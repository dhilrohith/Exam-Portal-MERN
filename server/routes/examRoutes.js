import express from 'express';

import { examController } from 
'../contollers/examController.js';

import {protect, authorize} from 
'../middlewares/authMiddleware.js'

import { examManagementController } from 
'../contollers/examManagmentController.js';

export const examRouter = express.Router();

examRouter.post(`/`,
    examController.createExam
)
examRouter.get(`/`,
    examController.getAllExams
)
examRouter.get('/:examId',
    examController.getExamById
)
examRouter.put(`/:examId`, 
    examController.updateExam
)
examRouter.delete(`/:examId`,
    examController.deleteExam
)
examRouter.post(`/:examId/enroll`,
    protect,
    authorize('student'),
    examController.enrollStudent
)

// exam taking & automated grading

examRouter.get(`/:examId/start`,
    protect,
    examManagementController.startExam
)
examRouter.post(`/:examId/save`,
    protect,
    examManagementController.saveExamProgress
)
examRouter.post(`/:examId/submit`,
    protect,
    examManagementController.submitExam
)
examRouter.get(`/:examId/results`,
    protect,
    examManagementController.getExamResults
)