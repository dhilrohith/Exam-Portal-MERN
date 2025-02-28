import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';

function ExamList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await api.get('/exams');
        setExams(data.exams);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load exams');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Exams</h1>
      <ul className="space-y-4">
        {exams.map((exam) => (
          <li key={exam._id} className="p-4 border rounded shadow-sm">
            <h2 className="font-semibold text-lg">{exam.title}</h2>
            <p>{exam.description}</p>
            <Link to={`/exams/${exam._id}`} className="text-blue-500 hover:underline mt-2 block">View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExamList;
