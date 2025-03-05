import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';

const EditExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  // Logging exam ID for debugging
  console.log('Exam ID from URL:', examId);

  // Exam details state
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [timeLimitPerQuestion, setTimeLimitPerQuestion] = useState('');
  const [proctorRequired, setProctorRequired] = useState(false);
  const [questionBankId, setQuestionBankId] = useState('');

  // Question bank details state
  const [qbTitle, setQbTitle] = useState('');
  const [qbDescription, setQbDescription] = useState('');
  const [category, setCategory] = useState('');
  const [examType, setExamType] = useState('');

  // Questions array state
  const [questions, setQuestions] = useState([]);

  // Toggle edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Loading state for spinner
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        // Fetch exam details
        const examRes = await api.get(`/exams/${examId}`);
        const examData = examRes.data.exam;

        setExamTitle(examData.title || '');
        setExamDescription(examData.description || '');
        setStartDateTime(
          examData.schedule?.startDateTime
            ? examData.schedule.startDateTime.substring(0, 16)
            : ''
        );
        setDurationMinutes(examData.schedule?.durationMinutes || '');
        setTimeLimitPerQuestion(examData.schedule?.timeLimitPerQuestion || '');
        setProctorRequired(examData.proctorRequired || false);
        setQuestionBankId(examData.questionBankId);

        // Fetch question bank details using the exam's questionBankId
        const qbRes = await api.get(`/questionBanks/${examData.questionBankId}`);
        const qbData = qbRes.data.questionBank || qbRes.data;
        setQbTitle(qbData.title || '');
        setQbDescription(qbData.description || '');
        setCategory(qbData.category || '');
        setExamType(qbData.examType || '');
        setQuestions(qbData.questions || []);
      } catch (error) {
        console.error('Error fetching exam data:', error);
      }
    };

    fetchExamData();
  }, [examId]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: 'multiple-choice',
        questionText: '',
        options: ['', ''],
        correctAnswer: '',
        topic: '',
        difficulty: 'Easy',
        explanation: '',
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update question bank details
      const qbPayload = {
        title: qbTitle,
        description: qbDescription,
        category,
        examType,
        questions,
      };
      await api.put(`/questionBanks/${questionBankId}`, qbPayload);

      // Update exam details
      const examPayload = {
        title: examTitle,
        description: examDescription,
        schedule: {
          startDateTime: new Date(startDateTime),
          durationMinutes: Number(durationMinutes),
          timeLimitPerQuestion: timeLimitPerQuestion
            ? Number(timeLimitPerQuestion)
            : undefined,
        },
        proctorRequired,
        status: 'scheduled',
      };
      await api.put(`/exams/${examId}`, examPayload);

      console.log('Exam updated successfully');
      window.alert('Exam updated successfully');

      // Optionally, redirect to exam detail or list page
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating exam:', error);
      window.alert('Error updating exam. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // If loading, show spinner
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Edit Exam</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isEditing ? 'Stop Editing' : 'Edit'}
        </button>
      </div>
      <form onSubmit={handleUpdate}>
        {/* Exam Details */}
        <h3 className="text-xl font-semibold mb-2">Exam Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ... existing form fields for examTitle, examDescription, etc. */}
          {/* no changes needed here, just keep the same fields */}
        </div>

        {/* Question Bank Details */}
        <h3 className="text-xl font-semibold mt-8 mb-2">Question Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ... existing form fields for qbTitle, qbDescription, etc. */}
        </div>

        {/* Questions */}
        <h3 className="text-xl font-semibold mt-8 mb-2">Questions</h3>
        {questions.map((q, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md">
            {/* ... existing question fields */}
            {isEditing && (
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove Question
              </button>
            )}
          </div>
        ))}
        {isEditing && (
          <button
            type="button"
            onClick={addQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Question
          </button>
        )}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Save Exam
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExam;
