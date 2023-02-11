import {
  StarPrinterEntry,
  StarPrinterEntryModel,
} from '../../src/collection/star-printer/schema';
import {
  Transaction,
  TransactionModel,
} from '../../src/collection/transaction/schema';

// Note: To remove a field from the collection:
// db.transactions.updateMany({}, {$unset: {printed: 1}})
// npm run script -- ./migrations/20221228_delete_printer_entries.ts
export default async function execute() {
  const starPrinterEntries: Array<StarPrinterEntry> =
    await StarPrinterEntryModel.find();

  for (const starPrinterEntry of starPrinterEntries) {
    await StarPrinterEntryModel.findByIdAndDelete(starPrinterEntry._id);
  }
}
