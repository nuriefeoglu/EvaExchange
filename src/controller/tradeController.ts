import { Request, Response } from 'express';
import { userRepo } from '../database/repository/UserRepo';
import { shareRepo } from '../database/repository/ShareRepo';
import { UserShareModel } from '../models/UserShareModel';
import { userShareRepo } from '../database/repository/UserShareRepo';
import { portfolioRepo } from '../database/repository/PortfolioRepo';
import { transactionRepo } from '../database/repository/TransactionRepo';
import { CreateTransactionModel } from '../models/TransactionModel';
import { TradeSchema } from '../schemas/tradeSchema';
import { validationError } from '../middleware/validationError';
import { UserModel } from '../models/UserModel';
import { ShareModel } from '../models/ShareModel';

class TradeController {
  async buyShares(req: Request, res: Response): Promise<Response> {
    try {
      //Check userId from req.headers['x-user-id'] and access token from req.headers['authorization'] bypassed now
      const validate = await TradeSchema.tradeSchemaValidator(req.body);

      if (validate.error) {
        return res.status(400).json({
          success: false,
          data: null,
          error: validate.error.message,
        });
      }
      const { userId, shareId } = req.body;
      const qty = parseInt(req.body.qty);

      const getUserData: UserModel = await userRepo.getUserPortfolio(userId);
      const portfolioId = getUserData.Portfolio.portfolioId;
      if (!portfolioId) {
        return res.status(404).json({
          success: false,
          data: null,
          error: 'Portfolio not found',
        });
      }
      if (getUserData.id !== userId) {
        return res.status(401).json({
          success: false,
          data: null,
          error: 'User id not match',
        });
      }

      //Check if share exists
      const shareData: ShareModel = await shareRepo.getShareById(shareId);
      if (!shareData) {
        return res.status(400).json({
          success: false,
          data: null,
          error: 'Share not found',
        });
      }
      const shareSymbol = shareData.shareSymbol;

      //Check if share not exists or quantity is less than qty
      if (shareData.shareQuantity < qty) {
        return res.status(400).json({
          success: false,
          data: null,
          error: 'Not enough shares to buy',
        });
      }

      //get user balance
      const { balance } = await userRepo.getUserBalance(userId);

      //check if user has enough balance to buy
      if (shareData.sharePrice * qty > balance) {
        return res.status(400).json({
          success: false,
          data: null,
          error: 'Not enough balance to buy',
        });
      }

      //update share quantity
      const updatedShareQuantity = shareData.shareQuantity - qty;
      await shareRepo.updateShareQuantity(shareId, updatedShareQuantity);

      //update user balance
      const updatedBalance = balance - shareData.sharePrice * qty;
      await userRepo.updateUserBalance(userId, updatedBalance);

      const { shares } = await portfolioRepo.getUserShares(portfolioId);
      const currentShare = shares.find(
        (share: UserShareModel) => share.shareSymbol === shareSymbol,
      );

      //update user share quantity
      if (currentShare) {
        const updatedShareQty = currentShare.shareQuantity + qty;
        await userShareRepo.updateUserShareQty(
          currentShare.id,
          updatedShareQty,
        );
      } else {
        await userShareRepo.createUserShare({
          portfolioId: portfolioId,
          shareSymbol,
          shareQuantity: qty,
        });
      }

      //create transaction data
      const transactionData: CreateTransactionModel = {
        shareId: shareId,
        userId: userId,
        transactionQuantity: qty,
        transactionType: 'BUY',
        transactionPrice: shareData.sharePrice * qty,
      };

      //create transaction
      const transactionResp = await transactionRepo.createTransaction(
        transactionData,
      );

      return res.status(200).json({
        success: true,
        data: transactionResp,
        errors: null,
      });
    } catch (e) {
      if (e.message === 'User not found') {
        return res.status(404).json({
          success: false,
          data: null,
          error: 'User not found',
        });
      }
      if (e.details) {
        const errors = validationError(e.details);
        return res.status(400).json({
          success: false,
          data: null,
          error: errors,
        });
      }
      return res.status(500).json({
        success: false,
        data: null,
        error: 'Something went wrong',
      });
    }
  }

  async sellShares(req: Request, res: Response): Promise<Response> {
    try {
      //Check userId from req.headers['x-user-id'] and access token from req.headers['authorization']
      const validate = await TradeSchema.tradeSchemaValidator(req.body);

      if (validate.error) {
        const errors = validationError(validate);
        return res.status(400).json({
          success: false,
          data: null,
          error: errors,
        });
      }

      const { userId, shareId } = req.body;
      const qty = parseInt(req.body.qty);

      const shareData: ShareModel = await shareRepo.getShareById(shareId);

      //Check if share not exists
      if (!shareData) {
        return res
          .status(400)
          .json({ success: false, data: null, error: 'Share not found' });
      }
      //last db price
      const lastPriceShare = shareData.sharePrice;

      const getUserPortfolio: UserModel = await userRepo.getUserPortfolio(
        userId,
      );

      const portfolioId = getUserPortfolio.Portfolio.portfolioId;
      if (!portfolioId) {
        return res.status(404).json({
          success: false,
          data: null,
          error: 'Portfolio not found',
        });
      }

      //get user share data from portfolio
      const { shares } = await portfolioRepo.getUserShares(portfolioId);

      const userShareData = shares.find(
        (share: UserShareModel) => share.shareSymbol === shareData.shareSymbol,
      );

      if (!userShareData) {
        return res.status(400).json({
          success: false,
          data: null,
          error: 'Share not found in portfolio',
        });
      }

      //check if user has enough shares to sell
      if (userShareData.shareQuantity < qty) {
        return res.status(400).json({
          success: false,
          data: null,
          error: 'Not enough shares to sell',
        });
      }

      //update share quantity
      const updatedShareQuantity = shareData.shareQuantity + qty;
      await shareRepo.updateShareQuantity(shareId, updatedShareQuantity);

      //update user balance
      const { balance } = await userRepo.getUserBalance(userId);
      const updatedBalance = balance + lastPriceShare * qty;
      await userRepo.updateUserBalance(userId, updatedBalance);

      //update user share quantity
      const updatedShareQty = userShareData.shareQuantity - qty;
      await userShareRepo.updateUserShareQty(userShareData.id, updatedShareQty);

      //create transaction data
      const transactionData: CreateTransactionModel = {
        shareId: shareId,
        userId: userId,
        transactionQuantity: qty,
        transactionType: 'SELL',
        transactionPrice: lastPriceShare * qty,
      };

      //create transaction
      const transactionResp = await transactionRepo.createTransaction(
        transactionData,
      );

      return res.json({
        success: true,
        data: transactionResp,
        errors: null,
      });
    } catch (e) {
      if (e.details) {
        if (e.message.includes('portfolioId')) {
          return res.status(400).json({
            success: false,
            data: null,
            error: 'Portfolio not found',
          });
        }
        const errors = validationError(e.details);
        return res.status(400).json({
          success: false,
          data: null,
          error: errors,
        });
      }
      return res.status(500).json({
        success: false,
        data: null,
        error: 'Something went wrong',
      });
    }
  }
}

export const tradeController: TradeController = new TradeController();
