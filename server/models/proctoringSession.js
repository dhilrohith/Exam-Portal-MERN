// models/ProctoringSession.js
import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * ProctoringEventSchema:
 * Captures individual proctoring events during a session.
 * Each event logs the event type, timestamp, and optional details.
 */
const ProctoringEventSchema = new Schema(
  {
    // Type of event, e.g., "browserSwitch", "faceNotDetected", "suspiciousActivity"
    eventType: {
      type: String,
      required: [true, 'Event type is required.'],
    },
    // Timestamp of when the event occurred
    timestamp: {
      type: Date,
      required: [true, 'Event timestamp is required.'],
      default: Date.now,
    },
    // Additional details or context for the event
    details: {
      type: String,
      default: '',
    },
  },
  { _id: false } // Prevent automatic creation of _id for subdocuments
);

/**
 * ProctoringSessionSchema:
 * Represents a proctoring session for an exam.
 */
const ProctoringSessionSchema = new Schema(
  {
    // Reference to the exam being proctored
    exam: {
      type: Schema.Types.ObjectId,
      ref: 'Exam',
      required: [true, 'Exam reference is required.'],
    },
    // Reference to the student taking the exam
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required.'],
    },
    // Optionally, reference to a proctor if one is assigned to monitor the session
    proctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    // The start time of the proctoring session
    sessionStart: {
      type: Date,
      default: Date.now,
      required: true,
    },
    // The end time of the session (if the session is completed)
    sessionEnd: {
      type: Date,
    },
    // Array of logged proctoring events for this session
    events: {
      type: [ProctoringEventSchema],
      default: [],
    },
    // Flag indicating whether the student's identity has been verified
    identityVerified: {
      type: Boolean,
      default: false,
    },
    // Status of the session: active, completed, or flagged (if suspicious behavior detected)
    sessionStatus: {
      type: String,
      enum: ['active', 'completed', 'flagged'],
      default: 'active',
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

export default mongoose.model('ProctoringSession', ProctoringSessionSchema);
