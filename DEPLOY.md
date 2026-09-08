# BiteBox VPS Deployment Guide

## 1. Prerequisites

- A VPS running **Ubuntu/Debian** (default target: `110.34.1.209`)
- Root/sudo access to the server
- SSH key from your laptop to the server must work: `ssh pratik@110.34.1.209`

## 2. One-time server provisioning

Copy the `deploy/` directory to the server, then run the bootstrap script once:

```bash
scp -r deploy pratik@110.34.1.209:/tmp/bitebox-deploy
ssh pratik@110.34.1.209
sudo bash /tmp/bitebox-deploy/bootstrap.sh
```

What this does:

- Installs `nginx`, `ufw`, `sqlite3`, `rsync`, and Node.js 22.x
- Creates the directory layout under `/srv/bitebox` (`app/`, `data/uploads/`, `backups/`)
- Generates a production `.env` at `/srv/bitebox/data/.env` with a random JWT secret and a temporary admin password (printed at the end — make note of it)
- Installs the `bitebox-api` systemd service and the nginx site config
- Enables UFW firewall (OpenSSH + Nginx Full)
- Installs a nightly SQLite backup cron (14 days of backups retained)

## 3. Deploy the app (from your laptop, repo root)

```bash
./deploy/deploy.sh            # normal deploy
./deploy/deploy.sh --seed     # FIRST deploy only — seeds the database
```

Pipeline:

1. Builds the frontend locally (`npm run build`)
2. Rsyncs backend source and the built frontend to the server
3. On the server: `npm ci` → `prisma generate` → `prisma migrate deploy` → `npm run build`
4. Restarts the `bitebox-api` systemd service
5. Smoke tests `GET /api/health` and the root page

## 4. Verify

- `curl http://110.34.1.209/api/health` → `{"status":"ok"}`
- Open `http://110.34.1.209` in a browser
- Swagger docs at `http://110.34.1.209/api/docs`
- Admin panel login → `admin@bitebox.com.np` / the temporary password printed during bootstrap (change it after first login, or edit `/srv/bitebox/data/.env`)

## 5. Operations & maintenance

- **Environment overrides** if the server details change:
  ```bash
  SSH_HOST=x.x.x.x SSH_USER=user APP_ROOT=/srv/bitebox ./deploy/deploy.sh
  ```
- **API logs:** `ssh pratik@110.34.1.209 journalctl -u bitebox-api -f`
- **DB backups:** automatic, nightly to `/srv/bitebox/backups/`, kept 14 days
- **Uploaded images:** live at `/srv/bitebox/data/uploads`, symlinked into the deploy dir so deploys never wipe them

## 6. Subsequent deploys

Just run `./deploy/deploy.sh` again — the pipeline is idempotent.