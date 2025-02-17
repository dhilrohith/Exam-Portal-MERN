import express from 'express';

import { authorize, protect } from 
'../middlewares/authMiddleware.js';

import { questionBankController } from 
'../contollers/questionBankController.js';

import { questionController } 
from '../contollers/questionControllers.js';

export const questionBankRouter = express.Router();

questionBankRouter.get(`/`,
    questionBankController.getAllQuestionBanks
);
questionBankRouter.get(`/:bankId`,
    questionBankController.getQuestionBankById
);

// question routes
questionBankRouter.post(`/:bankId/questions`,
    questionController.createQuestion
);
questionBankRouter.put(`/:questionId/questions`)
questionBankRouter.delete(`/:questionId/questions`);

// protected routes
questionBankRouter.post(`/`,
    protect, authorize('admin'),
    questionBankController.createQuestionBank
);
questionBankRouter.put(`/:bankId`,
    protect, authorize('admin'),
    questionBankController.updateQuestionBank
);
questionBankRouter.delete(`/:bankId`,
    protect, authorize('admin'),
    questionBankController.deleteQuestionBank
);