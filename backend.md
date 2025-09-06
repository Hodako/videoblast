# Backend Implementation Plan

This document outlines the requirements for the backend service that will power the VideoHub frontend application. The backend should be built with Node.js, Express, and a PostgreSQL database.

## 1. Database Setup

-   **Database:** PostgreSQL
-   **Connection URL (from user):** `postgresql://databasefordata_user:OB1BXLyGrtcjKKuMvtCWybrLWSB81Xos@dpg-d2u5t6h5pdvs73a5rlo0-a.singapore-postgres.render.com/databasefordata`
-   **Tables:**
    -   `users`:
        -   `id` (SERIAL PRIMARY KEY)
        -   `first_name` (VARCHAR)
        -   `last_name` (VARCHAR)
        -   `email` (VARCHAR, UNIQUE, NOT NULL)
        -   `password_hash` (VARCHAR, NOT NULL)
        -   `created_at` (TIMESTAMP, default NOW())
    -   `videos`:
        -   `id` (SERIAL PRIMARY KEY)
        -   `title` (VARCHAR)
        -   `description` (TEXT)
        -   `duration` (VARCHAR)
        -   `views` (VARCHAR)
        -   `uploaded` (VARCHAR)
        -   `thumbnail` (VARCHAR)
        -   `image_url` (VARCHAR)
        -   `video_url` (VARCHAR, NOT NULL)
        -   `subtitle` (VARCHAR)
        -   `uploader_id` (INTEGER, REFERENCES users(id))
    -   `comments`:
        -   `id` (SERIAL PRIMARY KEY)
        -   `text` (TEXT, NOT NULL)
        -   `user_id` (INTEGER, REFERENCES users(id))
        -   `video_id` (INTEGER, REFERENCES videos(id))
        -   `created_at` (TIMESTAMP, default NOW())

## 2. API Endpoints

The backend should expose a RESTful API to interact with the frontend.

### 2.1. Authentication

-   **`POST /api/auth/signup`**:
    -   **Request Body:** `{ firstName, lastName, email, password }`
    -   **Functionality:** Hash the password, create a new user in the `users` table. Return a JWT token for session management.
    -   **Response:** `{ token, user: { id, firstName, email } }`

-   **`POST /api/auth/login`**:
    -   **Request Body:** `{ email, password }`
    -   **Functionality:** Verify credentials against the `users` table. Return a JWT token if successful.
    -   **Response:** `{ token, user: { id, firstName, email } }`

### 2.2. Videos

-   **`GET /api/videos`**:
    -   **Functionality:** Fetch all videos from the `videos` table.
    -   **Response:** `[ { video1_data }, { video2_data }, ... ]`

-   **`GET /api/videos/:id`**:
    -   **Functionality:** Fetch a single video by its ID.
    -   **Response:** `{ video_data }`

-   **`GET /api/videos/search?q=:query`**:
    -   **Functionality:** Search for videos where the title, description, or subtitle matches the query.
    -   **Response:** `[ { video1_data }, { video2_data }, ... ]`

### 2.3. Comments

-   **`GET /api/videos/:videoId/comments`**:
    -   **Functionality:** Fetch all comments for a specific video, joining with the `users` table to get commenter information.
    -   **Response:** `[ { id, text, createdAt, user: { firstName, lastName, avatar } }, ... ]`

-   **`POST /api/videos/:videoId/comments`**:
    -   **Functionality:** Add a new comment to a video. Requires authentication (JWT token).
    -   **Request Body:** `{ text }`
    -   **Response:** `{ new_comment_data }`

## 3. Frontend Interaction

The Next.js frontend will use `fetch` or a library like `axios` to make requests to these endpoints.

-   **Login/Signup:** The forms will post data to the `/api/auth/` endpoints. Upon successful login, the received JWT will be stored in `localStorage` or a secure cookie and sent in the `Authorization` header for protected requests.
-   **Video Pages:** The pages will fetch data from `/api/videos` and `/api/videos/:id`. The search page will use `/api/videos/search`.
-   **Comments:** The watch page will fetch comments and allow authenticated users to post new ones.

## 4. Data Seeding

Create a script to populate the `videos` table with the initial video data provided in the user's first prompt. This script should be run once to set up the database for development.
