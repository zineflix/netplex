#!/bin/bash
set -e

echo "Starting build process..."

# 1. Create a clean output directory
mkdir -p dist

# 2. Copy all HTML and CSS files into dist
cp Netplex/*.html dist/ 2>/dev/null || cp *.html dist/ 2>/dev/null || true
cp -r Netplex/css dist/ 2>/dev/null || cp -r css dist/ 2>/dev/null || true

# Copy any images or assets folders if present
cp -r Netplex/assets dist/ 2>/dev/null || cp -r assets dist/ 2>/dev/null || true
cp -r Netplex/images dist/ 2>/dev/null || cp -r images dist/ 2>/dev/null || true

# 3. Obfuscate all JS files from Netplex/js and output them into dist/js
echo "Obfuscating JavaScript..."
npx --yes javascript-obfuscator Netplex/js --output dist/js \
  --compact true \
  --control-flow-flattening true \
  --dead-code-injection true \
  --string-array true \
  --string-array-encoding 'base64' \
  --debug-protection true \
  --disable-console-output true

echo "Build complete! Files are ready in dist/."
