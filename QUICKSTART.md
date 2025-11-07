# AI CleanCheck - Quick Start Guide

Get up and running in 5 minutes!

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure OpenAI API Key

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   PORT=3000
   ```

## Step 3: Start the Backend Server

```bash
npm start
```

You should see:
```
🚀 AI CleanCheck API running on port 3000
📊 Health check: http://localhost:3000/api/health
🔑 OpenAI API Key: Configured ✓
```

## Step 4: Start the Frontend

Open a new terminal window:

### Option A: Using Python
```bash
cd frontend
python -m http.server 8080
```

### Option B: Using Node.js
```bash
cd frontend
npx http-server -p 8080
```

## Step 5: Open in Browser

Navigate to: `http://localhost:8080`

## First Inspection

1. Click "Start Camera" or "Upload Image"
2. Select a cleaning task type (e.g., "Desk Surface")
3. Capture or upload an image
4. Click "Capture & Analyze"
5. View the AI-generated quality assessment!

## Troubleshooting

### "Cannot connect to API" error
- Make sure backend is running on port 3000
- Check the console for any errors

### Camera not working
- Allow camera permissions in your browser
- Try using "Upload Image" instead

### Analysis fails
- Verify your OpenAI API key is correct
- Check that you have sufficient API credits
- Ensure image is in JPEG, PNG, or WebP format

## What's Next?

- Check the **Dashboard** tab to see statistics
- View **History** to see all past inspections
- Read the full [README.md](README.md) for detailed documentation

## Need Help?

- Review the full documentation in README.md
- Check the API endpoints documentation
- Verify all prerequisites are installed

---

**Happy Testing!** 🎉
