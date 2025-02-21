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
    },

    saveExamProgress: async (req, res, next)=>{
        try{
            const { examId } = req.params;
            const { 
                attemptId, answers, currentQuestion 
            } = req.body;

            // Locate the exam attempt record for the current student
            const attempt = await ExamAttempt.findOne({
                _id: attemptId,
                exam: examId,
                student: req.user.id,
            });

            if (!attempt) {
                return res.status(404)
                .json({ 
                    error: 'Exam attempt not found' 
                });
            }

            // Update the answers Map properly by iterating over the new answers
            for (const [questionId, answer] of 
                Object.entries(answers)
            ) {
                attempt.answers.set(questionId, answer);
            }
            
            // Optionally track the current question to resume later
            attempt.currentQuestion = currentQuestion;
            await attempt.save();

            res.json({
                message: 'Progress saved successfully',
                attempt,
            });
              
        } catch(error){
            next(error);
        }
    }
}