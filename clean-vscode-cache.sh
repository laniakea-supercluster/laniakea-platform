#!/bin/bash

echo "🧹 Cleaning VSCode + TypeScript + Yarn caches..."

# Apaga tsbuildinfo e cache do node_modules
find . -name 'tsconfig.tsbuildinfo' -exec rm -v {} \;
rm -rf node_modules/.cache
rm -rf .turbo
rm -rf .eslintcache
rm -rf .yarn/install-state.gz
rm -rf .yarn/cache

# Reinicializa dependências
echo "🔁 Running yarn install..."
yarn install

# Mensagem final
echo "✅ Cache cleanup done. Now restart your VSCode and run:"
echo "➡️  Cmd+Shift+P → TypeScript: Restart TS Server"
