import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

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

export default dbConnection;