import { Router } from 'express';
import { prisma } from '../lib/db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const shorts = await prisma.short.findMany({
      include: { creator: true }
    });
    res.json(shorts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/by-slug/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const short = await prisma.short.findUnique({
            where: { slug },
            include: {
                creator: true,
            }
        });

        if (!short) {
            return res.status(404).json({ message: 'Short not found' });
        }
        res.json(short);

    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
