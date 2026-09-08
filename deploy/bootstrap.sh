#!/usr/bin/env bash
# One-time VPS provisioning for BiteBox. Run once, as a sudo-capable user, on the server.
#   sudo bash bootstrap.sh
set -euo pipefail

APP_USER="${APP_USER:-pratik}"
APP_ROOT="${APP_ROOT:-/srv/bitebox}"
NODE_MAJOR="${NODE_MAJOR:-22}"

echo "==> Installing system packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl ca-certificates gnupg rsync nginx ufw sqlite3

if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -c2- | cut -d. -f1)" -lt "$NODE_MAJOR" ]; then
  echo "==> Installing Node.js ${NODE_MAJOR}.x"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi
node -v && npm -v

echo "==> Creating directory layout under ${APP_ROOT}"
mkdir -p "${APP_ROOT}/app" "${APP_ROOT}/data/uploads" "${APP_ROOT}/backups"
chown -R "${APP_USER}:${APP_USER}" "${APP_ROOT}"

if [ ! -f "${APP_ROOT}/data/.env" ]; then
  echo "==> Generating production .env (JWT secret is random, admin password is temporary)"
  JWT="$(openssl rand -hex 32)"
  ADMIN_PW="$(openssl rand -base64 12)"
  cat > "${APP_ROOT}/data/.env" <<ENVEOF
DATABASE_URL="file:${APP_ROOT}/data/prod.db"
PORT=3000
NODE_ENV=production
JWT_SECRET="${JWT}"
ADMIN_EMAIL="admin@bitebox.com.np"
ADMIN_PASSWORD="${ADMIN_PW}"
ENVEOF
  chown "${APP_USER}:${APP_USER}" "${APP_ROOT}/data/.env"
  chmod 600 "${APP_ROOT}/data/.env"
  echo "    Admin login: admin@bitebox.com.np / ${ADMIN_PW}"
  echo "    (stored in ${APP_ROOT}/data/.env - change it after first login)"
else
  echo "==> ${APP_ROOT}/data/.env already exists, leaving it alone"
fi

echo "==> Installing systemd unit"
install -m 644 "$(dirname "$0")/bitebox-api.service" /etc/systemd/system/bitebox-api.service
sed -i "s|__APP_USER__|${APP_USER}|g; s|__APP_ROOT__|${APP_ROOT}|g" /etc/systemd/system/bitebox-api.service
systemctl daemon-reload
systemctl enable bitebox-api

echo "==> Installing nginx site"
install -m 644 "$(dirname "$0")/nginx-bitebox.conf" /etc/nginx/sites-available/bitebox
sed -i "s|__APP_ROOT__|${APP_ROOT}|g" /etc/nginx/sites-available/bitebox
ln -sf /etc/nginx/sites-available/bitebox /etc/nginx/sites-enabled/bitebox
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> Firewall"
ufw allow OpenSSH >/dev/null 2>&1 || true
ufw allow 'Nginx Full' >/dev/null 2>&1 || true
ufw --force enable >/dev/null 2>&1 || true

echo "==> Nightly SQLite backup cron"
cat > /etc/cron.daily/bitebox-backup <<CRONEOF
#!/bin/sh
DB="${APP_ROOT}/data/prod.db"
OUT="${APP_ROOT}/backups/prod-\$(date +\%F).db"
[ -f "\$DB" ] && sqlite3 "\$DB" ".backup '\$OUT'" && find "${APP_ROOT}/backups" -name 'prod-*.db' -mtime +14 -delete
CRONEOF
chmod +x /etc/cron.daily/bitebox-backup

echo "==> Bootstrap complete. Now run deploy.sh from your laptop."
