/**
 * Execute Script
 *
 * Execute whichever script passed into this file. You can use this using the npm package.json file. When running the command pass
 * in the script you want to run as a relative path to this file. For example:
 *
 * @example
 * npm run script -- ./refresh.ts
 *
 * @example
 * npm run script -- ./truncate.ts
 *
 * @example
 * npm run script -- ../src/index.ts
 *
 * @example
 * npm run script -- ./migrations/20221113_transaction_flags.ts
 */

import { connectToMongoDB } from '../src/config/db';
import mongoose from 'mongoose';

/**
 * Execution function setups necessary services for all scripts. These services currently include the database.
 */
async function execute(script: string): Promise<void> {
  await connectToMongoDB();

  try {
    console.log(`Executing ${script}`);
    const start = Date.now();
    const exec = await import(`${script}`);

    await exec.default();
    const elapsedMilli = Date.now() - start;
    console.log(`Finished Executing -- ${elapsedMilli / 1000}s`);
  } finally {
    await mongoose.connection.close();
  }
}

// Grab the first agurment to the script
if (process.argv.length != 3) {
  throw new Error(
    'Please pass in the script you desire to run. You may only pass in one script!'
  );
}

execute(process.argv[2]);
