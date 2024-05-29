import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adRoutes from './routes/adRoutes.js';
import dbConnection from './config/db.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ads', adRoutes);

const PORT = process.env.PORT;

app.listen(PORT, async () => {
  await dbConnection();
  console.log(`Server running on port ${PORT}`);
});
