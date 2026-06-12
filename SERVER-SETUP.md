# Urban Trails – Deployment auf den internen Docker-Server

Muster wie bei der Mörtelpumpe: `git push` auf `main` → self-hosted Runner
auf dem Server → `deploy.sh` → `docker compose up -d --build`.
Host-Port: **8083** (in `docker-compose.yml` änderbar – dann auch hier und
im Nginx Proxy Manager anpassen).

## 0. Einmalig: Git auf dem PC einrichten (falls noch nie gemacht)

**PowerShell öffnen** (Windows-Taste → «powershell» → Enter) und prüfen:

```powershell
git --version
```

Fehler statt Versionsnummer? Dann installieren:

```powershell
winget install --id Git.Git -e
```

…danach PowerShell **schliessen und neu öffnen**, nochmal `git --version`.

Dann einmalig deinen Namen/Mail hinterlegen (steht später in der Historie):

```powershell
git config --global user.name "Nils Lappenbusch"
git config --global user.email "nlappenbusch@gmail.com"
git config --global init.defaultBranch main
```

## 1. GitHub-Repo anlegen + Projekt hochladen (einmalig)

**a) Leeres Repo im Browser anlegen:**

1. https://github.com einloggen → oben rechts **+** → **New repository**
2. Repository name: `urban-trails`
3. **Private** auswählen
4. WICHTIG: **keine** Häkchen bei «Add a README / .gitignore / license»
   (das Repo muss leer sein, sonst kollidiert der erste Push)
5. **Create repository**

**b) Projekt hochladen** – PowerShell, in den Projektordner:

```powershell
cd C:\Users\Nils\Documents\Claude\Projects\city-guide2

git init                                  # Ordner wird Git-Repo
git add .                                 # alle Dateien vormerken
git commit -m "initial: urban trails + deployment pipeline"
git remote add origin https://github.com/nlappenbusch/urban-trails.git
git push -u origin main                   # hochladen
```

Beim ersten `git push` geht ein **Browserfenster zum GitHub-Login** auf
(Git Credential Manager) – einmal anmelden, der PC merkt sich das.

**c) Prüfen:** github.com/nlappenbusch/urban-trails neu laden → Dateien da?
Und wichtig: `.env.local` darf NICHT auftauchen (ist gitignored ✔).

**d) deploy.sh ausführbar markieren** (einmalig, Linux braucht das Flag):

```powershell
git update-index --chmod=+x deploy.sh
git commit -m "ci: deploy.sh ausführbar"
git push
```

**Ab jetzt ist dein Alltag nur noch dieser Dreisatz:**

```powershell
git add .
git commit -m "was ich geändert habe"
git push        # ← genau DAS löst das Deployment aus
```

Merksatz: Ohne commit kein Push, ohne Push kein Deployment.
(`git push` sagt «Everything up-to-date»? → committen vergessen.)

## 2. Server vorbereiten (auf dem Docker-Server)

```bash
sudo mkdir -p /opt/urban-trails
sudo chown actions:actions /opt/urban-trails
sudo -u actions git clone https://github.com/nlappenbusch/urban-trails.git /opt/urban-trails
sudo -u actions git config --global --add safe.directory /opt/urban-trails
```

(User `actions` existiert ja schon und ist in der docker-Gruppe –
falls neuer Server: `sudo usermod -aG docker actions`.)

**.env anlegen** (gitignored, daher manuell – Inhalt = deine lokale
`.env.local`):

```bash
sudo -u actions nano /opt/urban-trails/.env
```

```ini
NEXT_PUBLIC_MAPBOX_TOKEN=pk.…          # dein Mapbox-Token
GEMINI_API_KEY=AQ.…                    # Vertex Express Key
GEMINI_TTS_VOICE=Sulafat
NEXT_PUBLIC_PREFER_TTS=1
NEXT_PUBLIC_SITE_URL=https://deine-domain.ch   # oder http://SERVER-IP:8083
# optional: OPENAI_API_KEY=sk-…        # für «Frag deinen Guide»
# optional: ELEVENLABS_API_KEY / ELEVENLABS_VOICE_ID
```

Wichtig: Die `NEXT_PUBLIC_*`-Werte fliessen beim Build als Build-Args ins
Bundle (macht docker-compose automatisch). Nach Änderung daran → neu
deployen (pushen oder `deploy.sh` manuell ausführen).

## 3. Runner für DIESES Repo registrieren

Der Mörtelpumpe-Runner gehört zum Mörtelpumpe-**Repo** und nimmt keine Jobs
für andere Repos an → fürs neue Repo einen zweiten Runner auf demselben
Server registrieren (läuft problemlos parallel):

GitHub → `urban-trails` → Settings → Actions → Runners →
**New self-hosted runner** → Befehle als `actions`-User ausführen
(eigenes Verzeichnis nehmen, z.B. `~/actions-runner-urban-trails`).
Beim `config.sh`: Name UND zusätzliches Label **`docker-prod-01`**
(das erwartet der Workflow).

```bash
cd ~/actions-runner-urban-trails
sudo ./svc.sh install actions
sudo ./svc.sh start
systemctl status actions.runner.nlappenbusch-urban-trails.docker-prod-01.service
```

## 4. Erstes Deployment + Verifikation

```bash
# Lokal: trivialen Commit pushen → GitHub → Actions: Run grün?
# Auf dem Server:
cd /opt/urban-trails && git log -1 --oneline   # = neuester Commit?
docker ps                                       # urban-trails läuft, 8083?
curl -i http://127.0.0.1:8083 | head -n 20      # liefert HTML?
```

Erster Build dauert einige Minuten (npm ci + next build im Container).

## 5. Nginx Proxy Manager (Domain)

Proxy Host: Domain → `<docker-server-ip>:8083`, Let's-Encrypt-Zertifikat,
Force SSL, Websockets an. Danach `NEXT_PUBLIC_SITE_URL` in der Server-.env
auf die Domain stellen und einmal neu deployen.

**HTTPS ist fürs Handy wichtig:** Geolocation (Live-Standort auf der Karte,
«Du bist hier») funktioniert im Browser nur über HTTPS.

## 6. Audio-Cache warmlaufen lassen (einmalig nach Deploy)

Die TTS-Audios werden serverseitig gecacht (Volume `audio-cache`,
überlebt Rebuilds). Vorab generieren statt beim ersten Hörer:

```bash
# mehrfach ausführen, bis "remaining": 0
curl "http://127.0.0.1:8083/api/audio/warmup?limit=64"
```

## Troubleshooting

Reihenfolge: pushen → Actions grün? → Runner-Service → `git log` auf dem
Server → `docker ps` / `docker logs urban-trails` → `curl 127.0.0.1:8083`
→ NPM-Forward. Details: siehe deploy-pipeline-Skill bzw.
DEPLOY-PIPELINE-MASTERPROMPT.md.

Typisch hier:
- Karte leer → `NEXT_PUBLIC_MAPBOX_TOKEN` fehlte beim BUILD (in Server-.env
  eintragen, neu bauen)
- Audio 503 → `GEMINI_API_KEY` fehlt/ungültig (`docker logs urban-trails`)
- Job hängt «Queued» → Runner für DIESES Repo registriert + Label
  `docker-prod-01`?
