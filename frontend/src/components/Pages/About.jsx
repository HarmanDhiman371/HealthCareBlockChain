import { Heart, ShieldCheck, Users, Globe, Award, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider mb-6">
              Our Mission
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
              Empowering Patients through <span className="text-teal-400">Technology</span>.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Founded in 2024, HealthChain was born out of a simple realization: your medical data belongs to you, not the hospitals. We are building the infrastructure for a more transparent, secure, and efficient healthcare ecosystem.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-black text-white mb-1">50+</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Medical Partners</p>
              </div>
              <div>
                <p className="text-4xl font-black text-white mb-1">2M+</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Records Secured</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-teal-500/10 blur-[100px] rounded-full"></div>
            <div className="relative bg-slate-900/50 border border-white/10 rounded-[40px] p-12 overflow-hidden">
               <Heart size={200} className="text-rose-500/10 absolute -bottom-10 -right-10" />
               <div className="space-y-8 relative z-10">
                 <ValueItem icon={<ShieldCheck className="text-teal-400" />} title="Security First" text="We never compromise on the integrity of patient information." />
                 <ValueItem icon={<Users className="text-emerald-400" />} title="Inclusion" text="Providing decentralized health access to remote regions globally." />
                 <ValueItem icon={<Award className="text-sky-400" />} title="Excellence" text="Utilizing the latest breakthroughs in cryptography and Web3." />
               </div>
            </div>
          </div>
        </div>

        {/* Vision Grid */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Global Vision</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Connecting doctors and patients across borders without the need for centralized intermediaries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-900/30 border border-white/5 rounded-3xl text-center hover:bg-slate-900/50 transition-colors">
            <Globe className="text-teal-400 w-12 h-12 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">Universal Access</h3>
            <p className="text-sm text-slate-500">Access your records from any clinic, anywhere in the world, with just your wallet.</p>
          </div>
          <div className="p-8 bg-slate-900/30 border border-white/5 rounded-3xl text-center hover:bg-slate-900/50 transition-colors">
            <Sparkles className="text-emerald-400 w-12 h-12 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">Interoperability</h3>
            <p className="text-sm text-slate-500">No more manual file transfers. Our protocol makes data exchange seamless.</p>
          </div>
          <div className="p-8 bg-slate-900/30 border border-white/5 rounded-3xl text-center hover:bg-slate-900/50 transition-colors">
            <Heart className="text-rose-400 w-12 h-12 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">Patient Control</h3>
            <p className="text-sm text-slate-500">True data sovereignty means you are the only one with the keys to your life.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

function ValueItem({ icon, title, text }) {
  return (
    <div className="flex gap-6">
      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
        {icon}
      </div>
      <div>
        <h4 className="text-white font-bold mb-1">{title}</h4>
        <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
