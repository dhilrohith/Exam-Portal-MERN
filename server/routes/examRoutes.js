import express from 'express';

import { examController } from 
'../contollers/examController.js';

export const examRouter = express.Router();

examRouter.post(`/`,
    examController.createExam
)