import { User, UserModel } from '../../src/collection/user/schema';

/**
 * Add randomized access code for clock-in and clock-out.
 */
export default async function execute() {
  const users = await UserModel.find();

  for (const user of users) {
    const updatedUser: User | null = await UserModel.findByIdAndUpdate(
      user._id,
      {
        code: Math.floor(Math.random() * 900000) + 100000,
      },
      { runValidator: true, new: true }
    );
  }
}
