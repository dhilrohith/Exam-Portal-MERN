import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className=" text-red-600 p-4 bg-blue-600">
      <div className="container mx-auto flex justify-between items-center ">
        <Link to="/" className="font-bold text-xl !text-white">OAP</Link>
        <div>
          <Link to="/" className="mr-4 !text-white">Home</Link>
          {token ? (
            <>
              <Link to="/dashboard" className="mr-4  !text-white">Dashboard</Link>
              <button onClick={handleLogout} className="bg-blue-800 px-3 py-1 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4 !text-white">Login</Link>
              <Link to="/register" className="mr-4 !text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
