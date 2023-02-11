import { Product, ProductModel } from '../../src/collection/product/schema';
import { Store, StoreModel } from '../../src/collection/store/schema';

export default async function execute() {
  // Add fields for stores:
  const stores: Array<Store> = await StoreModel.find();

  for (const store of stores) {
    const updatedStore: Store | null = await StoreModel.findByIdAndUpdate(
      store._id,

      {
        virtualNumpadMode: false,
        closeModalAfterSubmit: true,
        receiptPrinter: false,
        receiptPrinterType: 'Serial',
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }
}
