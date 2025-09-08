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
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: number };
    const result = await pool.query('SELECT role FROM users WHERE id = $1', [decoded.id]);
    const user = result.rows[0];

    if (user && user.role === 'admin') {
      req.user = { id: decoded.id };
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

router.use(adminAuth);

// Dashboard
router.get('/stats', async (req, res) => {
  try {
    const totalVideos = await pool.query('SELECT COUNT(*) FROM videos');
    const totalViews = await pool.query("SELECT SUM(CAST(REPLACE(views, 'M', '') AS NUMERIC) * 1000000) FROM videos WHERE views LIKE '%M%'");
    res.json({
      totalVideos: totalVideos.rows[0].count || '0',
      totalViews: totalViews.rows[0].sum || '0',
      totalRevenue: '55,123.89',
      newSubscribers: '+2500',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Videos
router.get('/videos', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT v.*, COALESCE(json_agg(c.*) FILTER (WHERE c.id IS NOT NULL), '[]') as categories
            FROM videos v
            LEFT JOIN video_categories vc ON v.id = vc.video_id
            LEFT JOIN categories c ON vc.category_id = c.id
            GROUP BY v.id
            ORDER BY v.display_order
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/videos', async (req, res) => {
  const { title, description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views, uploaded, categoryIds = [], type } = req.body;
  
  if(!title || !video_url) {
    return res.status(400).json({ message: 'Title and Video URL are required' });
  }

  const client = await pool.connect();
  try {
      await client.query('BEGIN');
      const newVideo = await client.query(
          'INSERT INTO videos (title, description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views, uploaded, uploader_id, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
          [title, description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views, uploaded, req.user.id, type]
      );
      const videoId = newVideo.rows[0].id;
      if (categoryIds.length > 0) {
          const categoryValues = categoryIds.map(catId => `(${videoId}, ${catId})`).join(',');
          await client.query(`INSERT INTO video_categories (video_id, category_id) VALUES ${categoryValues}`);
      }
      await client.query('COMMIT');
      res.status(201).json(newVideo.rows[0]);
  } catch (error) {
      await client.query('ROLLBACK');
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  } finally {
      client.release();
  }
});

router.put('/videos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views, uploaded, categoryIds = [], type } = req.body;

  if(!title || !video_url) {
    return res.status(400).json({ message: 'Title and Video URL are required' });
  }
  
  const client = await pool.connect();
  try {
      await client.query('BEGIN');
      const updatedVideo = await client.query(
          'UPDATE videos SET title = $1, description = $2, video_url = $3, thumbnail_url = $4, tags = $5, meta_data = $6, subtitle = $7, duration = $8, views = $9, uploaded = $10, type = $12 WHERE id = $11 RETURNING *',
          [title, description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views, uploaded, id, type]
      );
      await client.query('DELETE FROM video_categories WHERE video_id = $1', [id]);
      if (categoryIds.length > 0) {
          const categoryValues = categoryIds.map(catId => `(${id}, ${catId})`).join(',');
          await client.query(`INSERT INTO video_categories (video_id, category_id) VALUES ${categoryValues}`);
      }
      await client.query('COMMIT');
      res.json(updatedVideo.rows[0]);
  } catch (error) {
      await client.query('ROLLBACK');
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  } finally {
      client.release();
  }
});

router.delete('/videos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM videos WHERE id = $1', [id]);
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


// Shorts
router.get('/shorts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM shorts');
        res.json(result.rows);
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
      [title, video_url, thumbnail_url, views || '0']
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
    await pool.query('DELETE FROM shorts WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Images
router.get('/images', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM images');
        res.json(result.rows);
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
    await pool.query('DELETE FROM images WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Playlists
router.get('/playlists', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, 
                   (SELECT COUNT(*) FROM playlist_videos pv WHERE pv.playlist_id = p.id) as video_count,
                   COALESCE(json_agg(v.*) FILTER (WHERE v.id IS NOT NULL), '[]') as videos
            FROM playlists p
            LEFT JOIN playlist_videos pv ON p.id = pv.playlist_id
            LEFT JOIN videos v ON pv.video_id = v.id
            GROUP BY p.id
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/playlists', async (req, res) => {
  const { name, videoIds = [] } = req.body;
  const client = await pool.connect();
  try {
      await client.query('BEGIN');
      const newPlaylist = await client.query(
          'INSERT INTO playlists (name, user_id) VALUES ($1, $2) RETURNING *',
          [name, req.user.id]
      );
      const playlistId = newPlaylist.rows[0].id;
      if (videoIds.length > 0) {
          const videoValues = videoIds.map(vId => `(${playlistId}, ${vId})`).join(',');
          await client.query(`INSERT INTO playlist_videos (playlist_id, video_id) VALUES ${videoValues}`);
      }
      await client.query('COMMIT');
      res.status(201).json(newPlaylist.rows[0]);
  } catch (error) {
      await client.query('ROLLBACK');
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  } finally {
      client.release();
  }
});

router.put('/playlists/:id', async (req, res) => {
    const { id } = req.params;
    const { name, videoIds = [] } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('UPDATE playlists SET name = $1 WHERE id = $2', [name, id]);
        await client.query('DELETE FROM playlist_videos WHERE playlist_id = $1', [id]);
        if (videoIds.length > 0) {
            const videoValues = videoIds.map(vId => `(${id}, ${vId})`).join(',');
            await client.query(`INSERT INTO playlist_videos (playlist_id, video_id) VALUES ${videoValues}`);
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

router.delete('/playlists/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await client.query('BEGIN');
    await pool.query('DELETE FROM playlist_videos WHERE playlist_id = $1', [id]);
    await pool.query('DELETE FROM playlists WHERE id = $1', [id]);
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

// Site Settings
router.get('/settings', async (req, res) => {
  try {
    const result = await pool.query("SELECT value FROM site_settings WHERE key = 'siteSettings'");
    if (result.rows.length > 0) {
      res.json(result.rows[0].value);
    } else {
      res.json({}); // Return empty object if no settings found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/settings', async (req, res) => {
  const { key, value } = req.body;
  try {
    const valueToStore = JSON.stringify(value);
    await pool.query(
      'INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
      [key, valueToStore]
    );
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Categories
router.get('/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/categories', async (req, res) => {
    const { name } = req.body;
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Category name cannot be empty.'});
    }
    try {
        const newCategory = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(newCategory.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.put('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Category name cannot be empty.'});
    }
    try {
        const updated = await pool.query('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
        res.json(updated.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.delete('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM video_categories WHERE category_id = $1', [id]);
        await client.query('DELETE FROM categories WHERE id = $1', [id]);
        await client.query('COMMIT');
        res.status(204).send();
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
});

// Creators
router.get('/creators', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM creators ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/creators', async (req, res) => {
    const { name, image_url, description } = req.body;
     if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Creator name cannot be empty.'});
    }
    try {
        const newCreator = await pool.query('INSERT INTO creators (name, image_url, description) VALUES ($1, $2, $3) RETURNING *', [name, image_url, description]);
        res.status(201).json(newCreator.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.put('/creators/:id', async (req, res) => {
    const { id } = req.params;
    const { name, image_url, description } = req.body;
     if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Creator name cannot be empty.'});
    }
    try {
        const updated = await pool.query('UPDATE creators SET name = $1, image_url = $2, description = $3 WHERE id = $4 RETURNING *', [name, image_url, description, id]);
        res.json(updated.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.delete('/creators/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM creators WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
