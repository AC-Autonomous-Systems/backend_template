/**
 * Production Seeder
 *
 * Seed the database with master user.
 *
 * @author An Chang <mchang@bottlerecyclingautomation.com>
 */

import { UserModel } from '../src/collection/user/schema';
import { StoreModel } from '../src/collection/store/schema';
import { FolderModel } from '../src/collection/folder/schema';
export default async function execute() {
  await seedUsers();
  await seedStores();
  await seedFolders();
}

async function seedUsers(): Promise<void> {
  await UserModel.create({
    firstName: 'Mark',
    lastName: 'Chang',
    email: 'markchangan@gmail.com',
    password: 'DefaultPass123!!',
    cellphone: '7163333333',
    role: 'Owner',
    organzationName: '',
  });
}

async function seedStores(): Promise<void> {
  const markId = await UserModel.findOne({ email: 'markchangan@gmail.com' });
  await StoreModel.create({
    name: 'Default Store',
    balance: 0,
    lowBalanceThreshold: 5000,
    staff: [markId!._id!],
  });
}
async function seedFolders(): Promise<void> {
  await FolderModel.create({ name: 'Home' });
}
