const express = require('express');
const cors = require('cors');
const multer = require('multer');
const OpenAI = require('openai');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

// In-memory storage for inspection history
let inspectionHistory = [];

// Cleaning task definitions
const CLEANING_TASKS = {
  'trash-bin': {
    name: 'Trash Bin',
    criteria: [
      'Bin should be completely empty',
      'No visible trash or debris',
      'Bin liner should be fresh and properly fitted',
      'No odors or stains visible',
    ],
  },
  'whiteboard': {
    name: 'Whiteboard',
    criteria: [
      'Surface should be completely clean',
      'No marker residues or stains',
      'Edges and corners should be clean',
      'Surface should be dry and streak-free',
    ],
  },
  'desk-surface': {
    name: 'Desk Surface',
    criteria: [
      'Surface should be dust-free',
      'No visible stains or spills',
      'Items should be organized',
      'No crumbs or debris',
    ],
  },
  'floor': {
    name: 'Floor',
    criteria: [
      'No visible dirt or debris',
      'No stains or spills',
      'Edges and corners should be clean',
      'Surface should be dry',
    ],
  },
  'window': {
    name: 'Window',
    criteria: [
      'Glass should be streak-free',
      'No smudges or fingerprints',
      'Window sill should be clean',
      'No visible dirt or spots',
    ],
  },
};

// Quality assessment prompt for OpenAI Vision
function generateAssessmentPrompt(taskType) {
  const task = CLEANING_TASKS[taskType] || CLEANING_TASKS['desk-surface'];

  return `You are a professional cleaning quality inspector for WISAG facility management services. Analyze this image of a ${task.name} and provide a detailed quality assessment.

Evaluation Criteria:
${task.criteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

| No. | Task                                | Evaluation Criteria                                            | **Green (2 Points)**                           | **Orange (1 Point)**                      | **Red (0 Points)**                                  |
| --- | ----------------------------------- | -------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------- | --------------------------------------------------- |
| 1   | Clean / clear the table surface     | No visible stains or crumbs, no trash left on the surface      | Table completely cleared and clean             | Some items or stains still visible        | Surface largely unchanged or only partially cleaned |
| 2   | Empty / check the trash bin         | Bin visibly empty, new bag inserted, no waste on the floor     | Bin empty, new bag properly inserted           | Partially emptied, bag not replaced       | Bin still full or dirty                             |
| 3   | Clean / organize the whiteboard     | Text fully removed without residues, magnets/markers organized | Whiteboard clean, no residues, fully organized | Light traces of text, partially organized | Text still visible, board unorganized               |
| 4   | Tidy up the windowsill / shelf area | Waste removed, dirt (e.g., soil) cleared, surface evenly clean | Windowsill clean and free of dirt/waste        | Some objects or light dirt still visible  | Area messy and dirty                                |
| 5   | Close windows                       | All windows closed                                             | All windows closed                             | Only a few windows closed                 | All windows open                                    |


Provide your assessment in the following JSON format:
{
  "overallScore": <number 0-100>,
  "quality": "<GOOD|MEDIUM|POOR>",
  "summary": "<brief one-sentence summary>",
  "findings": [
    {
      "aspect": "<what was evaluated>",
      "status": "<PASS|FAIL>",
      "description": "<detailed observation>"
    }
  ],
  "recommendations": ["<list of improvement suggestions if any>"],
  "confidence": <number 0-100>,
  "observations": [
    {
      "item": "<what was observed: e.g., 'coffee cup', 'stain', 'debris', 'paper stack'>",
      "type": "<OBJECT|STAIN|DEBRIS|ISSUE>",
      "x": <number 0-100, horizontal position as percentage>,
      "y": <number 0-100, vertical position as percentage>,
      "severity": "<LOW|MEDIUM|HIGH>"
    }
  ]
}

Quality ratings:
- GOOD (80-100): Meets all standards, professional quality
- MEDIUM (50-79): Acceptable but needs improvement
- POOR (0-49): Does not meet standards, requires rework

For observations:
- Identify ALL visible objects, stains, debris, or issues in the image
- Provide accurate coordinate positions (x: left to right, y: top to bottom)
- Mark severity based on impact on cleanliness

Be objective, specific, and provide actionable feedback with precise locations.`;
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI CleanCheck API is running' });
});

// Get all cleaning task types
app.get('/api/tasks', (req, res) => {
  res.json(CLEANING_TASKS);
});

// Analyze image with base64 data
app.post('/api/analyze', async (req, res) => {
  try {
    const { imageData, taskType, metadata } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Validate task type
    const validTaskType = taskType && CLEANING_TASKS[taskType] ? taskType : 'desk-surface';

    console.log(`Analyzing ${validTaskType} image...`);

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: generateAssessmentPrompt(validTaskType),
            },
            {
              type: 'image_url',
              image_url: {
                url: imageData,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const aiResponse = response.choices[0].message.content;
    console.log('OpenAI Response:', aiResponse);

    // Parse JSON response
    let assessment;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiResponse;
      assessment = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to basic assessment
      assessment = {
        overallScore: 50,
        quality: 'MEDIUM',
        summary: 'Unable to parse detailed assessment',
        findings: [{ aspect: 'Analysis', status: 'FAIL', description: aiResponse }],
        recommendations: ['Review image quality and try again'],
        confidence: 50,
      };
    }

    // Create inspection record
    const inspection = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      taskType: validTaskType,
      taskName: CLEANING_TASKS[validTaskType].name,
      assessment,
      metadata: metadata || {},
    };

    // Store in history
    inspectionHistory.unshift(inspection);

    // Keep only last 50 inspections
    if (inspectionHistory.length > 50) {
      inspectionHistory = inspectionHistory.slice(0, 50);
    }

    res.json(inspection);
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({
      error: 'Failed to analyze image',
      message: error.message,
      details: error.response?.data || null,
    });
  }
});

// Upload and analyze image file
app.post('/api/analyze-upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const taskType = req.body.taskType || 'desk-surface';
    const metadata = JSON.parse(req.body.metadata || '{}');

    // Read the uploaded file and convert to base64
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = req.file.mimetype;
    const imageData = `data:${mimeType};base64,${base64Image}`;

    // Delete the uploaded file after reading
    fs.unlinkSync(imagePath);

    // Reuse the analyze endpoint logic
    req.body = { imageData, taskType, metadata };

    // Forward to analyze endpoint
    return app._router.handle({
      ...req,
      method: 'POST',
      url: '/api/analyze',
      body: { imageData, taskType, metadata },
    }, res);

  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({
      error: 'Failed to process uploaded image',
      message: error.message,
    });
  }
});

// Get inspection history
app.get('/api/history', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  res.json(inspectionHistory.slice(0, limit));
});

// Get statistics
app.get('/api/stats', (req, res) => {
  if (inspectionHistory.length === 0) {
    return res.json({
      totalInspections: 0,
      averageScore: 0,
      qualityDistribution: { GOOD: 0, MEDIUM: 0, POOR: 0 },
      taskDistribution: {},
    });
  }

  const stats = {
    totalInspections: inspectionHistory.length,
    averageScore: Math.round(
      inspectionHistory.reduce((sum, i) => sum + i.assessment.overallScore, 0) /
        inspectionHistory.length
    ),
    qualityDistribution: {
      GOOD: inspectionHistory.filter((i) => i.assessment.quality === 'GOOD').length,
      MEDIUM: inspectionHistory.filter((i) => i.assessment.quality === 'MEDIUM').length,
      POOR: inspectionHistory.filter((i) => i.assessment.quality === 'POOR').length,
    },
    taskDistribution: {},
  };

  // Calculate task distribution
  inspectionHistory.forEach((inspection) => {
    const taskName = inspection.taskName;
    if (!stats.taskDistribution[taskName]) {
      stats.taskDistribution[taskName] = 0;
    }
    stats.taskDistribution[taskName]++;
  });

  res.json(stats);
});

// Delete inspection by ID
app.delete('/api/history/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = inspectionHistory.length;
  inspectionHistory = inspectionHistory.filter((i) => i.id !== id);

  if (inspectionHistory.length < initialLength) {
    res.json({ success: true, message: 'Inspection deleted' });
  } else {
    res.status(404).json({ error: 'Inspection not found' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI CleanCheck API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Configured ✓' : 'Missing ✗'}`);
});
