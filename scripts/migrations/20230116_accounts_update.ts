import { Reward, RewardModel } from '../../src/collection/reward/schema';
import { User, UserModel } from '../../src/collection/user/schema';

export default async function execute() {
  // Find all non-customer users and create a reward account for them:
  const users: Array<User> = await UserModel.find();

  for (const user of users) {
    const rewardFromUser: Reward | null = await RewardModel.findOne({
      customer: user._id,
    });

    if (!rewardFromUser) {
      if (user.role !== 'Customer') {
        const rewardFromUser: Reward | null = await RewardModel.create({
          customer: user._id,
          active: false,
        });
      } else {
        const rewardFromUser: Reward | null = await RewardModel.create({
          customer: user._id,
          active: true,
        });
      }
    } else {
      if (user.role !== 'Customer') {
        const rewardFromuser: Reward | null =
          await RewardModel.findByIdAndUpdate(rewardFromUser._id, {
            active: false,
          });
      } else {
        const rewardFromuser: Reward | null =
          await RewardModel.findByIdAndUpdate(rewardFromUser._id, {
            active: true,
          });
      }
    }

    if (user?.lastName?.toLowerCase() === 'account') {
      const updatedUser: User | null = await UserModel.findByIdAndUpdate(
        user._id,
        { organization: true, organizationName: user.firstName }
      );
    } else {
      const updatedUser: User | null = await UserModel.findByIdAndUpdate(
        user._id,
        { organization: false, organizationName: user.firstName }
      );
    }
  }

  // Find all rewards delete the payout history:
  const rewards: Array<Reward> = await RewardModel.find();

  for (const reward of rewards) {
    const updatedReward: Reward | null = await RewardModel.findByIdAndUpdate(
      reward._id,
      { payoutHistory: [] },
      { runValidator: true, new: true }
    );
  }
}
