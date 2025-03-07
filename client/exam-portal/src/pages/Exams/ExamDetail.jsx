import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import useAuth from '../../hooks/useAuth';

function ExamDetail() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // Get the current user's info
  const navigate = useNavigate();

  // State to track exam expiration
  const [isExamExpired, setIsExamExpired] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { data } = await api.get(`/exams/${examId}`);
        const fetchedExam = data.exam;
        setExam(fetchedExam);

        // Check if exam is expired: calculate end time based on scheduled start and duration
        const startTimeMs = new Date(fetchedExam.schedule.startDateTime).getTime();
        const durationMs = fetchedExam.schedule.durationMinutes * 60 * 1000;
        const endTimeMs = startTimeMs + durationMs;
        const nowMs = Date.now();
        setIsExamExpired(nowMs > endTimeMs);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load exam details');
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await api.delete(`/exams/${examId}`);
        window.alert("Exam deleted successfully");
        navigate('/dashboard');
      } catch (err) {
        console.error("Error deleting exam", err.response?.data);
        window.alert("Failed to delete exam");
      }
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4 flex flex-col flex-1">
      {exam && (
        <>
          <h1 className="text-3xl font-bold mb-4">{exam.title}</h1>
          <p className="mb-4">{exam.description}</p>

          {/* Display scheduled date and time including seconds */}
          <p>
            <strong>Scheduled:</strong>{' '}
            {new Date(exam.schedule.startDateTime).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </p>
          <p>
            <strong>Duration:</strong> {exam.schedule.durationMinutes} minutes
          </p>

          <div className="mt-4 flex space-x-4 items-center">
            {/* Conditionally render "Take Exam" or "Exam Expired" */}
            {!isExamExpired ? (
              <Link
                to={`/exams/${exam._id}/take`}
                className="!bg-green-500 !text-white px-4 py-2 rounded"
              >
                Take Exam
              </Link>
            ) : (
              <Link
                to="/exams"
                className="!bg-gray-500 !text-white px-4 py-2 rounded"
              >
                Exam Expired - View Exams
              </Link>
            )}

            {/* Admin controls */}
            {user && user.role === 'admin' && (
              <>
                <Link
                  to={`/exams/${exam._id}/edit`}
                  className="!bg-blue-500 !text-white px-4 py-2 rounded"
                >
                  Update Exam
                </Link>
                <button
                  onClick={handleDelete}
                  className="!bg-red-500 !text-white px-4 py-2 rounded"
                >
                  Delete Exam
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ExamDetail;
