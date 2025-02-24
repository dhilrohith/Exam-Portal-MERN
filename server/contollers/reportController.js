import mongoose from 'mongoose';

import Exam from '../models/exam.js';

import ExamAttempt from '../models/examAttempt.js';

import ExamReport from '../models/examReports.js';

import QuestionBank from '../models/questionBank.js';

import UserReport from '../models/userReport.js';

import User from '../models/users.js';

import ProctoringSession from
    '../models/proctoringSession.js'

export const reportController = {
    getExamReports: async (req, res, next) => {
        try {
            const {
                startDate, endDate, examId
            } = req.query;

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

            const match = {};

            if (examId) {
                match.exam = new mongoose.Types.ObjectId(examId);
            }

            if (startDate || endDate) {
                match.createdAT = {};

                if (startDate) {
                    match.createdAT.$gte = new Date(
                        startDate
                    );
                }

                if (endDate) {
                    match.createdAT.$lte = Date(endDate)
                }
            }

            // aggregate examAttempts grouped by exam
            const reports = await ExamAttempt
                .aggregate([
                    { $match: match },
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

            reports.forEach((report) => {
                const examReport = new ExamReport({
                    exam: report.examId,

                    title: report.examTitle,

                    averageScore: report.averageScore,

                    totalAttempts: report.totalAttempts,

                    highestScore: report.highestScore,

                    lowestScore: report.lowestScore,

                    questionStatistics: questions,

                    dateRange: {
                        startDate: exam.schedule
                            .startDateTime,

                        durationMinutes: exam.schedule
                            .durationMinutes,
                    }
                });

                examReport.save();
            })
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

    getUserPerformanceAnalytics:
        async (req, res, next) => {
            try {
                const { userId } = req.params;

                // aggregate the exam attempts of 
                // the specified user.
                const analytics = await ExamAttempt
                    .aggregate([
                        {
                            $match: {
                                student: new mongoose.Types
                                    .ObjectId(userId)
                            },
                        },

                        {
                            $group: {
                                _id: "$student",

                                averageScore: { $avg: "$score" },

                                totalExams: { $sum: 1 },

                                examHistory: {
                                    $push: {
                                        exam: "$exam",
                                        score: "$score",
                                        date: "$createdAt",
                                        totalQuestions: "$totalQuestions",
                                    }
                                },
                            }
                        }
                    ]);

                if (!analytics || analytics.length === 0) {
                    return res.status(404).json({
                        error:
                            "User performance data not found"
                    });
                }

                const {
                    _id,
                    averageScore,
                    totalExams,
                    examHistory,
                } = analytics[0]

                const userReport = new UserReport({
                    user: _id,
                    examHistory,
                    averageScore,
                    totalExams,
                })

                await userReport.save();

                res.status(200).json({
                    analytics: analytics[0]
                });


            } catch (error) {
                next(error)
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
    }
}