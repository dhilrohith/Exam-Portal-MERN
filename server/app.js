import express from 'express';

import { authRouter} from './routes/authRoutes.js';

import {errorHandler} from './middlewares/errorMiddleware.js';

import {userRouter} from './routes/userRoutes.js';

import {questionBankRouter} from './routes/questionBankRoutes.js';

const app = express();

app.use(express.json());

// open route
app.use(`/api/v1/auth`, authRouter);
// protected route
app.use(`/api/v1/users`, userRouter);


// questionBank route
app.use(`/api/v1/questionBanks`, questionBankRouter);

// error handler route
app.use(errorHandler);

export default app;