import dotenv from "dotenv";
import { startApolloServer } from "./config/apollo";
import { connectToMongoDB } from "./config/db";
import { sendMail } from "./config/email";
/**
 * Original Author: An Chang
 * Created Date: 6/14/2022
 * Purpose: Root file for starting Apollo server and connecting to MongoDB.
 */
dotenv.config();

// Start Express and Apollo Servers
startApolloServer(process.env.PORT!);

// Connect to Mongodb.
connectToMongoDB(process.env.MONGOURL!);
