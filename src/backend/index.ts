
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


import authRoutes from './routes/auth';
import videoRoutes from './routes/videos';
import shortsRoutes from './routes/shorts';
import adminRoutes from './routes/admin';

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/shorts', shortsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
