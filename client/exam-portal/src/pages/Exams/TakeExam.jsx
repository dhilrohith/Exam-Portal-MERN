import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';

function TakeExam() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [proctorSessionId, setProctorSessionId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // For proctor warnings
  const [showWarning, setShowWarning] = useState(false);

  // --- NEW: Timer State ---
  const [timeRemaining, setTimeRemaining] = useState(null);

  // for exam expired
  const [examExpired, setExamExpired] = useState(false);


  // Start exam and proctoring session
  useEffect(() => {
    const startExamAndProctor = async () => {
      try {
        // Start exam: assume backend returns exam data, questions, attemptId, etc.
        const examResponse = await api.get(`/exams/${examId}/start`);
        const data = examResponse.data;
        setExamData(data.exam);
        setQuestions(data.questions);
        setAttemptId(data.attemptId);

        // Start proctoring session
        const proctorResponse = await api.post('/proctoring/start', { examId });
        setProctorSessionId(proctorResponse.data.session._id);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to start exam');
      } finally {
        setLoading(false);
      }
    };

    startExamAndProctor();
  }, [examId]);

  // Once exam data is loaded, compute how long until the exam ends
  useEffect(() => {
    if (!examData || !examData.schedule) return;

    const durationMs = examData.schedule.durationMinutes * 60 * 1000;
    const nowMs = Date.now();
    const endTimeMs = nowMs + durationMs;

    setTimeRemaining(endTimeMs - nowMs);
  }, [examData]);

  // Timer: Decrement timeRemaining every second; auto-submit at 0
  useEffect(() => {
    if (timeRemaining === null) return; // not yet computed
    if (timeRemaining <= 0) {
      // If the exam is already past its end time, mark it expired
      setExamExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    // Cleanup
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining]);

  // Helper to format the remaining time as MM:SS
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  // Proctor event logging
  const logEvent = async (eventType, details) => {
    try {
      await api.post(`/proctoring/${proctorSessionId}/event`, { eventType, details });
    } catch (err) {
      console.error('Error logging proctoring event:', err.response?.data);
    }
  };

  // Warn if user switches tabs
  useEffect(() => {
    if (!proctorSessionId) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowWarning(true);
        logEvent('browserSwitch', 'User switched browser tab');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [proctorSessionId]);

  // Exam submission
  const handleSubmit = async () => {
    try {
      await api.post(`/exams/${examId}/submit`, { attemptId, answers });
      window.alert("Submitted Successfully");
      navigate(`/exams/${examId}/results?attemptId=${attemptId}`);
    } catch (err) {
      console.error('Submission error:', err.response?.data);
      setError(err.response?.data?.error || 'Submission failed');
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  if(examExpired){
    return(
      <div
      className="container mx-auto p-4"
      >
        <h1
        className="text-xl font-bold mb-4"
        >
          {examData?.title}
        </h1>

        <p
        className="text-red-600 font-bold"
        >
          This exam has expired. You can no longer take this exam.
        </p>

        <button
        onClick={() => navigate('/exams')}
        className="mt-4 !bg-gray-500
        text-white px-4 py-2 rounded-md
        "
        >
          Go Back
        </button>
      </div>
    )
  }

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
    <div className="container mx-auto p-4 flex-1 flex flex-col">
      <h1 className="text-xl font-bold mb-4">{examData.title}</h1>

      {/* Display the Timer */}
      {timeRemaining !== null && (
        <p className="text-red-600 font-bold mb-2">
          Time Remaining: {formatTime(timeRemaining)}
        </p>
      )}

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
          className="!bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {currentQuestionIndex < safeQuestions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            className="!bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="!bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit Exam
          </button>
        )}
      </div>

      {/* Warning Modal for Proctoring */}
      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center !bg-black bg-opacity-50 z-50">
          <div className="!bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h2 className="text-red-600 font-bold text-xl mb-2">Warning!</h2>
            <p className="mb-4 text-black font-bold">
              You have switched tabs or lost focus on the exam window. Please return immediately. 
              Multiple violations may result in exam termination.
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="!bg-blue-500 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TakeExam;
