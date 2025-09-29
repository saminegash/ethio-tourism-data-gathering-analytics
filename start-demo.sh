#!/bin/bash

# Ethiopia Tourism AI Platform Demo Startup Script

echo "🇪🇹 Starting Ethiopia Tourism AI Platform Demo..."
echo "================================================"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the application
echo "🔨 Building the application..."
pnpm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Starting the demo platform..."
    echo "   Demo will be available at: http://localhost:3000/demo"
    echo "   Main dashboard at: http://localhost:3000/dashboard"
    echo ""
    echo "🌟 Features available in this demo:"
    echo "   • NFC Wristband payment simulation"
    echo "   • Ethiopian Birr (ETB) currency"
    echo "   • Multi-language support (English, አማርኛ, Afaan Oromoo)"
    echo "   • Real-time analytics with mock data"
    echo "   • AI recommendation engine"
    echo "   • Tourism destinations showcase"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "================================================"
    
    # Start the development server
    pnpm run dev
else
    echo "❌ Build failed. Please check the errors above."
    echo ""
    echo "🔧 Common fixes:"
    echo "   1. Run 'pnpm install' to ensure all dependencies are installed"
    echo "   2. Check for TypeScript errors in the output above"
    echo "   3. Ensure Node.js version is 18+ by running 'node --version'"
    exit 1
fi
