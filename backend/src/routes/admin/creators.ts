
// backend/src/routes/admin/creators.ts
import { Router } from 'express';
import { prisma } from '../../lib/db';
import { adminAuth } from '../../lib/auth';

const router = Router();
router.use(adminAuth);

// GET /api/admin/creators
router.get('/', async (req, res) => {
  try {
    const creators = await prisma.creator.findMany({ orderBy: { name: 'asc' }});
    res.json(creators);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching creators' });
  }
});

// POST /api/admin/creators
router.post('/', async (req, res) => {
    const { name, image_url, description } = req.body;
     if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Creator name cannot be empty.'});
    }
    try {
        const newCreator = await prisma.creator.create({ data: { name, image_url, description } });
        res.status(201).json(newCreator);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'A creator with this name already exists.'});
        }
        res.status(500).json({ message: 'Server error creating creator' });
    }
});

// PUT /api/admin/creators/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, image_url, description } = req.body;
     if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Creator name cannot be empty.'});
    }
    try {
        const creatorId = parseInt(id, 10);
        if(isNaN(creatorId)) return res.status(400).json({ message: 'Invalid creator ID.' });
        const updated = await prisma.creator.update({ where: { id: creatorId }, data: { name, image_url, description }});
        res.json(updated);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'A creator with this name already exists.'});
        }
        res.status(500).json({ message: 'Server error updating creator' });
    }
});

// DELETE /api/admin/creators/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const creatorId = parseInt(id, 10);
        if(isNaN(creatorId)) return res.status(400).json({ message: 'Invalid creator ID.' });
        await prisma.creator.delete({ where: { id: creatorId } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting creator' });
    }
});

export default router;
