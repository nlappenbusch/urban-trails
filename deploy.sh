#!/usr/bin/env bash
# Wird vom GitHub Actions self-hosted Runner ausgeführt.
set -euo pipefail

cd /opt/urban-trails

echo "==> Hole neuesten Stand von origin/main"
git fetch origin main
git reset --hard origin/main

echo "==> Baue und starte Container neu"
docker compose up -d --build

echo "==> Räume alte Images auf"
docker image prune -f

echo "==> Deployed: $(git log -1 --oneline)"
