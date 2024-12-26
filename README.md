# MERN Stack Internship Management Application

## Project Overview
A containerized MERN stack (MongoDB, Express.js, React, Node.js) application managed with Docker Compose, designed to streamline the internship management process across multiple stakeholder roles.

## Core Features

### Role-Based Functionality

#### Students
- Search for internship opportunities
- Submit applications for internship offers
- Track application status in real-time

#### Managers
- Manage domains and associated skills
- Oversee internship offers and applications

#### HR Representatives
- Manage internship offers and candidate applications
- Schedule and manage interviews with candidates

#### Technical Validators
- Assess and validate candidate applications
- Evaluate technical skills and requirements

#### Administrators
- Manage user accounts
- Access offers and applications analytics
- Oversee domain and skill management

## Technical Stack

### Components
- Frontend: React application served through Nginx
- Backend: Node.js server with Express.js
- Database: MongoDB instance

### Prerequisites
- Docker
- Docker Compose

## Installation and Setup

### Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/eya-harbaoui/InternshipPlatform.git
   cd InternshipPlatform
   ```

2. Build and start containers:
   ```bash
   docker-compose up --build
   ```

### Service Access Points
- Frontend: http://localhost
- Backend API: http://localhost:8000
- MongoDB: localhost:27017

## Container Management

### Basic Commands
```bash
# Stop application
docker-compose down

# View service logs
docker-compose logs [service-name]

# Clear MongoDB data
docker volume rm your-repo_mongo-data
```

## Architecture Details

### Service Structure
The application uses three main services defined in `docker-compose.yml`:

1. Frontend Service
   - Port: 80
   - Stack: React + Nginx
   - Build: Multi-stage process

2. Backend Service
   - Port: 8000
   - Stack: Node.js + Express.js
   - Dependencies: MongoDB

3. Database Service (MongoDB)
   - Port: 27017
   - Storage: Persistent mongo-data volume

### Docker Configuration

#### Frontend Dockerfile (`frontend/Dockerfile`)
- Stage 1: Build React application
- Stage 2: Nginx server configuration

#### Backend Dockerfile (`server/Dockerfile`)
- Single-stage build process
- Node.js environment configuration
- Dependency management

## Configuration

### Web Server
- Nginx configuration can be customized in `frontend/nginx.conf`

## Troubleshooting Guide

### Common Issues

1. Port Conflicts
   - Verify ports 80, 8000, and 27017 are available
   - Check for competing services

2. Service Failures
   - Review service logs using `docker-compose logs`
   - Validate environment variables
   - Monitor system resource usage
