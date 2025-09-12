
// backend/src/routes/admin/shorts.ts
import { Router } from 'express';
import { prisma } from '../../lib/db';
import { adminAuth } from '../../lib/auth';

const router = Router();
router.use(adminAuth);

function createSlug(title: string) {
  if (!title) return '';
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

// GET /api/admin/shorts
router.get('/', async (req, res) => {
  try {
    const result = await prisma.short.findMany({ include: { creator: true } });
    res.json(result);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error fetching shorts' });
  }
});

// POST /api/admin/shorts
router.post('/', async (req, res) => {
  const { title, video_url, thumbnail_url, views, creator_id } = req.body;
  try {
    const newShort = await prisma.short.create({
      data: { 
          title,
          slug: createSlug(title),
          video_url, 
          thumbnail_url, 
          views: views || '0', 
          creator_id: creator_id ? parseInt(creator_id, 10) : null
      }
    });
    res.status(201).json(newShort);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
        return res.status(409).json({ message: 'A short with this title already exists.'});
    }
    res.status(500).json({ message: 'Server error creating short' });
  }
});

// PUT /api/admin/shorts/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, video_url, thumbnail_url, creator_id } = req.body;
  try {
    const shortId = parseInt(id, 10);
    if(isNaN(shortId)) return res.status(400).json({ message: 'Invalid short ID.' });
    const updatedShort = await prisma.short.update({
      where: { id: shortId },
      data: {
        title,
        slug: createSlug(title),
        video_url,
        thumbnail_url,
        creator_id: creator_id ? parseInt(creator_id, 10) : null
      }
    });
    res.json(updatedShort);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
        return res.status(409).json({ message: 'A short with this title already exists.'});
    }
    res.status(500).json({ message: 'Server error updating short' });
  }
});

// DELETE /api/admin/shorts/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const shortId = parseInt(id, 10);
    if(isNaN(shortId)) return res.status(400).json({ message: 'Invalid short ID.' });
    await prisma.short.delete({ where: { id: shortId }});
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting short' });
  }
});

export default router;
