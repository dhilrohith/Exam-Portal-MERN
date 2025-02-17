import express from 'express';

export const questionBankRouter = express.Router();

questionBankRouter.post(`/`);
questionBankRouter.get(`/`);
questionBankRouter.get(`/:bankId`);
questionBankRouter.put(`/:bankId`);
questionBankRouter.delete(`/:bankId`);