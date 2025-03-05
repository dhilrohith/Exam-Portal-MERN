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

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { data } = await api.get(`/exams/${examId}`);
        setExam(data.exam);
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
    <div className="container mx-auto p-4">
      {exam && (
        <>
          <h1 className="text-3xl font-bold mb-4">{exam.title}</h1>
          <p className="mb-4">{exam.description}</p>
          <p><strong>Scheduled:</strong> {new Date(exam.schedule.startDateTime).toLocaleString()}</p>
          <p><strong>Duration:</strong> {exam.schedule.durationMinutes} minutes</p>
          <div className="mt-4 flex space-x-4">
            <Link to={`/exams/${exam._id}/take`} 
            className="!bg-green-500 !text-white px-4 py-2 rounded">
            Take Exam
            </Link>

            {user && user.role === 'admin' && (
              <>
                <Link to={`/exams/${exam._id}/edit`} 
                className="!bg-blue-500 !text-white px-4 py-2 rounded">
                  Update Exam
                </Link>
                <button
                  onClick={handleDelete}
                  className="!bg-red-500 text-white px-4 py-2 rounded"
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
