import {
  ProductTaxHistory,
  Register,
  RegisterModel,
} from '../../src/collection/register/schema';

/**
 *
 * Changes made to the DB via mongosh:
 *
 * 1. db.products.updateMany({}, {$rename: {"tax": "taxPercentage"}}, false, true)
 * 2. db.registers.updateMany({ 'productTaxHistory.totalPreTax': null }, [
      {
        $addFields: {
          productTaxHistory: {
            $map: {
              input: '$productTaxHistory',
              as: 'productTaxHistory',
              in: {
                product_id: '$$productTaxHistory.product_id',
                bottleDepositDollarAmount: 0,
                bottleDepositQuantity: 0,
                totalPreTax: '$$productTaxHistory.total',
                taxes: '$$productTaxHistory.taxes',
                quantity: '$$productTaxHistory.quantity',
              },
            },
          },
          bottleDepositDollarAmount: 0,
          bottleDepositQuantity: 0,
          rewardsBottleDepositDollarAmount: 0,
          rewardsBottleDepositQuantity: 0,
        },
      },
    ]);

 */
export default async function RegisterFields20221002() {}
