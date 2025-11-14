#!/bin/bash

# Error Scenario Testing Script
# This script tests various error scenarios for the Browser Preview workflow

echo "=== Error Scenario Testing ==="
echo ""

# Test 1: Invalid Manifest - Missing required field
echo "Test 1: Invalid Manifest (missing manifest_version)"
echo "----------------------------------------------"

cd test-workflow-project

# Backup manifest
cp manifest.json manifest.json.bak

# Create invalid manifest (missing manifest_version)
cat > manifest.json << 'EOF'
{
  "name": "test-workflow-project",
  "version": "1.0.0",
  "description": "test-workflow-project - Chrome Extension"
}
EOF

echo "Running build with invalid manifest..."
npm run build > ../test-temp/invalid-manifest-test.txt 2>&1
BUILD_EXIT_CODE=$?

echo "Build exit code: $BUILD_EXIT_CODE"
if [ $BUILD_EXIT_CODE -ne 0 ]; then
  echo "✓ Build failed as expected"
  echo "Error output:"
  tail -20 ../test-temp/invalid-manifest-test.txt
else
  echo "✗ Build should have failed but succeeded"
fi

# Restore manifest
cp manifest.json.bak manifest.json

echo ""
echo "Test 2: Invalid Manifest (malformed JSON)"
echo "----------------------------------------------"

# Create malformed JSON
cat > manifest.json << 'EOF'
{
  "manifest_version": 3,
  "name": "test-workflow-project",
  "version": "1.0.0"
  "description": "test-workflow-project - Chrome Extension"
}
EOF

echo "Running build with malformed JSON..."
npm run build > ../test-temp/malformed-json-test.txt 2>&1
BUILD_EXIT_CODE=$?

echo "Build exit code: $BUILD_EXIT_CODE"
if [ $BUILD_EXIT_CODE -ne 0 ]; then
  echo "✓ Build failed as expected"
  echo "Error output:"
  tail -20 ../test-temp/malformed-json-test.txt
else
  echo "✗ Build should have failed but succeeded"
fi

# Restore manifest
cp manifest.json.bak manifest.json

echo ""
echo "Test 3: Missing Source File"
echo "----------------------------------------------"

# Backup source file
if [ -f src/popup/popup.js ]; then
  mv src/popup/popup.js src/popup/popup.js.bak
  
  echo "Running build with missing source file..."
  npm run build > ../test-temp/missing-file-test.txt 2>&1
  BUILD_EXIT_CODE=$?
  
  echo "Build exit code: $BUILD_EXIT_CODE"
  if [ $BUILD_EXIT_CODE -ne 0 ]; then
    echo "✓ Build failed as expected"
    echo "Error output:"
    tail -20 ../test-temp/missing-file-test.txt
  else
    echo "✗ Build should have failed but succeeded"
  fi
  
  # Restore source file
  mv src/popup/popup.js.bak src/popup/popup.js
else
  echo "⚠ popup.js not found, skipping test"
fi

echo ""
echo "Test 4: Profile Cleanup"
echo "----------------------------------------------"

if [ -d .dev-profile ]; then
  echo "Removing existing .dev-profile directory..."
  rm -rf .dev-profile
  echo "✓ Profile directory removed"
else
  echo "⚠ No .dev-profile directory found"
fi

echo "Profile can be recreated by running: npm run dev"

# Restore original manifest
cp manifest.json.bak manifest.json
rm manifest.json.bak

echo ""
echo "=== Testing Complete ==="
echo ""
echo "Summary:"
echo "- Invalid manifest test: Check test-temp/invalid-manifest-test.txt"
echo "- Malformed JSON test: Check test-temp/malformed-json-test.txt"
echo "- Missing file test: Check test-temp/missing-file-test.txt"
echo "- Profile cleanup: .dev-profile removed (will be recreated on next dev run)"
