import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dbOwner = process.env.DB_OWNER;
const dbPassword = process.env.DB_PASSWORD;
const MONGO_URI = process.env.MONGO_URI;

const dbConnection = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${dbOwner}:${dbPassword}@cluster0.e3dmxsw.mongodb.net/manager`);
        // await mongoose.connect(MONGO_URI);
        console.log("CONNECTED TO DATABASE SUCCESSFULLY");
    } catch (error) {
        console.error('COULD NOT CONNECT TO DATABASE:', error.message);
    }
};

export default dbConnection;
