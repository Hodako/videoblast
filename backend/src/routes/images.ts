
// backend/src/routes/images.ts
import { Router } from 'express';
import { prisma } from '../lib/db';

const router = Router();

// GET /api/images
router.get('/', async (req, res) => {
    try {
        const images = await prisma.image.findMany();
        res.json(images);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching images' });
    }
});

export default router;
