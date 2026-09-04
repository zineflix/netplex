#!/bin/bash
set -e

echo "Starting optimized build process..."

# 1. Prepare clean dist directories
mkdir -p dist/css dist/js

# 2. Copy static media/assets if present
cp -r Netplex/assets dist/ 2>/dev/null || cp -r assets dist/ 2>/dev/null || true
cp -r Netplex/images dist/ 2>/dev/null || cp -r images dist/ 2>/dev/null || true

# 3. Minify HTML files (removes comments, spaces, and line breaks)
echo "Minifying HTML..."
npx --yes html-minifier-terser \
  --input-dir Netplex \
  --output-dir dist \
  --file-ext html \
  --collapse-whitespace \
  --remove-comments \
  --remove-redundant-attributes \
  --remove-script-type-attributes \
  --remove-style-link-type-attributes \
  --use-short-doctype 2>/dev/null || cp Netplex/*.html dist/ 2>/dev/null || true

# 4. Minify all CSS files
echo "Minifying CSS..."
cp -r Netplex/css/* dist/css/ 2>/dev/null || cp -r css/* dist/css/ 2>/dev/null || true
for file in dist/css/*.css; do
  [ -f "$file" ] || continue
  npx --yes clean-css-cli -o "$file" "$file"
done

# 5. Obfuscate and compress all JavaScript files
echo "Obfuscating JavaScript..."
npx --yes javascript-obfuscator Netplex/js --output dist/js \
  --compact true \
  --control-flow-flattening true \
  --dead-code-injection true \
  --string-array true \
  --string-array-encoding 'base64' \
  --debug-protection true \
  --disable-console-output true

echo "Build complete! All HTML, CSS, and JS are minified and protected in dist/."
