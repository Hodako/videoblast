
// backend/src/routes/admin/settings.ts
import { Router } from 'express';
import { prisma } from '../../lib/db';
import { adminAuth } from '../../lib/auth';

const router = Router();
router.use(adminAuth);

// GET /api/admin/settings
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

// PUT /api/admin/settings
router.put('/', async (req, res) => {
  const { key, value } = req.body;
  if (key !== 'siteSettings') {
    return res.status(400).json({ message: 'Invalid settings key' });
  }
  try {
    const updated = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    res.json(updated.value);
  } catch (error: any) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: `Server error updating settings: ${error.message}` });
  }
});

export default router;
