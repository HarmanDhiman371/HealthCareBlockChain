import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Activity } from 'lucide-react';
import api from '../../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('id', res.data.id);
      localStorage.setItem('fullName', res.data.fullName);
      localStorage.setItem('walletAddress', res.data.walletAddress);
      
      if (res.data.role === 'Patient') navigate('/patient');
      else navigate('/doctor');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-teal-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4 text-teal-600">
            <Activity size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Sign in to manage healthcare data</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input 
              type="password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Sign In
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="text-teal-600 font-semibold hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
}
