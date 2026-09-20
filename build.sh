#!/bin/bash
set -e

# ============================================================
# CREATE DIST DIRECTORIES
# ============================================================
mkdir -p dist
mkdir -p dist/css
mkdir -p dist/js
mkdir -p dist/img


# ============================================================
# COPY STATIC ASSETS
# ============================================================

# Assets folder
if [ -d "Netplex/assets" ]; then
  cp -r Netplex/assets dist/
elif [ -d "assets" ]; then
  cp -r assets dist/
fi

# Images folder (if you also have /images)
if [ -d "Netplex/images" ]; then
  cp -r Netplex/images dist/
elif [ -d "images" ]; then
  cp -r images dist/
fi

# IMG folder - THIS INCLUDES YOUR NETPLEX LOGO
if [ -d "Netplex/img" ]; then
  cp -r Netplex/img/* dist/img/
elif [ -d "img" ]; then
  cp -r img/* dist/img/
fi


# ============================================================
# COPY ROOT STATIC FILES
# ============================================================

# Favicons
[ -f "Netplex/favicon.ico" ] && cp Netplex/favicon.ico dist/
[ -f "Netplex/favicon.png" ] && cp Netplex/favicon.png dist/

# Manifest
[ -f "Netplex/manifest.json" ] && cp Netplex/manifest.json dist/

# Security JS
[ -f "Netplex/security.js" ] && cp Netplex/security.js dist/

# Robots
[ -f "Netplex/robots.txt" ] && cp Netplex/robots.txt dist/

# Sitemap
[ -f "Netplex/sitemap.xml" ] && cp Netplex/sitemap.xml dist/


# ============================================================
# COPY ADDITIONAL DIRECTORIES
# ============================================================

# Adblock folder
if [ -d "Netplex/Adblock" ]; then
  cp -r Netplex/Adblock dist/
fi


# ============================================================
# FAST BUILD MODE
# ============================================================

if [ "$FAST_BUILD" = "true" ]; then

  echo "⚡ FAST_BUILD enabled"
  echo "Skipping minification & obfuscation..."

  # HTML
  cp Netplex/*.html dist/ 2>/dev/null || cp *.html dist/ 2>/dev/null || true

  # CSS
  cp -r Netplex/css/* dist/css/ 2>/dev/null || \
  cp -r css/* dist/css/ 2>/dev/null || true

  # JavaScript
  cp -r Netplex/js/* dist/js/ 2>/dev/null || \
  cp -r js/* dist/js/ 2>/dev/null || true

  echo "✅ Fast build complete!"
  exit 0
fi


# ============================================================
# FULL PRODUCTION PIPELINE
# ============================================================

echo "🔒 Production mode: Minifying and obfuscating..."


# ============================================================
# MINIFY HTML
# ============================================================

echo "Minifying HTML..."

npx --yes html-minifier-terser \
  --input-dir Netplex \
  --output-dir dist \
  --file-ext html \
  --collapse-whitespace \
  --remove-comments \
  --remove-redundant-attributes \
  --use-short-doctype \
  2>/dev/null || cp Netplex/*.html dist/ 2>/dev/null || true


# ============================================================
# MINIFY CSS
# ============================================================

echo "Minifying CSS..."

cp -r Netplex/css/* dist/css/ 2>/dev/null || \
cp -r css/* dist/css/ 2>/dev/null || true

for file in dist/css/*.css; do

  [ -f "$file" ] || continue

  npx --yes clean-css-cli \
    -o "$file" \
    "$file"

done


# ============================================================
# OBFUSCATE JAVASCRIPT
# ============================================================

echo "Obfuscating JavaScript..."

npx --yes javascript-obfuscator Netplex/js \
  --output dist/js \
  --compact true \
  --control-flow-flattening true \
  --dead-code-injection true \
  --string-array true \
  --string-array-encoding base64 \
  --debug-protection true \
  --disable-console-output true


# ============================================================
# BUILD COMPLETE
# ============================================================

echo "✅ Build complete!"

echo ""
echo "Files inside dist:"
find dist -maxdepth 2 -type f | sort
