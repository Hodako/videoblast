# Project Plan & Documentation

This document outlines the file structure of the project and provides instructions on how to run and use the website. This project uses a separate frontend and backend architecture.

---

## How to Run the Website (Development)

You will need to run two separate servers simultaneously for local development.

### 1. Running the Backend Server

1.  **Navigate to the Backend Directory:**
    ```bash
    cd backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Set Up Environment:** Copy the `backend/.env.example` file to `backend/.env` and fill in your `DATABASE_URL` and `JWT_SECRET`.

4.  **Run Database Migrations & Seed:** This command will set up and populate your database.
    ```bash
    npx prisma migrate dev
    npx prisma db:seed
    ```

5.  **Start the Backend Server:**
    ```bash
    npm run dev
    ```
    The backend will be running on `http://localhost:3002`.

### 2. Running the Frontend Server

1.  **Open a NEW terminal window.** Navigate to the project's root directory.

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Set Up Environment:** Create a file named `.env.local` in the root directory. Add the following line to tell the frontend where to find your local backend.
    ```
    NEXT_PUBLIC_API_URL=http://localhost:3002/api
    ```

4.  **Start the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    The frontend will be running on `http://localhost:9002`. You can now access the website in your browser.

---

## How to Deploy to Production

1.  **Deploy the Backend:** Deploy the `backend` directory to a Node.js hosting service like Heroku, Render, or Google Cloud Run. You will need to set the `DATABASE_URL` and `JWT_SECRET` environment variables in that service's settings.

2.  **Deploy the Frontend:** Deploy the root of your project to Vercel. In your Vercel project settings, add an environment variable:
    *   **Name:** `NEXT_PUBLIC_API_URL`
    *   **Value:** The public URL of your deployed backend server (e.g., `https://your-backend.onrender.com/api`).

---

## Project File Structure

The project is now divided into a Next.js frontend and a Node.js Express backend.

-   `/` (Root): Contains the Next.js frontend application.
    -   `/src/app`: All frontend pages and components.
    -   `/src/lib/data.ts`: The central data-fetching client. It reads the `NEXT_PUBLIC_API_URL` environment variable to know where to send API requests.
    -   **Note:** The `/src/app/api` directory has been removed as this logic now lives in the backend.

-   `/backend`: Contains the standalone Express.js backend server.
    -   `/src/index.ts`: The main entry point for the backend server.
    -   `/src/lib`: Contains database (`db.ts`) and authentication (`auth.ts`) helpers.
    -   `/src/routes`: Contains all API route definitions, separated into public and admin-only routes.
    -   `/prisma`: Contains the database schema and migration files.
    -   `package.json`: Contains all backend-specific dependencies like `express`, `cors`, and `prisma`.
