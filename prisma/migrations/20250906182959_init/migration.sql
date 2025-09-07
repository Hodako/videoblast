CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    role VARCHAR DEFAULT 'user'
);

CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    description TEXT,
    duration VARCHAR,
    views VARCHAR,
    uploaded VARCHAR,
    thumbnail_url VARCHAR,
    video_url VARCHAR NOT NULL,
    subtitle VARCHAR,
    uploader_id INTEGER REFERENCES users(id),
    tags TEXT[],
    meta_data JSONB,
    display_order INTEGER
);

CREATE TABLE shorts (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    video_url VARCHAR NOT NULL,
    thumbnail_url VARCHAR,
    views VARCHAR
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    image_url VARCHAR NOT NULL
);

CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    user_id INTEGER REFERENCES users(id)
);

CREATE TABLE playlist_videos (
    playlist_id INTEGER REFERENCES playlists(id),
    video_id INTEGER REFERENCES videos(id),
    PRIMARY KEY (playlist_id, video_id)
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id),
    video_id INTEGER REFERENCES videos(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE site_settings (
    key VARCHAR PRIMARY KEY,
    value JSONB
);