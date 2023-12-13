import { Request, Response } from 'express';
import { shareRepo } from '../database/repository/ShareRepo';
import { ShareSchemaValidator } from '../schemas/shareSchema';
import {
  CreateShareInput,
  ShareModel,
  UpdateShareInput,
} from '../models/ShareModel';

class ShareController {
  async createShare(req: Request, res: Response): Promise<Response> {
    try {
      const shareData = req.body;
      //joi validation step
      const validate =
        await ShareSchemaValidator.createShareInputSchemaValidator(shareData);
      if (validate.error) {
        return res
          .status(400)
          .json({ success: false, data: null, error: validate.error.message });
      }
      const share: CreateShareInput = await shareRepo.createShare(validate);
      return res.status(201).json(share);
    } catch (error) {
      if (error.message.includes('Unique constraint failed')) {
        return res.status(400).json({
          success: false,
          data: null,
          error: 'Share symbol already exists',
        });
      }
      return res
        .status(500)
        .json({ success: false, data: null, error: error.message });
    }
  }

  async updateShare(req: Request, res: Response): Promise<Response> {
    try {
      const validate =
        await ShareSchemaValidator.updateShareInputSchemaValidator(req.body);

      if (validate.error) {
        return res.status(400).json({
          success: false,
          data: null,
          error: validate.error.message,
        });
      }

      const { shareId } = req.body;
      //joi validation step

      //Just every hour can update share price
      //check last update time

      const shareData: ShareModel = await shareRepo.getShareDataById(shareId);

      if (shareData.sharePrice) {
        //check last update time
        const now = new Date();
        const lastUpdate = new Date(shareData.updatedAt);
        const diff = Math.abs(now.getTime() - lastUpdate.getTime());
        if (diff <= 3600000) {
          return res.status(400).json({
            success: false,
            data: null,
            error: 'You can update share price just every hour',
          });
        }
      }

      //shareData.sharePrice must be a 2 digit decimal number
      const share: UpdateShareInput = await shareRepo.updateShare(validate);
      return res.status(200).json({ success: true, data: share, error: null });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: null, error: error.message });
    }
  }

  async listShares(req: Request, res: Response): Promise<Response> {
    try {
      const shareList: ShareModel[] = await shareRepo.listShares();
      shareList.forEach((share) => {
        share.sharePriceStr = share.sharePrice.toFixed(2);
      });
      return res.json(shareList);
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, data: null, error: error.message });
    }
  }
}

export const shareController: ShareController = new ShareController();
