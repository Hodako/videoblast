import { Router } from 'express';
import { prisma } from '../lib/db';

const router = Router();

router.get('/', async (req, res) => {
  const { type } = req.query;
  try {
    const videos = await prisma.video.findMany({
      where: type ? { type: type as string } : {},
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

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const video = await prisma.video.findFirst({
        where: {
            title: {
                equals: slug.replace(/-/g, ' '),
                mode: 'insensitive'
            }
        },
        include: {
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
            first_name: true,
            last_name: true
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

router.post('/:videoId/comments', async (req, res) => {
  const { videoId } = req.params;
  // This should be an authenticated route in a real app
  const { userId, text } = req.body; 

  if (!text || !userId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        text,
        user_id: userId,
        video_id: parseInt(videoId),
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
