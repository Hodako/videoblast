import { Router } from 'express';
import { prisma } from '../lib/db';

const router = Router();

// Public route to get all categories
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

// Public route to get a single category by its slug
router.get('/by-slug/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    // This assumes slugs are unique, which should be enforced by the creation logic
    const category = await prisma.category.findFirst({
      where: {
        name: {
          // A simple slug-like transformation. For production, you'd save the slug in the DB.
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
