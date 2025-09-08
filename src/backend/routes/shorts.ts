import { Router } from 'express';
import { prisma } from '../lib/db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const shorts = await prisma.short.findMany();
    res.json(shorts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
