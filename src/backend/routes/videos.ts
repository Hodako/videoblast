import { Router } from 'express';
import { prisma } from '../lib/db';
import jwt from 'jsonwebtoken';

const router = Router();

// Middleware to check for optional authentication
const checkAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    req.user = null;
    return next(); // No token, continue as guest
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: number, role: string };
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    req.user = null;
    return next(); // Invalid token, continue as guest
  }
};


router.get('/', async (req, res) => {
  const { type, category, tag, sortBy } = req.query;
  const where: any = {};
  let orderBy: any = { uploaded: 'desc' }; // Default to recent
  
  if (type) {
      const types = Array.isArray(type) ? type : [type];
      if (types.length > 0) {
        where.type = { in: types };
      }
  }
  // When category is a slug
  if (category) {
      where.categories = { some: { category: { name: { equals: (category as string).replace(/-/g, ' '), mode: 'insensitive' } } } };
  }
  if (tag) {
      where.tags = { has: tag as string };
  }

  if (sortBy === 'popular') {
      orderBy = { views: 'desc' };
  } else if (sortBy === 'relevance' && !tag && !category) {
     orderBy = { display_order: 'asc' }; // Your custom relevance
  }

  try {
    const videos = await prisma.video.findMany({
      where,
      include: {
        creator: true,
        categories: { include: { category: true }}
      },
      orderBy,
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
    await prisma.like.create({
      data: {
        user_id: userId,
        video_id: parseInt(videoId),
      }
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if(error.code === 'P2002'){
      return res.status(409).json({ message: 'Video already liked.' });
    }
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
    await prisma.like.delete({
      where: {
        user_id_video_id: {
          user_id: userId,
          video_id: parseInt(videoId),
        }
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    if(error.code === 'P2025'){
       return res.status(404).json({ message: 'Like not found.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:videoId/likes', checkAuth, async (req, res) => {
    const { videoId } = req.params;
    try {
        const likesCount = await prisma.like.count({
            where: { video_id: parseInt(videoId) },
        });

        let userLike = null;
        if(req.user) {
          userLike = await prisma.like.findUnique({
            where: {
              user_id_video_id: {
                user_id: req.user.id,
                video_id: parseInt(videoId),
              }
            }
          })
        }
        
        res.json({ count: likesCount, isLiked: !!userLike });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



export default router;
