# Project Plan & Documentation

This document outlines the file structure of the project and provides instructions on how to run and use the website.

---

## How to Run the Website

1.  **Install Dependencies:** Open a terminal in the project's root directory and run the following command to install all the necessary packages:
    ```bash
    npm install
    ```

2.  **Start the Development Server:** After the installation is complete, run the following command to start the local development server:
    ```bash
    npm run dev
    ```

3.  **View the Website:** Open your web browser and navigate to `http://localhost:9002` to see the application in action.

---

## Website Functionality

-   **Homepage:** The main page displays a grid of videos and a carousel of "Shorts". It features tabs for "All Videos," "Trending," "New," and "Photos."
-   **Video Player:** Clicking on any video card takes you to a dedicated watch page with an advanced video player. The player includes custom controls for play/pause, volume, progress seeking, 10-second skips (via keyboard arrows), and playback speed adjustment.
-   **Shorts Player:** Clicking on a "Shorts" card takes you to a vertical, full-screen player designed for short-form content. You can navigate between shorts using the up and down arrow buttons on the screen or the arrow keys on your keyboard.
-   **Search:** Use the search bar in the header to filter videos by title, description, or channel.
-   **Login/Signup:** The application includes UI pages for login and signup. Currently, these are frontend-only and do not have backend authentication.
-   **Filtering:** The sidebar on the homepage allows filtering content by various criteria (type, category, etc.), although the filtering logic is not yet connected to the video list.
-   **Comments:** The video watch page includes a comments section that prompts non-authenticated users to log in or sign up.
-   **Responsive Design:** The site features a responsive header that adapts to mobile screens, consolidating navigation and login/signup options into menus.

---

## Project File Structure

Here is a breakdown of the current files and directories in the project:

-   `/.env`: Environment variables file. Currently empty but intended for storing sensitive information like API keys or database URLs.
-   `/README.md`: The main README file for the project.
-   `/apphosting.yaml`: Configuration file for Firebase App Hosting.
-   `/backend.md`: A detailed prompt and plan for building the required backend services.
-   `/context.md`: Detailed documentation on the project's file structure and context.
-   `/components.json`: Configuration for `shadcn/ui` components.
-   `/next.config.ts`: Configuration file for the Next.js framework.
-   `/package.json`: Lists all project dependencies and scripts.
-   `/plan.md`: This file. Contains documentation about the project.
-   `/task.md`: Contains a log of all user prompts from the development session.
-   `/tailwind.config.ts`: Configuration file for Tailwind CSS.
-   `/tsconfig.json`: TypeScript configuration for the project.

### `src` Directory

-   `/src/ai/`: Contains Genkit AI flow configurations.
    -   `dev.ts`: Main entry point for development-related AI flows.
    -   `genkit.ts`: Initializes and configures the Genkit AI plugin.
    -   `flows/`: Directory for specific AI flow definitions.
        -   `automated-trending-video-detection.ts`: AI flow to detect trending videos.
        -   `personalized-video-suggestions.ts`: AI flow for generating video suggestions.

-   `/src/app/`: The main application directory for Next.js.
    -   `globals.css`: Global stylesheet with Tailwind CSS and theme variables.
    -   `layout.tsx`: The main layout component for the entire application.
    -   `page.tsx`: The component for the homepage (`/`).
    -   `login/page.tsx`: The component for the login page (`/login`).
    -   `signup/page.tsx`: The component for the signup page (`/signup`).
    -   `search/page.tsx`: The component for the search results page (`/search`).
    -   `videos/page.tsx`: The component for the all videos page (`/videos`).
    -   `live/page.tsx`: The component for the live page (`/live`).
    -   `categories/page.tsx`: The component for the categories page (`/categories`).
    -   `creators/page.tsx`: The component for the creators page (`/creators`).
    -   `channels/page.tsx`: The component for the channels page (`/channels`).
    -   `playlists/page.tsx`: The component for the playlists page (`/playlists`).
    -   `shorts/[id]/page.tsx`: Dynamic route for the "Shorts" video player.
    -   `watch/[id]/page.tsx`: Dynamic route for the main video player page.

-   `/src/components/`: Contains all reusable React components.
    -   `header.tsx`: The header component displayed on most pages.
    -   `main-content.tsx`: The main content area of the homepage, including video listings and shorts.
    -   `promo-banner.tsx`: A promotional banner component.
    -   `shorts-card.tsx`: A card component for displaying individual "Shorts".
    -   `shorts-carousel.tsx`: A carousel to display a list of "Shorts".
    -   `sidebar-content.tsx`: The content for the filter sidebar on the homepage.
    -   `video-card.tsx`: A card component for displaying individual videos.
    -   `ui/`: Directory for `shadcn/ui` components (e.g., Button, Card, Input).

-   `/src/hooks/`: Contains custom React hooks.
    -   `use-mobile.tsx`: A hook to detect if the user is on a mobile device.
    -   `use-toast.ts`: A hook for displaying toast notifications.

-   `/src/lib/`: Contains library files and utilities.
    -   `data.ts`: A file containing the static video and shorts data used throughout the app.
    -   `utils.ts`: Utility functions, including `cn` for merging CSS classes.
