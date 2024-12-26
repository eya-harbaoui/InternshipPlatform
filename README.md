# MERN Stack Application with Docker

A containerized MERN stack (MongoDB, Express.js, React, Node.js) application managed with Docker Compose. 
Project Description: Internship Management Application
This application serves as a comprehensive platform to streamline the internship process for various stakeholders, providing tailored functionalities for each user role:

Students:

- Search for internship opportunities.
- Submit applications for internship offers.
- Track the status of their applications in real-time.
Managers:

- Manage domains and associated skills.
- Oversee internship offers and applications.
HR Representatives (RH):

- Manage internship offers and candidate applications.
- Schedule and manage interviews with candidates.
Technical Validators:

- Assess and validate candidate applications based on technical skills and requirements.
Admins:

- Manage user accounts.
- Oversee offers and applications statistics and analytics.
- Manage domains and associated skills.
The application is designed to enhance collaboration, ensure transparency, and simplify the management of internships, offering an efficient and user-friendly interface for all stakeholders involved in the process.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview

This project implements a full-stack application using the MERN stack, with all services containerized using Docker:
- Frontend: React application served through Nginx
- Backend: Node.js server with Express.js
- Database: MongoDB instance

## Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/eya-harbaoui/InternshipPlatform.git
   cd InternshipPlatform
   ```

2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

## Usage

### Accessing Services

- Frontend: [http://localhost](http://localhost)
- Backend API: [http://localhost:8000](http://localhost:8000)
- MongoDB: localhost:27017

### Managing Containers

Stop the application:
```bash
docker-compose down
```

View service logs:
```bash
docker-compose logs [service-name]
```

Clear MongoDB data:
```bash
docker volume rm your-repo_mongo-data
```

## Architecture

### Service Configuration

The `docker-compose.yml` file defines three main services:

1. **Frontend**
   - Port: 80
   - Technology: React + Nginx
   - Multi-stage build process

2. **Backend**
   - Port: 8000
   - Technology: Node.js + Express.js
   - Dependencies: MongoDB

3. **MongoDB**
   - Port: 27017
   - Persistent storage: mongo-data volume

### Dockerfiles

#### Frontend (`frontend/Dockerfile`)
- Stage 1: Build React application
- Stage 2: Serve built files with Nginx

#### Backend (`server/Dockerfile`)
- Single-stage build
- Node.js environment setup
- Dependencies installation

## Configuration

### Nginx Setup
Customize the web server configuration by modifying `frontend/nginx.conf`.

## Troubleshooting

Common issues and solutions:

1. **Port Conflicts**
   - Ensure ports 80, 8000, and 27017 are available
   - Check for running services using these ports

2. **Service Failures**
   - Check service logs: `docker-compose logs [service-name]`
   - Verify environment variables
   - Ensure sufficient system resources
