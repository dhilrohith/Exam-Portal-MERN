import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EditExam = () => {
  const { examId } = useParams();

  console.log('Exam ID from URL:', examId);
  
  const navigate = useNavigate();

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
          timeLimitPerQuestion: timeLimitPerQuestion ? Number(timeLimitPerQuestion) : undefined,
        },
        proctorRequired,
        status: 'scheduled',
      };
      await api.put(`/exams/${examId}`, examPayload);
      console.log('Exam updated successfully');
      window.alert("Exam created successfully");
      // Optionally, redirect to exam detail or list page
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Error updating exam:', error);
    }
  };

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
          <div>
            <label className="block text-gray-700">Exam Title</label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              required
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Exam Description</label>
            <textarea
              value={examDescription}
              onChange={(e) => setExamDescription(e.target.value)}
              required
              disabled={!isEditing}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Start Date &amp; Time</label>
            <input
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              required
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              required
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Time Limit Per Question (sec)</label>
            <input
              type="number"
              value={timeLimitPerQuestion}
              onChange={(e) => setTimeLimitPerQuestion(e.target.value)}
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              checked={proctorRequired}
              onChange={(e) => setProctorRequired(e.target.checked)}
              disabled={!isEditing}
              className="mr-2"
            />
            <label className="text-gray-700">Proctor Required</label>
          </div>
        </div>

        {/* Question Bank Details */}
        <h3 className="text-xl font-semibold mt-8 mb-2">Question Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Question Bank Title</label>
            <input
              type="text"
              value={qbTitle}
              onChange={(e) => setQbTitle(e.target.value)}
              required
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Question Bank Description</label>
            <textarea
              value={qbDescription}
              onChange={(e) => setQbDescription(e.target.value)}
              required
              disabled={!isEditing}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Exam Type</label>
            <input
              type="text"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Questions */}
        <h3 className="text-xl font-semibold mt-8 mb-2">Questions</h3>
        {questions.map((q, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md">
            <div className="mb-2">
              <label className="block text-gray-700">Question Text</label>
              <input
                type="text"
                value={q.questionText}
                onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                required
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Question Type</label>
              <select
                value={q.type}
                onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-fals">True/False</option>
              </select>
            </div>
            {q.type === 'multiple-choice' && (
              <div className="mb-2">
                <label className="block text-gray-700">Options (comma separated)</label>
                <input
                  type="text"
                  value={q.options.join(',')}
                  onChange={(e) =>
                    handleQuestionChange(index, 'options', e.target.value.split(','))
                  }
                  required
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            )}
            <div className="mb-2">
              <label className="block text-gray-700">Correct Answer</label>
              <input
                type="text"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                required
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Topic</label>
              <input
                type="text"
                value={q.topic}
                onChange={(e) => handleQuestionChange(index, 'topic', e.target.value)}
                required
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Difficulty</label>
              <select
                value={q.difficulty}
                onChange={(e) => handleQuestionChange(index, 'difficulty', e.target.value)}
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Explanation (optional)</label>
              <textarea
                value={q.explanation}
                onChange={(e) => handleQuestionChange(index, 'explanation', e.target.value)}
                rows="2"
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              ></textarea>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="!bg-red-500 text-white px-3 py-1 rounded"
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
            className="!bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Question
          </button>
        )}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 !bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 !bg-green-500 text-white rounded"
          >
            Save Exam
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExam;
