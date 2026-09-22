#!/bin/bash
set -e

# ============================================================
# CONFIG
# ============================================================

# Detect whether the website files are inside /Netplex
# or directly in the repository root.
SOURCE_DIR="."

if [ -d "Netplex" ]; then
  SOURCE_DIR="Netplex"
fi

echo "=============================================="
echo "🚀 NETPLEX BUILD"
echo "=============================================="
echo ""
echo "📂 Source directory: $SOURCE_DIR"
echo ""


# ============================================================
# CLEAN AND CREATE DIST DIRECTORIES
# ============================================================

echo "🧹 Cleaning previous build..."

rm -rf dist

mkdir -p dist
mkdir -p dist/css
mkdir -p dist/js
mkdir -p dist/img


# ============================================================
# COPY STATIC ASSETS
# ============================================================

echo "📦 Copying static assets..."

# Assets folder
if [ -d "$SOURCE_DIR/assets" ]; then
  cp -r "$SOURCE_DIR/assets" dist/
  echo "✅ assets copied"
fi


# Images folder
if [ -d "$SOURCE_DIR/images" ]; then
  cp -r "$SOURCE_DIR/images" dist/
  echo "✅ images copied"
fi


# IMG folder
# Includes Netplex logo and other images
if [ -d "$SOURCE_DIR/img" ]; then
  cp -r "$SOURCE_DIR/img/." dist/img/
  echo "✅ img copied"
fi


# ============================================================
# COPY ROOT STATIC FILES
# ============================================================

echo ""
echo "📄 Copying root static files..."


# ------------------------------------------------------------
# Favicons
# ------------------------------------------------------------

if [ -f "$SOURCE_DIR/favicon.ico" ]; then
  cp "$SOURCE_DIR/favicon.ico" dist/
  echo "✅ favicon.ico copied"
fi

if [ -f "$SOURCE_DIR/favicon.png" ]; then
  cp "$SOURCE_DIR/favicon.png" dist/
  echo "✅ favicon.png copied"
fi


# ------------------------------------------------------------
# Manifest
# ------------------------------------------------------------

if [ -f "$SOURCE_DIR/manifest.json" ]; then
  cp "$SOURCE_DIR/manifest.json" dist/
  echo "✅ manifest.json copied"
fi

if [ -f "$SOURCE_DIR/site.webmanifest" ]; then
  cp "$SOURCE_DIR/site.webmanifest" dist/
  echo "✅ site.webmanifest copied"
fi


# ------------------------------------------------------------
# Security JS
# ------------------------------------------------------------

if [ -f "$SOURCE_DIR/security.js" ]; then
  cp "$SOURCE_DIR/security.js" dist/
  echo "✅ security.js copied"
fi


# ------------------------------------------------------------
# Robots
# ------------------------------------------------------------

if [ -f "$SOURCE_DIR/robots.txt" ]; then
  cp "$SOURCE_DIR/robots.txt" dist/
  echo "✅ robots.txt copied"
fi


# ------------------------------------------------------------
# Sitemap
# ------------------------------------------------------------

if [ -f "$SOURCE_DIR/sitemap.xml" ]; then
  cp "$SOURCE_DIR/sitemap.xml" dist/
  echo "✅ sitemap.xml copied"
fi


# ------------------------------------------------------------
# Browser config
# ------------------------------------------------------------

if [ -f "$SOURCE_DIR/browserconfig.xml" ]; then
  cp "$SOURCE_DIR/browserconfig.xml" dist/
  echo "✅ browserconfig.xml copied"
fi


# ============================================================
# COPY ADS.TXT
# ============================================================

echo ""
echo "📢 Checking ads.txt..."

# First check repository root because your ads.txt
# is located beside build.sh.
if [ -f "ads.txt" ]; then

  cp "ads.txt" "dist/ads.txt"

  echo "✅ Root ads.txt copied to dist/ads.txt"

# Fallback: check inside Netplex/source folder
elif [ -f "$SOURCE_DIR/ads.txt" ]; then

  cp "$SOURCE_DIR/ads.txt" "dist/ads.txt"

  echo "✅ $SOURCE_DIR/ads.txt copied to dist/ads.txt"

else

  echo "⚠️ ads.txt not found"

fi


# ============================================================
# COPY ADDITIONAL DIRECTORIES
# ============================================================

echo ""
echo "📁 Copying additional directories..."

# Adblock folder
if [ -d "$SOURCE_DIR/Adblock" ]; then

  cp -r "$SOURCE_DIR/Adblock" dist/

  echo "✅ Adblock copied"

fi


# ============================================================
# FAST BUILD MODE
# ============================================================

if [ "${FAST_BUILD:-false}" = "true" ]; then

  echo ""
  echo "=============================================="
  echo "⚡ FAST_BUILD ENABLED"
  echo "=============================================="
  echo ""
  echo "Skipping minification and obfuscation..."
  echo ""


  # ==========================================================
  # COPY HTML
  # ==========================================================

  echo "📄 Copying HTML..."

  for file in "$SOURCE_DIR"/*.html; do

    [ -f "$file" ] || continue

    cp "$file" dist/

  done


  # ==========================================================
  # COPY CSS
  # ==========================================================

  echo "🎨 Copying CSS..."

  if [ -d "$SOURCE_DIR/css" ]; then

    cp -r "$SOURCE_DIR/css/." dist/css/

  fi


  # ==========================================================
  # COPY JAVASCRIPT
  # ==========================================================

  echo "📜 Copying JavaScript..."

  if [ -d "$SOURCE_DIR/js" ]; then

    cp -r "$SOURCE_DIR/js/." dist/js/

  fi


  # ==========================================================
  # FAST BUILD COMPLETE
  # ==========================================================

  echo ""
  echo "=============================================="
  echo "✅ FAST BUILD COMPLETE"
  echo "=============================================="

  echo ""
  echo "Files inside dist:"
  echo ""

  find dist -maxdepth 3 -type f | sort

  echo ""
  echo "Total files:"
  find dist -type f | wc -l

  echo ""

  exit 0

fi


# ============================================================
# FULL PRODUCTION PIPELINE
# ============================================================

echo ""
echo "=============================================="
echo "🔒 PRODUCTION BUILD"
echo "=============================================="
echo ""
echo "Minifying HTML..."
echo "Minifying CSS..."
echo "Obfuscating JavaScript..."
echo ""


# ============================================================
# MINIFY HTML
# ============================================================

echo "📄 Minifying HTML..."

HTML_FOUND=false

for file in "$SOURCE_DIR"/*.html; do

  [ -f "$file" ] || continue

  HTML_FOUND=true

  filename=$(basename "$file")

  echo "Processing: $filename"

  if ! npx --yes html-minifier-terser \
    "$file" \
    --output "dist/$filename" \
    --collapse-whitespace \
    --remove-comments \
    --remove-redundant-attributes \
    --use-short-doctype; then

    echo "⚠️ Failed to minify $filename"
    echo "Copying original file instead..."

    cp "$file" "dist/$filename"

  fi

done


if [ "$HTML_FOUND" = false ]; then

  echo "⚠️ No HTML files found inside $SOURCE_DIR"

fi


# ============================================================
# MINIFY CSS
# ============================================================

echo ""
echo "🎨 Minifying CSS..."


if [ -d "$SOURCE_DIR/css" ]; then

  # Copy CSS files first
  cp -r "$SOURCE_DIR/css/." dist/css/


  for file in dist/css/*.css; do

    [ -f "$file" ] || continue

    filename=$(basename "$file")

    echo "Processing: $filename"

    TEMP_FILE="${file}.tmp"


    if npx --yes clean-css-cli \
      -o "$TEMP_FILE" \
      "$file"; then

      mv "$TEMP_FILE" "$file"

    else

      echo "⚠️ Failed to minify $filename"

      rm -f "$TEMP_FILE"

      echo "Keeping original CSS."

    fi

  done

else

  echo "⚠️ CSS folder not found."

fi


# ============================================================
# OBFUSCATE JAVASCRIPT
# ============================================================

echo ""
echo "🔐 Obfuscating JavaScript..."


if [ -d "$SOURCE_DIR/js" ]; then

  if ! npx --yes javascript-obfuscator "$SOURCE_DIR/js" \
    --output dist/js \
    --compact true \
    --control-flow-flattening true \
    --control-flow-flattening-threshold 0.5 \
    --dead-code-injection true \
    --dead-code-injection-threshold 0.2 \
    --string-array true \
    --string-array-encoding base64 \
    --string-array-threshold 0.75 \
    --debug-protection true \
    --disable-console-output true; then

    echo ""
    echo "⚠️ JavaScript obfuscation failed."
    echo "Copying original JavaScript instead..."

    rm -rf dist/js
    mkdir -p dist/js

    cp -r "$SOURCE_DIR/js/." dist/js/

  fi

else

  echo "⚠️ JavaScript folder not found."

fi


# ============================================================
# VERIFY ADS.TXT
# ============================================================

echo ""
echo "📢 Verifying ads.txt..."

if [ -f "dist/ads.txt" ]; then

  echo "✅ dist/ads.txt exists"

  echo ""
  echo "ads.txt contents:"
  echo "----------------------------------------------"

  cat dist/ads.txt

  echo ""
  echo "----------------------------------------------"

else

  echo "❌ dist/ads.txt is missing!"

fi


# ============================================================
# VERIFY IMPORTANT DIRECTORIES
# ============================================================

echo ""
echo "🔎 Verifying build directories..."


# IMG
if [ -d "dist/img" ]; then

  if find dist/img -type f 2>/dev/null | grep -q .; then

    echo "✅ dist/img contains files"

  else

    echo "⚠️ dist/img exists but is empty"

  fi

else

  echo "⚠️ dist/img missing"

fi


# CSS
if [ -d "dist/css" ]; then

  if find dist/css -type f 2>/dev/null | grep -q .; then

    echo "✅ dist/css contains files"

  else

    echo "⚠️ dist/css exists but is empty"

  fi

else

  echo "⚠️ dist/css missing"

fi


# JS
if [ -d "dist/js" ]; then

  if find dist/js -type f 2>/dev/null | grep -q .; then

    echo "✅ dist/js contains files"

  else

    echo "⚠️ dist/js exists but is empty"

  fi

else

  echo "⚠️ dist/js missing"

fi


# ============================================================
# BUILD COMPLETE
# ============================================================

echo ""
echo "=============================================="
echo "✅ NETPLEX BUILD COMPLETE"
echo "=============================================="

echo ""
echo "Files inside dist:"
echo ""

find dist -maxdepth 3 -type f | sort


echo ""
echo "----------------------------------------------"
echo "Total files:"
find dist -type f | wc -l
echo "----------------------------------------------"


echo ""
echo "Important public files:"
echo ""

[ -f "dist/index.html" ] && echo "✅ /index.html"
[ -f "dist/ads.txt" ] && echo "✅ /ads.txt"
[ -f "dist/robots.txt" ] && echo "✅ /robots.txt"
[ -f "dist/sitemap.xml" ] && echo "✅ /sitemap.xml"
[ -f "dist/manifest.json" ] && echo "✅ /manifest.json"
[ -f "dist/favicon.ico" ] && echo "✅ /favicon.ico"

echo ""
echo "🎉 Deployment folder: dist"
echo ""

