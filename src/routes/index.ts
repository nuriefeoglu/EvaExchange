import Router, { Express } from 'express';
import { shareRoutes } from './shareRouter';
import { tradeRouter } from './tradeRouter';

export const Routes: Express = Router();

Routes.use('/share', shareRoutes);
Routes.use('/trade', tradeRouter);
