import express from 'express';

import {authController} from 
'../contollers/authController.js'

import {authorize, protect} from '../middlewares/authMiddleware.js'

export const authRouter = express.Router();

authRouter.post(`/register`, authController.register);
authRouter.post(`/login`, authController.login);

// routes for authenticated user
authRouter.get(`/users/:userId`, 
    protect, authController.getUser
);
authRouter.put(`/users/:userId`, 
    protect, authController.updateUser
);

// admin route (protected route)
authRouter.get(`/users`, 
    protect, authorize('admin'), 
    authController.getAllUsers
);
