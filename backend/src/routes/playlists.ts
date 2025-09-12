
// backend/src/routes/playlists.ts
import { Router } from 'express';
import { prisma } from '../lib/db';

const router = Router();

// GET /api/playlists
router.get('/', async (req, res) => {
  try {
    const playlists = await prisma.playlist.findMany({
      include: {
        user: { 
          select: {
            first_name: true,
          }
        },
        videos: {
          take: 1, 
          include: {
            video: {
              select: {
                thumbnail_url: true,
              }
            }
          },
          orderBy: {
            video: {
              display_order: 'asc'
            }
          }
        },
        _count: {
            select: { videos: true }
        }
      },
    });
    
    const publicPlaylists = playlists.map(p => ({
        id: p.id,
        name: p.name,
        user: p.user,
        videos: p.videos,
        videoCount: p._count.videos
    }));

    res.json(publicPlaylists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching playlists' });
  }
});

export default router;
