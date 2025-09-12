
// backend/src/routes/admin/videos.ts
import { Router } from 'express';
import { prisma } from '../../lib/db';
import { adminAuth, getUserIdFromRequest } from '../../lib/auth';

const router = Router();
router.use(adminAuth);

function createSlug(title: string) {
  if (!title) return '';
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

// GET /api/admin/videos
router.get('/', async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      include: {
        categories: { select: { category: true } },
        creator: true,
      },
      orderBy: { display_order: 'asc' }
    });
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/videos
router.post('/', async (req, res) => {
  const uploaderId = getUserIdFromRequest(req);
  if (!uploaderId) {
    return res.status(401).json({ message: 'Could not determine uploader.'});
  }

  const { title, description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views, uploaded, categoryIds = [], type, creator_id } = req.body;
  
  if(!title || !video_url) {
    return res.status(400).json({ message: 'Title and Video URL are required' });
  }
  
  try {
    const newVideo = await prisma.video.create({
        data: {
            title, 
            slug: createSlug(title),
            description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views: parseInt(views, 10) || 0, uploaded, uploader_id: uploaderId, type,
            creator_id: creator_id ? parseInt(creator_id, 10) : undefined,
            categories: {
                create: categoryIds.map((id: number) => ({
                    category: { connect: { id: id } }
                }))
            }
        }
    });
    res.status(201).json(newVideo);
  } catch (error: any) {
      console.error('Failed to create video:', error);
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'A video with this title already exists. Please choose a unique title.'});
      }
      res.status(500).json({ message: 'Server error creating video' });
  }
});

// PUT /api/admin/videos/reorder
router.put('/reorder', async (req, res) => {
  const videos: { id: number, order: number }[] = req.body;
  if(!Array.isArray(videos)) return res.status(400).json({ message: 'Request body must be an array.' });
  try {
    await prisma.$transaction(
      videos.map(video => {
        if(typeof video.id !== 'number' || typeof video.order !== 'number') {
            throw new Error('Invalid video data in array.');
        }
        return prisma.video.update({
          where: { id: video.id },
          data: { display_order: video.order }
        })
      })
    );
    res.json({ message: "Video order updated successfully."});
  } catch (error) {
    console.error('Failed to reorder videos:', error);
    res.status(500).json({ message: 'Server error reordering videos' });
  }
});

// PUT /api/admin/videos/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views, uploaded, categoryIds = [], type, creator_id } = req.body;

  if(!title || !video_url) {
    return res.status(400).json({ message: 'Title and Video URL are required' });
  }
  
  try {
    const videoId = parseInt(id, 10);
    if(isNaN(videoId)) return res.status(400).json({ message: 'Invalid video ID.' });

    await prisma.$transaction(async (tx) => {
      await tx.videoCategory.deleteMany({ where: { video_id: videoId } });
      const updatedVideo = await tx.video.update({
        where: { id: videoId },
        data: {
            title, 
            slug: createSlug(title),
            description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views: parseInt(views, 10) || 0, uploaded, type,
            creator_id: creator_id ? parseInt(creator_id, 10) : null,
            categories: {
                create: categoryIds.map((catId: number) => ({
                    category: { connect: { id: catId } }
                }))
            }
        }
      });
      res.json(updatedVideo);
    });
  } catch (error: any) {
      console.error('Failed to update video:', error);
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'A video with this title already exists. Please choose a unique title.'});
      }
      res.status(500).json({ message: 'Server error updating video' });
  }
});

// DELETE /api/admin/videos/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const videoId = parseInt(id, 10);
    if(isNaN(videoId)) return res.status(400).json({ message: 'Invalid video ID.' });
    await prisma.video.delete({ where: { id: videoId } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting video' });
  }
});

export default router;
