import mongoose from "mongoose";
import { startApolloServer } from "../config/apollo";
import { connectToMongoDB } from "../config/db";

/**
 * Original Author: An Chang
 * Created Date: 7/6/2022
 * Purpose: Helper function to remove all the collections from the test databse.
 * ! Only use in the test environment!!
 */

/**
 * Start the test environment by starting the Apollo GraphQL server as well as connecting to MongoDB.
 */
export async function startTestEnvironment() {
  await startApolloServer(process.env.PORT_TESTING!);
  await connectToMongoDB(process.env.MONGOURL_TESTING!);
}

/**
 * Remove all the collections from the test database.
 */
export async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);

  for (const collectionName of collections) {
    await mongoose.connection.db.dropCollection(collectionName);
  }
}
