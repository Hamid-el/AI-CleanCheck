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

// In-memory session storage
const activeSessions = new Map(); // token -> { username, role, loginTime }

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
      'Window should be CLOSED',
      'Glass should be streak-free',
      'No smudges or fingerprints',
      'Window sill should be clean',
      'No visible dirt or spots',
    ],
  },
};

// Quality assessment prompt for OpenAI Vision
function generateAssessmentPrompt(taskType) {
  const isAutoDetect = !taskType || taskType === 'auto-detect';

  if (isAutoDetect) {
    // Auto-detection prompt
    return `You are a professional cleaning quality inspector for WISAG facility management services. Analyze this image and:

1. FIRST, automatically detect what type of cleaning area this is from these options:
   - "trash-bin": Trash bin or waste container
   - "whiteboard": Whiteboard or writing surface
   - "desk-surface": Desk, table, or work surface
   - "floor": Floor or ground surface
   - "window": Window, glass, or transparent surface

2. THEN, evaluate the cleaning quality based on the appropriate criteria for that area type.

Area-specific criteria:
- Trash Bin: Bin should be empty, clean, new bag properly inserted, no waste around
- Whiteboard: Text fully removed, no residues, magnets/markers organized
- Desk Surface: Dust-free, no stains/spills, items organized, crumb-free and debris-free
- Floor: No dirt/debris, no stains/spills, edges/corners clean, surface dry
- Window: Closed window, Streak-free glass, no smudges/fingerprints, sill clean, no dirt/spots

| No. | Task                                | Evaluation Criteria                                            | **Green (2 Points)**                           | **Orange (1 Point)**                      | **Red (0 Points)**                                  |
| --- | ----------------------------------- | -------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------- | --------------------------------------------------- |
| 1   | Clean / clear the table surface     | No visible stains or crumbs, no trash left on the surface      | Table completely cleared and clean             | Some items or stains still visible        | Surface largely unchanged or only partially cleaned |
| 2   | Empty / check the trash bin         | Bin visibly empty, new bag inserted, no waste on the floor     | Bin empty, new bag properly inserted           | Partially emptied, bag not replaced       | Bin still full or dirty                             |
| 3   | Clean / organize the whiteboard     | Text fully removed without residues, magnets/markers organized | Whiteboard clean, no residues, fully organized | Light traces of text, partially organized | Text still visible, board unorganized               |
| 4   | Tidy up the windowsill / shelf area | Waste removed, dirt (e.g., soil) cleared, surface evenly clean | Windowsill clean and free of dirt/waste        | Some objects or light dirt still visible  | Area messy and dirty                                |
| 5   | Close windows                       | All windows closed                                             | All windows closed                             | Only a few windows closed                 | All windows open                                    |

IMPORTANT: Identify and mark the locations of specific observations (objects, stains, debris, issues) in the image.
For each observation, provide the approximate location as a percentage of image dimensions (0-100% for both x and y coordinates).

Provide your assessment in the following JSON format:
{
  "detectedTaskType": "<trash-bin|whiteboard|desk-surface|floor|window>",
  "taskName": "<name of the detected area type>",
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
  } else {
    // Manual task type selected
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
| 5   | Closed or OPEN windows only          | All windows should be closed                                             | All windows closed                             | Only a few windows closed                 | All windows open                                    |


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
}

// User database with roles
const USERS = {
  wisag: {
    username: 'wisag',
    password: 'wisag',
    name: 'WISAG Admin',
    role: 'admin',
    createdAt: new Date().toISOString()
  }
};

// Helper function to get user by username
function getUser(username) {
  return USERS[username];
}

// Helper function to create new user (admin only)
function createUser(username, password, name, role = 'staff') {
  if (USERS[username]) {
    throw new Error('Username already exists');
  }

  USERS[username] = {
    username,
    password,
    name,
    role,
    createdAt: new Date().toISOString()
  };

  return USERS[username];
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI CleanCheck API is running' });
});

// Authentication middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const session = activeSessions.get(token);
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  const user = getUser(session.username);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  req.user = { ...user, token };
  next();
}

// Admin-only middleware
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  next();
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = USERS[username];

  if (user && user.password === password) {
    // Create session token
    const sessionToken = uuidv4();

    // Store session
    activeSessions.set(sessionToken, {
      username: user.username,
      role: user.role,
      loginTime: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        username: user.username,
        name: user.name,
        role: user.role
      },
      token: sessionToken
    });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Logout endpoint
app.post('/api/logout', requireAuth, (req, res) => {
  activeSessions.delete(req.user.token);
  res.json({ success: true, message: 'Logged out successfully' });
});

// User Management Endpoints (Admin only)

// Get all users
app.get('/api/users', requireAuth, requireAdmin, (req, res) => {
  const users = Object.values(USERS).map(u => ({
    username: u.username,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt
  }));
  res.json(users);
});

// Create new user
app.post('/api/users', requireAuth, requireAdmin, (req, res) => {
  try {
    const { username, password, name, role } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({ error: 'Username, password, and name are required' });
    }

    // Validate role
    if (role && role !== 'staff' && role !== 'admin') {
      return res.status(400).json({ error: 'Role must be either "staff" or "admin"' });
    }

    // Count existing staff members
    const staffCount = Object.values(USERS).filter(u => u.role === 'staff').length;
    if ((!role || role === 'staff') && staffCount >= 2) {
      return res.status(400).json({ error: 'Maximum of 2 staff members allowed' });
    }

    const newUser = createUser(username, password, name, role || 'staff');

    res.json({
      success: true,
      message: 'User created successfully',
      user: {
        username: newUser.username,
        name: newUser.name,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user
app.delete('/api/users/:username', requireAuth, requireAdmin, (req, res) => {
  const { username } = req.params;

  if (username === 'wisag') {
    return res.status(400).json({ error: 'Cannot delete admin account' });
  }

  if (!USERS[username]) {
    return res.status(404).json({ error: 'User not found' });
  }

  delete USERS[username];

  // Remove all sessions for this user
  for (const [token, session] of activeSessions.entries()) {
    if (session.username === username) {
      activeSessions.delete(token);
    }
  }

  res.json({ success: true, message: 'User deleted successfully' });
});

// Get all cleaning task types
app.get('/api/tasks', (req, res) => {
  res.json(CLEANING_TASKS);
});

// Analyze image with base64 data
app.post('/api/analyze', requireAuth, async (req, res) => {
  try {
    const { imageData, taskType, metadata } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Validate task type - allow 'auto-detect' to pass through
    let validTaskType;
    if (taskType === 'auto-detect' || !taskType) {
      validTaskType = 'auto-detect';
    } else if (CLEANING_TASKS[taskType]) {
      validTaskType = taskType;
    } else {
      validTaskType = 'desk-surface';
    }

    console.log(`Analyzing image with mode: ${validTaskType}`);

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
    // If auto-detect was used and AI provided a detected type, use that
    let finalTaskType = validTaskType;
    let finalTaskName = 'Auto-detect';

    if (validTaskType === 'auto-detect' && assessment.detectedTaskType) {
      finalTaskType = assessment.detectedTaskType;
      finalTaskName = assessment.taskName || CLEANING_TASKS[assessment.detectedTaskType]?.name || 'Unknown';
    } else if (CLEANING_TASKS[validTaskType]) {
      finalTaskType = validTaskType;
      finalTaskName = CLEANING_TASKS[validTaskType].name;
    }

    const inspection = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      taskType: finalTaskType,
      taskName: finalTaskName,
      userId: req.user.username,
      userName: req.user.name,
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

// Get inspection history (filtered by user role)
app.get('/api/history', requireAuth, (req, res) => {
  const limit = parseInt(req.query.limit) || 20;

  // Filter inspections based on user role
  let filteredHistory;
  if (req.user.role === 'admin') {
    // Admin sees all inspections
    filteredHistory = inspectionHistory;
  } else {
    // Staff sees only their own inspections
    filteredHistory = inspectionHistory.filter(i => i.userId === req.user.username);
  }

  res.json(filteredHistory.slice(0, limit));
});

// Get statistics (filtered by user role)
app.get('/api/stats', requireAuth, (req, res) => {
  // Filter inspections based on user role
  let filteredHistory;
  if (req.user.role === 'admin') {
    // Admin sees all inspections
    filteredHistory = inspectionHistory;
  } else {
    // Staff sees only their own inspections
    filteredHistory = inspectionHistory.filter(i => i.userId === req.user.username);
  }

  if (filteredHistory.length === 0) {
    return res.json({
      totalInspections: 0,
      averageScore: 0,
      qualityDistribution: { GOOD: 0, MEDIUM: 0, POOR: 0 },
      taskDistribution: {},
    });
  }

  const stats = {
    totalInspections: filteredHistory.length,
    averageScore: Math.round(
      filteredHistory.reduce((sum, i) => sum + i.assessment.overallScore, 0) /
        filteredHistory.length
    ),
    qualityDistribution: {
      GOOD: filteredHistory.filter((i) => i.assessment.quality === 'GOOD').length,
      MEDIUM: filteredHistory.filter((i) => i.assessment.quality === 'MEDIUM').length,
      POOR: filteredHistory.filter((i) => i.assessment.quality === 'POOR').length,
    },
    taskDistribution: {},
  };

  // Calculate task distribution
  filteredHistory.forEach((inspection) => {
    const taskName = inspection.taskName;
    if (!stats.taskDistribution[taskName]) {
      stats.taskDistribution[taskName] = 0;
    }
    stats.taskDistribution[taskName]++;
  });

  res.json(stats);
});

// Delete inspection by ID
app.delete('/api/history/:id', requireAuth, (req, res) => {
  const { id } = req.params;

  // Find the inspection
  const inspection = inspectionHistory.find(i => i.id === id);

  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }

  // Check permissions: admin can delete any, staff can only delete their own
  if (req.user.role !== 'admin' && inspection.userId !== req.user.username) {
    return res.status(403).json({ error: 'Not authorized to delete this inspection' });
  }

  inspectionHistory = inspectionHistory.filter((i) => i.id !== id);
  res.json({ success: true, message: 'Inspection deleted' });
});

// Update inspection description (admin only)
app.put('/api/history/:id/description', requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { summary } = req.body;

  if (typeof summary !== 'string' || !summary.trim()) {
    return res.status(400).json({ error: 'Valid summary (description) string required' });
  }

  // Find inspection
  const inspection = inspectionHistory.find(i => i.id === id);
  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }

  // Update summary (description)
  inspection.assessment.summary = summary.trim();
  inspection.updatedAt = new Date().toISOString();

  res.json({ success: true, message: 'Description updated', inspection });
});

// Update inspection score (admin only)
app.put('/api/history/:id/score', requireAuth, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { overallScore } = req.body;

  // Validate score
  if (typeof overallScore !== 'number' || overallScore < 0 || overallScore > 100) {
    return res.status(400).json({ error: 'Invalid score. Must be a number between 0 and 100' });
  }

  // Find the inspection
  const inspection = inspectionHistory.find(i => i.id === id);

  if (!inspection) {
    return res.status(404).json({ error: 'Inspection not found' });
  }

  // Update the score
  inspection.assessment.overallScore = Math.round(overallScore);

  // Update quality based on new score
  if (overallScore >= 80) {
    inspection.assessment.quality = 'GOOD';
  } else if (overallScore >= 50) {
    inspection.assessment.quality = 'MEDIUM';
  } else {
    inspection.assessment.quality = 'POOR';
  }

  res.json({
    success: true,
    message: 'Score updated successfully',
    inspection
  });
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
