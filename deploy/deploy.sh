#!/usr/bin/env bash
# Deploy BiteBox from your laptop to the VPS.
#   ./deploy/deploy.sh            # build frontend locally, sync, rebuild API, restart
#   ./deploy/deploy.sh --seed     # ...and seed the database (first deploy only)
set -euo pipefail

SSH_HOST="${SSH_HOST:-110.34.1.209}"
SSH_USER="${SSH_USER:-pratik}"
APP_ROOT="${APP_ROOT:-/srv/bitebox}"
REMOTE="${SSH_USER}@${SSH_HOST}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SEED=0
[ "${1:-}" = "--seed" ] && SEED=1

say() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }

say "Building frontend locally"
cd "${REPO_ROOT}/frontend"
npm run build

say "Syncing backend source to ${REMOTE}:${APP_ROOT}/app/backend"
rsync -az --delete \
  --exclude node_modules --exclude dist --exclude uploads \
  --exclude .env --exclude '*.tsbuildinfo' --exclude 'prisma/dev.db*' \
  "${REPO_ROOT}/backend/" "${REMOTE}:${APP_ROOT}/app/backend/"

say "Syncing frontend build"
rsync -az --delete "${REPO_ROOT}/frontend/dist/" "${REMOTE}:${APP_ROOT}/app/frontend/dist/"

say "Installing deps, running migrations, rebuilding API"
ssh "${REMOTE}" APP_ROOT="${APP_ROOT}" SEED="${SEED}" 'bash -s' <<'REMOTE_EOF'
set -euo pipefail
cd "${APP_ROOT}/app/backend"

# Uploaded images live outside the deploy dir so --delete never wipes them
ln -sfn "${APP_ROOT}/data/uploads" "${APP_ROOT}/app/backend/uploads"

set -a; . "${APP_ROOT}/data/.env"; set +a

npm ci --no-audit --fund=false
npx prisma generate
npx prisma migrate deploy
npm run build

if [ "${SEED}" = "1" ]; then
  echo "--> Seeding database"
  npm run db:seed
fi

sudo systemctl restart bitebox-api
sleep 2
systemctl is-active --quiet bitebox-api && echo "--> bitebox-api is running" || {
  echo "--> bitebox-api FAILED to start:"; journalctl -u bitebox-api -n 40 --no-pager; exit 1;
}
REMOTE_EOF

say "Smoke test"
curl -fsS "http://${SSH_HOST}/api/health" && echo
curl -fsSI "http://${SSH_HOST}/" | head -1

say "Deployed: http://${SSH_HOST}"
