import { Router } from 'express';
import { prisma } from '../lib/db';

const router = Router();

// Public route to get all playlists
router.get('/', async (req, res) => {
  try {
    const playlists = await prisma.playlist.findMany({
      include: {
        user: { // Only select public user info
          select: {
            first_name: true,
          }
        },
        videos: {
          take: 1, // Only take one video to get a thumbnail
          include: {
            video: {
              select: {
                thumbnail_url: true,
              }
            }
          }
        },
        _count: {
            select: { videos: true }
        }
      },
    });
    // Remap to match what frontend might expect
    const publicPlaylists = playlists.map(p => ({
        id: p.id,
        name: p.name,
        user: p.user,
        videos: p.videos, // The limited video info for thumbnail
        videoCount: p._count.videos
    }));

    res.json(publicPlaylists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching playlists' });
  }
});

export default router;
