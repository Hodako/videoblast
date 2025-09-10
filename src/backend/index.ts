
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration to allow requests from the frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:9002',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Public routes
import videoRoutes from './routes/videos';
import shortsRoutes from './routes/shorts';
import categoryRoutes from './routes/categories';
import creatorRoutes from './routes/creators';
import authRoutes from './routes/auth';
import settingsRoutes from './routes/settings'; // New public settings route

app.use('/api/videos', videoRoutes);
app.use('/api/shorts', shortsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes); // New public settings route

// Admin routes
import adminRoutes from './routes/admin';
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
