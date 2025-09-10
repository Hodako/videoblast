# Project Plan & Documentation

This document outlines the file structure of the project and provides instructions on how to run and use the website.

---

## How to Run the Website (Development)

1.  **Install Dependencies:** Open a terminal in the project's root directory and run the following command to install all the necessary packages:
    ```bash
    npm install
    ```

2.  **Set Up Database:** Run the following command to reset and seed your database. This will create the necessary tables and populate them with initial data.
     ```bash
    npx prisma migrate reset
    ```
    *(You will be prompted to confirm; type `y` and press Enter.)*

3.  **Start the Development Server:** After the installation and database setup is complete, run the following command to start the local development server for both frontend and backend:
    ```bash
    npm run dev
    ```

4.  **View the Website:** Open your web browser and navigate to `http://localhost:9002` to see the application in action.

---

## How to Build and Run for Production

1.  **Install Dependencies:** Make sure all dependencies are installed:
    ```bash
    npm install
    ```

2.  **Build the Application:** Run the following command to create a production-ready, optimized build of your Next.js frontend and ensure the backend is ready.
    ```bash
    npm run build
    ```

3.  **Start the Production Server:** After the build is complete, run this command to start the application in production mode.
     ```bash
    npm run start
    ```
    The application will be served from `http://localhost:3001` by default (or the port specified by the `PORT` environment variable).

---

## Website Functionality

-   **Homepage:** The main page displays a grid of videos and a carousel of "Shorts". It features dynamic tabs for categories fetched from the database.
-   **Video Player:** Clicking on any video card takes you to a dedicated watch page with an advanced video player. The player includes custom controls for play/pause, volume, instant seeking, playback speed adjustment, and keyboard shortcuts (Space, F, M, Arrow Keys).
-   **Secure Video Streaming:** Video URLs are hidden from the user. Videos are streamed securely through a Next.js API route that proxies the content, preventing direct access to the source file.
-   **Shorts Player:** Clicking on a "Shorts" card takes you to a vertical, full-screen player designed for short-form content. You can navigate between shorts using the up and down arrow buttons on the screen or the arrow keys on your keyboard.
-   **Search:** Use the search bar in the header to find both videos and shorts by title or description.
-   **Login/Signup:** The application includes fully functional login and signup pages that connect to the backend for authentication.
-   **Filtering:** The sidebar on the homepage allows filtering content by type (Straight, Gay, Trans), categories, and tags, with results updated in real-time.
-   **Comments & Likes:** Authenticated users can post comments and like videos. The comment section displays the first 3 comments with a "Show More" button for further engagement.
-   **Responsive Design:** The site features a responsive header and layout that adapts to mobile screens, ensuring a great user experience on any device.
-   **SEO Optimized:** The application automatically generates a `sitemap.xml` for search engine discovery and uses dynamic meta tags for video watch pages to improve search rankings.

---

## Project File Structure

Here is a breakdown of the current files and directories in the project:

-   `/.env`: Environment variables file. Currently empty but intended for storing sensitive information like API keys or database URLs.
-   `/README.md`: The main README file for the project.
-   `/apphosting.yaml`: Configuration file for Firebase App Hosting.
-   `/backend.md`: A detailed plan for the backend services.
-   `/context.md`: Detailed documentation on the project's file structure and context.
-   `/components.json`: Configuration for `shadcn/ui` components.
-   `/next.config.ts`: Configuration file for the Next.js framework, including image optimization and caching headers.
-   `/package.json`: Lists all project dependencies and scripts, including `build` and `start` for production.
-   `/plan.md`: This file. Contains documentation about the project and how to run it.
-   `/task.md`: Contains a log of all user prompts from the development session.
-   `/tailwind.config.ts`: Configuration file for Tailwind CSS.
-   `/tsconfig.json`: TypeScript configuration for the project.
-   `/prisma/`: Contains all database-related files.
    - `schema.prisma`: The definitive schema for the PostgreSQL database.
    - `seed.ts`: The script to populate the database with initial test data.

### `src` Directory
-   `/src/app/`: The main application directory for Next.js.
    -   `globals.css`: Global stylesheet with Tailwind CSS and theme variables.
    -   `layout.tsx`: The main layout component for the entire application.
    -   `page.tsx`: The component for the dynamic homepage (`/`).
    -   `login/page.tsx`, `signup/page.tsx`: User authentication pages.
    -   `search/page.tsx`: The component for the search results page.
    -   `videos/page.tsx`, `categories/page.tsx`, `creators/page.tsx`, `playlists/page.tsx`: Public content browsing pages.
    -   `shorts/[id]/page.tsx`, `watch/[slug]/page.tsx`: Dynamic routes for the video and shorts players.
    -   `api/`: Contains all backend API route handlers.
        - `stream/[videoId]/route.ts`: The secure video streaming proxy.
    - `admin/`: Contains all pages for the administration dashboard.
-   `/src/components/`: Contains all reusable React components.
    -   `header.tsx`, `sidebar-content.tsx`, `video-card.tsx`, etc.
    -   `ui/`: Directory for `shadcn/ui` components (e.g., Button, Card, Input).
-   `/src/hooks/`: Contains custom React hooks.
-   `/src/lib/`: Contains library files and utilities.
    -   `data.ts`: The main data-fetching client for interacting with the backend API.
    -   `utils.ts`: Utility functions, including `cn` for merging CSS classes.
-   `/src/backend/`: Contains the Express.js backend server logic.
    -   `index.ts`: The main entry point for the backend server.
    -   `lib/db.ts`: Prisma client initialization.
    -   `routes/`: Contains all API route definitions for authentication, content, and admin actions.
