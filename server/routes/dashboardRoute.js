import express from 'express';

import { reportController } from 
'../contollers/reportController.js';

import {protect, authorize} from
'../middlewares/authMiddleware.js';

export const dashboardRouter = express.Router();

dashboardRouter.get(`/`,
    protect,
    reportController.getDashboardSummary
)