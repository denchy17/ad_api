import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

const dbOwner = process.env.DB_OWNER;
const dbPassword = process.env.DB_PASSWORD;

const dbConnection = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${dbOwner}:${dbPassword}@db1.x2w3yhm.mongodb.net/manager`);
        console.log("CONNECTED TO DATABASE SUCCESSFULLY");
    } catch (error) {
        console.error('COULD NOT CONNECT TO DATABASE:', error.message);
    }
};

const PORT = process.env.PORT;

app.listen(PORT, () => {
  dbConnection();
  console.log(`Server running on port ${PORT}`);
});
