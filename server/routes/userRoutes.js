import express from 'express';

import { userController } from 
'../contollers/userController.js';

import {authorize, protect} from 
'../middlewares/authMiddleware.js';

export const userRouter = express.Router();

// routes for authenticated user
userRouter.get(`/:userId`, 
    protect, userController.getUser
);
userRouter.put(`/:userId`, 
    protect, userController.updateUser
);

// admin route (protected route)
userRouter.get(`/`, 
    protect, authorize('admin'), 
    userController.getAllUsers
);

