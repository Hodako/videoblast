import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const adminAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: number, role: string };
    
    if (decoded && decoded.role === 'admin') {
      req.user = { id: decoded.id };
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

router.use(adminAuth);

// Dashboard
router.get('/stats', async (req, res) => {
  try {
    const videoCount = await prisma.video.count();
    const totalViewsResult = await prisma.video.aggregate({
        _sum: {
            views: true,
        },
    });
    
    const totalViews = totalViewsResult._sum.views || 0;
    
    res.json({
      totalVideos: videoCount.toString(),
      totalViews: totalViews.toLocaleString(),
      totalRevenue: '55,123.89', // Example data
      newSubscribers: '+2500', // Example data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Videos
router.get('/videos', async (req, res) => {
    try {
        const videos = await prisma.video.findMany({
            include: {
                categories: {
                    include: {
                        category: true
                    }
                }
            },
            orderBy: {
                display_order: 'asc'
            }
        });
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/videos', async (req, res) => {
  const { title, description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views, uploaded, categoryIds = [], type } = req.body;
  
  if(!title || !video_url) {
    return res.status(400).json({ message: 'Title and Video URL are required' });
  }
  
  try {
    const newVideo = await prisma.video.create({
        data: {
            title, description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views, uploaded, uploader_id: req.user.id, type,
            categories: {
                create: categoryIds.map(id => ({
                    category: {
                        connect: { id }
                    }
                }))
            }
        }
    });
    res.status(201).json(newVideo);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

router.put('/videos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views, uploaded, categoryIds = [], type } = req.body;

  if(!title || !video_url) {
    return res.status(400).json({ message: 'Title and Video URL are required' });
  }
  
  try {
    await prisma.$transaction(async (tx) => {
      await tx.videoCategory.deleteMany({
        where: { video_id: parseInt(id) }
      });

      const updatedVideo = await tx.video.update({
        where: { id: parseInt(id) },
        data: {
            title, description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views, uploaded, type,
            categories: {
                create: categoryIds.map(catId => ({
                    category: {
                        connect: { id: catId }
                    }
                }))
            }
        }
      });
      res.json(updatedVideo);
    });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/videos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.video.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/videos/reorder', async (req, res) => {
  const videos = req.body;
  try {
    await prisma.$transaction(
      videos.map(video => 
        prisma.video.update({
          where: { id: video.id },
          data: { display_order: video.order }
        })
      )
    );
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Shorts
router.get('/shorts', async (req, res) => {
    try {
        const result = await prisma.short.findMany();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/shorts', async (req, res) => {
  const { title, video_url, thumbnail_url, views } = req.body;
  try {
    const newShort = await prisma.short.create({
      data: { title, video_url, thumbnail_url, views: views || '0' }
    });
    res.status(201).json(newShort);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/shorts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.short.delete({ where: { id: parseInt(id) }});
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Images
router.get('/images', async (req, res) => {
    try {
        const result = await prisma.image.findMany();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/images', async (req, res) => {
  const { title, image_url } = req.body;
  try {
    const newImage = await prisma.image.create({
      data: { title, image_url }
    });
    res.status(201).json(newImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/images/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.image.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Playlists
router.get('/playlists', async (req, res) => {
    try {
        const playlists = await prisma.playlist.findMany({
            include: {
                videos: {
                    include: {
                        video: true
                    }
                },
                _count: {
                    select: { videos: true }
                }
            }
        });
        res.json(playlists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/playlists', async (req, res) => {
  const { name, videoIds = [] } = req.body;
  try {
      const newPlaylist = await prisma.playlist.create({
          data: {
              name,
              user_id: req.user.id,
              videos: {
                  create: videoIds.map(vId => ({
                      video: { connect: { id: vId }}
                  }))
              }
          }
      });
      res.status(201).json(newPlaylist);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

router.put('/playlists/:id', async (req, res) => {
    const { id } = req.params;
    const { name, videoIds = [] } = req.body;
    try {
        await prisma.$transaction(async (tx) => {
            await tx.playlistVideo.deleteMany({ where: { playlist_id: parseInt(id) }});
            const updatedPlaylist = await tx.playlist.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    videos: {
                        create: videoIds.map(vId => ({
                            video: { connect: { id: vId }}
                        }))
                    }
                }
            });
            res.status(200).json(updatedPlaylist);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/playlists/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.playlist.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Site Settings
router.get('/settings', async (req, res) => {
  try {
    const result = await prisma.siteSetting.findUnique({where: { key: 'siteSettings' }});
    if (result) {
      res.json(result.value);
    } else {
      res.json({}); // Return empty object if no settings found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/settings', async (req, res) => {
  const { key, value } = req.body;
  try {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({ orderBy: { name: 'asc' }});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/categories', async (req, res) => {
    const { name } = req.body;
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Category name cannot be empty.'});
    }
    try {
        const newCategory = await prisma.category.create({ data: { name } });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.put('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Category name cannot be empty.'});
    }
    try {
        const updated = await prisma.category.update({ where: { id: parseInt(id) }, data: { name }});
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.delete('/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.category.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Creators
router.get('/creators', async (req, res) => {
    try {
        const creators = await prisma.creator.findMany({ orderBy: { name: 'asc' }});
        res.json(creators);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/creators', async (req, res) => {
    const { name, image_url, description } = req.body;
     if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Creator name cannot be empty.'});
    }
    try {
        const newCreator = await prisma.creator.create({ data: { name, image_url, description } });
        res.status(201).json(newCreator);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.put('/creators/:id', async (req, res) => {
    const { id } = req.params;
    const { name, image_url, description } = req.body;
     if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Creator name cannot be empty.'});
    }
    try {
        const updated = await prisma.creator.update({ where: { id: parseInt(id) }, data: { name, image_url, description }});
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.delete('/creators/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.creator.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

    