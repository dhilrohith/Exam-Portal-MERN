import express from 'express';

import { protect, authorize } from 
'../middlewares/authMiddleware.js';

import {proctorController} from 
'../contollers/proctorController.js'

export const proctorRouter = express.Router();

proctorRouter.post(`/session/start`, 
    protect,
    proctorController.startProctoringSession
);
proctorRouter.post(`/session/:sessionId/event`,
    proctorController.logProctoringEvent
);
proctorRouter.post(`/verify`,
    protect,
    proctorController.verifyIdentity
);
proctorRouter.get(`/session/:sessionId`,
    protect,
    proctorController.getProctoringSessionDetails
);
proctorRouter.get(`/sessions`,
    protect,
    proctorController.listProctoringSession
);