import { transactionModel } from '../index';
import { CreateTransactionModel } from '../../models/TransactionModel';

class TransactionRepo {

  async createTransaction(createTransactionInput: CreateTransactionModel): Promise<any> {
    try {
      return await transactionModel.create({
        data: {
          userId: createTransactionInput.userId,
          shareId: createTransactionInput.shareId,
          transactionType: createTransactionInput.transactionType,
          transactionQuantity: createTransactionInput.transactionQuantity,
          transactionPrice: createTransactionInput.transactionPrice,
        },
      });
    } catch (error) {
      throw error;
    }
  }

}
export const transactionRepo = new TransactionRepo();