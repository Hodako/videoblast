
import { Router } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const adminAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const result = await pool.query('SELECT role FROM users WHERE id = $1', [decoded.id]);
    const user = result.rows[0];

    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

router.use(adminAuth);

router.get('/stats', async (req, res) => {
  try {
    const totalVideos = await pool.query('SELECT COUNT(*) FROM videos');
    const totalViews = await pool.query('SELECT SUM(views::bigint) FROM videos');
    res.json({
      totalVideos: totalVideos.rows[0].count,
      totalViews: totalViews.rows[0].sum
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/videos', async (req, res) => {
  const { title, description, duration, views, uploaded, thumbnail_url, video_url, subtitle, uploader_id, tags, meta_data, display_order } = req.body;
  try {
    const newVideo = await pool.query(
      'INSERT INTO videos (title, description, duration, views, uploaded, thumbnail_url, video_url, subtitle, uploader_id, tags, meta_data, display_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [title, description, duration, views, uploaded, thumbnail_url, video_url, subtitle, uploader_id, tags, meta_data, display_order]
    );
    res.status(201).json(newVideo.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/videos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, duration, views, uploaded, thumbnail_url, video_url, subtitle, uploader_id, tags, meta_data, display_order } = req.body;
  try {
    const updatedVideo = await pool.query(
      'UPDATE videos SET title = $1, description = $2, duration = $3, views = $4, uploaded = $5, thumbnail_url = $6, video_url = $7, subtitle = $8, uploader_id = $9, tags = $10, meta_data = $11, display_order = $12 WHERE id = $13 RETURNING *',
      [title, description, duration, views, uploaded, thumbnail_url, video_url, subtitle, uploader_id, tags, meta_data, display_order, id]
    );
    res.json(updatedVideo.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/videos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM videos WHERE id = $1');
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/shorts', async (req, res) => {
  const { title, video_url, thumbnail_url, views } = req.body;
  try {
    const newShort = await pool.query(
      'INSERT INTO shorts (title, video_url, thumbnail_url, views) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, video_url, thumbnail_url, views]
    );
    res.status(201).json(newShort.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/shorts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM shorts WHERE id = $1');
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/images', async (req, res) => {
  const { title, image_url } = req.body;
  try {
    const newImage = await pool.query(
      'INSERT INTO images (title, image_url) VALUES ($1, $2) RETURNING *',
      [title, image_url]
    );
    res.status(201).json(newImage.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/images/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM images WHERE id = $1');
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/playlists', async (req, res) => {
  const { name, user_id } = req.body;
  try {
    const newPlaylist = await pool.query(
      'INSERT INTO playlists (name, user_id) VALUES ($1, $2) RETURNING *',
      [name, user_id]
    );
    res.status(201).json(newPlaylist.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/playlists/:id', async (req, res) => {
  const { id } = req.params;
  const { video_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO playlist_videos (playlist_id, video_id) VALUES ($1, $2)',
      [id, video_id]
    );
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/playlists/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM playlists WHERE id = $1');
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM site_settings');
    const settings = result.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/settings', async (req, res) => {
  const { key, value } = req.body;
  try {
    await pool.query(
      'INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
      [key, JSON.stringify(value)]
    );
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/videos/reorder', async (req, res) => {
  const videos = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const video of videos) {
      await client.query('UPDATE videos SET display_order = $1 WHERE id = $2', [video.order, video.id]);
    }
    await client.query('COMMIT');
    res.status(204).send();
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

export default router;
