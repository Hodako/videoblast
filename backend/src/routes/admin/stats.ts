
// backend/src/routes/admin/stats.ts
import { Router } from 'express';
import { prisma } from '../../lib/db';
import { adminAuth } from '../../lib/auth';

const router = Router();
router.use(adminAuth);

// GET /api/admin/stats
router.get('/', async (req, res) => {
  try {
    const videoCount = await prisma.video.count();
    const shortCount = await prisma.short.count();
    const creatorCount = await prisma.creator.count();
    const totalViewsResult = await prisma.video.aggregate({ _sum: { views: true } });
    const totalViews = totalViewsResult._sum.views || 0;
    
    res.json({
      totalVideos: videoCount.toString(),
      totalShorts: shortCount.toString(),
      totalCreators: creatorCount.toString(),
      totalViews: totalViews.toLocaleString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

export default router;
