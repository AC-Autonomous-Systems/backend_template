import { Reward, RewardModel } from '../../src/collection/reward/schema';
import { User, UserModel } from '../../src/collection/user/schema';

export default async function execute() {
  const users: Array<User> = await UserModel.find();

  for (const user of users) {
    if (user.role === 'Customer') {
      const rewardFromUser: Reward | null = await RewardModel.findOne({
        customer: user._id,
      });

      console.log(rewardFromUser?.unpaid);

      console.log(rewardFromUser?.total);

      if (rewardFromUser) {
        const updatedReward: Reward | null =
          await RewardModel.findByIdAndUpdate(
            rewardFromUser._id,
            { unpaidCans: rewardFromUser.total },
            { new: true, runValidators: true }
          );
      }
    }
  }
}
