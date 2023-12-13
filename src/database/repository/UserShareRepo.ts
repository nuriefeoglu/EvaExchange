import { userShareModel } from '../index';

class UserShareRepo {
  async createUserShare(createUserShareInput: any): Promise<any> {
    try {
      return await userShareModel.create({
        data: {
          portfolioId: createUserShareInput.portfolioId,
          shareSymbol: createUserShareInput.shareSymbol,
          shareQuantity: createUserShareInput.shareQuantity,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateUserShareQty(id: string, updatedShareQty: number): Promise<any> {
    try {
      return await userShareModel.update({
        where: { id: id },
        data: {
          shareQuantity: updatedShareQty,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export const userShareRepo = new UserShareRepo();
