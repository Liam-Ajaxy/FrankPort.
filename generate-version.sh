#!/bin/bash

# === Git metadata ===
BUILD=$(git rev-list --count HEAD)         # total commits = build number
HASH=$(git rev-parse --short HEAD)         # short commit hash
DATE=$(git log -1 --format=%cd --date=iso) # last commit date

# === Write JSON file ===
cat <<EOF > version.json
{
  "major": 1,
  "minor": 2,
  "patch": 7,
  "build": $BUILD,
  "commit": "$HASH",
  "releaseDate": "$DATE"
}
EOF

echo "✅ version.json updated! (build=$BUILD, commit=$HASH)"
