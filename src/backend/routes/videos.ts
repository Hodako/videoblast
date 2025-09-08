import { Router } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

router.get('/', async (req, res) => {
  const { type } = req.query;
  try {
    let query = 'SELECT * FROM "Video" ORDER BY display_order';
    const params = [];
    if (type) {
        query = 'SELECT * FROM "Video" WHERE type = $1 ORDER BY display_order';
        params.push(type);
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query("SELECT * FROM \"Video\" WHERE REPLACE(LOWER(title), ' ', '-') = $1", [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM \"Video\" WHERE title ILIKE $1 OR description ILIKE $1",
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:videoId/comments', async (req, res) => {
  const { videoId } = req.params;
  try {
    const result = await pool.query('SELECT c.*, u.first_name, u.last_name FROM "Comment" c JOIN "User" u ON c.user_id = u.id WHERE video_id = $1 ORDER BY c.created_at DESC', [videoId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:videoId/comments', async (req, res) => {
  const { videoId } = req.params;
  // This should be an authenticated route in a real app
  // const { userId } = req.user; 
  const { text, userId } = req.body; 

  if (!text || !userId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newComment = await pool.query(
      'INSERT INTO "Comment" (text, user_id, video_id) VALUES ($1, $2, $3) RETURNING *',
      [text, userId, videoId]
    );
    res.status(201).json(newComment.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
