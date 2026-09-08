# BiteBox Production Deployment

Record of the steps taken to fully deploy BiteBox on the VPS (`110.34.1.209`, Ubuntu). Manual deployment to `/var/www/bitebox` — no Docker.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 + Tailwind, built to static files |
| Backend | NestJS 11 + Prisma 6 + SQLite |
| Process manager | pm2 |
| Web server | nginx (serves frontend, proxies `/api` → `127.0.0.1:3000`) |
| Database | SQLite at `/var/www/bitebox/data/prod.db` |

## 1. Server prerequisites

- Ubuntu on the VPS, root/sudo access, SSH as `pratik`
- Node.js 22.x installed (required: Vite 8 / NestJS 11 need Node 20+):

```bash
sudo apt install -y curl ca-certificates gnupg
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
```

- nginx, sqlite3, rsync installed via apt.

## 2. Get the code on the server

Clone the repo into `/var/www/bitebox` (HTTPS with a GitHub Personal Access Token, or over SSH):

```bash
cd /var/www/bitebox
git clone -b test https://github.com/Pratikmhrzn1/BiteBox.git .
sudo chown -R pratik:pratik /var/www/bitebox
```

## 3. Backend environment

Production `.env` (generated locally as `backend/.env.prod`, scp'd to the server, then renamed):

```
DATABASE_URL="file:/var/www/bitebox/data/prod.db"
PORT=3000
NODE_ENV=production
JWT_SECRET="<random 64-char hex>"
ADMIN_EMAIL="admin@bitebox.com.np"
ADMIN_PASSWORD="<random temporary password>"
```

```bash
# from laptop
scp backend/.env.prod pratik@110.34.1.209:~/.env.prod

# on server
sudo mv ~/.env.prod /var/www/bitebox/backend/.env.prod
sudo chown pratik:pratik /var/www/bitebox/backend/.env.prod

# promote to the file the app reads
cd /var/www/bitebox/backend
mv .env.prod .env
chmod 600 .env
mkdir -p /var/www/bitebox/data
```

The DB lives at `/var/www/bitebox/data/prod.db` (outside the repo so git operations never touch it).

## 4. Install, migrate, build, seed

```bash
cd /var/www/bitebox/backend

npm install
npx prisma generate
npx prisma migrate deploy
npm run build

# seed the database (first time) — loads prod .env so the admin
# user is created with the .env credentials
set -a; . ./.env; set +a
npx prisma db seed
```

Seeding creates an admin user (`admin@bitebox.com.np`), demo customers, categories, menu, reviews, orders, contact messages and site content.

## 5. Run the backend with pm2

```bash
sudo npm install -g pm2

cd /var/www/bitebox/backend
pm2 start dist/main.js --name bitebox-api
pm2 save

# survive reboots
pm2 startup systemd -u pratik --hp /home/pratik
# run the command printed above, then:
pm2 save
```

Verify:

```bash
pm2 status
curl -s http://localhost:3000/api/health
```

## 6. Build the frontend

```bash
cd /var/www/bitebox/frontend
npm install
npm run build
```

Output static site at `/var/www/bitebox/frontend/dist`.

## 7. Configure nginx

Install the provided site config, pointing it at the real paths:

```bash
sudo cp /var/www/bitebox/deploy/nginx-bitebox.conf /etc/nginx/sites-available/bitebox

# replace the placeholder root with the actual frontend build dir
sudo sed -i 's|root /var/www/bitebox/app/frontend/dist;|root /var/www/bitebox/frontend/dist;|' /etc/nginx/sites-available/bitebox

sudo ln -sf /etc/nginx/sites-available/bitebox /etc/nginx/sites-enabled/bitebox
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t && sudo systemctl reload nginx
```

What the nginx config does:

- Serves the SPA from `/var/www/bitebox/frontend/dist` with SPA fallback to `index.html`
- Proxies `/api/` → `http://127.0.0.1:3000` (backend + Swagger + uploaded images)
- 12M request limit for image uploads, immutable caching for `/assets/`

## 8. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

## 9. Final verification

```bash
curl -s http://localhost:3000/api/health            # backend directly
curl -s http://localhost/api/health                 # through nginx
sudo systemctl reload nginx
```

Open `http://110.34.1.209` in a browser:

- Customer-facing menu at `/`
- Swagger docs at `/api/docs`
- Admin panel → log in with the `.env` admin credentials

## Admin access

- Email: `admin@bitebox.com.np`
- Password: the `ADMIN_PASSWORD` from `backend/.env.prod` / server `.env` (change it after first login)

## Useful commands

```bash
pm2 logs bitebox-api          # backend logs
pm2 restart bitebox-api       # after backend code changes
pm2 status                    # process state
sudo systemctl reload nginx   # after nginx changes
```

## Deploying updates

```bash
cd /var/www/bitebox && git pull
cd backend && npm install && npx prisma migrate deploy && npm run build && pm2 restart bitebox-api
cd frontend && npm install && npm run build
```