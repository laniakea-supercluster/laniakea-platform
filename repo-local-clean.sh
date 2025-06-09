#!/bin/bash

# repo-local-refresh.sh
# Remove specified libraries from Yarn and Verdaccio

VERDACCIO_POD="verdaccio-0"
NAMESPACE="laniakea-local"
STORAGE_PATH="/verdaccio/storage"

# Verifica se argumentos foram passados
if [ $# -eq 0 ]; then
  echo "❌ Usage: $0 <libs | lib1 lib2 ...>"
  exit 1
fi

# Função para remover do Yarn (apenas se estiver listado no package.json)
remove_from_yarn() {
  local lib="$1"
  if grep -q "\"$lib\"" package.json; then
    echo "📦 Removing $lib from yarn..."
    yarn remove "$lib"
  else
    echo "⚠️  $lib not found in package.json. Skipping yarn remove."
  fi
}

# Função para remover do Verdaccio
remove_from_verdaccio() {
  local lib="$1"
  echo "🧹 Removing $lib from Verdaccio..."
  kubectl exec -it "$VERDACCIO_POD" -n "$NAMESPACE" -- sh -c "rm -rf $STORAGE_PATH/$lib"
}

# Se o primeiro argumento for 'libs', processa todas as libs do diretório ./libs/
if [ "$1" = "libs" ]; then
  LIBS=$(find ./libs -maxdepth 1 -mindepth 1 -type d -exec basename {} \; | grep '^laniakea-lib-')

  echo "🔄 Refreshing all Verdaccio libs from ./libs:"
  for lib in $LIBS; do
    remove_from_yarn "$lib"
    remove_from_verdaccio "$lib"
  done
else
  # Processa todos os argumentos como libs individuais
  for lib in "$@"; do
    remove_from_yarn "$lib"
    remove_from_verdaccio "$lib"
  done
fi

echo "🔧 Running yarn install..."
yarn install
echo "✅ Done!"
