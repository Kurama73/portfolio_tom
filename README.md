# Portfolio Tom - Exploitation, CI/CD, Nginx, Migration

Ce document explique comment lancer le projet, configurer Nginx, brancher le runner GitHub Actions et deplacer le site vers un nouveau serveur sans casser la prod.

## 1. Architecture

- Frontend: React + Vite (`frontend/`)
- Backend: Node.js + Express + SQLite (`backend/`)
- Base SQLite persistante: `backend/data/portfolio.db`
- Uploads persistants: `backend/public/images/uploads/`
- Backend en conteneur Docker via `docker-compose.yml`
- Frontend build en fichiers statiques dans `frontend/dist`
- Nginx sert `frontend/dist` et fait proxy vers l'API backend (`/api`) et les images backend (`/images`)

## 2. Structure importante

- `docker-compose.yml`
- `.github/workflows/deploy.yml`
- `backend/.env`
- `backend/data/`
- `backend/public/images/uploads/`
- `frontend/dist/` (genere par `npm run build`)

## 3. Variables et secrets backend

Fichier: `backend/.env`

Variables minimales:

- `JWT_SECRET=...`
- `ADMIN_PASSWORD=...`
- `DISCORD_WEBHOOK_URL=...`
- `DB_PATH=/app/data/portfolio.db`

## 4. Lancer les services (local/dev)

### 4.1 Backend

Depuis la racine du repo:

```bash
docker compose up -d --build
```

Verifier:

```bash
docker compose ps
docker compose logs --tail=50
```

API attendue sur `http://localhost:3001`.

### 4.2 Frontend dev

```bash
cd frontend
npm ci
npm run dev
```

Le frontend Vite utilise la config de `frontend/src/domain/services/api.ts` et les proxies Vite (`/api`, `/images`) pour parler au backend.

### 4.3 Frontend production build

```bash
cd frontend
npm ci
npm run build
```

Sortie: `frontend/dist/`.

## 5. Nginx production (statique + proxy API)

Le point critique: Nginx doit servir `frontend/dist` ET proxy `/api` vers le backend.

Exemple de config `default.conf`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://172.17.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /images/ {
        proxy_pass http://172.17.0.1:3001/images/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### 5.1 Mapping du dist dans le conteneur Nginx

Le conteneur Nginx doit monter:

- Source host: `/DATA/AppData/mesSites/portfolio_tom/frontend/dist`
- Destination conteneur: `/usr/share/nginx/html`

Si Nginx retourne `403 directory index ... forbidden`, verifier que le conteneur voit bien les fichiers:

```bash
docker exec <nginx-container> ls -la /usr/share/nginx/html/
```

## 6. CI/CD GitHub Actions (branche `prod`)

Workflow: `.github/workflows/deploy.yml`

Declenchement:

- Push sur la branche `prod`

Ce que fait le workflow:

1. Setup Node 22
2. Verifie que le clone de prod existe dans `DEPLOY_DIR`
3. `git fetch/checkout/pull` dans le clone de prod
4. Prepare les dossiers runtime (`backend/data`, uploads, `.env`)
5. Build frontend dans `DEPLOY_DIR/frontend` (`npm ci && npm run build`)
6. Rebuild/restart backend (`docker compose up -d --build --remove-orphans`)

## 7. Runner GitHub Actions (self-hosted)

Installer le runner hors du repo, exemple:

- Dossier runner: `~/actions-runner`

Installation type (depuis GitHub > Settings > Actions > Runners > New self-hosted runner):

```bash
mkdir -p ~/actions-runner
cd ~/actions-runner
# telecharger + extraire le runner
# configurer avec URL repo + token
./config.sh --url https://github.com/<owner>/<repo> --token <TOKEN>
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status
```

Verifier que le runner est `Online` dans GitHub.

## 8. Protocole de deploiement standard

1. Travailler sur branche feature
2. Merge vers `prod`
3. Push `prod`
4. Verifier workflow `Deploy Portfolio` en vert
5. Verifier site + endpoints API

Commande push correcte:

```bash
git push origin prod
```

## 9. Checklist de migration vers un nouveau serveur

1. Installer Docker et Docker Compose
2. Cloner le repo dans le nouveau chemin de production
3. Creer `backend/.env`
4. Restaurer SQLite (`backend/data/portfolio.db`) et uploads (`backend/public/images/uploads/`)
5. Configurer Nginx conteneur:
- volume `frontend/dist -> /usr/share/nginx/html`
- proxy `/api` et `/images` vers backend
6. Installer un nouveau runner self-hosted sur le nouveau serveur
7. Mettre a jour `DEPLOY_DIR` dans `.github/workflows/deploy.yml` si chemin different
8. Lancer un premier deploy (push sur `prod`)
9. Verifier:
- `curl -I http://localhost:<nginx-port>`
- `curl -I http://localhost:<nginx-port>/api/projects`
- site public en 200

## 10. Commandes de diagnostic utiles

### Backend

```bash
cd /DATA/AppData/mesSites/portfolio_tom
docker compose ps
docker compose logs --tail=100
```

### Nginx

```bash
docker ps | grep -i nginx
docker logs <nginx-container> --tail=100
docker exec <nginx-container> ls -la /usr/share/nginx/html/
docker exec <nginx-container> nginx -t
```

### Permissions/chemins

```bash
namei -l /DATA/AppData/mesSites/portfolio_tom/frontend/dist/index.html
realpath /DATA/AppData/mesSites/portfolio_tom/frontend/dist
```

## 11. Erreurs frequentes

- `git push prod` echoue: mauvais remote, utiliser `git push origin prod`
- Job Actions en `Queued`: runner offline
- `403 directory index ... forbidden`: Nginx monte un dossier vide ou ne voit pas `index.html`
- Front ok mais API en `404`: pas de `location /api/` dans Nginx

## 12. Notes de securite

- Ne pas commiter `backend/.env`
- Ne pas installer le runner dans le repo de l'app
- Limiter les ports exposes au strict necessaire
- Garder Docker et runner a jour
