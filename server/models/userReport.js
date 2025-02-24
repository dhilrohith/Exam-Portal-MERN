// models/UserReport.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const ExamHistorySchema = new Schema(
  {
    // Reference to the exam taken
    exam: {
      type: Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    // The score the student received for that exam
    score: {
      type: Number,
      required: true,
    },
    // Total questions in the exam
    totalQuestions: {
      type: Number,
      required: true,
    },
    // Date when the exam was taken
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const ProgressTrendSchema = new Schema(
  {
    // Date of the recorded trend snapshot
    date: {
      type: Date,
      required: true,
    },
    // The average score up to that date or for that period
    averageScore: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const UserReportSchema = new Schema(
  {
    // Reference to the student (User)
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // An array of exam history records for the student
    examHistory: {
      type: [ExamHistorySchema],
      default: [],
    },
    // Overall average score calculated from examHistory
    averageScore: {
      type: Number,
      default: 0,
    },
    // Trend data showing progress over time
    totalExams: {
      type: Number,
      default: 0 ,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('UserReport', UserReportSchema);
