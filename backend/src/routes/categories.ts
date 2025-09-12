
// backend/src/routes/categories.ts
import { Router } from 'express';
import { prisma } from '../lib/db';

const router = Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/categories/by-slug/:slug
router.get('/by-slug/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const category = await prisma.category.findFirst({
            where: {
                name: {
                    equals: slug.replace(/-/g, ' '),
                    mode: 'insensitive'
                }
            }
        });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
