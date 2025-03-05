import Exam from '../models/exam.js';

import QuestionBank from '../models/questionBank.js';

import ExamAttempt from '../models/examAttempt.js';

import {compareAnswers} from '../utils/compareAnswers.js';

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
    },

    submitExam: async (req, res, next)=>{
        try{
            const { examId } = req.params;
            const { attemptId, answers } = req.body;
        
            // Find the exam by ID
            const exam = await Exam.findById(examId);
            if (!exam) {
              return res.status(404)
              .json({ error: 'Exam not found' });
            }
            
            // Find the associated question bank
            const questionBank = await QuestionBank
            .findById(exam.questionBankId);

            if (!questionBank) {
              return res.status(404)
              .json({ 
                error: 'Question bank not found' 
                });
            }
        
            // Find the exam attempt record for the current student
            const attempt = await ExamAttempt
            .findOne({
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
        
            // Since "answers" is defined as a Map in the model, update it using Map.set()
            // Loop over each key-value pair in the incoming answers object.
            for (const [questionId, answerValue] of 
                Object.entries(answers)) {
              attempt.answers.set(
                questionId, answerValue
                );
            }
        
            // Mark the attempt as submitted.
            attempt.status = 'submitted';
        
            let score = 0;
            const totalQuestions = questionBank
            .questions.length;

            const results = [];
        
            // Evaluate each question in the question bank
            questionBank.questions.forEach(
                (question) => {
              // Retrieve the student's answer from the Map using the question's _id
              const studentAnswer = attempt.answers
              .get(question._id.toString());
              
              const isCorrect = compareAnswers(studentAnswer, question.correctAnswer);
        
              // Increment score if correct
              if (isCorrect) {
                score++;
              }
        
              // Build the detailed result for the question ensuring isCorrect is a boolean
              results.push({
                questionId: question._id,
                questionText: question.questionText,
                studentAnswer: studentAnswer || null,
                correctAnswer: question.correctAnswer,
                isCorrect: isCorrect, // Always defined as true or false
                explanation: question.explanation || '',
              });
            });
        
            // Update attempt record with grading results
            attempt.score = score;
            attempt.totalQuestions = totalQuestions;
            attempt.results = results;
            await attempt.save();
        
            res.json({
              message: 'Exam submitted and graded successfully',
              score,
              totalQuestions,
              results,
            });
        } catch(error){
            next(error);
        }
    },

    getExamResults: async (req, res, next)=>{
        try{
            const { examId } = req.params;
            const { attemptId } = req.query;
        
            // Find the exam attempt record associated with this exam and student
            const attempt = await ExamAttempt.findOne({
              _id: attemptId,
              exam: examId,
              student: req.user.id,
            });
            if (!attempt) {
              return res.status(404).json({ error: 'Exam attempt not found' });
            }
        
            res.json({
              attempt: {
                score: attempt.score,
                totalQuestions: attempt.totalQuestions,
                results: attempt.results,
                submittedAt: attempt.updatedAt,
              },
            });
        } catch(error){
            next(error)
        }
    }
}