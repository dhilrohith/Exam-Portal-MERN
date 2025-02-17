import QuestionBank from '../models/quetionBank.js';

export const questionBankController = {
    createQuestionBank: async (req, res, next)=>{
        try{
            const {
                title, description, category, examType
            } = req.body;

            const questionBank = new QuestionBank({
                title,
                description,
                category,
                examType,
            });
            await questionBank.save();

            res.json({
                message: 'Question bank created successfully',
                questionBank,
            });

        } catch(error){
            next(error)
        }
    },

    getAllQuestionBanks: async (req, res, next)=>{
        try{
            const questionBanks = 
            await QuestionBank.find();

            res.json({questionBanks});

        } catch(error){
            next(error);
        }
    },

    getQuestionBankById: async (req, res, next)=>{
        try{
            const {bankId} = req.params;

            const questionBank = 
            await QuestionBank.findById(bankId);

            if(!questionBank){
                return res.status(404)
                .json({
                    error: 'Question bank not found' 
                });
            }

            res.json({questionBank});

        } catch(error){
            next(error)
        }
    },

    updateQuestionBank: async (req, res, next)=>{
        try{
            const {bankId} = req.params;

            const questionBank = 
            await QuestionBank.findById(bankId);

            if(!questionBank){
                return res.status(404)
                .json({
                    error: 'Question bank not found'
                })
            }

            const allowedChanges = [
                "title", "description", "category",
                "type"
            ];

            allowedChanges.forEach((field)=>{
                if(req.body[field] !== undefined){
                    questionBank[field] = 
                    req.body[field];
                }
            });

            await questionBank.save();

            res.json({
                message: 
                `Question bank updated successfully`,
                questionBank
            })

        } catch(error){
            next(error);
        }
    },

    deleteQuestionBank: async (req, res, next)=>{
        try{
            const id = req.params.bankId;

            const questionBank = 
            await QuestionBank.findById(id);

            if(!questionBank){
                return res.status(404)
                .json({
                    error: 'Question bank not found'
                });
            }
            
            await questionBank.deleteOne();
            res.json(
                { message: 
                    'Question bank deleted successfully' 
                }
            );

        } catch(error){
            next(error);
        }
    }
}