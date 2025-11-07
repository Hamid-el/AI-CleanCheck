#!/bin/bash

# AI CleanCheck - Automated Setup Script
# This script sets up both backend and frontend

echo "🚀 AI CleanCheck - Automated Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up backend..."
cd backend

if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found!"
    exit 1
fi

echo "   Installing dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "   Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/.env and add your OpenAI API key!"
    echo "   Open backend/.env and replace 'your_openai_api_key_here' with your actual key"
    echo ""
fi

cd ..

# Check Python for frontend server
echo ""
echo "🌐 Frontend Setup"
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "⚠️  Python not found. You can:"
    echo "   1. Install Python for easy frontend serving"
    echo "   2. Use: npx http-server -p 8080 frontend"
    echo "   3. Use any other static file server"
    PYTHON_CMD=""
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Edit backend/.env and add your OpenAI API key"
echo "   2. Start the backend: cd backend && npm start"
if [ -n "$PYTHON_CMD" ]; then
    echo "   3. Start the frontend: cd frontend && $PYTHON_CMD -m http.server 8080"
else
    echo "   3. Start the frontend: cd frontend && npx http-server -p 8080"
fi
echo "   4. Open http://localhost:8080 in your browser"
echo ""
echo "📚 For detailed instructions, see QUICKSTART.md"
echo ""
