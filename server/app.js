import express from 'express';

import cors from 'cors';

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

// Define CORS options before using them
const corsOptions = {
  origin: 'https://exam-portal-mern-web.netlify.app', // exactly match your client URL, no trailing slash
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

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