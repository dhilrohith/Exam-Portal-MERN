import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";

function UserReports() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const { data } = await api.get("/reports/users");
        setAnalytics(data.analytics);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load user reports");
      } finally {
        setLoading(false);
      }
    };

    fetchUserReports();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Users Performance Report</h1>
      {analytics.length === 0 ? (
        <p>No performance data available.</p>
      ) : (
        analytics.map((report) => (
          <div key={report.userId} className="border p-4 rounded mb-4">
            <h2 className="font-bold">
              {report.studentName} ({report.studentEmail})
            </h2>
            <p>
              Overall Average Score:{" "}
              {report.averageScore !== undefined
                ? report.averageScore.toFixed(2)
                : "N/A"}
            </p>
            <p>Total Exams: {report.totalExams || 0}</p>

            {/* Display Proctoring Sessions */}
            <div className="mt-4">
              <h3 className="font-bold">Proctoring Sessions:</h3>
              {report.proctorSessions && report.proctorSessions.length > 0 ? (
                report.proctorSessions.map((session) => (
                  <div key={session._id} className="border p-2 my-2">
                    <p>
                      <strong>Session Start:</strong>{" "}
                      {new Date(session.sessionStart).toLocaleString()}
                    </p>
                    <p>
                      <strong>Status:</strong> {session.sessionStatus}
                    </p>
                    {session.events && session.events.length > 0 ? (
                      <div className="mt-2">
                        <h4 className="font-bold">Events:</h4>
                        <ul className="list-disc ml-6">
                          {session.events.map((event, idx) => (
                            <li key={idx}>
                              {event.eventType} at{" "}
                              {new Date(event.timestamp).toLocaleTimeString()} -{" "}
                              {event.details}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>No events recorded.</p>
                    )}
                  </div>
                ))
              ) : (
                <p>No proctoring sessions found.</p>
              )}
            </div>

            {/* Existing Exam History */}
            <h3 className="font-bold mt-2">Exam History:</h3>
            <ul>
              {report.examHistory.map((exam, idx) => (
                <li key={idx} className="pl-2 border-l ml-2 mb-2">
                  <p>Exam ID: {exam.exam}</p>
                  <p>Score: {exam.score !== undefined ? exam.score : "N/A"}</p>
                  <p>
                    Date:{" "}
                    {exam.date ? new Date(exam.date).toLocaleDateString() : "N/A"}
                  </p>
                  <p>
                    Total Questions:{" "}
                    {exam.totalQuestions !== undefined ? exam.totalQuestions : "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default UserReports;
