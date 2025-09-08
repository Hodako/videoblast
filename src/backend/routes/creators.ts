import { Router } from 'express';
import { prisma } from '../lib/db';

const router = Router();

// Public route
router.get('/', async (req, res) => {
  try {
    const creators = await prisma.creator.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(creators);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
