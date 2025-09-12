
// backend/src/routes/admin/playlists.ts
import { Router } from 'express';
import { prisma } from '../../lib/db';
import { adminAuth, getUserIdFromRequest } from '../../lib/auth';

const router = Router();
router.use(adminAuth);

// GET /api/admin/playlists
router.get('/', async (req, res) => {
  try {
    const playlists = await prisma.playlist.findMany({
        include: {
            videos: { include: { video: { include: { creator: true } } } },
            user: true
        }
    });
    res.json(playlists);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error fetching playlists' });
  }
});

// POST /api/admin/playlists
router.post('/', async (req, res) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ message: 'Could not identify user' });
  }

  const { name, videoIds = [] } = req.body;
  try {
      const newPlaylist = await prisma.playlist.create({
          data: {
              name,
              user_id: userId,
              videos: {
                  create: videoIds.map((vId: number) => ({
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

// PUT /api/admin/playlists/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, videoIds = [] } = req.body;
    try {
        const playlistId = parseInt(id, 10);
        if(isNaN(playlistId)) return res.status(400).json({ message: 'Invalid playlist ID.' });

        await prisma.$transaction(async (tx) => {
            await tx.playlistVideo.deleteMany({ where: { playlist_id: playlistId }});
            await tx.playlist.update({
                where: { id: playlistId },
                data: {
                    name,
                    videos: {
                        create: videoIds.map((vId: number) => ({
                            video: { connect: { id: vId }}
                        }))
                    }
                }
            });
        });
        res.json({ message: 'Playlist updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating playlist' });
    }
});

// DELETE /api/admin/playlists/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const playlistId = parseInt(id, 10);
        if(isNaN(playlistId)) return res.status(400).json({ message: 'Invalid playlist ID.' });
        await prisma.playlist.delete({ where: { id: playlistId } });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting playlist' });
    }
});


export default router;
