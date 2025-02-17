import express from 'express';

export const questionRouter = express.Router();

questionRouter.post(`/`);
questionRouter.put(`/:questionId`)
questionRouter.delete(`/:questionId`);