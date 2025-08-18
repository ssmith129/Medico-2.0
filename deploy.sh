#!/bin/bash

echo "🚀 Starting React Medical Dashboard Deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful! Ready for deployment."
    echo "📁 Built files are in the 'dist' directory"
    echo "🌐 You can now deploy to Vercel using:"
    echo "   npx vercel --prod"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
