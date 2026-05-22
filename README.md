# 🚀 Vite + Docker Notion-Themed Deployment Environment

A minimalist, Notion-themed workspace to test and verify Dockerized deployments of React and TypeScript applications. It is configured to run on port **5179** out-of-the-box.

---

## 📂 Project Structure

- `Dockerfile`: Production build and serve using Vite preview.
- `Dockerfile.dev`: Light-weight development image with hot-reloading (HMR) enabled.
- `docker-compose.yml`: Local orchestrator with both `app-dev` (development) and `app-prod` (production build and serve) setups.
- `vite.config.ts`: Configuration binding to host `0.0.0.0` and port `5179`.
- `.env` & `.env.example`: Configuration variables (environment tag, port details, titles).
- `src/App.tsx` & `src/index.css`: Elegant Notion-styled dashboard hero page showing environment metrics and simulated pipelines.

---

## ⚙️ Initial Setup

Before running the containers, ensure you have **Docker Desktop** installed and running on your machine.

### 1. Launch Docker Desktop
If you encounter a `pipe/dockerDesktopLinuxEngine: The system cannot find the file specified` error:
1. Search for **Docker Desktop** in your Windows Start menu and launch it.
2. Wait until the Docker status icon in the system tray turns green (indicator that the daemon is active).

---

## 🚀 How to Run and Test Deployments

### Option A: Local Development Deployment (With Hot-Reload)
This mode runs the Vite development server inside a container, mounts your workspace directory, and tracks edits in real-time.

```bash
# Build and launch the development container
docker compose up app-dev
```

- **Endpoint**: Access [http://localhost:5179](http://localhost:5179)
- **HMR Verification**: Modify any React component (e.g., `src/App.tsx`) and notice the changes reflect instantly inside the browser without manual page refresh.

---

### Option B: Local Production Deployment (Served by Vite Preview)
This mode builds the optimized static files using Node.js and serves them using Vite's preview server inside the container. This represents a production release simulation environment.

```bash
# Stop any running containers first
docker compose down

# Build and launch the production container
docker compose up app-prod
```

- **Endpoint**: Access [http://localhost:5179](http://localhost:5179)
- **Production Verification**: The server will serve pure optimized production builds with strict routing handling.

---

## 🌐 Customizing Port Configuration

If you wish to change the port from `5179` to another port:
1. **`.env`**: Edit `VITE_PORT` to your desired port number.
2. **`vite.config.ts`**: Edit the `port` value under the `server` and `preview` configuration objects.
3. **`Dockerfile` & `Dockerfile.dev`**: Update the `EXPOSE` port command.
4. **`docker-compose.yml`**: Update the port mappings (`YOUR_PORT:YOUR_PORT`).

---

## 🔒 Secure CI/CD VPS Deployment Guide (No-Compromise Policy)

To deploy this application to your VPS without compromising other running services or security, follow this guide.

### 1. GitHub Secrets Setup
Add the following secrets to your GitHub Repository (**Settings > Secrets and variables > Actions > New repository secret**):

| Secret Name | Description | Example / Best Practice |
| :--- | :--- | :--- |
| `VPS_HOST` | VPS Server IP address or domain | `192.168.1.50` or `app.domain.com` |
| `VPS_USERNAME` | SSH username for deployment | **Deploy User** (e.g. `deployer`), *not* `root` (see below) |
| `VPS_SSH_KEY` | Private SSH Key for authentication | RSA/ED25519 Private Key |
| `VPS_PROJECT_PATH` | Path to project folder on VPS | `/var/www/autodeploy` |
| `VPS_SSH_PORT` | SSH port of your server | `22` (default) or your custom port |

---

### 2. VPS Isolation Checklist

#### A. Create a Dedicated Non-Root User (Recommended)
Avoid deploying with the `root` user to prevent the CI/CD pipeline from having access to system-wide administrative functions.
```bash
# 1. Create user
sudo adduser deployer

# 2. Add deployer to docker group so it can run docker commands without sudo
sudo usermod -aG docker deployer

# 3. Create SSH key directory for user
sudo mkdir -p /home/deployer/.ssh
sudo chmod 700 /home/deployer/.ssh
```

#### B. SSH Key Isolation
Generate a dedicated SSH key pair *only* for this deployment, rather than using your main personal SSH key.
```bash
# Generate key on your local machine
ssh-keygen -t ed25519 -C "github-actions-deployer" -f ./id_deployer

# Copy public key content to VPS
# Add it to /home/deployer/.ssh/authorized_keys
```

#### C. Prevent Network Port Conflicts (Reverse Proxy Isolation)
By default, Docker compose maps `"5179:5179"` which binds port `5179` to `0.0.0.0` (exposing it publicly on the internet, bypassing UFW firewalls). 
* **If you use Nginx, Apache, or Caddy as a Reverse Proxy**:
  To protect this application and other VPS services, modify `docker-compose.yml` on the VPS to bind only to the loopback interface (`127.0.0.1`):
  ```yaml
  ports:
    - "127.0.0.1:5179:5179"
  ```
  Then route traffic using Nginx:
  ```nginx
  server {
      listen 80;
      server_name your-domain.com;

      location / {
          proxy_pass http://127.0.0.1:5179;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
      }
  }
  ```

#### D. Safe Docker Deployment commands
The deployment pipeline defined in `.github/workflows/deploy.yml` uses surgical commands to guarantee that other VPS services are completely untouched:
1. **Targeted builds**: `docker compose build app-prod` builds only this application.
2. **Targeted deployment**: `docker compose up -d --no-deps app-prod` stops and restarts *only* the `app-prod` container. It ignores other services in the file and leaves unrelated Docker containers untouched.
3. **Safe cleanup**: `docker image prune -f` only prunes dangling (untagged) build stages. It does **not** prune active images or system-wide volumes, ensuring other databases or services remain online.

