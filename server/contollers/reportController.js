import mongoose from 'mongoose';

import Exam from '../models/exam.js';

import ExamAttempt from '../models/examAttempt.js';

import ExamReport from '../models/examReports.js';

import QuestionBank from '../models/questionBank.js';

import UserReport from '../models/userReport.js';

import User from '../models/users.js';

import ProctoringSession from
    '../models/proctoringSession.js'

export const reportController = 
{
    getExamReports: async (req, res, next) => {
        try {
          const { startDate, endDate, examId } = req.query;
    
          // Build the match object based on provided query parameters
          const match = {};
          if (examId) {
            match.exam = new mongoose.Types.ObjectId(examId);
          }
          if (startDate || endDate) {
            match.createdAt = {};
            if (startDate) {
              match.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
              match.createdAt.$lte = new Date(endDate);
            }
          }
    
          // Aggregate examAttempts
          const reports = await ExamAttempt.aggregate([
            { $match: match },
            {
              $group: {
                _id: "$exam",
                averageScore: { $avg: "$score" },
                totalAttempts: { $sum: 1 },
                highestScore: { $max: "$score" },
                lowestScore: { $min: "$score" },
              },
            },
            {
              $lookup: {
                from: "exams",
                localField: "_id",
                foreignField: "_id",
                as: "examDetails",
              },
            },
            { $unwind: "$examDetails" },
            {
              $project: {
                examId: "$_id",
                examTitle: "$examDetails.title",
                averageScore: 1,
                totalAttempts: 1,
                highestScore: 1,
                lowestScore: 1,
              },
            },
          ]);
    
          // If an examId was provided, fetch additional exam details
          if (examId) {
            const exam = await Exam.findById(examId);
            if (!exam) {
              return res.status(404).json({ message: "Exam not found" });
            }
            const questionBank = await QuestionBank.findById(exam.questionBankId);
            if (!questionBank) {
              return res.status(404).json({ message: "Question bank not found" });
            }
    
            const questionStats = questionBank.questions.map((q) => ({
              questionId: q._id,
              questionText: q.questionText,
              difficulty: q.difficulty,
            }));
    
            // Attach questionStatistics to each report (should be one report if examId is provided)
            reports.forEach((report) => {
              report.questionStatistics = questionStats;
            });
          }
    
          // Optionally, create and save an ExamReport document for each aggregated report
          for (const report of reports) {
            // If examId is not provided, fetch exam details for each report
            let examDoc;
            if (examId) {
              examDoc = await Exam.findById(examId);
            } else {
              examDoc = await Exam.findById(report.examId);
            }
            let dateRange = {};
            if (examDoc && examDoc.schedule) {
              dateRange = {
                startDate: examDoc.schedule.startDateTime,
                durationMinutes: examDoc.schedule.durationMinutes,
              };
            }
            const examReport = new ExamReport({
              exam: report.examId,
              title: report.examTitle,
              averageScore: report.averageScore,
              totalAttempts: report.totalAttempts,
              highestScore: report.highestScore,
              lowestScore: report.lowestScore,
              questionStatistics: report.questionStatistics || [],
              dateRange,
            });
            await examReport.save();
        }
        res.status(200).json({ reports });
        } catch (error) {
            next(error)
        }
    },

    getExamReportByExamId: async (req, res, next) => {
        try {
            const { examId } = req.params;

            const exam = await Exam.findById(examId);


            const questionBankId = exam.questionBankId;
            const questionBank = await QuestionBank
                .findById(questionBankId);

            if (!exam) {
                return res.status(404).json({
                    message: "Exam not found"
                });
            }

            if (!questionBank) {
                return res.status(404).json({
                    message: "Question bank not found"
                });
            }

            const questions = questionBank.questions
                .map((question) => {
                    return {
                        questionId: question._id,
                        questionText: question.questionText,
                        difficulty: question.difficulty,
                    }
                })

            const report = await ExamAttempt
                .aggregate([
                    {
                        $match: {
                            exam: new mongoose.Types
                                .ObjectId(examId,)
                        }
                    },

                    {
                        $group: {
                            _id: "$exam",
                            averageScore: { $avg: "$score" },
                            totalAttempts: { $sum: 1 },
                            highestScore: { $max: "$score" },
                            lowestScore: { $min: "$score" }
                        }
                    },

                    {
                        $lookup: {
                            from: "exams",
                            localField: "_id",
                            foreignField: "_id",
                            as: "examDetails"
                        }
                    },

                    { $unwind: "$examDetails" },

                    {
                        $project: {
                            examId: "$_id",
                            examTitle: "$examDetails.title",
                            averageScore: 1,
                            totalAttempts: 1,
                            highestScore: 1,
                            lowestScore: 1,
                            questionStatistics: questions,
                        }
                    }
                ]);

            if (!report || report.length === 0) {
                return res.status(404).json({
                    error: "Exam report not found"
                });
            }

            res.status(200).json({
                report
            });
        } catch (error) {
            next(error)
        }
    },

    getUserPerformanceAnalytics: async (req, res, next) => {
        try {
          const { userId } = req.params;
      
          // Step 1: Match all exam attempts for the given user.
          // Step 2: Sort by createdAt descending so that the most recent attempt appears first.
          // Step 3: Group by both student and exam to get one (latest) attempt per exam.
          // Step 4: Group by student to compute overall statistics and compile exam history.
          const analytics = await ExamAttempt.aggregate([
            {
              $match: {
                student: new mongoose.Types.ObjectId(userId)
              }
            },
            { $sort: { createdAt: -1 } },
            {
              $group: {
                _id: { student: "$student", exam: "$exam" },
                score: { $first: "$score" },
                totalQuestions: { $first: "$totalQuestions" },
                date: { $first: "$createdAt" }
              }
            },
            {
              $group: {
                _id: "$_id.student",
                averageScore: { $avg: "$score" },
                totalExams: { $sum: 1 },
                examHistory: {
                  $push: {
                    exam: "$_id.exam",
                    score: "$score",
                    date: "$date",
                    totalQuestions: "$totalQuestions"
                  }
                }
              }
            }
          ]);
      
          if (!analytics || analytics.length === 0) {
            return res.status(404).json({
              error: "User performance data not found"
            });
          }
      
          const { _id, averageScore, totalExams, examHistory } = analytics[0];
      
          const userReport = new UserReport({
            user: _id,
            examHistory,
            averageScore,
            totalExams,
          });
      
          await userReport.save();
      
          res.status(200).json({
            analytics: analytics[0]
          });
        } catch (error) {
          next(error);
        }
      },

    getDashboardSummary: async (req, res, next) => {
        try {
            // Count total exams from the Exam collection.
            const totalExams = await Exam.countDocuments();

            const totalStudents = await User
                .countDocuments({
                    role: "student"
                });

            const flaggedProctoringIncidents =
                await ProctoringSession.countDocuments(
                    { sessionStatus: "flagged" }
                );

            // Calculate overall average exam score from ExamAttempt.
            const avgScoreAgg = await ExamAttempt
            .aggregate([
                {
                    $group: {
                        _id: null,
                        averageExamScore: { 
                            $avg: "$score" 
                        }
                    }
                }
            ]);

            const averageExamScore = avgScoreAgg
            .length ? avgScoreAgg[0]
            .averageExamScore : 0;

            const dashboard = {
                totalExams,
                totalStudents,
                flaggedProctoringIncidents,
                averageExamScore
            };

            res.status(200).json({ dashboard });
        } catch (error) {
            next(error)
        }
    },

    getAllUsersPerformanceAnalytics: async (req, res, next) => {
        try {
          const userReports = await ExamAttempt.aggregate([
            { $sort: { createdAt: -1 } },
            {
              $group: {
                _id: { student: "$student", exam: "$exam" },
                score: { $max: "$score" }, // Use $max if you want the highest score
                totalQuestions: { $max: "$totalQuestions" },
                date: { $first: "$createdAt" }
              },
            },
            {
              $group: {
                _id: "$_id.student",
                averageScore: { $avg: "$score" },
                totalExams: { $sum: 1 },
                examHistory: {
                  $push: {
                    exam: "$_id.exam",
                    score: "$score",
                    totalQuestions: "$totalQuestions",
                    date: "$date"
                  }
                }
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "userDetails"
              }
            },
            { $unwind: "$userDetails" },
            // Exclude admin users
            {
              $match: {
                "userDetails.role": { $ne: "admin" }
              }
            },
            {
              $project: {
                userId: "$_id",
                studentName: "$userDetails.name",
                studentEmail: "$userDetails.email",
                averageScore: 1,
                totalExams: 1,
                examHistory: 1
              }
            },

            // --- New Lookup for Proctoring Sessions ---
            {
              $lookup: {
                from: "proctoringsessions", // the collection name in MongoDB (usually lowercase and plural)
                localField: "_id", // the student id from our grouping
                foreignField: "student", // field in ProctoringSession referencing the student
                as: "proctorSessions"
              }
            }
          ]);
      
          res.status(200).json({ analytics: userReports });
        } catch (error) {
          next(error);
        }
      },
      
      
}