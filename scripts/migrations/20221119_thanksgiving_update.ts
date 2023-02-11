import { Product, ProductModel } from '../../src/collection/product/schema';
import { Store, StoreModel } from '../../src/collection/store/schema';

export default async function execute() {
  // Add fields for stores:
  const stores: Array<Store> = await StoreModel.find();

  for (const store of stores) {
    const updatedStore: Store | null = await StoreModel.findByIdAndUpdate(
      store._id,

      {
        lastLowBalanceNotified: new Date(),
        personalPinMode: false,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // Add fields for products
  const products: Array<Product> = await ProductModel.find();

  for (const product of products) {
    const updatedProduct: Product | null = await ProductModel.findByIdAndUpdate(
      product._id,

      {
        recyclingShortcut: false,
        recyclingShortcutQuantity: 0,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }
}
