#!/bin/bash

set -e

CLUSTER_NAME="laniakea-cluster"
CONFIG_FILE="kind-config.yaml"
NGINX_MANIFEST="https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.6/deploy/static/provider/kind/deploy.yaml"

echo "🧹 Deleting existing KIND cluster (if any)..."
kind delete cluster --name "$CLUSTER_NAME"

echo "🚀 Creating KIND cluster: $CLUSTER_NAME"
kind create cluster --name "$CLUSTER_NAME" --config "$CONFIG_FILE"

echo "🌐 Installing NGINX Ingress Controller..."
kubectl apply -f "$NGINX_MANIFEST"

echo "⏳ Waiting for ingress-nginx-controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

echo "✅ KIND cluster and Ingress Controller ready!"


# chmod +x create-kind-cluster.sh
# ./create-kind-cluster.sh