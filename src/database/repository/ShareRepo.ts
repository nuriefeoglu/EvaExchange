import { shareModel } from '../index';
import { CreateShareInput, UpdateShareInput } from '../../models/ShareModel';

class ShareRepo {
  async createShare(createShareInput: CreateShareInput): Promise<any> {
    try {
      return await shareModel.create({
        data: createShareInput,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateShare(updateShareInput: UpdateShareInput): Promise<any> {
    try {
      return await shareModel.update({
        where: { id: updateShareInput.shareId },
        select: {
          sharePrice: true,
        },
        data: {
          sharePrice: updateShareInput.sharePrice,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getShareById(shareId: string): Promise<any> {
    try {
      return await shareModel.findUnique({
        where: { id: shareId },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateShareQuantity(
    shareId: string,
    updatedShareQuantity: number,
  ): Promise<any> {
    try {
      return await shareModel.update({
        where: { id: shareId },
        data: {
          shareQuantity: updatedShareQuantity,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getShareDataById(shareId: string): Promise<any> {
    try {
      return await shareModel.findUnique({
        where: { id: shareId },
      });
    } catch (error) {
      throw error;
    }
  }

  async listShares(): Promise<any[]> {
    try {
      return await shareModel.findMany();
    } catch (error) {
      throw error;
    }
  }
}

export const shareRepo = new ShareRepo();
