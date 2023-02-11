/**
 * Truncate the Database
 * 
 * Remove all of the data from the database. We bypass mongoose right here simply becuase it is easier. 
 */

import mongoose from "mongoose";
import { Collection } from "mongodb";

export default async function execute(): Promise<void> {
    const collections: Array<Collection> = await mongoose.connection.db.collections();

    for(const collection of collections) {
        await collection.drop();
    }
}
