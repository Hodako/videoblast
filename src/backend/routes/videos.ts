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
  try {
    const result = await pool.query('SELECT * FROM videos ORDER BY display_order');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM videos WHERE id = $1', [id]);
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
      "SELECT * FROM videos WHERE title ILIKE $1 OR description ILIKE $1",
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
    const result = await pool.query('SELECT c.*, u.first_name, u.last_name FROM comments c JOIN users u ON c.user_id = u.id WHERE video_id = $1 ORDER BY c.created_at DESC', [videoId]);
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
      'INSERT INTO comments (text, user_id, video_id) VALUES ($1, $2, $3) RETURNING *',
      [text, userId, videoId]
    );
    res.status(201).json(newComment.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
