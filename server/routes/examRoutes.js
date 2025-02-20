import express from 'express';

import { examController } from 
'../contollers/examController.js';
import exam from '../models/exam.js';

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