
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { User, UserRole, AdvisorCategory, ProductType } from '../../types';
import { Trash2, Plus, Search, Edit2, Shield, Globe, Power, PowerOff, X, Check, Save, Archive, RotateCcw, AlertTriangle, Briefcase, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminUsers: React.FC = () => {
  const { allUsers, addAdvisor, deleteAdvisor, updateUser, restoreUser, permanentlyDeleteUser } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  
  const [formData, setFormData] = useState<Partial<User>>({
      name: '',
      email: '',
      role: UserRole.ADVISOR,
      category: AdvisorCategory.INSURANCE,
      productsSold: [],
      micrositeEnabled: true
  });

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const isArchived = !!u.deletedAt;
    return matchesSearch && (showArchived ? isArchived : !isArchived);
  });

  const handleAddUser = (e: React.FormEvent) => {
      e.preventDefault();
      if(formData.name && formData.email) {
          addAdvisor(formData as User);
          setIsModalOpen(false);
          setFormData({ name: '', email: '', role: UserRole.ADVISOR, category: AdvisorCategory.INSURANCE, productsSold: [], micrositeEnabled: true });
      }
  };

  const handleDelete = (id: string, name: string) => {
      if(window.confirm(`Are you sure you want to remove ${name}? They will be moved to the archive.`)) {
          deleteAdvisor(id);
      }
  };

  const handleEditClick = (user: User) => {
      setEditingUser({
          ...user,
          productsSold: user.productsSold || []
      });
  };

  const handleUpdateUser = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingUser) {
          updateUser(editingUser.id, editingUser);
          setEditingUser(null);
      }
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4">
            <div>
                <h1 className="text-sm font-black text-slate-800 tracking-tight">{showArchived ? 'Archived Terminal' : 'Active Terminal'}</h1>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${showArchived ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {showArchived ? 'Archive View Mode' : 'Real-time Feed Active'}
                    </span>
                </div>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
                <button 
                    onClick={() => setShowArchived(!showArchived)}
                    className={`px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-sm transition-all flex items-center gap-2 border ${showArchived ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                    <Archive className="h-3 w-3" /> {showArchived ? 'Active Users' : 'Archived'}
                </button>
                {!showArchived && (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#0A62A7] text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-sm hover:bg-blue-700 transition-all flex items-center gap-2 uppercase tracking-widest"
                    >
                        <Plus className="h-4 w-4" /> Add User
                    </button>
                )}
            </div>
        </div>

        <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
                type="text" 
                placeholder={showArchived ? "Search archived users..." : "Search terminal users..."}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
        </div>

        <div className="space-y-px bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-xl overflow-hidden">
            {filteredUsers.map((user, idx) => {
                const isEven = idx % 2 === 0;
                return (
                    <div 
                        key={user.id} 
                        className={`flex items-center p-6 transition-all duration-300 ${showArchived ? 'bg-orange-50/20 grayscale-[0.5]' : isEven ? 'bg-white/40' : 'bg-slate-50/30'} hover:bg-white hover:shadow-lg hover:z-10 group relative border-b border-slate-100 last:border-b-0`}
                    >
                        <div className="flex items-center gap-4 w-1/4 min-w-[240px]">
                            <div className="relative flex-shrink-0">
                                <div className={`h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm ${showArchived ? 'bg-slate-200' : 'bg-blue-50'}`}>
                                    {user.avatar ? (
                                        <img src={user.avatar} className="h-full w-full object-cover" alt="" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center font-black text-slate-400 text-sm">
                                            {user.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                {!showArchived && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>}
                            </div>
                            <div className="min-w-0">
                                <h3 className={`font-black text-sm truncate ${showArchived ? 'text-slate-500' : 'text-slate-800'}`}>{user.name}</h3>
                                <p className="text-[11px] text-slate-400 font-bold truncate">{user.email}</p>
                            </div>
                        </div>

                        <div className="w-1/6 flex justify-center items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                user.role === UserRole.ADMIN ? 'bg-red-50 text-red-600' : 
                                user.role === UserRole.MANAGER ? 'bg-purple-50 text-purple-600' :
                                'bg-blue-50 text-blue-600'
                            }`}>
                                {user.role}
                            </span>
                            {!showArchived && user.role === UserRole.ADVISOR && (
                                <div title={user.micrositeEnabled ? "Public Microsite Live" : "Public Microsite Hidden"}>
                                    {user.micrositeEnabled ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4 text-slate-300" />}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-wrap gap-2 px-6 justify-center">
                            {user.productsSold?.slice(0, 3).map(p => (
                                <span key={p} className="text-[9px] font-black uppercase bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-100 shadow-sm whitespace-nowrap">
                                    {p}
                                </span>
                            ))}
                        </div>

                        <div className="w-1/6 flex items-center justify-end gap-2">
                            {showArchived ? (
                                <button onClick={() => restoreUser(user.id)} className="p-2.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-sm">
                                    <RotateCcw className="h-4 w-4" />
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => handleEditClick(user)} className="p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDelete(user.id, user.name)} className="p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Edit User Modal - Mastering Microsite Visibility */}
        {editingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/60 backdrop-blur-md p-4 animate-fade-in">
                <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg p-10 relative border border-white/20">
                    <button onClick={() => setEditingUser(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors"><X size={24}/></button>
                    <h2 className="text-2xl font-black text-[#0B2240] mb-8 tracking-tight">Modify User Configuration</h2>
                    
                    <form onSubmit={handleUpdateUser} className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Core Attributes</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 ml-1">Full Name</label>
                                    <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 ml-1">Email</label>
                                    <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        {/* MASTER MICROSITE TOGGLE - ADMIN ONLY CONTROL */}
                        {editingUser.role === UserRole.ADVISOR && (
                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-blue-900">Microsite Visibility</h3>
                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Master Administrative Control</p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setEditingUser({...editingUser, micrositeEnabled: !editingUser.micrositeEnabled})}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${editingUser.micrositeEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${editingUser.micrositeEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        )}

                        <div className="pt-6 flex gap-4">
                            <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-4 bg-slate-100 text-slate-400 font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-slate-200">Cancel</button>
                            <button type="submit" className="flex-1 py-4 bg-[#0B2240] text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-blue-900/20 active:scale-95 transition-all">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Add User Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/60 backdrop-blur-md p-4 animate-fade-in">
                <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg p-10 relative border border-white/20">
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors"><X size={24}/></button>
                    <h2 className="text-2xl font-black text-[#0B2240] mb-8 tracking-tight">Provision New User</h2>
                    <form onSubmit={handleAddUser} className="space-y-6">
                        <div className="space-y-4">
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" required placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                                {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="pt-6 flex gap-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-400 font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-slate-200">Cancel</button>
                            <button type="submit" className="flex-1 py-4 bg-[#0B2240] text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-blue-900/20">Add User</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};
