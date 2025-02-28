import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <form onSubmit={handleSubmit} className="bg-amber-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Name</label>
          <input id="name" type="text" className="border w-full p-2" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input id="email" type="email" className="border w-full p-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password</label>
          <input id="password" type="password" className="border w-full p-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block mb-2">Role</label>
          <select id="role" className="border w-full p-2 text-black" 
          value={role} 
          onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            {/* <option value="proctor">Proctor</option> */}
          </select>
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
}

export default Register;
