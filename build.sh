#!/bin/bash
set -e

echo "Installing obfuscator..."
npm install -g javascript-obfuscator

echo "Preparing dist folder..."
mkdir -p dist

# Copy all HTML files
cp Netplex/*.html dist/ 2>/dev/null || cp *.html dist/ 2>/dev/null || true

# Copy css and js folders
cp -r Netplex/css dist/ 2>/dev/null || cp -r css dist/ 2>/dev/null || true
cp -r Netplex/js dist/ 2>/dev/null || cp -r js dist/ 2>/dev/null || true

# Copy any asset/image folders if they exist
cp -r Netplex/assets dist/ 2>/dev/null || cp -r assets dist/ 2>/dev/null || true
cp -r Netplex/images dist/ 2>/dev/null || cp -r images dist/ 2>/dev/null || true

echo "Obfuscating JavaScript files..."
javascript-obfuscator dist/js --output dist/js \
  --compact true \
  --control-flow-flattening true \
  --dead-code-injection true \
  --string-array true \
  --string-array-encoding 'base64' \
  --debug-protection true \
  --disable-console-output true

echo "Build complete!"
