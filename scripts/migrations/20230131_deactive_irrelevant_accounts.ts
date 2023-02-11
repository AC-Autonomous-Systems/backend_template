import { Reward, RewardModel } from '../../src/collection/reward/schema';
import { User, UserModel } from '../../src/collection/user/schema';

export default async function execute() {
  const users: Array<User> = await UserModel.find();

  for (const user of users) {
    const rewardFromUser: Reward | null = await RewardModel.findOne({
      customer: user._id,
    });

    if (rewardFromUser) {
      console.log(rewardFromUser);

      if (user.role !== 'Customer') {
        await RewardModel.findByIdAndUpdate(rewardFromUser._id, {
          active: false,
        });
      }
    }
  }
}
