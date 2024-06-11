import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dbOwner = process.env.DB_OWNER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const maxRetries = 5;
const retryDelay = 3000;

const dbConnection = async () => {
    let retries = maxRetries;

    while (retries > 0) {
        try {
            await mongoose.connect(`mongodb+srv://${dbOwner}:${dbPassword}@${dbName}.e3dmxsw.mongodb.net/manager`);
            console.log("CONNECTED TO DATABASE SUCCESSFULLY");
            break;
        } catch (error) {
            retries -= 1;
            console.error(`COULD NOT CONNECT TO DATABASE. Retrying in ${retryDelay / 1000} seconds...`, error.message);
            if (retries > 0) {
                await new Promise(res => setTimeout(res, retryDelay));
            } else {
                console.error('COULD NOT CONNECT TO DATABASE. Maximum retries reached:', error.message);
            }
        }
    }
};

export default dbConnection;
