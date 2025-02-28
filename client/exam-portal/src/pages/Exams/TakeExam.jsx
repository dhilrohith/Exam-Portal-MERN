import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import { useNavigate } from 'react-router-dom';

function TakeExam() {
  const { examId } = useParams();
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const startExam = async () => {
      try {
        const { data } = await api.get(`/exams/${examId}/start`);
        // console.log('Fetched exam data:', data);
        // Set examData from data.exam, questions from data.questions, and attemptId from data.attemptId
        setExamData(data.exam);
        setQuestions(data.questions);
        setAttemptId(data.attemptId);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to start exam');
      } finally {
        setLoading(false);
      }
    };

    startExam();
  }, [examId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await api.post(`/exams/${examId}/submit`, { attemptId, answers });
      window.alert("Submitted Successfully");
      navigate(`/exams/${examId}/results?attemptId=${attemptId}`);
      // Handle navigation or display results here.
    } catch (err) {
      console.error('Submission error:', err.response?.data);
      setError(err.response?.data?.error || 'Submission failed');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  // Ensure questions defaults to an empty array if undefined.
  const safeQuestions = questions || [];

  if (safeQuestions.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <p>No questions available for this exam.</p>
      </div>
    );
  }

  const currentQuestion = safeQuestions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">{examData.title}</h1>
      <div className="mb-4">
        <p>
          <strong>Question {currentQuestionIndex + 1}:</strong>{' '}
          {currentQuestion.questionText}
        </p>
        {currentQuestion.options && (
          <ul className="mt-2">
            {currentQuestion.options.map((option, index) => (
              <li key={index} className="mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`question-${currentQuestion._id}`}
                    value={option}
                    onChange={() =>
                      handleAnswerChange(currentQuestion._id, option)
                    }
                    className="form-radio"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex justify-between">
        <button
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {currentQuestionIndex < safeQuestions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit Exam
          </button>
        )}
      </div>
    </div>
  );
}

export default TakeExam;
