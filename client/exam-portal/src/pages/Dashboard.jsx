import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Make sure this hook returns the current user info

function Dashboard() {
  const { user } = useAuth(); // Assumes user has a role property

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard. You can view your exams and reports as applicable.</p>
      <div className="mt-6">
        {/* Always visible for students */}
        <Link to="/exams" className="bg-purple-500 !text-white px-4 py-2 rounded mr-4">
          View Exams
        </Link>
        {/* Only visible to admin users */}
        {user && user.role === 'admin' && (
          <>
            <Link to="/reports/exams" className="bg-purple-500 !text-white px-4 py-2 rounded mr-4">
              Exam Reports
            </Link>
            <Link to="/reports/users" className="bg-purple-500 !text-white px-4 py-2 rounded mr-4">
              User Reports
            </Link>
            <Link to="/createexam" className="bg-purple-500 !text-white px-4 py-2 rounded">
              Create Exam
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
