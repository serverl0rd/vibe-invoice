#!/bin/bash

# Puppeteer Test Runner for Vibe Invoice Generator

echo "🎭 Puppeteer Test Runner for Vibe Invoice"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm packages are installed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if Puppeteer is installed
if [ ! -d "node_modules/puppeteer" ]; then
    echo "📦 Installing Puppeteer..."
    npm install puppeteer
    echo ""
fi

# Create test results directory
mkdir -p test-results

echo "🚀 Starting Puppeteer tests..."
echo ""

# Parse command line arguments
ARGS=""
if [[ "$1" == "--headed" ]]; then
    ARGS="--headed"
    echo "Running in headed mode (browser visible)..."
elif [[ "$1" == "--slow" ]]; then
    ARGS="--slow"
    echo "Running in slow mode..."
fi

# Run the tests
node puppeteer-tests.js $ARGS

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests completed successfully!"
    
    # Check if screenshot was created
    if [ -f "test-results/puppeteer-invoice.png" ]; then
        echo "📸 Screenshot saved at: test-results/puppeteer-invoice.png"
    fi
else
    echo ""
    echo "❌ Some tests failed. Check the output above for details."
    exit 1
fi