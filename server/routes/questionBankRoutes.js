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

// question routes protected
questionBankRouter.post(`/:bankId/questions`,
    protect, authorize("admin"), 
    questionController.createQuestion
);
questionBankRouter.put(`/:bankId/questions/:questionId`,
    protect, authorize("admin"),
    questionController.updateQuestionInBank
)
questionBankRouter.delete(
    `/:bankId/questions/:questionId`,
    protect, authorize("admin"),
    questionController.deleteQuestionInBank
);

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