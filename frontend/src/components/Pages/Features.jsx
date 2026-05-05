import { Cpu, Lock, Globe, Zap, ShieldAlert, Fingerprint, Database, Share2, Activity } from 'lucide-react';

export default function Features() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Technical Architecture</h1>
          <p className="text-slate-400 max-w-3xl mx-auto text-lg">
            A deep dive into the decentralized technologies that make HealthChain the most secure medical data network on the planet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Blockchain Logic */}
          <div className="bg-slate-900/60 border border-white/10 rounded-[40px] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Cpu size={120} className="text-teal-400" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 border border-teal-500/20">
                <Share2 className="text-teal-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">On-Chain Access Control</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                We use Ethereum Smart Contracts to handle all authorization logic. When a patient grants access to a doctor, a permanent, immutable record is written to the blockchain.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <Fingerprint className="text-teal-400 shrink-0" size={18} />
                  <span>Wallet-based identity verification for all participants.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-300">
                  <Activity className="text-teal-400 shrink-0" size={18} />
                  <span>Real-time on-chain audit trails for every access attempt.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Encryption */}
          <div className="bg-slate-900/60 border border-white/10 rounded-[40px] p-10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <Lock size={120} className="text-emerald-400" />
             </div>
             <div className="relative z-10">
               <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
                 <ShieldAlert className="text-emerald-400" />
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">Military-Grade Encryption</h2>
               <p className="text-slate-400 mb-8 leading-relaxed">
                 Data is never stored in plain text. We utilize AES-256 encryption at the edge. Your private keys never leave your browser, ensuring true data sovereignty.
               </p>
               <ul className="space-y-4">
                 <li className="flex items-start gap-3 text-sm text-slate-300">
                   <Zap className="text-emerald-400 shrink-0" size={18} />
                   <span>Hybrid encryption combining RSA and AES algorithms.</span>
                 </li>
                 <li className="flex items-start gap-3 text-sm text-slate-300">
                   <Lock className="text-emerald-400 shrink-0" size={18} />
                   <span>Patient-controlled master keys for global decryption.</span>
                 </li>
               </ul>
             </div>
          </div>

          {/* Storage */}
          <div className="bg-slate-900/60 border border-white/10 rounded-[40px] p-10 relative overflow-hidden group md:col-span-2">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center mb-6 border border-sky-500/20">
                   <Database className="text-sky-400" />
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-6">Distributed IPFS Vault</h2>
                 <p className="text-slate-400 mb-6 leading-relaxed text-lg">
                   Traditional databases are vulnerable to centralized failures and hacks. HealthChain stores encrypted blobs on the InterPlanetary File System (IPFS).
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                     <p className="text-white font-bold mb-1">Content Addressing</p>
                     <p className="text-xs text-slate-500 font-mono">CID v1 - Peer-to-peer retrieval</p>
                   </div>
                   <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                     <p className="text-white font-bold mb-1">Immutable History</p>
                     <p className="text-xs text-slate-500 font-mono">Versioned patient record history</p>
                   </div>
                 </div>
               </div>
               <div className="relative flex justify-center">
                  <div className="w-64 h-64 bg-sky-500/10 blur-[80px] absolute rounded-full"></div>
                  <Globe size={200} className="text-sky-500/20 animate-spin-slow" />
               </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
