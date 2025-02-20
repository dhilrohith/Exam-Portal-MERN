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
    },

    getAllExams: async (req, res, next)=>{
        try{
            let exams;

            exams = await Exam.find();

            res.json({ exams });
        } catch(error){
            next(error)
        }
    },

    getExamById: async (req, res, next)=>{
        try{
            const {examId} = req.params;

            const exam = await Exam.findById(examId);

            if(!exam){
                return res.status(404).json({
                    error: "Exam not found"
                });
            }

            res.json({
                message: 
                "Exam returned successfully",
                exam
            })
        } catch(error){
            next(error)
        }
    },

    updateExam: async (req, res, next)=>{
        try{
            const {examId} = req.params;

            const exam = await Exam.findById(examId);

            if(!exam){
                return res.status(404).json({
                    error: "Exam not found"
                })
            }

            const allowedUpdate = [
                'title', 
                'description', 
                'questionBankId', 
                'schedule', 
                'proctorRequired'
            ]

            allowedUpdate.forEach((field)=>{
                if(req.body[field] !== undefined){
                    exam[field] = req.body[field]
                }
            });

            await exam.save();

            res.json({
                message: 'Exam updated successfully',
                exam,
              });            
        } catch(error){
            next(error)
        }
    }
}