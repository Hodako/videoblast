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

// Public routes
import videoRoutes from './routes/videos';
import shortsRoutes from './routes/shorts';
import categoryRoutes from './routes/categories';
import creatorRoutes from './routes/creators';
import authRoutes from './routes/auth';

app.use('/api/videos', videoRoutes);
app.use('/api/shorts', shortsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/auth', authRoutes);

// Admin routes
import adminRoutes from './routes/admin';
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
  res.send('Backend is running');
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  console.log('Connected to database');
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
