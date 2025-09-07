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
        -   `role` (VARCHAR, default 'user') -- Add for admin access
    -   `videos`:
        -   `id` (SERIAL PRIMARY KEY)
        -   `title` (VARCHAR)
        -   `description` (TEXT)
        -   `duration` (VARCHAR)
        -   `views` (VARCHAR)
        -   `uploaded` (VARCHAR)
        -   `thumbnail_url` (VARCHAR)
        -   `video_url` (VARCHAR, NOT NULL)
        -   `subtitle` (VARCHAR)
        -   `uploader_id` (INTEGER, REFERENCES users(id))
        -   `tags` (TEXT[])
        -   `meta_data` (JSONB)
        -   `display_order` (INTEGER)
    -   `shorts`:
        -   `id` (SERIAL PRIMARY KEY)
        -   `title` (VARCHAR)
        -   `video_url` (VARCHAR, NOT NULL)
        -   `thumbnail_url` (VARCHAR)
        -   `views` (VARCHAR)
    -   `images`:
        -   `id` (SERIAL PRIMARY KEY)
        -   `title` (VARCHAR)
        -   `image_url` (VARCHAR, NOT NULL)
    -   `playlists`:
        -   `id` (SERIAL PRIMARY KEY)
        -   `name` (VARCHAR, NOT NULL)
        -   `user_id` (INTEGER, REFERENCES users(id))
    -   `playlist_videos`:
        -   `playlist_id` (INTEGER, REFERENCES playlists(id))
        -   `video_id` (INTEGER, REFERENCES videos(id))
        -   PRIMARY KEY (`playlist_id`, `video_id`)
    -   `comments`:
        -   `id` (SERIAL PRIMARY KEY)
        -   `text` (TEXT, NOT NULL)
        -   `user_id` (INTEGER, REFERENCES users(id))
        -   `video_id` (INTEGER, REFERENCES videos(id))
        -   `created_at` (TIMESTAMP, default NOW())
    -   `site_settings`:
        -   `key` (VARCHAR, PRIMARY KEY)
        -   `value` (JSONB)
    -   `categories`:
        -   `id` (SERIAL PRIMARY KEY)
        -   `name` (VARCHAR, UNIQUE, NOT NULL)
    -   `creators`:
        -   `id` (SERIAL PRIMARY KEY)
        -   `name` (VARCHAR, NOT NULL)
        -   `image_url` (VARCHAR)
        -   `description` (TEXT)
    -   `video_categories`:
        -   `video_id` (INTEGER, REFERENCES videos(id) ON DELETE CASCADE)
        -   `category_id` (INTEGER, REFERENCES categories(id) ON DELETE CASCADE)
        -   PRIMARY KEY (`video_id`, `category_id`)

## 2. API Endpoints

The backend should expose a RESTful API to interact with the frontend. All `/api/admin` routes should be protected and only accessible by users with the `admin` role.

### 2.1. Authentication

-   **`POST /api/auth/signup`**:
    -   **Request Body:** `{ firstName, lastName, email, password }`
    -   **Functionality:** Hash the password, create a new user in the `users` table. Return a JWT token for session management.
    -   **Response:** `{ token, user: { id, firstName, email, role } }`

-   **`POST /api/auth/login`**:
    -   **Request Body:** `{ email, password }`
    -   **Functionality:** Verify credentials against the `users` table. Return a JWT token if successful.
    -   **Response:** `{ token, user: { id, firstName, email, role } }`

### 2.2. Public Content

-   **`GET /api/videos`**: Fetch all videos, ordered by `display_order`.
-   **`GET /api/videos/:id`**: Fetch a single video by its ID, including associated categories.
-   **`GET /api/videos/search?q=:query`**: Search for videos.
-   **`GET /api/shorts`**: Fetch all shorts.
-   **`GET /api/categories`**: Fetch all categories.
-   **`GET /api/creators`**: Fetch all creators.
-   **`GET /api/videos/:videoId/comments`**: Fetch all comments for a specific video.
-   **`GET /api/settings`**: Fetch public site settings (theme, banner text, etc.).

### 2.3. User Actions (Auth Required)

-   **`POST /api/videos/:videoId/comments`**: Add a new comment.

### 2.4. Admin - Dashboard

-   **`GET /api/admin/stats`**:
    -   **Functionality:** Fetch aggregate data for the dashboard (e.g., total revenue, subscribers, video counts, views).
    -   **Response:** `{ totalRevenue, newSubscribers, totalVideos, totalViews, monthlyData: [...] }`

### 2.5. Admin - Content Management (Videos, Shorts, Images, Playlists, Categories, Creators)

-   **`POST /api/admin/videos`**: Add a new video. Also handle `categoryIds` in the body to link categories.
-   **`PUT /api/admin/videos/:id`**: Update an existing video. Also handle `categoryIds`.
-   **`DELETE /api/admin/videos/:id`**: Delete a video.
-   **`POST /api/admin/shorts`**: Add a new short.
-   **`DELETE /api/admin/shorts/:id`**: Delete a short.
-   **`POST /api/admin/images`**: Add a new image.
-   **`DELETE /api/admin/images/:id`**: Delete an image.
-   **`POST /api/admin/playlists`**: Create a new playlist.
-   **`PUT /api/admin/playlists/:id`**: Update a playlist (e.g., add/remove videos).
-   **`DELETE /api/admin/playlists/:id`**: Delete a playlist.
-   **`GET /api/admin/categories`**: Get all categories.
-   **`POST /api/admin/categories`**: Create a new category.
-   **`PUT /api/admin/categories/:id`**: Update a category.
-   **`DELETE /api/admin/categories/:id`**: Delete a category.
-   **`GET /api/admin/creators`**: Get all creators.
-   **`POST /api/admin/creators`**: Create a new creator.
-   **`PUT /api/admin/creators/:id`**: Update a creator.
-   **`DELETE /api/admin/creators/:id`**: Delete a creator.

### 2.6. Admin - Customization

-   **`GET /api/admin/settings`**: Fetch all site settings.
-   **`PUT /api/admin/settings`**: Update a specific setting.
-   **`PUT /api/admin/videos/reorder`**:
    -   **Request Body:** `[{ id: 1, order: 0 }, { id: 2, order: 1 }, ...]`
    -   **Functionality:** Update the `display_order` for all videos based on the provided array.

## 3. Frontend Interaction

The Next.js frontend will use `fetch` to make requests to these endpoints.

-   **JWT Management:** Upon successful login, the received JWT will be stored in `localStorage` and sent in the `Authorization: Bearer <token>` header for all protected requests (especially to `/api/admin/*` routes).
-   **Admin Panel:** The admin pages will make CRUD requests to the `/api/admin/*` endpoints to manage content and settings. For example, the "Add Video" form will `POST` to `/api/admin/videos`. The theme settings form will `PUT` to `/api/admin/settings`.
-   **Data Fetching:** The public pages (`/videos`, `/creators`, etc.) will `GET` data from the public API endpoints.
