import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ResultSchema = new Schema(
    {
        // Reference ID of the question (optional, can be used to look up details)
        questionId: {
          type: Schema.Types.ObjectId,
          ref: 'QuestionBank', // or a specific Question model if you split it out
          required: true,
        },
        // The text of the question for feedback purposes
        questionText: {
          type: String,
          required: true,
        },
        // The answer provided by the student
        studentAnswer: {
          type: String,
        },
        // The correct answer for the question
        correctAnswer: {
          type: String,
          required: true,
        },
        // Boolean indicating if the student's answer is correct
        isCorrect: {
          type: Boolean,
          required: true,
        },
        // Optional explanation for the correct answer
        explanation: {
          type: String,
        },
    },

    { _id: false } // Prevent Mongoose from creating an _id for subdocuments
);

// main exam attempt schema
const ExamAttemptSchema = new Schema(
    {
        // Reference to the Exam the student is attempting
        exam: {
          type: Schema.Types.ObjectId,
          ref: 'Exam',
          required: [true, 'Exam reference is required.'],
        },
        // Reference to the Student (User) taking the exam
        student: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: [true, 'Student reference is required.'],
        },
        // A map storing answers where each key is a question ID and the value is the student's answer
        answers: {
          type: Map,
          of: String,
          default: {},
        },
        // Optionally store the ID of the current question for auto-save/resume functionality
        currentQuestion: {
          type: String,
        },
        // Status of the exam attempt: 'in-progress' for an ongoing exam or 'submitted' after final submission
        status: {
          type: String,
          enum: ['in-progress', 'submitted'],
          default: 'in-progress',
        },
        // The total score obtained after grading
        score: {
          type: Number,
          default: 0,
        },
        // The total number of questions in the exam, stored for calculating performance metrics
        totalQuestions: {
          type: Number,
          default: 0,
        },
        // Array of detailed results for each question for feedback purposes
        results: [ResultSchema],
    },

    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

export default mongoose.model(
    'ExamAttempt', ExamAttemptSchema
);