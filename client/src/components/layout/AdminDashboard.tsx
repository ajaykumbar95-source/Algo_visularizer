import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';
import { Users, Trash2, Shield, ShieldAlert, ShieldCheck, ArrowLeft, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

interface UserData {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  _count: {
    histories: number;
  };
}

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { token, user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user and all their history?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete user');
      }
    } catch (err) {
      alert('Connection error');
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      });
      if (response.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update role');
      }
    } catch (err) {
      alert('Connection error');
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      {/* Header */}
      <div className="h-16 border-b border-background-lighter bg-background-light/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">Admin Dashboard</h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase mt-1">User Management</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background-lighter border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all w-64"
            />
          </div>
          <button 
            onClick={fetchUsers}
            className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"
            title="Refresh"
          >
            <Users size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="text-primary animate-spin" size={32} />
            <p className="text-slate-500 text-sm animate-pulse">Loading user database...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-2">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-xl font-bold text-white">{error}</h2>
            <button onClick={fetchUsers} className="text-primary hover:underline text-sm font-bold">Try again</button>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-background-light border border-background-lighter rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background-lighter/30">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Activity</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <AnimatePresence>
                      {filteredUsers.map((u, idx) => (
                        <motion.tr 
                          key={u.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                                u.role === 'ADMIN' ? "bg-primary/20 text-primary" : "bg-slate-800 text-slate-400"
                              )}>
                                {u.username[0].toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                                  {u.username}
                                  {u.id === currentUser?.id && <span className="ml-2 text-[8px] bg-white/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">You</span>}
                                </span>
                                <span className="text-xs text-slate-500">{u.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                              u.role === 'ADMIN' ? "bg-primary/10 text-primary" : "bg-slate-800 text-slate-400"
                            )}>
                              {u.role === 'ADMIN' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                              {u.role}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-mono text-white">{u._count.histories}</span>
                              <span className="text-[10px] text-slate-500">Visualizations</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-slate-500 font-mono">{new Date(u.createdAt).toLocaleDateString()}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleToggleRole(u.id, u.role)}
                                disabled={u.id === currentUser?.id}
                                className={cn(
                                  "p-2 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed",
                                  u.role === 'ADMIN' 
                                    ? "bg-slate-800 text-slate-400 hover:text-white" 
                                    : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                )}
                                title={u.role === 'ADMIN' ? "Revoke Admin" : "Make Admin"}
                              >
                                {u.role === 'ADMIN' ? <Shield size={18} /> : <ShieldCheck size={18} />}
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(u.id)}
                                disabled={u.id === currentUser?.id}
                                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Delete User"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="py-20 text-center">
                    <Users className="mx-auto text-slate-800 mb-4" size={48} />
                    <p className="text-slate-500 text-sm italic">No users found matching your search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
