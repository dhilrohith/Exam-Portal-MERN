import express from 'express';

import { examController } from 
'../contollers/examController.js';

import {protect, authorize} from 
'../middlewares/authMiddleware.js'

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