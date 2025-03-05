import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Spinner from '../common/Spinner';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token); // update context with new token
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-amber-700 shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-700 font-bold mb-4">{error}</p>}
      <label className="block mb-2" htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        className="border w-full p-2 mb-4 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label className="block mb-2" htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        className="border w-full p-2 mb-4 text-black"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
