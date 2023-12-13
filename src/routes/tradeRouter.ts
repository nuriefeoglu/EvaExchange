import { Router } from 'express';
import { shareController } from '../controller/shareController';
import { tradeController } from '../controller/tradeController';

export const tradeRouter: Router = Router();

tradeRouter.post('/buy', tradeController.buyShares);
tradeRouter.post('/sell', tradeController.sellShares);