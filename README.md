# SpaceScope: NASA Data Explorer

SpaceScope is a web application that leverages NASA's Open APIs to provide an interactive and visually appealing platform for exploring space-related data. The application features a React frontend, a Node.js/Express backend, and a Django Python backend for the SKAI NASA AI agent. It includes functionalities like Astronomy Picture of the Day (APOD), media search, Near Earth Object (NEO) data visualizations, Mars weather dashboard, and an AI-powered query system.

# Table of Contents

1. Features

2. Technologies

3. Project Structure

4. Setup Instructions

Prerequisites

Cloning the Repository

Docker Setup

5. Running the Application

6. CI/CD Pipeline

7. Deployment

8. Usage

9. Contributing


# Features

## Astronomy Picture of the Day (APOD):

Displays NASA's APOD with image, title, description, and date.

## APOD Archive:

Allows users to browse historical APOD entries.

## Favorites:

Enables users to save and view favorite APOD or other NASA media.

## Search Functionality:

Search for any NASA media (images, videos) using NASA's Image and Video Library API.

## Near Earth Object (NEO) Dashboard:

Asteroid Timeline: Visualizes close approach timelines of asteroids.

Asteroid Map: Displays regions with higher asteroid impact risks.

Asteroid Scatter Plot: Plots asteroid size vs. miss distance to Earth.

Asteroid Stats: Pie chart showing counts of hazardous vs. non-hazardous asteroids.

Historical Close Approaches: Line chart of miss distance vs. close approach date with filters for 5, 10, 50, or all-time data.

Asteroid Explorer: To search for past asteroid approaches. 

## Mars Weather Dashboard:

Displays weather data for the last week before NASA's InSight lander stopped transmitting.

## SKAI (NASA AI Agent):

A Django-based AI agent that answers queries related to NASA data, including APOD, NEO, DONKI, and Tech Transfer, with up-to-date information.

# Technologies

Frontend: React, Tailwind CSS

Backend (API): Node.js, Express

Backend (AI Agent): Django, Python

NASA APIs: APOD, NEO Web Service (NeoWs), NASA Image and Video Library, DONKI, Tech Transfer

# Deployment:

Frontend: Vercel (https://space-scope-liard.vercel.app)

Backend (Node.js/Express): Render

Backend (Django/SKAI): Render

Testing: Docker for local testing

CI/CD: GitHub Actions for automated testing and deployment

Visualization: Chart.js for scatter plots, pie charts, and line charts

Other: Axios for API requests, React Router for navigation, Firebase for additional functionality


# Setup Instructions

Prerequisites: 

Docker and Docker Compose

Git

NASA API Key (sign up at https://api.nasa.gov/ to get your free API key)

OpenAI API Key (for SKAI functionality)

Firebase configuration (for Firebase-related features)

# Cloning the Repository

git clone https://github.com/your-username/SpaceScope.git
cd SpaceScope

# Docker Setup

1. Update the docker compose file with environment variable: 
NASA_API_KEY=your_nasa_api_key
OPENAI_API_KEY=your_openai_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id


2. Ensure Docker and Docker Compose are installed.

3. Run the following command to start all services (frontend, Node.js backend, and Django SKAI backend):

docker-compose up --build

# Running the Application

Once the Docker Compose setup is complete, the application will be running with the following services:

Frontend: React app at http://localhost:5173

Backend (Node.js/Express): API server at http://localhost:4000/api

Backend (SKAI): Django AI agent at http://localhost:8000/api

If you prefer running without Docker, you can set up each service individually (see previous README for manual setup instructions).

# CI/CD Pipeline

GitHub Actions is configured for automated testing and deployment.

On push to the main branch, the pipeline runs tests and deploys to Vercel (frontend) and Render (backends).

See .github/workflows/ for pipeline configurations.

# Deployment

Frontend: Deployed on Vercel at https://space-scope-liard.vercel.app

Backend (Node.js/Express): Deployed on Render

Backend (Django/SKAI): Deployed on Render

Environment variables (e.g., NASA_API_KEY, OPENAI_API_KEY, Firebase configs) are configured in the deployment platforms.

# Usage

APOD: View the daily astronomy picture with details.

APOD Archive: Browse past APOD entries by date.

Favorites: Save APOD or media to your favorites list (powered by Firebase).

Search: Search NASA's Image and Video Library by keywords.

NEO Dashboard:

Explore asteroid data through timeline, map, scatter plot, pie chart, and historical close approaches.

Use filters (5, 10, 50, all-time) for historical data.

Mars Weather Dashboard: View weather data for the last week before InSight stopped transmitting.

SKAI: Ask questions about NASA data (APOD, NEO, DONKI, Tech Transfer) via the AI agent.

The application is fully responsive and optimized for various screen sizes. It includes user interactivity features like date filters, favorite filters, and search functionality.

# Contributing

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request.
