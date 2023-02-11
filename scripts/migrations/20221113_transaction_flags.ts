import {
  Transaction,
  TransactionModel,
} from '../../src/collection/transaction/schema';

export default async function execute() {
  const transactions: Array<Transaction> = await TransactionModel.find();

  for (const transaction of transactions) {
    const updatedTransaction: Transaction | null =
      await TransactionModel.findByIdAndUpdate(
        transaction._id,

        {
          pendingReview: false,
          notes: 'None',
        }
      );
  }
}
