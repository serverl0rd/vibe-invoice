#!/bin/bash

# Vibe Invoice Test Setup Script

echo "🚀 Vibe Invoice Test Setup"
echo "=========================="

# Check if running from correct directory
if [ ! -f "Vibe Invoice.html" ]; then
    echo "❌ Error: Please run this script from the vibe-invoice directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo ""
echo "📦 Installing test dependencies..."
npm install

# Install Playwright browsers
echo ""
echo "🌐 Installing Playwright browsers..."
npx playwright install

# Create test results directory
mkdir -p test-results

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Available commands:"
echo "  npm test                 - Run all tests"
echo "  npm run test:headed      - Run tests with browser visible"
echo "  npm run test:debug       - Run tests in debug mode"
echo "  npm run test:ui          - Run tests with interactive UI"
echo "  npm run test:report      - Show test report"
echo ""
echo "🔧 To run browser console tests:"
echo "  1. Open 'Vibe Invoice.html' in your browser"
echo "  2. Open browser console (F12)"
echo "  3. Copy and paste the contents of 'test-suite.js'"
echo "  4. Run: tester.runAllTests()"
echo ""
echo "🎭 Playwright MCP Configuration:"
echo "  ✅ Config file created at: ~/Library/Application Support/Claude Desktop/claude_desktop_config.json"
echo "  ⚠️  You need to restart Claude Desktop for MCP to be available"
echo ""

# Ask if user wants to run tests now
read -p "Would you like to run the tests now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🧪 Running tests..."
    npm test
fi