#!/usr/bin/env bash
# Build voyage-scorm.zip — a SCORM 1.2 package Oracle Learning can ingest.
# Run from the repo root: bash scripts/build-scorm.sh
set -euo pipefail
OUT=voyage-scorm.zip
rm -f "$OUT"
zip -r "$OUT" imsmanifest.xml index.html assets \
  -x "assets/video/*"   # drop the 6MB hero video to keep the package light; the poster covers the hero
echo "Built $OUT ($(du -h "$OUT" | cut -f1)). Upload to Oracle Learning as SCORM content."
echo "To keep the hero video in the package, re-run without the -x exclusion."
