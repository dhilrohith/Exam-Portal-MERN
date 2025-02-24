import express from 'express';

import { authRouter} from './routes/authRoutes.js';

import {errorHandler} from 
'./middlewares/errorMiddleware.js';

import {userRouter} from './routes/userRoutes.js';

import {questionBankRouter} from 
'./routes/questionBankRoutes.js';

import { examRouter } from './routes/examRoutes.js';

import { proctorRouter } from 
'./routes/proctorRoutes.js';

import { reportRouter } from './routes/reportRoutes.js';

import {dashboardRouter} from 
'./routes/dashboardRoute.js'

const app = express();

app.use(express.json());

// open route
app.use(`/api/v1/auth`, authRouter);
// protected route
app.use(`/api/v1/users`, userRouter);


// questionBank route
app.use(`/api/v1/questionBanks`, questionBankRouter);

// exam management and sheduling
app.use('/api/v1/exams', examRouter);

// proctor routes
app.use(`/api/v1/proctoring`, proctorRouter);

// report routes
app.use(`/api/v1/reports`, reportRouter)

// dashboard route
app.use('/api/v1/dashboard', dashboardRouter);

// error handler route
app.use(errorHandler);

export default app;