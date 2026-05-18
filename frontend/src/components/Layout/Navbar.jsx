import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Activity, Menu, X, Shield, Lock, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const dashboardPath = role === 'Patient' ? '/patient' : '/doctor';

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              Health<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Chain</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Home</Link>
            <Link to="/features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</Link>
            <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</Link>
            {/* <Link to="/contact" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Contact</Link> */}
            
            <div className="h-6 w-px bg-white/10 mx-2"></div>

            {token ? (
              <div className="flex items-center gap-4">
                <Link 
                  to={dashboardPath}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 transition-all font-bold text-sm"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-rose-400 transition-all"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-sm shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all"
                >
                  Join Network
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-300 hover:text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-white/10 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-slate-300 hover:text-white border-b border-white/5">Home</Link>
            <Link to="/features" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-slate-300 hover:text-white border-b border-white/5">Features</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-slate-300 hover:text-white border-b border-white/5">About</Link>
            {/* <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-slate-300 hover:text-white border-b border-white/5">Contact</Link> */}
            
            <div className="pt-4">
              {token ? (
                <div className="space-y-3">
                   <Link 
                    to={dashboardPath}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold"
                  >
                    <LayoutDashboard size={18} /> My Dashboard
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full py-4 text-rose-400 font-bold"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center py-4 rounded-xl border border-white/10 text-white font-bold">Sign In</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="flex items-center justify-center py-4 rounded-xl bg-teal-500 text-white font-bold">Join Now</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
