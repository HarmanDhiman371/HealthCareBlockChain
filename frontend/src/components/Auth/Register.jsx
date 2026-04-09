import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, HeartPulse } from 'lucide-react';
import api from '../../services/api';

export default function Register() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'Patient' });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-emerald-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4 text-emerald-600">
            <HeartPulse size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
          <p className="text-slate-500 mt-2">Join HealthChain today</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" required
              value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" required
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input 
              type="password" required
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition ${formData.role === 'Patient' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" name="role" value="Patient" className="hidden" onChange={(e) => setFormData({...formData, role: e.target.value})} checked={formData.role === 'Patient'} />
                Patient
              </label>
              <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition ${formData.role === 'Doctor' ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" name="role" value="Doctor" className="hidden" onChange={(e) => setFormData({...formData, role: e.target.value})} checked={formData.role === 'Doctor'} />
                Doctor
              </label>
            </div>
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Creating Wallet...' : <><UserPlus size={20} /> Register</>}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-emerald-600 font-semibold hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
