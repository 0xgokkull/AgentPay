#!/usr/bin/env bash

# AgentPay AI Agent System - Setup and Run Script

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        AgentPay AI Agent System - Setup & Run                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if .env file exists and has groq API key
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with your Groq API key:"
    echo "groq=YOUR_GROQ_API_KEY_HERE"
    exit 1
fi

if ! grep -q "groq=" .env; then
    echo "❌ Error: Groq API key not found in .env!"
    echo "Please add: groq=YOUR_GROQ_API_KEY_HERE"
    exit 1
fi

echo "✅ Environment configuration found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              Available Commands                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "  npm run test:agent       - Run all agent tests"
echo "  npm run test:agent:watch - Run tests in watch mode"
echo "  npm run dev              - Start Next.js development server"
echo "  npm run build            - Build the project"
echo ""

echo "🚀 Ready to use AgentPay AI Agents!"
echo ""
echo "To run tests, execute:"
echo "  npm run test:agent"
echo ""
