#!/bin/bash

# Usage: ./yarn-add-range.sh "@ix/laniakea-lib-audit:>=1.0.0-alpha.1 <2.0.0,@ix/laniakea-lib-core:^1.2.0"

if [ -z "$1" ]; then
  echo "❌ Usage: $0 \"@scope/pkg1:versionRange1,@scope/pkg2:versionRange2,...\""
  exit 1
fi

DEPS=$1
IFS=',' read -ra PAIRS <<< "$DEPS"

for pair in "${PAIRS[@]}"; do
  NAME=$(echo "$pair" | cut -d':' -f1)
  RANGE=$(echo "$pair" | cut -d':' -f2-)

  if [ -z "$NAME" ] || [ -z "$RANGE" ]; then
    echo "⚠️  Skipping invalid entry: $pair"
    continue
  fi

  echo "📦 Setting $NAME to version range \"$RANGE\" in package.json..."

  # Use jq if available
  if command -v jq > /dev/null; then
    TMP=$(mktemp)
    jq --arg name "$NAME" --arg range "$RANGE" '.dependencies[$name] = $range' package.json > "$TMP" && mv "$TMP" package.json
  else
    # Fallback: naive sed (not robust for nested/complex JSON)
    sed -i.bak "/\"dependencies\"[^{]*{/a \ \ \ \ \"$NAME\": \"$RANGE\"," package.json
    rm -f package.json.bak
  fi
done

echo "🔧 Running yarn install..."
yarn install
echo "✅ Done!"
