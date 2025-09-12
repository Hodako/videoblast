
// backend/src/routes/settings.ts
import { Router } from 'express';
import { prisma } from '../lib/db';

const router = Router();

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const result = await prisma.siteSetting.findUnique({where: { key: 'siteSettings' }});
    if (result) {
      res.json(result.value);
    } else {
      res.json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching settings' });
  }
});

export default router;
