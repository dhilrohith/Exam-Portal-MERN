import mongoose from 'mongoose';

const {Schema} = mongoose;

const QuestionSchema = new Schema({
    type: {
        type: String,
        enum: ['multiple-choice', 'true-fals'],
        required: 
        [true, 'please specify the question type'],
    },

    questionText: {
        type: String,
        required: [true, 'question text is required'],
    },

    // array of options for multiple-choice 
    options: {
        type:[String],

        // for multiple choice validate the options
        // are atleast two
        validate: function(value){
            if(this.type === 'multiple-choice'){
                return Array.isArray(value)&&
                value.length >=2;
            }

            // for true/false, options are not required
            return true; 
        },

        message: `multiple choice question must have
        atleast two options`,
    },

    correctAnswer: {
        type: String,
        required: [true, 'correct answer is required.'],
    },

    topic: {
        type: String,
        required: [true, 'Topic is required.'],
    },

    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: [true, 'Difficulty is required.'],
    },

    examType: String,

    explanation: {
        type: String
    },

   },

   {timeStamps: true}
);

// Define the main QuestionBank schema
const QuestionBankSchema = new Schema(
    {
      // Title of the question bank
      title: {
        type: String,
        required: [true, 'Title is required.'],
        trim: true,
      },
      // Description of the question bank
      description: {
        type: String,
        required: [true, 'Description is required.'],
      },
      // Category to classify the question bank (e.g., "Programming", "Math")
      category: {
        type: String,
        required: [true, 'Category is required.'],
      },
      // Optional exam type field to further classify the bank
      examType: {
        type: String,
      },
      // Array of questions contained in the bank
      questions: [QuestionSchema],
    },
    { timestamps: true }
);

  export default mongoose.model(
    'QuestionBank', QuestionBankSchema
  )