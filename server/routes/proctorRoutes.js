import express from 'express';

import { protect, authorize } from 
'../middlewares/authMiddleware.js';

import {proctorController} from 
'../contollers/proctorController.js'

export const proctorRouter = express.Router();

proctorRouter.post(`/start`, 
    protect,
    proctorController.startProctoringSession
);
proctorRouter.post(`/:sessionId/event`,
    proctorController.logProctoringEvent
);
proctorRouter.post(`/verify`,
    protect,
    proctorController.verifyIdentity
);
proctorRouter.get(`/:sessionId`,
    protect,
    proctorController.getProctoringSessionDetails
);
proctorRouter.get(`/sessions`,
    protect,
    authorize("admin"),
    proctorController.listProctoringSession
);