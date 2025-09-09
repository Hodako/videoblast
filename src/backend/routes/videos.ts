import { Router } from 'express';
import { prisma } from '../lib/db';
import jwt from 'jsonwebtoken';

const router = Router();

// Middleware to check for optional authentication
const checkAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(); // No token, continue as guest
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: number, role: string };
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return next(); // Invalid token, continue as guest
  }
};


router.get('/', async (req, res) => {
  const { type } = req.query;
  try {
    const videos = await prisma.video.findMany({
      where: type ? { type: type as string } : {},
      include: {
        creator: true
      },
      orderBy: {
        display_order: 'asc',
      },
    });
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/by-slug/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const video = await prisma.video.findUnique({
        where: { slug },
        include: {
            creator: true,
            categories: {
                include: {
                    category: true
                }
            }
        }
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    // Increment views
    await prisma.video.update({
      where: { id: video.id },
      data: { views: { increment: 1 } },
    });

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const videos = await prisma.video.findMany({
      where: {
        OR: [
          { title: { contains: q as string, mode: 'insensitive' } },
          { description: { contains: q as string, mode: 'insensitive' } },
        ],
      },
       include: {
        creator: true
      }
    });
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

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

router.post('/:videoId/comments', checkAuth, async (req, res) => {
  if (!req.user) {
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
        user_id: req.user.id,
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

router.post('/:videoId/like', checkAuth, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const { videoId } = req.params;
  const userId = req.user.id;

  try {
    // Use upsert to either create a like or do nothing if it exists
    await prisma.like.upsert({
      where: {
        user_id_video_id: {
          user_id: userId,
          video_id: parseInt(videoId),
        },
      },
      create: {
        user_id: userId,
        video_id: parseInt(videoId),
      },
      update: {}, // Do nothing if it already exists
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:videoId/like', checkAuth, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const { videoId } = req.params;
  const userId = req.user.id;

  try {
    await prisma.like.deleteMany({
      where: {
        user_id: userId,
        video_id: parseInt(videoId),
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:videoId/likes', async (req, res) => {
    const { videoId } = req.params;
    try {
        const likes = await prisma.like.count({
            where: { video_id: parseInt(videoId) },
        });
        res.json({ count: likes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



export default router;
