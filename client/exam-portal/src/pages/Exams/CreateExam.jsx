import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateExam = () => {
  const navigate = useNavigate();

  // Exam details state
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [timeLimitPerQuestion, setTimeLimitPerQuestion] = useState('');
  const [proctorRequired, setProctorRequired] = useState(false);

  // Question bank details state
  const [qbTitle, setQbTitle] = useState('');
  const [qbDescription, setQbDescription] = useState('');
  const [category, setCategory] = useState('');
  const [examType, setExamType] = useState('');

  // Questions array state
  const [questions, setQuestions] = useState([
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create the question bank first
      const qbPayload = {
        title: qbTitle,
        description: qbDescription,
        category,
        examType,
        questions,
      };
  
      const qbResponse = await api.post('/questionBanks', qbPayload);
      console.log('Question Bank Response:', qbResponse.data);
      const questionBankId = qbResponse.data.questionBank._id;
      console.log('Question Bank created with ID:', questionBankId);

      // Now create the exam with the returned question bank ID
      const examPayload = {
        title: examTitle,
        description: examDescription,
        questionBankId,
        schedule: {
          startDateTime: new Date(startDateTime), // Convert to Date
          durationMinutes: Number(durationMinutes), // Convert to number
          timeLimitPerQuestion: timeLimitPerQuestion ? Number(timeLimitPerQuestion) : undefined,
        },
        proctorRequired,
        status: 'scheduled',
      };
  
      const examResponse = await api.post('/exams', examPayload);
      console.log('Exam created:', examResponse.data);
      // Make sure you use the correct property:
      const examId = examResponse.data.exam ? examResponse.data.exam._id : examResponse.data._id;
      navigate(`/exams/${examId}/edit`);
      
    } catch (error) {
      if (error.response) {
        console.error('Server responded with:', error.response.status);
        console.error('Response data:', error.response.data);
      } else {
        console.error('Error creating exam:', error.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Create Exam</h2>
      <form onSubmit={handleSubmit}>
        {/* Exam Details */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Exam Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Exam Title</label>
              <input
                type="text"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Exam Description</label>
              <textarea
                value={examDescription}
                onChange={(e) => setExamDescription(e.target.value)}
                required
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
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Time Limit Per Question (sec)</label>
              <input
                type="number"
                value={timeLimitPerQuestion}
                onChange={(e) => setTimeLimitPerQuestion(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                checked={proctorRequired}
                onChange={(e) => setProctorRequired(e.target.checked)}
                className="mr-2"
              />
              <label className="text-gray-700">Proctor Required</label>
            </div>
          </div>
        </div>

        {/* Question Bank Details */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Question Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Question Bank Title</label>
              <input
                type="text"
                value={qbTitle}
                onChange={(e) => setQbTitle(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Question Bank Description</label>
              <textarea
                value={qbDescription}
                onChange={(e) => setQbDescription(e.target.value)}
                required
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
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Exam Type</label>
              <input
                type="text"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Questions</h3>
          {questions.map((q, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md">
              <div className="mb-2">
                <label className="block text-gray-700">Question Text</label>
                <input
                  type="text"
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Question Type</label>
                <select
                  value={q.type}
                  onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="multiple-choice"
                  className='text-black'>
                    Multiple Choice
                  </option>
                  <option value="true-fals"
                  className='text-black'>
                    True/False
                  </option>
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
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Difficulty</label>
                <select
                  value={q.difficulty}
                  onChange={(e) => handleQuestionChange(index, 'difficulty', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="Easy"
                  className='text-black'>
                    Easy
                  </option>
                  <option value="Medium"
                  className='text-black'>
                    Medium
                  </option>
                  <option value="Hard"
                  className='text-black'>
                    Hard
                  </option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Explanation (optional)</label>
                <textarea
                  value={q.explanation}
                  onChange={(e) => handleQuestionChange(index, 'explanation', e.target.value)}
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                ></textarea>
              </div>
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="!bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove Question
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="!bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Question
          </button>
        </div>

        <div className="flex justify-end space-x-4">
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
            Create Exam
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExam;
