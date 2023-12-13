import { Router } from 'express';
import { shareController } from '../controller/shareController';

export const shareRoutes: Router = Router();

shareRoutes.get('/list', shareController.listShares);
shareRoutes.post('/create', shareController.createShare);
shareRoutes.post('/update', shareController.updateShare);