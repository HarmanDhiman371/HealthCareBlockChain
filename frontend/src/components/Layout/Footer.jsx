import { Activity, Mail, ShieldCheck, Cpu, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-slate-950 border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Health<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Chain</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Revolutionizing healthcare data management through decentralized blockchain technology. Secure, transparent, and patient-centric.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"><Mail size={18} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"><Globe size={18} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"><Activity size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Home</Link></li>
              <li><Link to="/features" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Features</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Security */}
          <div>
            <h4 className="text-white font-bold mb-6">Security</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-2 text-slate-400 text-sm"><ShieldCheck size={16} className="text-teal-500" /> AES-256 Encryption</li>
              <li className="flex items-center gap-2 text-slate-400 text-sm"><Cpu size={16} className="text-emerald-500" /> Smart Contracts</li>
              <li className="flex items-center gap-2 text-slate-400 text-sm"><Globe size={16} className="text-sky-500" /> IPFS Storage</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6">Stay Updated</h4>
            <p className="text-slate-400 text-sm mb-4">Join our newsletter for latest updates in Web3 Health.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="email@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
              <button className="absolute right-2 top-1.5 px-3 py-1.5 bg-teal-500 text-white rounded-lg text-xs font-bold hover:bg-teal-400 transition-colors">
                Join
              </button>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © 2026 HealthChain Network. Built with integrity for humanity.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
