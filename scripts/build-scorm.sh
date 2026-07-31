#!/usr/bin/env bash
# Build voyage-scorm.zip — a SCORM 1.2 package Oracle Learning can ingest.
# Run from the repo root: bash scripts/build-scorm.sh
set -euo pipefail
OUT=voyage-scorm.zip
rm -f "$OUT"
# Videos ship in the package: the 90-day intro gate requires intro-90day.mp4
# (the gate fails open without it), and both are compressed for streaming.
zip -r "$OUT" imsmanifest.xml index.html assets
echo "Built $OUT ($(du -h "$OUT" | cut -f1)). Upload to Oracle Learning as SCORM content."
