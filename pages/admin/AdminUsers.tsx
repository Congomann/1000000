
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { User, UserRole, AdvisorCategory, ProductType } from '../../types';
import { Trash2, Plus, Search, Edit2, Shield, Globe, Power, PowerOff, X, Check, Save, Archive, RotateCcw, AlertTriangle, Briefcase, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminUsers: React.FC = () => {
  const { allUsers, addAdvisor, deleteAdvisor, updateUser, restoreUser, permanentlyDeleteUser } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  
  // Add User Form State
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

  const handlePermanentDelete = (id: string) => {
      if(window.confirm('This action is permanent and cannot be undone. Delete user forever?')) {
          permanentlyDeleteUser(id);
      }
  };
  
  const toggleMicrosite = (id: string, currentStatus: boolean | undefined) => {
      updateUser(id, { micrositeEnabled: !currentStatus });
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

  const toggleProductInForm = (product: ProductType, isEdit: boolean) => {
      if (isEdit && editingUser) {
          const current = editingUser.productsSold || [];
          const updated = current.includes(product) 
              ? current.filter(p => p !== product) 
              : [...current, product];
          setEditingUser({ ...editingUser, productsSold: updated });
      } else {
          const current = formData.productsSold || [];
          const updated = current.includes(product) 
              ? current.filter(p => p !== product) 
              : [...current, product];
          setFormData({ ...formData, productsSold: updated });
      }
  };

  return (
    <div className="space-y-6">
        {/* Header Section from Screenshot */}
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

        {/* Search Bar */}
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

        {/* User List Layout matched to screenshot */}
        <div className="space-y-px bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-xl overflow-hidden">
            {filteredUsers.map((user, idx) => {
                const advisorSlug = user.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                const isEven = idx % 2 === 0;
                
                return (
                    <div 
                        key={user.id} 
                        className={`flex items-center p-6 transition-all duration-300 ${showArchived ? 'bg-orange-50/20 grayscale-[0.5]' : isEven ? 'bg-white/40' : 'bg-slate-50/30'} hover:bg-white hover:shadow-lg hover:z-10 group relative border-b border-slate-100 last:border-b-0`}
                    >
                        {/* 1. Avatar & Identity */}
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
                                {!showArchived && (
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h3 className={`font-black text-sm truncate ${showArchived ? 'text-slate-500' : 'text-slate-800'}`}>{user.name}</h3>
                                <p className="text-[11px] text-slate-400 font-bold truncate">{user.email}</p>
                            </div>
                        </div>

                        {/* 2. Role Badge */}
                        <div className="w-1/6 flex justify-center">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                user.role === UserRole.ADMIN ? 'bg-red-50 text-red-600' : 
                                user.role === UserRole.MANAGER ? 'bg-purple-50 text-purple-600' :
                                user.role === UserRole.SUB_ADMIN ? 'bg-indigo-50 text-indigo-600' :
                                'bg-blue-50 text-blue-600'
                            }`}>
                                {user.role}
                            </span>
                        </div>

                        {/* 3. Status Icons (Microsite/Online) */}
                        <div className="w-1/12 flex items-center justify-center gap-3">
                            {user.role === UserRole.ADVISOR && !showArchived ? (
                                <>
                                    <button 
                                        onClick={() => toggleMicrosite(user.id, user.micrositeEnabled)}
                                        className={`transition-colors ${user.micrositeEnabled ? 'text-green-500' : 'text-slate-300'}`}
                                        title={user.micrositeEnabled ? 'Disable Microsite' : 'Enable Microsite'}
                                    >
                                        <Power className="h-4 w-4" />
                                    </button>
                                    <Link 
                                        to={`/advisor/${advisorSlug}`} 
                                        target="_blank" 
                                        className={`transition-colors ${user.micrositeEnabled ? 'text-slate-400 hover:text-blue-500' : 'text-slate-200 pointer-events-none'}`}
                                        title="View Public Profile"
                                    >
                                        <Globe className="h-4 w-4" />
                                    </Link>
                                </>
                            ) : !showArchived ? (
                                <span className="text-slate-200"><Power className="h-4 w-4 opacity-30" /></span>
                            ) : null}
                            {showArchived && (
                                <AlertTriangle className="h-4 w-4 text-red-400" title={`Archived: ${new Date(user.deletedAt!).toLocaleDateString()}`} />
                            )}
                        </div>

                        {/* 4. Authorized Products (Badges) */}
                        <div className="flex-1 flex flex-wrap gap-2 px-6 justify-center">
                            {user.productsSold && user.productsSold.length > 0 ? (
                                user.productsSold.slice(0, 3).map(p => (
                                    <span key={p} className="text-[9px] font-black uppercase bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-100 shadow-sm whitespace-nowrap">
                                        {p}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[10px] font-bold text-slate-300 italic uppercase tracking-widest">None Assigned</span>
                            )}
                            {user.productsSold && user.productsSold.length > 3 && (
                                <span className="text-[9px] font-black text-slate-400 py-1">+{user.productsSold.length - 3}</span>
                            )}
                        </div>

                        {/* 5. Actions (Edit / Delete) */}
                        <div className="w-1/6 flex items-center justify-end gap-2">
                            {showArchived ? (
                                <>
                                    <button 
                                        onClick={() => restoreUser(user.id)}
                                        className="p-2.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-sm"
                                        title="Restore User"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => handlePermanentDelete(user.id)}
                                        className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                                        title="Delete Forever"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => handleEditClick(user)}
                                        className="p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                                        title="Edit Profile"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.id, user.name)}
                                        className="p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                                        title="Archive User"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
            
            {filteredUsers.length === 0 && (
                <div className="p-20 text-center bg-white/40">
                    <Shield className="h-16 w-16 mx-auto mb-4 text-slate-200" />
                    <p className="font-black text-slate-400 uppercase tracking-[0.2em] text-sm">No Terminal Activity Found</p>
                    <p className="text-xs text-slate-400 mt-2 font-medium">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>

        {/* Add User Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-8 animate-fade-in max-h-[90vh] overflow-y-auto border border-white/20">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-black text-[#0B2240] tracking-tight">Provision New Terminal User</h2>
                        <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
                    </div>
                    <form onSubmit={handleAddUser} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Legal Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent outline-none transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder="Enter full name..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent outline-none transition-all"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    placeholder="email@nhfg.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Access Permissions (Role)</label>
                                <div className="relative">
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-black focus:ring-2 focus:ring-[#0A62A7] appearance-none cursor-pointer outline-none transition-all"
                                        value={formData.role}
                                        onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                                    >
                                        {Object.values(UserRole).filter(r => r !== UserRole.CLIENT).map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Product Lines Selection */}
                        <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Briefcase className="h-3.5 w-3.5" /> Assigned Product Verticals
                            </h3>
                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {Object.values(ProductType).map(product => (
                                    <button
                                        key={product}
                                        type="button"
                                        onClick={() => toggleProductInForm(product, false)}
                                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-[11px] font-black uppercase tracking-wide transition-all ${
                                            (formData.productsSold || []).includes(product)
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200'
                                        }`}
                                    >
                                        <span>{product}</span>
                                        {(formData.productsSold || []).includes(product) ? <Check className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border-2 border-slate-200" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all">Cancel</button>
                            <button type="submit" className="flex-1 py-4 rounded-full font-black text-[10px] uppercase tracking-widest bg-[#0A62A7] text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20">Authorize Account</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-10 animate-fade-in relative max-h-[90vh] overflow-y-auto border border-white/20">
                    <button onClick={() => setEditingUser(null)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"><X size={24}/></button>
                    <h2 className="text-2xl font-black text-[#0B2240] mb-8 tracking-tight">Modify Terminal User</h2>
                    <form onSubmit={handleUpdateUser} className="space-y-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none"
                                    value={editingUser.name}
                                    onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Terminal ID (Email)</label>
                                <input 
                                    type="email" 
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none"
                                    value={editingUser.email}
                                    onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">System Role</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-black focus:ring-2 focus:ring-[#0A62A7] appearance-none outline-none cursor-pointer"
                                            value={editingUser.role}
                                            onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})}
                                        >
                                            {Object.values(UserRole).map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">License Reg.</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none"
                                        value={editingUser.license_state || ''}
                                        onChange={e => setEditingUser({...editingUser, license_state: e.target.value})}
                                        placeholder="e.g. 24 States"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Lines Selection (Edit) */}
                        <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Briefcase className="h-3.5 w-3.5" /> Product Authority List
                            </h3>
                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {Object.values(ProductType).map(product => (
                                    <button
                                        key={product}
                                        type="button"
                                        onClick={() => toggleProductInForm(product, true)}
                                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-[11px] font-black uppercase tracking-wide transition-all ${
                                            (editingUser.productsSold || []).includes(product)
                                                ? 'bg-[#0A62A7] text-white border-[#0A62A7] shadow-lg'
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200'
                                        }`}
                                    >
                                        <span>{product}</span>
                                        {(editingUser.productsSold || []).includes(product) ? <Check className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border-2 border-slate-200" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {editingUser.role === UserRole.ADVISOR && (
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-[#0B2240] uppercase tracking-widest">Advisor Microsite</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-tighter">Public presence on website</p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setEditingUser({...editingUser, micrositeEnabled: !editingUser.micrositeEnabled})}
                                    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${editingUser.micrositeEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
                                >
                                    <span 
                                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${editingUser.micrositeEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                        )}

                        <div className="pt-4 flex gap-4">
                            <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-4 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all">Discard</button>
                            <button type="submit" className="flex-1 py-4 rounded-full font-black text-[10px] uppercase tracking-widest bg-[#0B2240] text-white hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2">
                                <Save size={16} /> Apply Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};
