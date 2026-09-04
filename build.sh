#!/bin/bash
set -e

mkdir -p dist/css dist/js

# 1. Copy static assets if present
cp -r Netplex/assets dist/ 2>/dev/null || cp -r assets dist/ 2>/dev/null || true
cp -r Netplex/images dist/ 2>/dev/null || cp -r images dist/ 2>/dev/null || true

# 2. Check if Dev/Fast mode is enabled in Cloudflare
if [ "$FAST_BUILD" = "true" ]; then
  echo "⚡ FAST_BUILD enabled: Skipping minification & obfuscation for quick dev deploy."
  cp Netplex/*.html dist/ 2>/dev/null || cp *.html dist/ 2>/dev/null || true
  cp -r Netplex/css/* dist/css/ 2>/dev/null || cp -r css/* dist/css/ 2>/dev/null || true
  cp -r Netplex/js/* dist/js/ 2>/dev/null || cp -r js/* dist/js/ 2>/dev/null || true
  echo "Done in seconds!"
  exit 0
fi

# --- FULL PRODUCTION PIPELINE ---
echo "🔒 Production mode: Minifying and obfuscating..."

# Minify HTML
echo "Minifying HTML..."
npx --yes html-minifier-terser \
  --input-dir Netplex \
  --output-dir dist \
  --file-ext html \
  --collapse-whitespace \
  --remove-comments \
  --remove-redundant-attributes \
  --use-short-doctype 2>/dev/null || cp Netplex/*.html dist/ 2>/dev/null || true

# Minify CSS
echo "Minifying CSS..."
cp -r Netplex/css/* dist/css/ 2>/dev/null || cp -r css/* dist/css/ 2>/dev/null || true
for file in dist/css/*.css; do
  [ -f "$file" ] || continue
  npx --yes clean-css-cli -o "$file" "$file"
done

# Obfuscate JS
echo "Obfuscating JavaScript..."
npx --yes javascript-obfuscator Netplex/js --output dist/js \
  --compact true \
  --control-flow-flattening true \
  --dead-code-injection true \
  --string-array true \
  --string-array-encoding 'base64' \
  --debug-protection true \
  --disable-console-output true

echo "Build complete!"
