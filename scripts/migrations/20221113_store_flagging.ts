import { Store, StoreModel } from '../../src/collection/store/schema';

export default async function execute() {
  const stores: Array<Store> = await StoreModel.find();

  for (const store of stores) {
    const updatedStore: Store | null = await StoreModel.findByIdAndUpdate(
      store._id,

      {
        flaggingParameters: [],
        notificationList: [],
        lastNotified: new Date(),
        overshortLimit: 50,
        singleTransactionCanLimit: 1200,
        singleTransactionDollarLimit: 100,
      }
    );
  }
}
