import Exam from '../models/exam.js'

export const examController= {
    createExam: async (req, res, next)=>{
        try{
            const {
                title,
                description,
                questionBankId,
                schedule,
                proctorRequired
            } = req.body;

            const exam = new Exam({
                title,
                description,
                questionBankId,
                schedule,
                proctorRequired
            });

            await exam.save();

            res.status(201).json({
                message: "Exam created successfully",
                exam,
            })
        } catch(error){
            next(error);
        }
    }
}