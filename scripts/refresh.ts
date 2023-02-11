/**
 * Refresh Database
 *
 * This command refreshes the database by first removing all the data in the database then seeding, and truncating the data.
 */

import truncate from "./truncate";
import seed from "./seed";
import prod from "./prod";
import dotenv from "dotenv";
dotenv.config();

export default async function execute(): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    await truncate();
    await seed();
  } else if (process.env.NODE_ENV === "production") {
    await prod();
  }
}
