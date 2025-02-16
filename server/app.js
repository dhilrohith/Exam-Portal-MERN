import express from 'express';
import { authRouter } from './routes/authRoutes.js';
const app = express();

app.use(`/api/v1/auth`, authRouter);

export default app;