import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';

function ExamReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await api.get('/reports/exams');
        setReports(data.reports);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Exam Reports</h1>
      {reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <ul>
          {reports.map((report) => (
            <li key={report.examId} className="border p-4 rounded mb-4">
              <h2 className="font-bold">{report.examTitle}</h2>
              <p>Average Score: {report.averageScore.toFixed(2)}</p>
              <p>Total Attempts: {report.totalAttempts}</p>
              <p>Highest Score: {report.highestScore}</p>
              <p>Lowest Score: {report.lowestScore}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExamReports;
