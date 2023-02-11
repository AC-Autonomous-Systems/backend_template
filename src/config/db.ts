import mongoose from 'mongoose';
import dotenv from 'dotenv';

/**
 * Original Author: An Chang
 * Created Date: 6/14/2022
 * Purpose: Helper function for connecting to MongoDB database using connection string.
 */

dotenv.config();

export async function connectToMongoDB(mongoURL?: string) {
  try {
    // The ! behind process.env.MONGOURL is the non-null assertion operator for typescript.
    // It tells typescript that it can trust the return value will not be null.
    let resulting_url = mongoURL ? mongoURL : process.env.MONGOURL!;

    await mongoose.connect(resulting_url);

    console.log(`Connected to Database.`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
