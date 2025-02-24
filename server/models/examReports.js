// models/ExamReport.js
import mongoose from 'mongoose';
import { text } from 'stream/consumers';

const { Schema } = mongoose;

const QuestionStatisticsSchema = new Schema(
  {
    // Reference to the question (could be the question's ObjectId)
    questionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    // Text of the question for display purposes
    questionText: {
      type: String,
      required: true,
    },

    // Optional difficulty level (if applicable)
    difficulty: {
      type: String,
    },
  },
  { _id: false }
);

const ExamReportSchema = new Schema(
  {
    // Reference to the exam being reported on
    exam: {
      type: Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },

    title: {
      type: Schema.Types.String,
      ref: 'Exam',
      required: true,
    },

    // Overall average score for the exam
    averageScore: {
      type: Number,
      required: true,
    },
    // Total number of exam attempts
    totalAttempts: {
      type: Number,
      required: true,
    },
    // Highest and lowest scores achieved
    highestScore: {
      type: Number,
      required: true,
    },
    lowestScore: {
      type: Number,
      required: true,
    },
    // Detailed statistics for each question in the exam
    questionStatistics: {
      type: [QuestionStatisticsSchema],
      default: [],
    },
    // Optional date range the report covers
    dateRange: {
      startDate: Date,
      durationMinutes: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ExamReport', ExamReportSchema);
