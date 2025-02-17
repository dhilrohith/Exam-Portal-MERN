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
    }
}