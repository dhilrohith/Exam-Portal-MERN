import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Online Assessment Platform</h1>
      <p className="mb-8">Take your exams online, view results, and more.</p>
      <div>
        <Link to="/login" className="bg-yellow-500 !text-white px-4 py-2 rounded mr-4">Login</Link>
        <Link to="/register" className="bg-green-500 !text-white px-4 py-2 rounded">Register</Link>
      </div>
    </div>
  );
}

export default Home;
