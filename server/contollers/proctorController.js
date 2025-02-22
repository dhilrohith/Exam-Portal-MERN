import ProctoringSession from 
"../models/proctoringSession.js";

import Exam from '../models/exam.js';

export const proctorController = {
    startProctoringSession: async (req, res, next)=>{
        try{
            const { examId, proctorId } = req.body;
            
                // Validate examId is provided
            if (!examId) {
                return res.status(400).json({ 
                    error: 'Exam ID is required.' 
                });
            }

            // Create a new proctoring session for the exam with the current student
            const session = new ProctoringSession({
              exam: examId,
              student: req.user.id,
              proctor: proctorId || undefined,
              sessionStart: new Date(),
            });
        
            await session.save();
        
            res.status(201).json({
              message: "Proctoring session started successfully",
              session,
            });
        } catch(error){
            next(error);
        }
    },

    logProctoringEvent: async (req, res, next)=>{
        try{
            const { sessionId } = req.params;
            const { eventType, details } = req.body;
        
            // Find the proctoring session by its ID
            const session = await ProctoringSession
            .findById(sessionId);
            if (!session) {
              return res.status(404).json({ 
                error: "Proctoring session not found" 
            });
            }
        
            // Create an event record
            const event = {
              eventType,
              timestamp: new Date(),
              details: details || "",
            };
        
            // Add the event to the session's events array
            session.events.push(event);
        
            // Optionally, flag the session if a suspicious event occurs
            // Example: flag if the event indicates a browser switch or any other flagged behavior
            if (eventType === "browserSwitch" || 
                eventType === "suspiciousActivity") {
              session.sessionStatus = "flagged";
            }
        
            await session.save();
        
            res.status(200).json({
              message: "Event logged successfully",
              session,
            });
        } catch(error){
            next(error)
        }
    },

    verifyIdentity: async (req, res, next)=>{
        try{
            const { examId, verificationData } = req.body;

            console.log("Exam ID from request:", examId, typeof examId);
            console.log("Authenticated student ID:", req.user.id, typeof req.user.id);

            // Locate the active proctoring session for the exam and student
            const session = await ProctoringSession.findOne({
              exam: examId,
              student: req.user.id,
              sessionStatus: "active",
            }); 
            if (!session) {
              return res.status(404).json({ error: "Active proctoring session not found" });
            }
        
            // Integrate with a third-party identity verification service here.
            // For demonstration, assume verification succeeds if verificationData exists.
            const isVerified = verificationData ? true : false;
        
            session.identityVerified = isVerified;
            await session.save();
        
            res.status(200).json({
              message: "Identity verification " + (isVerified ? "successful" : "failed"),
              identityVerified: isVerified,
            });
        } catch(error){
            next(error);
        }
    },

    getProctoringSessionDetails: async (req, res, next)=>
        {
            try{
                const { sessionId } = req.params;
                const session = await ProctoringSession.findById(sessionId)
                  .populate("exam")
                  .populate("student")
                  .populate("proctor");
            
                if (!session) {
                  return res.status(404).json({ error: "Proctoring session not found" });
                }
            
                res.status(200).json({ session });
            } catch(error){
                next(error)
            }
        },
    listProctoringSession: async (req,res,next)=>{
        try{
            const { examId, studentId, status } = req.query;
            const filter = {};
            if (examId) filter.exam = examId;
            if (studentId) filter.student = studentId;
            if (status) filter.sessionStatus = status;
        
            const sessions = await ProctoringSession.find(filter)
              .populate("exam")
              .populate("student")
              .populate("proctor");
        
            res.status(200).json({ sessions });
        } catch(error){
            next(error);
        }
    }
}