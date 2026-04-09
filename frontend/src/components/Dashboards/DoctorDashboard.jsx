import { useState, useEffect } from 'react';
import { Search, Download, ShieldAlert, ShieldCheck, Activity, Users, FileLock2, KeyRound } from 'lucide-react';
import api from '../../services/api';

export default function DoctorDashboard() {
  const [patientId, setPatientId] = useState('');
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authorizedPatients, setAuthorizedPatients] = useState([]);

  useEffect(() => {
    const fetchAuthorizedPatients = async () => {
      try {
        const res = await api.get('/access/authorized-patients');
        setAuthorizedPatients(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAuthorizedPatients();
  }, []);

  const fetchRecordsForPatient = async (id) => {
    setLoading(true);
    setError('');
    setRecords([]);
    try {
      const res = await api.get(`/records/patient/${id}`);
      setRecords(res.data);
      setPatientId(id);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access Denied by Smart Contract. The patient has not granted you permission.');
      } else if (err.response?.status === 404) {
        setError('Patient not found in global registry.');
      } else {
        setError('A network error occurred connecting to the node.');
      }
    } finally {
      setLoading(false);
    }
  };

  const searchPatient = async (e) => {
    e.preventDefault();
    if (patientId) {
      await fetchRecordsForPatient(patientId);
    }
  };

  const handleDownload = async (recordId, fileName) => {
    try {
      const res = await api.get(`/records/${recordId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Decryption failed or access was revoked on-chain!');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full -z-10"></div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center">
            <Activity className="text-blue-400 w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
              {localStorage.getItem('fullName') || 'Physician'}
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg uppercase tracking-widest font-black">ID: #{localStorage.getItem('id')}</span>
            </h2>
            <p className="text-slate-400 mt-1 font-mono text-xs">{localStorage.getItem('walletAddress')}</p>
          </div>
        </div>

        <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center min-w-[120px]">
          <Users className="text-purple-400 w-5 h-5 mb-1" />
          <span className="text-2xl font-black text-white">{authorizedPatients.length}</span>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider text-center">Accessible<br/>Patients</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Search & Auth Patients) */}
        <div className="space-y-8">
          
          {/* Search Node */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-white">
              <Search className="text-blue-400 w-5 h-5" /> Query Network
            </h2>
            
            <form onSubmit={searchPatient} className="flex flex-col gap-4">
              <input 
                type="number" required
                value={patientId} onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-5 py-4 bg-slate-950/50 rounded-xl border border-white/5 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-slate-200 outline-none transition-all placeholder-slate-600"
                placeholder="Enter Patient ID (e.g. 1)"
              />
              <button 
                type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_25px_rgba(79,70,229,0.4)]"
              >
                {loading ? <span className="animate-pulse flex gap-2"><KeyRound size={20}/> Validating Node...</span> : <span className="flex gap-2"><Search size={20}/> Sync Records</span>}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl flex items-start gap-3 font-medium text-sm">
                <ShieldAlert className="text-rose-400 shrink-0 mt-0.5" size={18} />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Quick Access List */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2 text-white">
              <Users className="text-purple-400 w-5 h-5" /> My Patients
            </h2>
            <p className="text-xs text-slate-400 mb-6">Patients who have granted you immutable access.</p>
            
            {authorizedPatients.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4 bg-slate-950/30 rounded-xl border border-white/5">No active grants found.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {authorizedPatients.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => fetchRecordsForPatient(p.id)}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-950/50 border border-white/5 rounded-xl hover:border-purple-500/50 hover:bg-purple-500/10 text-slate-300 text-sm font-bold transition-all flex items-center gap-3 group text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                      #{p.id}
                    </div>
                    <div className="flex-1">
                      <span className="block text-slate-200 group-hover:text-white font-bold">{p.fullName || p.email.split('@')[0]}</span>
                      <span className="block text-[10px] text-slate-500 truncate w-24 sm:w-auto font-mono">{p.walletAddress}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Record Viewer) */}
        <div className="lg:col-span-2 space-y-8">
          {records.length > 0 ? (
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
               <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>
               
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                   <ShieldCheck className="text-emerald-400 w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-black text-white">Access Verified</h3>
                   <p className="text-sm text-emerald-400/80 font-medium tracking-wide">Blockchain signature confirmed.</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {records.map(r => (
                   <div key={r.id} className="p-6 border border-white/5 rounded-2xl bg-slate-950/50 hover:bg-slate-900 transition-all group relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="flex justify-between items-start mb-6">
                       <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400 border border-blue-500/20"><FileLock2 size={24} /></div>
                       <div className="flex flex-col items-end gap-2">
                         <span className="text-[10px] font-black tracking-widest px-2 py-1 bg-slate-800 border border-white/10 text-slate-400 rounded-lg">ID: {r.id}</span>
                         {r.category && <span className="text-[9px] font-black tracking-widest px-2 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-lg uppercase">{r.category}</span>}
                       </div>
                     </div>
                     <h4 className="font-bold text-slate-200 mb-1 truncate" title={r.fileName}>{r.fileName}</h4>
                     <p className="text-xs text-slate-500 mb-6 font-medium tracking-wide">{new Date(r.uploadDate).toLocaleDateString()}</p>
                     
                     <button 
                       onClick={() => handleDownload(r.id, r.fileName)}
                       className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border border-white/5 hover:border-white/10"
                     >
                       <Download size={16} /> Secure Decrypt
                     </button>
                   </div>
                 ))}
               </div>
            </div>
          ) : (
             <div className="bg-slate-900/20 border border-white/5 border-dashed p-12 rounded-3xl flex flex-col items-center justify-center text-center h-full min-h-[400px]">
               <FileLock2 className="text-slate-700 w-16 h-16 mb-4" />
               <h3 className="text-xl font-bold text-slate-400 mb-2">Vault Locked</h3>
               <p className="text-sm text-slate-600 max-w-sm">
                 Query a patient's Node ID above or select a granted pass from the left to unlock medical records.
               </p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
