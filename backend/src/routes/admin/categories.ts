
// backend/src/routes/admin/categories.ts
import { Router } from 'express';
import { prisma } from '../../lib/db';
import { adminAuth } from '../../lib/auth';

const router = Router();
router.use(adminAuth);

// GET /api/admin/categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' }});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

// POST /api/admin/categories
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Category name cannot be empty.'});
  }
  try {
      const newCategory = await prisma.category.create({ data: { name } });
      res.status(201).json(newCategory);
  } catch (error: any) {
      if (error.code === 'P2002') {
          return res.status(409).json({ message: 'A category with this name already exists.'});
      }
      res.status(500).json({ message: 'Server error creating category' });
  }
});

// PUT /api/admin/categories/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Category name cannot be empty.'});
    }
    try {
        const categoryId = parseInt(id, 10);
        if(isNaN(categoryId)) return res.status(400).json({ message: 'Invalid category ID.' });
        const updated = await prisma.category.update({ where: { id: categoryId }, data: { name }});
        res.json(updated);
    } catch (error: any) {
         if (error.code === 'P2002') {
            return res.status(409).json({ message: 'A category with this name already exists.'});
        }
        res.status(500).json({ message: 'Server error updating category' });
    }
});

// DELETE /api/admin/categories/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const categoryId = parseInt(id, 10);
        if(isNaN(categoryId)) return res.status(400).json({ message: 'Invalid category ID.' });
        await prisma.category.delete({ where: { id: categoryId } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting category' });
    }
});

export default router;
