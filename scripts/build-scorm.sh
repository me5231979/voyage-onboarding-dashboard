#!/usr/bin/env bash
# Build voyage-scorm.zip — a SCORM 1.2 package Oracle Learning can ingest.
# Run from the repo root: bash scripts/build-scorm.sh
set -euo pipefail
OUT=voyage-scorm.zip
rm -f "$OUT"
# Stamp asset URLs with the current commit so the running build is
# identifiable (the SCORM adapter logs it to the console) and LMS/CDN
# caches can't serve files from an older package version.
SHA=$(git rev-parse --short HEAD)
sed -i "s/?v=[0-9a-f]*/?v=${SHA}/g" index.html
# Videos ship in the package: the 90-day intro gate requires intro-90day.mp4
# (the gate fails open without it), and both are compressed for streaming.
zip -r "$OUT" imsmanifest.xml index.html assets
git checkout -- index.html
echo "Built $OUT ($(du -h "$OUT" | cut -f1), build ${SHA}). Upload to Oracle Learning as SCORM content."
