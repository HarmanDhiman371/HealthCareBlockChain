import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PatientDashboard from './components/Dashboards/PatientDashboard';
import DoctorDashboard from './components/Dashboards/DoctorDashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { LogOut, Activity } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-teal-500/30 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-950 to-slate-950 pointer-events-none z-0"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-emerald-500/10 blur-[120px] pointer-events-none z-0 rounded-full"></div>

      {/* Navigation */}
      <nav className="relative z-50 bg-slate-900/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Health<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Chain</span>
              </span>
            </div>
            <div className="flex items-center">
              {localStorage.getItem('token') && (
                <button 
                  onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                  className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-all px-4 py-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
                >
                  <LogOut size={16} /> Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/patient/*" element={<ProtectedRoute allowedRole="Patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/doctor/*" element={<ProtectedRoute allowedRole="Doctor"><DoctorDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
