import Exam from '../models/exam.js';

import QuestionBank from '../models/questionBank.js';

import ExamAttempt from '../models/examAttempt.js';

export const examManagementController = {
    startExam: async (req, res, next)=>{
        try{
            const {examId} = req.params;

            const exam = await Exam.findById(examId);
            if(!exam){
                return res.status(404).json({
                    error: `Exam not found`
                });
            }

            const questionBank = await QuestionBank
            .findById(
                exam.questionBankId
            );

            if(!questionBank){
                return res.status(404).json({
                    error: `Question Bank not found`
                });
            }

            
            const questions = questionBank.questions
                .map((q)=>{
                    // Convert the Mongoose document to a plain object
                    const questionObj = q.toObject();
                    
                    // Delete the correctAnswer property
                    delete questionObj.correctAnswer;
                    delete questionObj.explanation;
                    return questionObj;
                }
            );

            const examAttempt = await ExamAttempt
            .create({
                exam: examId,
                student: req.user.id,
                answers: {},
                status: 'in-progress',
            });
            
            res.json({
                exam: {
                  id: exam._id,
                  title: exam.title,
                  description: exam.description,
                  schedule: exam.schedule,
                  proctorRequired: exam.proctorRequired,
                },

                questions,

                attemptId: examAttempt._id
            });
        } catch(error){
            next(error);
        }
    }
}