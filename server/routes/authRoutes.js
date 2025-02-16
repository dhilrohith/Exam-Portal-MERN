import express from 'express';

export const authRouter = express.Router();

authRouter.post(`/register`, (req, res)=>{
  res.send("hello")
});
// authRouter.post(`/login`);
// authRouter.get(`/users/:userId`);
// authRouter.get(`/users`);
