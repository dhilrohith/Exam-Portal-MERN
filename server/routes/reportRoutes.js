import express from 'express';

import { reportController } from 
'../contollers/reportController.js';

import { protect, authorize } from
'../middlewares/authMiddleware.js'

export const reportRouter = express.Router();

reportRouter.get(`/exams`,
    protect,
    authorize("admin"),
    reportController.getExamReports
)
reportRouter.get(`/exams/:examId`,
    protect,
    authorize("admin"),
    reportController.getExamReportByExamId
)
reportRouter.get(`/users/:userId`,
    protect,
    authorize("admin"),
    reportController. getUserPerformanceAnalytics
)