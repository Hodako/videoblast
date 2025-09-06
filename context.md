# Project Context and File Structure

This document provides a detailed overview of the project's file structure and the purpose of each file and directory.

---

## High-Level Overview

This is a video streaming application built with Next.js, React, TypeScript, and Tailwind CSS. It features a modern UI with pages for browsing videos, watching content, searching, and user authentication. It uses `shadcn/ui` for pre-built components and `lucide-react` for icons.

---

## Directory Structure

```
.
├── .env
├── README.md
├── apphosting.yaml
├── backend.md
├── components.json
├── context.md
├── next.config.ts
├── package.json
├── plan.md
├── src
│   ├── ai
│   │   ├── dev.ts
│   │   ├── flows
│   │   │   ├── automated-trending-video-detection.ts
│   │   │   └── personalized-video-suggestions.ts
│   │   └── genkit.ts
│   ├── app
│   │   ├── categories
│   │   │   └── page.tsx
│   │   ├── channels
│   │   │   └── page.tsx
│   │   ├── creators
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── live
│   │   │   └── page.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   ├── playlists
│   │   │   └── page.tsx
│   │   ├── search
│   │   │   └── page.tsx
│   │   ├── shorts
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   ├── signup
│   │   │   └── page.tsx
│   │   ├── videos
│   │   │   └── page.tsx
│   │   └── watch
│   │       └── [id]
│   │           └── page.tsx
│   ├── components
│   │   ├── header.tsx
│   │   ├── main-content.tsx
│   │   ├── promo-banner.tsx
│   │   ├── shorts-card.tsx
│   │   ├── shorts-carousel.tsx
│   │   ├── sidebar-content.tsx
│   │   ├── ui
│   │   │   ├── ... (all shadcn components)
│   │   └── video-card.tsx
│   ├── hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   └── lib
│       ├── data.ts
│       └── utils.ts
├── tailwind.config.ts
├── task.md
└── tsconfig.json
```

### Root Directory

-   `.env`: For environment variables. Currently empty.
-   `README.md`: Basic project information.
-   `apphosting.yaml`: Configuration for Firebase App Hosting.
-   `backend.md`: Contains a detailed prompt/plan for building the backend.
-   `components.json`: `shadcn/ui` configuration.
-   `context.md`: This file. Detailed project context.
-   `next.config.ts`: Next.js configuration.
-   `package.json`: Project dependencies and scripts.
-   `plan.md`: High-level project plan and usage instructions.
-   `task.md`: Log of all user prompts during development.
-   `tailwind.config.ts`: Tailwind CSS configuration.
-   `tsconfig.json`: TypeScript configuration.

### `src/ai` Directory

-   **Purpose:** Contains all Generative AI related code using Genkit.
-   `genkit.ts`: Initializes and configures the Genkit AI plugin with Google AI.
-   `dev.ts`: Entry point for development Genkit flows.
-   `flows/`:
    -   `automated-trending-video-detection.ts`: A flow to analyze video data and identify trending content.
    -   `personalized-video-suggestions.ts`: A flow to recommend videos based on user history and preferences.

### `src/app` Directory

-   **Purpose:** Contains all the pages and layouts of the application, following the Next.js App Router structure.
-   `layout.tsx`: The root layout for the entire application. Wraps all pages.
-   `globals.css`: Global styles and Tailwind CSS theme variables (light and dark mode).
-   `page.tsx`: The homepage of the application.
-   `[folder]/page.tsx`: Each folder represents a route in the application (e.g., `/login`, `/videos`, `/watch/[id]`).

### `src/components` Directory

-   **Purpose:** Houses all reusable React components.
-   `header.tsx`: The main navigation header for the site.
-   `main-content.tsx`: The central content area of the homepage, containing video tabs and the shorts carousel.
-   `sidebar-content.tsx`: The filter sidebar shown on the homepage.
-   `video-card.tsx` & `shorts-card.tsx`: Components for displaying individual videos and shorts.
-   `ui/`: This directory contains all the `shadcn/ui` components (Button, Card, Input, etc.), which form the building blocks of the application's UI.

### `src/hooks` Directory

-   **Purpose:** Custom React hooks for shared logic.
-   `use-mobile.tsx`: Detects if the application is being viewed on a mobile device.
-   `use-toast.ts`: A hook for displaying toast notifications.

### `src/lib` Directory

-   **Purpose:** Utility functions and data.
-   `data.ts`: Contains the static, hardcoded data for videos and shorts used throughout the app. This acts as a mock database for frontend development.
-   `utils.ts`: Contains helper functions, most notably the `cn` function for merging Tailwind CSS classes.
