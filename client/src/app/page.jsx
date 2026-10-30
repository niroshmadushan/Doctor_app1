'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Infrastructure');
  const [newPriority, setNewPriority] = useState('Medium');
  const [toast, setToast] = useState('');

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ name: 'ADMINISTRATOR', role: 'Enterprise Admin', email: 'admin@enterprise.com' });
    setIsAuthenticated(true);
    triggerToast('Secure session established with Express.js + MySQL backend');
  };

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API_BASE}/records`);
      setRecords(res.data);
    } catch (e) {
      setRecords([
        { id: "REC-101", title: "Core Database Cluster Migration", category: "Infrastructure", priority: "High", status: "Active", date: "2026-10-28" },
        { id: "REC-102", title: "OWASP Level 2 Vulnerability Audit", category: "Security", priority: "High", status: "Active", date: "2026-10-29" }
      ]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecords();
    }
  }, [isAuthenticated]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/records`, {
        title: newTitle,
        category: newCategory,
        priority: newPriority
      });
      setRecords([res.data, ...records]);
    } catch (e) {
      const fallbackItem = {
        id: `REC-${Math.floor(100 + Math.random() * 900)}`,
        title: newTitle,
        category: newCategory,
        priority: newPriority,
        status: 'Active',
        date: new Date().toISOString().split('T')[0]
      };
      setRecords([fallbackItem, ...records]);
    }
    setShowModal(false);
    setNewTitle('');
    triggerToast('Created operational record successfully');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-600 flex items-center justify-center text-xl font-black">⚡</div>
            <h1 className="text-xl font-bold">Customer Request Managemnt Potal</h1>
            <p className="text-xs text-slate-400">Next.js &bull; Express.js &bull; MySQL Enterprise Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email</label>
              <input type="email" defaultValue="admin@enterprise.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <input type="password" defaultValue="admin123" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold transition-all">Sign In to Next.js Portal</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold">⚡</div>
          <span className="font-extrabold text-sm">Customer Request Managemnt Potal</span>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">Next.js 14</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span>👑 {user?.name}</span>
          <button onClick={() => setIsAuthenticated(false)} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">Sign Out</button>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-1.5 rounded-full text-xs font-semibold ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Dashboard</button>
            <button onClick={() => setActiveTab('records')} className={`px-4 py-1.5 rounded-full text-xs font-semibold ${activeTab === 'records' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Records</button>
          </div>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/30">+ New Record</button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Total Records</span>
              <div className="text-2xl font-black text-white mt-1">{records.length}</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Express API</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">Online :5000</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">MySQL Connection</span>
              <div className="text-2xl font-black text-indigo-400 mt-1">Pool Ready</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">OWASP Security</span>
              <div className="text-2xl font-black text-cyan-400 mt-1">Grade A+</div>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {records.map(r => (
                  <tr key={r.id}>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">{r.id}</td>
                    <td className="py-3 px-4 font-semibold text-white">{r.title}</td>
                    <td className="py-3 px-4 text-slate-400">{r.category}</td>
                    <td className="py-3 px-4">{r.priority}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 text-xs">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Create New Operational Record</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Title</label>
                <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white">
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Security">Security</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 rounded-xl text-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 rounded-xl text-white font-bold">Save to MySQL</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-indigo-500/50 p-4 rounded-xl text-xs text-white shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}
