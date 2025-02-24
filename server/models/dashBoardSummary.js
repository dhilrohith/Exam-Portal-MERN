// models/DashboardSummary.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const DashboardSummarySchema = new Schema(
  {
    // Total number of exams in the system
    totalExams: {
      type: Number,
      default: 0,
    },
    // Total number of registered students
    totalStudents: {
      type: Number,
      default: 0,
    },
    // Number of flagged proctoring incidents (from ProctoringSession data)
    flaggedProctoringIncidents: {
      type: Number,
      default: 0,
    },
    // Overall average exam score across all exams (if applicable)
    averageExamScore: {
      type: Number,
      default: 0,
    },
    // Additional fields can be added as needed
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('DashboardSummary', DashboardSummarySchema);
