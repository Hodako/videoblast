
// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import videoRoutes from './routes/videos';
import shortRoutes from './routes/shorts';
import categoryRoutes from './routes/categories';
import creatorRoutes from './routes/creators';
import playlistRoutes from './routes/playlists';
import settingsRoutes from './routes/settings';
import imageRoutes from './routes/images';

import adminVideoRoutes from './routes/admin/videos';
import adminShortsRoutes from './routes/admin/shorts';
import adminImagesRoutes from './routes/admin/images';
import adminPlaylistsRoutes from './routes/admin/playlists';
import adminCategoriesRoutes from './routes/admin/categories';
import adminCreatorsRoutes from './routes/admin/creators';
import adminSettingsRoutes from './routes/admin/settings';
import adminStatsRoutes from './routes/admin/stats';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Public API Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/shorts', shortRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/images', imageRoutes);

// Admin API Routes
app.use('/api/admin/videos', adminVideoRoutes);
app.use('/api/admin/shorts', adminShortsRoutes);
app.use('/api/admin/images', adminImagesRoutes);
app.use('/api/admin/playlists', adminPlaylistsRoutes);
app.use('/api/admin/categories', adminCategoriesRoutes);
app.use('/api/admin/creators', adminCreatorsRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use('/api/admin/stats', adminStatsRoutes);


app.get('/', (req, res) => {
  res.send('VideoBlast Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
