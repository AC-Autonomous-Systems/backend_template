import {
  Transaction,
  TransactionModel,
} from '../../src/collection/transaction/schema';

// Note: To remove a field from the collection:
// db.transactions.updateMany({}, {$unset: {printed: 1}})
export default async function execute() {
  // Add fields for stores:
  // const transactions: Array<Transaction> = await TransactionModel.find();
  // for (const transaction of transactions) {
  //   const updatedStore: Transaction | null =
  //     await TransactionModel.findByIdAndUpdate(
  //       transaction._id,
  //       {},
  //       {
  //         new: true,
  //         runValidators: true,
  //       }
  //     );
  // }
}
