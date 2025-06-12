# LLM Insurance Advisor Chatbot

This project was developed as part of **Mission Ready Level 5, Mission 4**, with the primary goal of building an LLM (Large Language Model) connected chatbot designed to advise on insurance-related queries, and then "dockerizing" the entire application for easier deployment and management.

As a learning project, you will find numerous comments and commented-out code sections. These serve as documentation for the development process, highlighting discarded approaches, explaining complex configurations, and providing future reference points for architectural decisions.

## Table of Contents

1.  [Features](#features)
2.  [Project Architecture](#project-architecture)
3.  [Technologies Used](#technologies-used)
4.  [Local Development Setup](#local-development-setup)
    * [Prerequisites](#prerequisites)
    * [Environment Variables and Secrets](#environment-variables-and-secrets)
    * [Installation and Build Steps](#installation-and-build-steps)
    * [Running the Application](#running-the-application)
    * [Accessing the Application](#accessing-the-application)
5.  [Development Notes](#development-notes)
6.  [Deployment Considerations](#deployment-considerations)
7.  [Troubleshooting Common Setup Errors](#troubleshooting-common-setup-errors)

---

## 1. Features

* **LLM-Powered Chatbot:** Utilizes a Large Language Model (LLM) to provide advice on insurance queries.
* **Interactive Frontend:** A modern, responsive user interface built with React.
* **Robust Backend:** A Node.js (Express) server handling API requests, LLM integration, and session management.
* **Dockerized Application:** The entire application (frontend and backend) is containerized using Docker and orchestrated with Docker Compose for consistent local development and deployment.
* **Nginx Reverse Proxy:** The frontend container uses Nginx to serve static files and act as a reverse proxy for API requests, routing them seamlessly to the backend service.

## 2. Project Architecture

The application follows a client-server architecture, deployed using Docker Compose:

* **Frontend Service:**
    * A React application built with Vite.
    * Served by an Nginx web server within its Docker container.
    * All API requests from the browser are routed through Nginx (via the `/api/` path).
* **Backend Service:**
    * A Node.js (Express) application.
    * Handles LLM interactions, processes chat messages, and manages chat sessions.
    * Listens on an internal port (e.g., 5000) within the Docker network.
* **Nginx Proxy (within Frontend Container):**
    * Acts as a reverse proxy, intercepting `/api/` requests from the frontend and forwarding them internally to the `backend` service (e.g., `http://backend:5000`).
    * Serves the static React application files.

## 3. Technologies Used

* **Frontend:**
    * **React:** JavaScript library for building user interfaces.
    * **Vite:** Fast development build tool.
    * **Axios:** Promise-based HTTP client for the browser and Node.js.
    * **Nginx:** High-performance web server and reverse proxy (used within the frontend Docker container).
* **Backend:**
    * **Node.js:** JavaScript runtime.
    * **Express:** Fast, unopinionated, minimalist web framework for Node.js.
    * **Gemini API:** For Large Language Model capabilities.
* **Containerization & Orchestration:**
    * **Docker:** Platform for developing, shipping, and running applications in containers.
    * **Docker Compose:** Tool for defining and running multi-container Docker applications.

## 4. Local Development Setup

To get this project running on your local machine, follow these steps carefully.

### Prerequisites

* **Git:** For cloning the repository.
* **Node.js (v20 or higher) and npm (or Yarn):** Required for building the frontend and installing backend dependencies.
* **Docker Desktop:** (or Docker Engine on Linux) - Essential for building and running the Docker containers. Ensure Docker Desktop is running before starting the containers.

### Environment Variables and Secrets

You need to create several environment files to configure the application.

1.  **In the root directory of the project (`mission-code/`):**
    * Create a file named `.env`.
    * Add the following variables to it:
        ```env
        FRONTEND_PORT=8080       # Port for your frontend application on your host machine
        BACKEND_PORT=5000        # Internal port for the backend, also mapped to host
        CORS_ORIGIN=http://localhost:8080 # Adjust if your frontend port differs
        SESSIONS_DIR=./sessions  # Directory to save chat sessions (will be volume mounted)
        ```
    * Create a file named `secret_api_key.txt`.
    * Paste your OpenAI API Key directly into this file on a single line. **Do not commit this file to version control.**
        ```
        sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx # Your actual OpenAI API Key
        ```

2.  **In the `front-end/` directory:**
    * For this Dockerized setup with Nginx proxy, the `front-end/.env` file is no longer strictly necessary for backend URL configuration. You can create an empty `.env` file here if your frontend build process expects one, or omit it if your Vite setup doesn't require it for other frontend-specific environment variables.

3.  **In the `back-end/` directory:**
    * Similar to the frontend, for this Docker Compose setup, most backend environment variables (`PORT`, `CORS_ORIGIN`, `SESSIONS_DIR`, and especially `OPENAI_API_KEY`) are managed either by the `docker-compose.yml` file or Docker secrets.
    * Therefore, a `back-end/.env` file is primarily for local non-Docker development of the backend. For this setup, it's not strictly required as the values are passed via Docker Compose.

### Installation and Build Steps

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-url]
    cd mission-code
    ```

2.  **Install Frontend Dependencies & Build:**
    ```bash
    cd front-end
    npm install
    npm run build # This creates the 'dist' folder with your production-ready frontend
    cd .. # Go back to the mission-code root
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd back-end
    npm install
    cd .. # Go back to the mission-code root
    ```

4.  **Build Docker Images:**
    Ensure Docker Desktop is running. From the `mission-code` root directory:
    ```bash
    docker compose build --no-cache
    ```
    This will build both your `frontend` and `backend` Docker images from scratch.

### Running the Application

From the `mission-code` root directory:

```bash
docker compose up --build
```


The `--build` flag ensures that your images are up-to-date with any changes you might have made. You can omit it on subsequent runs if no Dockerfile or `docker-compose.yml` changes occurred.

To stop the application, press `Ctrl+C` in your terminal and then run:

```bash
docker compose down
```
### Accessing the Application

Once `docker compose up` is running, open your web browser and navigate to:

`http://localhost:8080` (or the `FRONTEND_PORT` you configured in your `.env` file).

## 5. Development Notes

This project has evolved through various stages, and some architectural decisions are reflected in comments and commented-out code. Key learning points include:

* **Frontend API Routing Evolution:** The frontend's API calls initially used a hardcoded or environment-variable-injected backend URL. This was later simplified to relative `/api/` paths, with routing handled by:
    * Vite's development proxy (`vite.config.js`) for local `npm run dev`.
    * Nginx reverse proxy (`nginx.conf`) for the Dockerized production-like environment.
    This significantly decouples the frontend from backend location specifics, making the frontend more portable.
* **Dockerizing a Multi-Service Application:** Understanding `Dockerfile` for individual services and `docker-compose.yml` for orchestrating them on a shared network.
* **Nginx as a Static Server and Proxy:** Leveraging Nginx for efficient static file serving and as a flexible API gateway within the frontend container.
* **Docker Secrets:** Utilizing Docker secrets for sensitive information like API keys, which is a more secure approach than plain environment variables, especially in production.

## 6. Deployment Considerations

While this setup is robust for local development, a production deployment would involve additional steps:

* **Domain Names:** Replacing `localhost` with your actual domain name(s) in `nginx.conf` and `CORS_ORIGIN`.
* **SSL/TLS (HTTPS):** Implementing HTTPS, typically by configuring Nginx to handle SSL certificates (e.g., with Certbot/Let's Encrypt).
* **Production Environment Variables:** Ensuring all environment variables (e.g., `CORS_ORIGIN`) are correctly set for the production environment, possibly using different values.
* **Secrets Management:** Using a more advanced secrets management system (e.g., Docker Swarm Secrets, Kubernetes Secrets, cloud-specific secret managers) instead of `secret_api_key.txt`.
* **Persistence:** Confirming data persistence strategies for volumes in a production context (e.g., persistent storage for `backend_sessions`).
* **Monitoring & Logging:** Setting up proper monitoring and centralized logging for containers.
* **Orchestration:** For larger scale deployments, considering orchestrators like Docker Swarm or Kubernetes.

## 7. Troubleshooting Common Setup Errors

During the setup process, several common issues arose, leading to specific changes and deeper understanding of Docker and Nginx:

* **Initial API Routing with Environment Variables:**
    * **Problem:** The frontend initially used `VITE_BACKEND_URL` passed via `ARG` and `ENV` in `Dockerfile`, and `args` and `environment` in `docker-compose.yml` to specify the backend's exact address.
    * **Change & Reason:** To improve deployability and decouple the frontend from the backend's specific address, the frontend code (`Homepage.jsx`) was modified to make API calls to relative paths (e.g., `/api/session`). Consequently, the `VITE_BACKEND_URL` `ARG` and `ENV` lines in `frontend/Dockerfile` and the `args` and `environment` sections in `docker-compose.yml` for the frontend were removed/commented out.
    * **New Solution:** Routing is now handled by a proxy: Vite's dev server (`vite.config.js`) for local development, and Nginx (`nginx.conf`) for the Dockerized setup.

* **Nginx Configuration File Placement (`events` directive error):**
    * **Problem:** After creating `nginx.conf` and copying it to `/etc/nginx/conf.d/default.conf` in the Dockerfile, the frontend container failed to start with the error: `"events" directive is not allowed here in /etc/nginx/conf.d/default.conf`.
    * **Meaning:** Files placed in the `conf.d/` directory are typically *included* by Nginx's main configuration file. These included files should only contain directives that belong *inside* the `http` block (like `server` blocks). The `events` and `http` blocks are top-level contexts and shouldn't be in an included file.
    * **Change & Reason:** The `front-end/nginx.conf` file was refactored to contain *only* the `server { ... }` block, removing the extraneous `events { ... }` and `http { ... }` wrappers. This allowed Nginx to correctly parse the configuration.
    * **Action:** Required rebuilding the `frontend` Docker image (`docker compose build --no-cache frontend`) after the `nginx.conf` change.

* **Docker Daemon Connection Issues:**
    * **Problem:** Commands like `docker compose build` failed with errors like `error during connect: ... The system cannot find the file specified.`.
    * **Meaning:** The Docker client (your terminal command) could not establish a connection with the Docker daemon (the Docker Desktop service running in the background).
    * **Fix:** The primary solution was to ensure Docker Desktop was fully running and responsive, or to restart it (and potentially `wsl --shutdown` on Windows with WSL2). This is an environmental issue, not a code change.

