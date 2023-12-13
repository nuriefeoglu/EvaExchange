import { UserShareModel } from './UserShareModel';

export interface UserModel {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
  balance?: number;
  Portfolio?: PortfolioModel;
}

export interface PortfolioModel {
  portfolioId: string;
  shares?: UserShareModel[];
  userId?: string;
}