import { userModel } from '../index';

class UserRepo {
  async getUserPortfolio(userId: string): Promise<any> {
    const data = await userModel.findUnique({
      where: { id: userId },
      //select portfolioId from user table nullable
      select: {
        id: true,
        Portfolio: true
      },
    });
    if (!data) throw new Error('User not found');
    return data;
  }

  async getUserBalance(userId: string): Promise<any> {
    try {
      return await userModel.findUnique({
        where: { id: userId },
        select: {
          balance: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateUserBalance(
    userId: string,
    updatedBalance: number,
  ): Promise<any> {
    try {
      return await userModel.update({
        where: { id: userId },
        data: {
          balance: updatedBalance,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export const userRepo = new UserRepo();
