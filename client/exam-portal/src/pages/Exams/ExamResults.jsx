import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';

function ExamResults() {
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get('attemptId');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await api.get(`/exams/${examId}/results?attemptId=${attemptId}`);
        setResults(data.attempt);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch exam results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [examId, attemptId]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Exam Results</h1>
      <p>
        Your score: {results.score} out of {results.totalQuestions}
      </p>
      <ul>
        {results.results.map((result) => (
          <li key={result.questionId} className="border p-2 rounded mb-2">
            <p><strong>Question:</strong> {result.questionText}</p>
            <p><strong>Your answer:</strong> {result.studentAnswer}</p>
            <p><strong>Correct answer:</strong> {result.correctAnswer}</p>
            <p>{result.isCorrect ? 'Correct' : 'Incorrect'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExamResults;
