#!/bin/bash

set -e

./repo-local-clean.sh \
  @ix/laniakea-lib-audit \
  @ix/laniakea-lib-core \
  @ix/laniakea-lib-encode \
  @ix/laniakea-lib-commons \
  @ix/laniakea-lib-central \
  @ix/laniakea-lib-database \
  @ix/laniakea-lib-enterprise \
  @ix/laniakea-lib-logistics \
  @ix/laniakea-lib-metrics \
  @ix/laniakea-lib-sec-comm

# Step 2: Clean yarn cache
echo "🧹 Cleaning yarn cache..."
yarn cache clean
yarn install

# Step 3: Delete yarn PnP state (optional)
if [ -f .yarn/install-state.gz ]; then
  echo "🗑️ Removing .yarn/install-state.gz"
  rm -f .yarn/install-state.gz
fi

# # Step 4: Delete node_modules (only if using node_modules linker)
# if grep -q "nodeLinker: node-modules" .yarnrc.yml 2>/dev/null; then
#   echo "🗑️ Removing node_modules"
#   rm -rf node_modules
# fi

# # Step 5: Delete yarn.lock and reinstall cleanly
# echo "🔁 Removing yarn.lock and reinstalling..."
rm -f yarn.lock
yarn install

yarn grunt local publish-local \
  --workspace=libs \
  --projects=laniakea-lib-audit,laniakea-lib-core,laniakea-lib-encode \
  --build-type=nest
./yarn-add-range.sh \
  "@ix/laniakea-lib-audit:>=1.0.0-alpha.0 <2.0.0," \
  "@ix/laniakea-lib-core:>=1.0.0-alpha.0 <2.0.0," \
  "@ix/laniakea-lib-encode:>=1.0.0-alpha.0 <2.0.0"

yarn grunt local publish-local \
  --workspace=libs \
  --projects=laniakea-lib-commons,\
laniakea-lib-central,\
laniakea-lib-database,\
laniakea-lib-metrics,\
laniakea-lib-sec-comm \
  --build-type=nest

./yarn-add-range.sh \
  "@ix/laniakea-lib-commons:>=1.0.0-alpha.0 <2.0.0," \
  "@ix/laniakea-lib-central:>=1.0.0-alpha.0 <2.0.0," \
  "@ix/laniakea-lib-database:>=1.0.0-alpha.0 <2.0.0," \
  "@ix/laniakea-lib-metrics:>=1.0.0-alpha.0 <2.0.0," \
  "@ix/laniakea-lib-sec-comm:>=1.0.0-alpha.0 <2.0.0"

yarn grunt local publish-local \
  --workspace=libs \
  --projects=laniakea-lib-enterprise \
  --build-type=nest

./yarn-add-range.sh "@ix/laniakea-lib-enterprise:>=1.0.0-alpha.0 <2.0.0"

yarn grunt local publish-local \
  --workspace=libs \
  --projects=laniakea-lib-logistics \
  --build-type=nest

./yarn-add-range.sh "@ix/laniakea-lib-logistics:>=1.0.0-alpha.0 <2.0.0"
