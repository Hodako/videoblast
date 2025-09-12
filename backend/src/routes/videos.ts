
// backend/src/routes/videos.ts
import { Router } from 'express';
import { prisma } from '../lib/db';
import { checkAuth, getUserIdFromRequest } from '../lib/auth';
import jwt from 'jsonwebtoken';

const router = Router();

// GET /api/videos - Get all videos with filtering
router.get('/', async (req, res) => {
    const { type, category, tag, sortBy } = req.query;

    const where: any = {};
    let orderBy: any = { uploaded: 'desc' };

    if (type) {
        const types = Array.isArray(type) ? type : [type];
        where.type = { in: types as string[] };
    }
    if (category) {
        where.categories = { some: { category: { name: { equals: (category as string).replace(/-/g, ' '), mode: 'insensitive' } } } };
    }
    if (tag) {
        where.tags = { has: tag as string };
    }

    if (sortBy === 'popular') {
        orderBy = { views: 'desc' };
    } else if (sortBy === 'relevance' && !tag && !category) {
        orderBy = { display_order: 'asc' };
    }

    try {
        const videos = await prisma.video.findMany({
            where,
            include: {
                creator: true,
                categories: { include: { category: true } }
            },
            orderBy,
        });
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching videos' });
    }
});

// GET /api/videos/search - Search for videos
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json({ videos: [], shorts: []});
  }
  try {
    const videos = await prisma.video.findMany({
      where: {
        OR: [
          { title: { contains: q as string, mode: 'insensitive' } },
          { description: { contains: q as string, mode: 'insensitive' } },
          { tags: { has: q as string } }
        ],
      },
       include: {
        creator: true
      }
    });

    const shorts = await prisma.short.findMany({
      where: {
         OR: [
          { title: { contains: q as string, mode: 'insensitive' } },
        ],
      },
      include: {
        creator: true
      }
    })
    res.json({ videos, shorts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/videos/by-slug/:slug - Get a single video by slug
router.get('/by-slug/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const video = await prisma.video.findUnique({
            where: { slug },
            include: {
                creator: true,
                categories: { include: { category: true } }
            }
        });
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        // Increment views - should not await to avoid blocking response
        prisma.video.update({
            where: { id: video.id },
            data: { views: { increment: 1 } },
        }).catch(console.error);

        res.json(video);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// A new endpoint to securely provide the video source URL
router.get('/stream-source/:videoId', async (req, res) => {
    const { videoId } = req.params;
    try {
        const video = await prisma.video.findUnique({
            where: { id: parseInt(videoId) }
        });
        if (!video || !video.video_url) {
            return res.status(404).json({ message: "Video not found" });
        }
        // In a real-world scenario, you would generate a temporary, signed URL here
        // For simplicity, we are returning the direct URL.
        res.json({ sourceUrl: video.video_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/videos/:videoId/comments
router.get('/:videoId/comments', async (req, res) => {
    const { videoId } = req.params;
    try {
        const comments = await prisma.comment.findMany({
            where: { video_id: parseInt(videoId) },
            include: {
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                    }
                }
            },
            orderBy: { created_at: 'desc' },
        });
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/videos/:videoId/comments
router.post('/:videoId/comments', checkAuth, async (req, res) => {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    const { videoId } = req.params;
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ message: 'Comment text is required' });
    }
    try {
        const newComment = await prisma.comment.create({
            data: {
                text,
                user_id: userId,
                video_id: parseInt(videoId),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                    }
                }
            }
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/videos/:videoId/like
router.get('/:videoId/like', async (req, res) => {
    const { videoId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    let userId = null;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
            userId = decoded.id;
        } catch (e) {
            // Invalid token, treat as guest
        }
    }

    try {
        const likesCount = await prisma.like.count({
            where: { video_id: parseInt(videoId) },
        });

        let userLike = null;
        if (userId) {
            userLike = await prisma.like.findUnique({
                where: {
                    user_id_video_id: {
                        user_id: userId,
                        video_id: parseInt(videoId),
                    }
                }
            });
        }
        res.json({ count: likesCount, isLiked: !!userLike });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/videos/:videoId/like
router.post('/:videoId/like', checkAuth, async (req, res) => {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    const { videoId } = req.params;
    try {
        await prisma.like.create({
            data: {
                user_id: userId,
                video_id: parseInt(videoId),
            }
        });
        res.status(204).send();
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Video already liked.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/videos/:videoId/like
router.delete('/:videoId/like', checkAuth, async (req, res) => {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    const { videoId } = req.params;
    try {
        await prisma.like.delete({
            where: {
                user_id_video_id: {
                    user_id: userId,
                    video_id: parseInt(videoId),
                }
            },
        });
        res.status(204).send();
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Like not found.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
