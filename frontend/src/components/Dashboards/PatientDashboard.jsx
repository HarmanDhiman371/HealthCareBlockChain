import { useState, useEffect } from 'react';
import { FileUp, FileText, Share2, Lock, Unlock, ShieldCheck, Activity, Clock, Server, CheckCircle2, FilePlus, Database, Fingerprint } from 'lucide-react';
import api from '../../services/api';
import AccessChart from './AccessChart';

export default function PatientDashboard() {
  const [records, setRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [authorizedDoctors, setAuthorizedDoctors] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('General');
  const [filterCategory, setFilterCategory] = useState('All');
  const [uploading, setUploading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null); // doctorId of the doctor being processed
  const [message, setMessage] = useState('');

  const fetchRecords = async () => {
    try {
      const res = await api.get('/records/mine');
      setRecords(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/access/doctors');
      setDoctors(res.data);
      const authRes = await api.get('/access/authorized-doctors');
      setAuthorizedDoctors(authRes.data.map(d => d.id));
    } catch (err) { console.error(err); }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await api.get('/records/audit');
      setAuditLogs(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchRecords();
    fetchDoctors();
    fetchAuditLogs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    try {
      await api.post('/records/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Data encrypted & stored successfully.');
      setFile(null);
      fetchRecords();
    } catch (err) {
      setMessage('Upload failed.');
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const grantAccess = async (doctorAddress, doctorId) => {
    console.log(`Granting access to doctor at wallet: ${doctorAddress} (ID: ${doctorId})`);
    setLoadingAction(doctorId);
    try {
      const res = await api.post('/access/grant', { doctorWalletAddress: doctorAddress });
      console.log('Grant Access Response:', res.data);
      await fetchDoctors();
      await fetchAuditLogs();
    } catch (err) {
      const msg = err.response?.data || 'Error granting access. Is the Hardhat node running?';
      console.error('Grant Access Error:', err);
      alert(msg);
    } finally {
      setLoadingAction(null);
    }
  };

  const revokeAccess = async (doctorAddress, doctorId) => {
    console.log(`Revoking access to doctor at wallet: ${doctorAddress} (ID: ${doctorId})`);
    setLoadingAction(doctorId);
    try {
      const res = await api.post('/access/revoke', { doctorWalletAddress: doctorAddress });
      console.log('Revoke Access Response:', res.data);
      await fetchDoctors();
      await fetchAuditLogs();
    } catch (err) {
      const msg = err.response?.data || 'Error revoking access. Transaction failed.';
      console.error('Revoke Access Error:', err);
      alert(msg);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Stat Card */}
      <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full -z-10"></div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center">
            <Fingerprint className="text-teal-400 w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
              {localStorage.getItem('fullName') || 'Patient'}
              <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-1 rounded-lg uppercase tracking-widest font-black">ID: #{localStorage.getItem('id')}</span>
            </h2>
            <p className="text-slate-400 mt-1 font-mono text-xs">{localStorage.getItem('walletAddress')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center min-w-[100px]">
            <Database className="text-emerald-400 w-5 h-5 mb-1" />
            <span className="text-2xl font-black text-white">{records.length}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Storage</span>
          </div>
          <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center min-w-[100px]">
            <Server className="text-teal-400 w-5 h-5 mb-1" />
            <span className="text-2xl font-black text-white">{authorizedDoctors.length}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Grants</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Chart, Upload & Audit) */}
        <div className="xl:col-span-2 space-y-8">
          
          <AccessChart />

          {/* Upload Section */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl hover:bg-slate-900/50 transition-colors">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-white">
              <FilePlus className="text-teal-400 w-5 h-5" /> Secure Upload Node
            </h3>
            
            <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex flex-col sm:flex-row w-full gap-4">
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full sm:w-2/3 block text-sm text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-teal-500/10 file:text-teal-400 hover:file:bg-teal-500/20 file:transition-colors bg-slate-950/50 rounded-xl border border-white/5 cursor-pointer"
                />
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full sm:w-1/3 bg-slate-950/50 text-slate-300 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500 transition-colors"
                >
                  <option value="General">General</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Lab Results">Lab Results</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={!file || uploading} 
                className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_25px_rgba(20,184,166,0.4)] whitespace-nowrap"
              >
                {uploading ? 'Encrypting...' : 'Upload Data'}
              </button>
            </form>
            {message && (
              <div className="mt-4 p-3 bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm font-medium rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {message}
              </div>
            )}
          </div>

          {/* Audit Log Section */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                <Activity className="text-purple-400 w-5 h-5" /> Access Audit Trail
              </h3>
              <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20 flex items-center gap-1">
                <Fingerprint size={12}/> Live
              </span>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {auditLogs.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">No access attempts recorded yet.</div>
              ) : (
                auditLogs.map(log => (
                  <div key={log.id} className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${log.status === 'Granted' ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]'}`}>
                        {log.status === 'Granted' ? <Unlock size={18} /> : <Lock size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">{log.doctorName}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{log.doctorWallet}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium text-slate-300 flex items-center gap-1 sm:justify-end">
                        <FileText size={14} className="text-slate-500" /> {log.fileName}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 sm:justify-end">
                        <Clock size={12} /> {new Date(log.accessTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Access Control & Files) */}
        <div className="space-y-8">
          
          {/* Smart Contract Access Control */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col h-[400px]">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2 text-white">
              <Share2 className="text-blue-400 w-5 h-5" /> Access Rights
            </h3>
            <p className="text-xs text-slate-400 mb-6">Manage Smart Contract pointers.</p>
            
            <div className="space-y-3 overflow-y-auto pr-2 flex-grow custom-scrollbar">
              {doctors.map(doctor => {
                const hasAccess = authorizedDoctors.includes(doctor.id);
                return (
                  <div key={doctor.id} className={`p-4 rounded-2xl border transition-all duration-300 ${hasAccess ? 'bg-teal-900/20 border-teal-500/30' : 'bg-slate-950/50 border-white/5 hover:border-white/10'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-bold text-slate-200 flex items-center gap-2">
                        {doctor.fullName || `Dr. ${doctor.email.split('@')[0]}`}
                        {hasAccess && <span className="text-[9px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full uppercase font-black tracking-widest shadow-[0_0_10px_rgba(20,184,166,0.2)]">Granted</span>}
                      </p>
                      <div className="flex gap-2">
                        {loadingAction === doctor.id ? (
                          <div className="p-2 animate-spin text-teal-400"><Database size={16} /></div>
                        ) : !hasAccess ? (
                          <button onClick={() => grantAccess(doctor.walletAddress, doctor.id)} className="group p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all" title="Grant On-Chain Access">
                            <Unlock size={16} className="group-hover:scale-110 transition-transform" />
                          </button>
                        ) : (
                          <button onClick={() => revokeAccess(doctor.walletAddress, doctor.id)} className="group p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all" title="Revoke On-Chain Access">
                            <Lock size={16} className="group-hover:scale-110 transition-transform" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono truncate bg-slate-900 p-1.5 rounded-lg border border-white/5">{doctor.walletAddress}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Records List Mini */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl opacity-90">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                 <Database className="text-sky-400 w-5 h-5" /> Vault
               </h3>
               <select 
                 value={filterCategory} 
                 onChange={(e) => setFilterCategory(e.target.value)} 
                 className="bg-slate-950/80 text-xs text-slate-300 border border-white/10 rounded-lg px-2 py-1.5 outline-none focus:border-sky-500"
               >
                 <option value="All">All Categories</option>
                 <option value="General">General</option>
                 <option value="Cardiology">Cardiology</option>
                 <option value="Radiology">Radiology</option>
                 <option value="Prescription">Prescription</option>
                 <option value="Lab Results">Lab Results</option>
               </select>
             </div>
             <ul className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
               {(filterCategory === 'All' ? records : records.filter(r => r.category === filterCategory)).map(record => (
                 <li key={record.id} className="p-3 bg-slate-950/50 rounded-xl border border-white/5 flex justify-between items-center">
                   <div className="flex flex-col truncate w-3/4">
                     <p className="text-sm font-semibold text-slate-300 truncate">{record.fileName}</p>
                     <span className="text-[9px] text-teal-400 mt-0.5 uppercase tracking-widest font-bold">{record.category}</span>
                   </div>
                   <Lock size={14} className="text-emerald-500 opacity-60 flex-shrink-0" />
                 </li>
               ))}
               {records.length === 0 && <p className="text-xs text-slate-500 text-center py-4">Vault is empty.</p>}
               {records.length > 0 && filterCategory !== 'All' && records.filter(r => r.category === filterCategory).length === 0 && <p className="text-xs text-slate-500 text-center py-4">No records in this category.</p>}
             </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
