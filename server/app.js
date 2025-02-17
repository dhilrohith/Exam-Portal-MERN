import express from 'express';

import { authRouter} from './routes/authRoutes.js';

import {errorHandler} from './middlewares/errorMiddleware.js';

import {userRouter} from './routes/userRoutes.js'

const app = express();

app.use(express.json());

// open route
app.use(`/api/v1/auth`, authRouter);
// protected route
app.use(`/api/v1/users`, userRouter);

app.use(errorHandler);

export default app;