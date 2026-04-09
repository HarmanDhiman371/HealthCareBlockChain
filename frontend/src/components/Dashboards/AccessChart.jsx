import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import api from '../../services/api';

export default function AccessChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/records/audit/stats');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setData(res.data);
        } else {
          // Generate empty but valid data frame
          const dummy = Array.from({length: 7}, (_, i) => ({
            date: new Date(Date.now() - (6-i)*24*60*60*1000).toLocaleDateString('en-US', {month:'short', day:'2-digit'}),
            accesses: 0
          }));
          setData(dummy);
        }
      } catch (err) {
        console.error("Failed to load audit stats", err);
        setError("Network error: Unable to retrieve access logs.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl animate-pulse">
        <div className="flex gap-2 text-teal-500 font-bold"><Activity className="animate-bounce" /> Syncing Node Data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[250px] w-full flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md border border-rose-500/20 rounded-3xl shadow-xl">
        <div className="text-rose-400 font-medium mb-2">{error}</div>
        <button onClick={() => window.location.reload()} className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 px-4 py-2 rounded-lg transition-colors border border-rose-500/20">
          Retry Sync
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl w-full">
      <div className="flex items-center gap-2 mb-6 text-white">
        <Activity className="text-teal-400 w-5 h-5" />
        <h3 className="text-xl font-bold">Network Access Analytics</h3>
      </div>
      
      <div className="h-[300px] w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAccess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.3)" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
              dy={10}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ color: '#2dd4bf', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="accesses" 
              stroke="#2dd4bf" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAccess)" 
              activeDot={{ r: 6, stroke: '#134e4a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
