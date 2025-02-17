import QuestionBank from '../models/questionBank.js';

export const questionController = {
    createQuestion: async (req, res, next)=>{
        try{
            const {bankId} = req.params;
            
            const questionBank = 
            await QuestionBank.findById(bankId);

            const {
                type,
                questionText,
                options,
                correctAnswer,
                topic,
                difficulty,
                examType,
                explanation
            } = req.body;

            if(!questionBank){
                return res.status(404).json({
                    error: 'Question bank not found'
                });
            }

            // create a new question object
            const question = {
                type,
                questionText,
                options,
                correctAnswer,
                topic,
                difficulty,
                examType,
                explanation
            }

            questionBank.questions.push(question);
            await questionBank.save();

            res.status(202).json({
                message: 'Question added successfully',
                questionBank,
            });

        } catch(error){
            next(error)
        }
    },

    updateQuestionInBank: async(req, res, next)=>{
        try{
            const {bankId, questionId} = req.params;

            const questionBank = await QuestionBank
            .findById(bankId);

            if(!questionBank){
                return res.status(404).json({
                    error: 'Question bank not found'
                });
            }

            // find the question by its subdocument id
            const question = questionBank.questions
            .id(questionId);

            if(!question){
                return res.status(404).json({
                    error: 'Question not found'
                });
            }

            // allowed fields for the question update
            const allowedFields = [
                'type', 
                'questionText', 
                'options', 
                'correctAnswer', 
                'topic', 
                'difficulty', 
                'examType', 
                'explanation'
            ]

            allowedFields.forEach((field)=>{
                if(req.body[field] !== undefined){
                    question[field] = req.body[field];
                }
            });

            await questionBank.save();
            res.json({
                message: 'Question updated successfully',
                questionBank,
              });

        } catch(error){
            next(error);
        }
    },

    deleteQuestionInBank: async (req, res, next)=>{
        try{
            const {bankId, questionId} = req.params;

            const questionBank = await QuestionBank
            .findById(bankId);

            if(!questionBank){
                return res.status(404).json({
                    error: 'Question bank not found'
                });
            }

            // get question by it subdocument id
            const question = questionBank.questions
            .id(questionId);

            if(!question){
                return res.status(404).json({
                    error: 'Question not found'
                });
            }

            question.deleteOne();
            await questionBank.save();
            res.json({
                message: 
                "Question deleted successfully in question bank",
                question,
            });

        } catch(error){
            next(error)
        }
    }
}