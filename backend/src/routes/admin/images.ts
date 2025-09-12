
// backend/src/routes/admin/images.ts
import { Router } from 'express';
import { prisma } from '../../lib/db';
import { adminAuth } from '../../lib/auth';

const router = Router();
router.use(adminAuth);

// GET /api/admin/images
router.get('/', async (req, res) => {
  try {
    const result = await prisma.image.findMany();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching images' });
  }
});

// POST /api/admin/images
router.post('/', async (req, res) => {
  const { title, image_url } = req.body;
  try {
    const newImage = await prisma.image.create({
      data: { title, image_url }
    });
    res.status(201).json(newImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating image' });
  }
});

// DELETE /api/admin/images/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const imageId = parseInt(id, 10);
    if(isNaN(imageId)) return res.status(400).json({ message: 'Invalid image ID.' });
    await prisma.image.delete({ where: { id: imageId } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting image' });
  }
});

export default router;
