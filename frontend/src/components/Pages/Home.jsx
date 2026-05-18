import { ArrowRight, Shield, Zap, Lock, Database, Activity, CheckCircle2, Star, Users, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const getStartedPath = token ? (role === 'Patient' ? '/patient' : '/doctor') : '/register';

  return (
    <div className="pt-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-teal-500/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full -z-10 animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom duration-500">
            <Star size={12} fill="currentColor" /> Web3 Healthcare Revolution
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            Your Health Data, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-sky-400">
              Decentralized & Secure
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            The world's first healthcare platform powered by Ethereum blockchain and IPFS. 
            Full control over your medical records with military-grade encryption.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <Link 
              to={getStartedPath} 
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-black text-lg shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_50px_rgba(20,184,166,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              Get Started Now <ArrowRight size={20} />
            </Link>
            <Link 
              to="/features" 
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              Explore Tech Stack
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-12 border-t border-white/5 animate-in fade-in duration-1000 delay-500">
            <div>
              <p className="text-3xl font-black text-white">99.9%</p>
              <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mt-1">Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-black text-teal-400">0%</p>
              <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mt-1">Data Leaks</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">256-bit</p>
              <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mt-1">Encryption</p>
            </div>
            <div>
              <p className="text-3xl font-black text-emerald-400">Node-Sync</p>
              <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mt-1">Live</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Built for the Future</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Our architecture ensures that your sensitive medical history remains private, accessible only by you and authorized physicians.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="text-teal-400" />}
              title="Blockchain Access Control"
              desc="Granular permissions managed on the Ethereum blockchain. You decide which doctor sees what."
            />
            <FeatureCard 
              icon={<Lock className="text-emerald-400" />}
              title="End-to-End Encryption"
              desc="Every document is encrypted client-side using AES-256 before it ever touches the network."
            />
            <FeatureCard 
              icon={<Database className="text-sky-400" />}
              title="IPFS Storage"
              desc="Decentralized storage ensures your data is never lost and remains immutable forever."
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-[40px] p-8 md:p-20 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Patient-Centric Sovereignty</h2>
                <div className="space-y-6">
                  <BenefitItem text="Own your medical history globally" />
                  <BenefitItem text="Instant verification of physician credentials" />
                  <BenefitItem text="Real-time audit logs for data access" />
                  <BenefitItem text="Zero-knowledge proof integrations (Coming Soon)" />
                </div>
                <Link to={getStartedPath} className="mt-12 inline-flex items-center gap-2 text-teal-400 font-bold hover:gap-4 transition-all">
                  Start your journey <ArrowRight size={20} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-40 bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col justify-end">
                    <Users className="text-teal-400 mb-2" />
                    <p className="text-white font-bold">10k+ Patients</p>
                  </div>
                  <div className="h-60 bg-gradient-to-b from-teal-500/20 to-transparent rounded-3xl border border-white/10 p-6 flex flex-col justify-end">
                    <CheckCircle2 className="text-teal-400 mb-2" />
                    <p className="text-white font-bold">Verified Nodes</p>
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="h-60 bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col justify-end">
                    <Activity className="text-emerald-400 mb-2" />
                    <p className="text-white font-bold">Live Network</p>
                  </div>
                  <div className="h-40 bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col justify-end">
                    <Cpu className="text-sky-400 mb-2" />
                    <p className="text-white font-bold">Smart Contracts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group p-8 bg-slate-900/50 border border-white/5 rounded-[32px] hover:bg-slate-900 hover:border-white/10 transition-all hover:-translate-y-2">
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function BenefitItem({ text }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
        <CheckCircle2 size={14} className="text-emerald-400" />
      </div>
      <span className="text-slate-300 font-medium">{text}</span>
    </div>
  );
}
