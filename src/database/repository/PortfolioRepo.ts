import { portfolioModel } from '../index';

class PortfolioRepo {
  async getUserShares(id: string): Promise<any> {
    try {
      return await portfolioModel.findUnique({
        where: { portfolioId: id},
        select: {
          shares: true,
        }
      });
    } catch (error) {
      throw error;
    }
  }
}

export const portfolioRepo = new PortfolioRepo();
