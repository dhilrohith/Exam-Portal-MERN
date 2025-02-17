import express from 'express';

import { authorize, protect } from 
'../middlewares/authMiddleware.js';

import { questionBankController } from 
'../contollers/questionBankController.js';

export const questionBankRouter = express.Router();

questionBankRouter.post(`/`,
    protect, authorize('admin'),
    questionBankController.createQuestionBank
);
questionBankRouter.get(`/`,
    questionBankController.getAllQuestionBanks
);
questionBankRouter.get(`/:bankId`,
    questionBankController.getQuestionBankById
);
questionBankRouter.put(`/:bankId`,
    protect, authorize('admin'),
    questionBankController.updateQuestionBank
);
questionBankRouter.delete(`/:bankId`,
    protect, authorize('admin'),
    questionBankController.deleteQuestionBank
);