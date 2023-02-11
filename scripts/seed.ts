/**
 * Database Seeder
 *
 * Seed the database with fake data.
 *
 * @author Jack Watson <watson.jack.p@gmail.com>
 */

import { UserModel } from '../src/collection/user/schema';
import { faker } from '@faker-js/faker';

const PASSWORD = 'pos2022';

export default async function execute(): Promise<void> {
  await seedUsers();
}

async function seedUsers(): Promise<void> {
  await UserModel.create({
    firstName: 'Mark',
    lastName: 'Chang',
    email: 'markchangan@gmail.com',
    password: PASSWORD,
    cellphone: '7163333333',
    role: 'Owner',
  });

  await UserModel.create({
    firstName: 'Jack',
    lastName: 'Watson',
    email: 'watson.jack.p@gmail.com',
    password: PASSWORD,
    cellphone: '1233333333',
    role: 'Owner',
  });

  await UserModel.create({
    firstName: 'Admin',
    lastName: 'Doe',
    email: 'admin.doe@gmail.com',
    password: PASSWORD,
    cellphone: '1233333334',
    role: 'Admin',
  });

  await UserModel.create({
    firstName: 'Manager',
    lastName: 'Doe',
    email: 'manager.doe@gmail.com',
    password: PASSWORD,
    cellphone: '1233333335',
    role: 'Manager',
  });

  await UserModel.create({
    firstName: 'Employee',
    lastName: 'Doe',
    email: 'employee.doe@gmail.com',
    password: PASSWORD,
    cellphone: '1233333336',
    role: 'Employee',
  });

  await UserModel.create({
    firstName: 'Counter',
    lastName: 'Doe',
    email: 'counter.doe@gmail.com',
    password: PASSWORD,
    cellphone: '1233333334',
    role: 'Counter',
  });
}
