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

echo "==> Audio-Cache im Hintergrund auffüllen (Log: warmup.log)"
setsid nohup bash -c '
  sleep 15
  for i in $(seq 1 300); do
    R=$(curl -s --max-time 900 "http://127.0.0.1:8083/api/audio/warmup?limit=4" | grep -o "\"remaining\":[0-9]*" | cut -d: -f2)
    echo "$(date +%H:%M:%S) warmup remaining=${R:-fehler}"
    [ "${R:-1}" = "0" ] && echo "$(date +%H:%M:%S) alle Audios generiert ✔" && break
    sleep 2
  done
' >> /opt/urban-trails/warmup.log 2>&1 < /dev/null &

echo "==> Deployed: $(git log -1 --oneline)"
