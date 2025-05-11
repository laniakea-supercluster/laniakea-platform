#!/bin/bash

ZSHRC="$HOME/.zshrc"
MARKER_BEGIN="# >>> lania setup >>>"
MARKER_END="# <<< lania setup <<<"

# Create Verdaccio hostPath directories with full permissions
sudo mkdir -p /opt/local-storage/verdaccio/conf
sudo mkdir -p /opt/local-storage/verdaccio/storage
sudo chmod -R 777 /opt/local-storage/verdaccio

echo "✅ Created and set permissions for /local-storage/verdaccio"

# Update .zshrc if not already set
if grep -q "$MARKER_BEGIN" "$ZSHRC"; then
  echo "✅ LANIAKEA block already exists in $ZSHRC"
else
  cat <<'EOF' >> "$ZSHRC"

# >>> lania setup >>>
LANIAKEA_HOME=/Volumes/ssd/workspace/projects/atis/laniakea-supercluster/laniakea-platform

lcp_local() {
  set -a
  source "\$LANIAKEA_HOME/infrastructure/local.env"
  set +a
}

lcp_docker() {
  set -a
  source "\$LANIAKEA_HOME/infrastructure/docker.env"
  set +a
}

export PATH=\$PATH:\$LANIAKEA_HOME
# <<< lania setup <<<
EOF

  echo "✅ LANIAKEA setup added to $ZSHRC"
fi
