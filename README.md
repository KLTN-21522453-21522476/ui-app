# UI Application

The main frontend dashboard and user interface for the project, built with a modern React SPA architecture.

## Tech Stack
- **Framework**: React 19, TypeScript
- **State Management**: Redux Toolkit & React-Redux
- **Routing**: React Router DOM (v7)
- **UI Components & Styling**: Material UI (MUI), Bootstrap
- **Data Visualization**: Chart.js (`react-chartjs-2`)
- **BaaS Integration**: Appwrite
- **Build Server**: Vite

## Key Features
- Dynamic and responsive UI crafted with Material UI and Bootstrap elements.
- Clean application state and data fetching handling via Redux.
- Secure user authentication and file handling integrated through Appwrite.
- Visual data representations using customizable charts.
- Configured for Docker & NGINX standard production deployments.

## Quick Start

1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Compile bundle for production:
   ```bash
   npm run build
   ```