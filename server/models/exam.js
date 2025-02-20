// models/Exam.js
import mongoose from 'mongoose';

const {Schema} = mongoose;

// Define a sub-schema for exam scheduling details
const ScheduleSchema = new Schema(
    {
        // Start date and time for the exam
        startDateTime: {
          type: Date,
          required: [true, 'Start date and time are required.'],
        },
        // Total duration of the exam in minutes
        durationMinutes: {
          type: Number,
          required: [true, 'Exam duration (in minutes) is required.'],
        },
        // Optional: Time limit per question (in seconds) if needed
        timeLimitPerQuestion: {
          type: Number,
          required: false,
        },
      },
      { _id: false } // Prevent creation of an _id for the subdocument
)

const ExamSchema = new Schema(
    {
        // Title of the exam
        title: {
          type: String,
          required: [true, 'Exam title is required.'],
          trim: true,
        },
        // Description of the exam, including any exam instructions
        description: {
          type: String,
          required: [true, 'Exam description is required.'],
        },
        // Reference to the associated Question Bank
        questionBankId: {
          type: Schema.Types.ObjectId,
          ref: 'QuestionBank',
          required: [true, 'A valid Question Bank reference is required.'],
        },
        // Schedule details for the exam
        schedule: {
          type: ScheduleSchema,
          required: [true, 'Exam schedule is required.'],
        },
        // Indicates if proctoring is required during the exam
        proctorRequired: {
          type: Boolean,
          default: false,
        },
        // Array of enrolled student IDs (references to User model)
        enrolledStudents: [
          {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
        // Exam status to indicate whether the exam is scheduled, ongoing, or completed
        status: {
          type: String,
          enum: ['scheduled', 'ongoing', 'completed'],
          default: 'scheduled',
        },
      },
      { timestamps: true } // Automatically add createdAt and updatedAt fields
)

export default mongoose.model('Exam', ExamSchema);