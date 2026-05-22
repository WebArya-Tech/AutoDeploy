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
