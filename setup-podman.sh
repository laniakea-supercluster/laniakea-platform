#!/bin/bash

set -e

VM_NAME="podman-lania"
LIMA_CONFIG="$HOME/.lima/$VM_NAME/lima.yaml"

echo "🔧 Podman VM setup script for '$VM_NAME'"

# 1. Criar a VM se não existir
if ! podman machine list | grep -q "$VM_NAME"; then
  echo "🚀 Creating Podman VM '$VM_NAME' with qemu backend..."
  LIMA_VM_TYPE=qemu podman machine init --cpus 4 --memory 4096 --disk-size 30 "$VM_NAME"
  echo "✅ VM created."
fi

# 2. Iniciar a VM
echo "▶️ Starting VM '$VM_NAME'..."
if podman machine start "$VM_NAME"; then
  echo "✅ VM started successfully."
else
  echo "❌ Failed to start the VM. Aborting."
  exit 1
fi

# 3. Parar a VM
echo "⏹️ Stopping VM '$VM_NAME' to apply configuration..."
podman machine stop "$VM_NAME"

# 4. Verifica e edita o lima.yaml
if [ ! -f "$LIMA_CONFIG" ]; then
  echo "❌ lima.yaml not found at $LIMA_CONFIG — something went wrong."
  exit 1
fi

echo "🔍 Editing shared mounts in $LIMA_CONFIG..."
MISSING=0

if ! grep -q 'location: "~"' "$LIMA_CONFIG"; then
  echo "➕ Adding mount: ~"
  sed -i '' '/mounts:/a\
  - location: "~"
' "$LIMA_CONFIG"
  MISSING=1
fi

if ! grep -q 'location: "/Volumes/ssd"' "$LIMA_CONFIG"; then
  echo "➕ Adding mount: /Volumes/ssd"
  sed -i '' '/mounts:/a\
  - location: "/Volumes/ssd"\
    writable: true
' "$LIMA_CONFIG"
  MISSING=1
fi

if [ "$MISSING" -eq 1 ]; then
  echo "✅ Mount configuration applied to lima.yaml"
else
  echo "ℹ️ Mounts already configured."
fi

# 5. Iniciar novamente a VM
echo "🔁 Restarting VM '$VM_NAME' with new config..."
podman machine start "$VM_NAME"

echo "✅ Setup complete. Podman VM '$VM_NAME' is running with shared volumes configured."
