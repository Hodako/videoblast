import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

function createSlug(title: string) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

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


// Videos
router.get('/videos', async (req, res) => {
    try {
        const videos = await prisma.video.findMany({
            include: {
                categories: {
                    select: {
                        category: true
                    }
                },
                creator: true,
            },
            orderBy: {
                display_order: 'asc'
            }
        });
         const videosWithCategoryIds = videos.map(video => ({
            ...video,
            categoryIds: video.categories.map(vc => vc.category.id)
        }));
        res.json(videosWithCategoryIds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching videos' });
    }
});

router.post('/videos', async (req, res) => {
  const { title, description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views, uploaded, categoryIds = [], type, creator_id } = req.body;
  
  if(!title || !video_url) {
    return res.status(400).json({ message: 'Title and Video URL are required' });
  }
  
  try {
    const newVideo = await prisma.video.create({
        data: {
            title, 
            slug: createSlug(title),
            description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views: parseInt(views, 10) || 0, uploaded, uploader_id: req.user.id, type,
            creator_id: creator_id ? parseInt(creator_id, 10) : undefined,
            categories: {
                create: categoryIds.map(id => ({
                    category: {
                        connect: { id: parseInt(id, 10) }
                    }
                }))
            }
        }
    });
    res.status(201).json(newVideo);
  } catch (error) {
      console.error('Failed to create video:', error);
      if (error.code === 'P2002') { // Unique constraint violation
        return res.status(409).json({ message: 'A video with this title already exists. Please choose a unique title.'});
      }
      res.status(500).json({ message: 'Server error creating video' });
  }
});

router.put('/videos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views, uploaded, categoryIds = [], type, creator_id } = req.body;

  if(!title || !video_url) {
    return res.status(400).json({ message: 'Title and Video URL are required' });
  }
  
  try {
    const videoId = parseInt(id, 10);
    await prisma.$transaction(async (tx) => {
      await tx.videoCategory.deleteMany({
        where: { video_id: videoId }
      });

      const updatedVideo = await tx.video.update({
        where: { id: videoId },
        data: {
            title, 
            slug: createSlug(title),
            description, video_url, thumbnail_url, tags, meta_data, subtitle, duration, views: parseInt(views, 10) || 0, uploaded, type,
            creator_id: creator_id ? parseInt(creator_id, 10) : null,
            categories: {
                create: categoryIds.map(catId => ({
                    category: {
                        connect: { id: parseInt(catId, 10) }
                    }
                }))
            }
        }
      });
      res.json(updatedVideo);
    });
  } catch (error) {
      console.error('Failed to update video:', error);
      if (error.code === 'P2002') { // Unique constraint violation
        return res.status(409).json({ message: 'A video with this title already exists. Please choose a unique title.'});
      }
      res.status(500).json({ message: 'Server error updating video' });
  }
});

router.delete('/videos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.video.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting video' });
  }
});

router.put('/videos/reorder', async (req, res) => {
  const videos = req.body; // Expects an array of { id: number, order: number }
  try {
    await prisma.$transaction(
      videos.map(video => 
        prisma.video.update({
          where: { id: video.id },
          data: { display_order: video.order }
        })
      )
    );
    res.status(200).json({ message: "Video order updated successfully."});
  } catch (error) {
    console.error('Failed to reorder videos:', error);
    res.status(500).json({ message: 'Server error reordering videos' });
  }
});


// Shorts
router.get('/shorts', async (req, res) => {
    try {
        const result = await prisma.short.findMany({
          include: { creator: true }
        });
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching shorts' });
    }
});
router.post('/shorts', async (req, res) => {
  const { title, video_url, thumbnail_url, views, creator_id } = req.body;
  try {
    const newShort = await prisma.short.create({
      data: { 
          title,
          slug: createSlug(title),
          video_url, 
          thumbnail_url, 
          views: views || '0', 
          creator_id: creator_id ? parseInt(creator_id, 10) : null
      }
    });
    res.status(201).json(newShort);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
        return res.status(409).json({ message: 'A short with this title already exists.'});
    }
    res.status(500).json({ message: 'Server error creating short' });
  }
});

router.put('/shorts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, video_url, thumbnail_url, creator_id } = req.body;
  try {
    const updatedShort = await prisma.short.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        slug: createSlug(title),
        video_url,
        thumbnail_url,
        creator_id: creator_id ? parseInt(creator_id, 10) : null
      }
    });
    res.status(200).json(updatedShort);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
        return res.status(409).json({ message: 'A short with this title already exists.'});
    }
    res.status(500).json({ message: 'Server error updating short' });
  }
});

router.delete('/shorts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.short.delete({ where: { id: parseInt(id) }});
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting short' });
  }
});

// Images
router.get('/images', async (req, res) => {
    try {
        const result = await prisma.image.findMany();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching images' });
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
    res.status(500).json({ message: 'Server error creating image' });
  }
});

router.delete('/images/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.image.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting image' });
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
                user: true
            }
        });
        res.json(playlists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching playlists' });
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
      res.status(500).json({ message: 'Server error creating playlist' });
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
        res.status(500).json({ message: 'Server error updating playlist' });
    }
});

router.delete('/playlists/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.playlistVideo.deleteMany({ where: { playlist_id: parseInt(id) } });
    await prisma.playlist.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting playlist' });
  }
});

// Site Settings (Admin only)
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
    res.status(500).json({ message: 'Server error fetching settings' });
  }
});


router.put('/settings', async (req, res) => {
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
    res.status(200).json(updated.value);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: `Server error updating settings: ${error.message}` });
  }
});


// Categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({ orderBy: { name: 'asc' }});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching categories' });
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
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'A category with this name already exists.'});
        }
        res.status(500).json({ message: 'Server error creating category' });
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
         if (error.code === 'P2002') {
            return res.status(409).json({ message: 'A category with this name already exists.'});
        }
        res.status(500).json({ message: 'Server error updating category' });
    }
});
router.delete('/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.category.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting category' });
    }
});

// Creators
router.get('/creators', async (req, res) => {
    try {
        const creators = await prisma.creator.findMany({ orderBy: { name: 'asc' }});
        res.json(creators);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching creators' });
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
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'A creator with this name already exists.'});
        }
        res.status(500).json({ message: 'Server error creating creator' });
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
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'A creator with this name already exists.'});
        }
        res.status(500).json({ message: 'Server error updating creator' });
    }
});
router.delete('/creators/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.creator.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting creator' });
    }
});

export default router;
