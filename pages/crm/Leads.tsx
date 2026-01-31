import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Lead, LeadStatus, UserRole, ProductType } from '../../types';
import { Sparkles, Loader2, Filter, Search, X, Eye, ChevronDown, Edit2, Save, Globe, CheckSquare, Square, Trash, CheckCircle2, AlertTriangle, Clock, Info, UserCheck, Archive, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DetailRowProps {
  label: string;
  value: any;
  isEditing: boolean;
  onChange: (val: any) => void;
  type?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, isEditing, onChange, type = "text" }) => {
    if (!isEditing) {
        return (
            <div className="mb-4">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
                <span className="text-slate-900 font-medium text-base">{value || <span className="text-slate-300 italic">Not provided</span>}</span>
            </div>
        );
    }
    return (
        <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
            <input 
                type={type}
                className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent outline-none"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

const PriorityBadge = ({ priority }: { priority?: string }) => {
    switch (priority) {
        case 'High':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter bg-red-100 text-red-600 border border-red-200">
                    <AlertTriangle size={10} /> High
                </span>
            );
        case 'Medium':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter bg-orange-100 text-orange-600 border border-orange-200">
                    <Clock size={10} /> Medium
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter bg-blue-100 text-blue-600 border border-blue-200">
                    <Info size={10} /> Low
                </span>
            );
    }
};

export const Leads: React.FC = () => {
  const { leads, updateLeadStatus, updateLead, user, allUsers, reAnalyzeLead } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [assignedFilter, setAssignedFilter] = useState<string>('All');
  const [showArchived, setShowArchived] = useState(false);
  const [viewLead, setViewLead] = useState<Lead | null>(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editedLeadData, setEditedLeadData] = useState<Partial<Lead>>({});
  
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [showBulkSuccess, setShowBulkSuccess] = useState(false);

  const isAdvisor = user?.role === UserRole.ADVISOR;
  const isAdminOrManager = user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER || user?.role === UserRole.SUB_ADMIN;

  const advisorsList = useMemo(() => allUsers.filter(u => u.role === UserRole.ADVISOR), [allUsers]);

  const uniqueSources = useMemo(() => {
    const sources = new Set<string>();
    leads.forEach(l => { if (l.source) sources.add(l.source); });
    return Array.from(sources).sort();
  }, [leads]);

  const filteredLeads = useMemo(() => {
    let list = [...leads];
    list = list.filter(l => showArchived ? l.isArchived : !l.isArchived);
    if (isAdvisor && user) list = list.filter(l => l.assignedTo === user.id || !l.assignedTo);
    if (statusFilter !== 'All') list = list.filter(l => l.status === statusFilter);
    if (sourceFilter !== 'All') list = list.filter(l => l.source === sourceFilter);
    if (assignedFilter !== 'All') {
        if (assignedFilter === 'Unassigned') list = list.filter(l => !l.assignedTo);
        else list = list.filter(l => l.assignedTo === assignedFilter);
    }
    if (searchTerm) {
        const q = searchTerm.toLowerCase();
        list = list.filter(l => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.interest.toLowerCase().includes(q));
    }
    return list.sort((a, b) => {
        const priorityScore: any = { 'High': 3, 'Medium': 2, 'Low': 1 };
        const scoreA = priorityScore[a.priority || 'Low'];
        const scoreB = priorityScore[b.priority || 'Low'];
        if (scoreA !== scoreB) return scoreB - scoreA;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [leads, user, isAdvisor, statusFilter, sourceFilter, assignedFilter, searchTerm, showArchived]);

  const toggleSelectAll = () => {
    if (selectedLeadIds.size === filteredLeads.length && filteredLeads.length > 0) setSelectedLeadIds(new Set());
    else setSelectedLeadIds(new Set(filteredLeads.map(l => l.id)));
  };

  const toggleSelectLead = (id: string) => {
    const next = new Set(selectedLeadIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedLeadIds(next);
  };

  const handleBulkStatusUpdate = (newStatus: LeadStatus) => {
    if (selectedLeadIds.size === 0) return;
    selectedLeadIds.forEach(id => updateLeadStatus(id, newStatus));
    setSelectedLeadIds(new Set());
    setShowBulkSuccess(true);
    setTimeout(() => setShowBulkSuccess(false), 3000);
  };

  const handleOpenView = (lead: Lead) => {
      setViewLead(lead);
      setEditedLeadData({...lead});
      setIsEditing(false);
  };

  const handleSaveChanges = () => {
      if (viewLead && editedLeadData) {
          updateLead(viewLead.id, editedLeadData);
          setViewLead(prev => prev ? ({...prev, ...editedLeadData} as Lead) : null);
          setIsEditing(false);
      }
  };

  const handleReAnalyze = async () => {
    if (viewLead) {
      setIsAnalyzing(true);
      await reAnalyzeLead(viewLead.id);
      const updated = leads.find(l => l.id === viewLead.id);
      if (updated) setViewLead(updated);
      setIsAnalyzing(false);
    }
  };

  const statusColors: any = {
    [LeadStatus.NEW]: 'bg-blue-100 text-blue-800',
    [LeadStatus.CONTACTED]: 'bg-yellow-100 text-yellow-800',
    [LeadStatus.UNAVAILABLE]: 'bg-orange-100 text-orange-800',
    [LeadStatus.PROPOSAL]: 'bg-purple-100 text-purple-800',
    [LeadStatus.APPROVED]: 'bg-green-100 text-green-800',
    [LeadStatus.CLOSED]: 'bg-gray-100 text-gray-800',
    [LeadStatus.LOST]: 'bg-red-100 text-red-700',
    [LeadStatus.ASSIGNED]: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <div className="space-y-8 relative">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{showArchived ? 'Archived Leads' : 'Leads Database'}</h1>
            <p className="text-slate-500 mt-1 font-medium">{showArchived ? 'Viewing inactive or lost leads older than 15 days.' : 'Capture insights, manage follow-ups, and log legal requests.'}</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => setShowArchived(!showArchived)} className={`flex items-center gap-2 px-6 py-4 rounded-full text-sm font-bold transition-all border ${showArchived ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 shadow-sm'}`}><Archive size={16} /> {showArchived ? 'Show Active' : 'Show Archived'}</button>
             <Link to="/crm/intake" className="bg-[#0A62A7] text-white px-8 py-4 rounded-full text-sm font-bold shadow-xl hover:bg-blue-700 transition-all">+ New Lead</Link>
          </div>
        </div>

        {showBulkSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce-subtle">
            <CheckCircle2 className="h-6 w-6" />
            <span className="font-bold">Bulk update successful! Leads processed.</span>
          </div>
        )}

        <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input type="text" placeholder="Filter by name, email, or interest..." className="w-full pl-12 pr-6 py-4 bg-white text-slate-900 border border-slate-200 rounded-[2rem] text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
            </div>
            <div className="flex flex-wrap gap-3 w-full xl:w-auto">
                <div className="relative min-w-[150px] flex-1">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <select className="w-full bg-white text-slate-900 border border-slate-200 rounded-[2rem] pl-10 pr-10 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] cursor-pointer appearance-none shadow-sm" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
                        <option value="All">All Sources</option>
                        {uniqueSources.map(src => <option key={src} value={src}>{src}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                {isAdminOrManager && (
                    <div className="relative min-w-[180px] flex-1">
                        <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <select className="w-full bg-white text-slate-900 border border-slate-200 rounded-[2rem] pl-10 pr-10 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] cursor-pointer appearance-none shadow-sm" value={assignedFilter} onChange={e => setAssignedFilter(e.target.value)}>
                            <option value="All">All Advisors</option>
                            <option value="Unassigned">Unassigned</option>
                            {advisorsList.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                )}
                <div className="relative min-w-[150px] flex-1">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <select className="w-full bg-white text-slate-900 border border-slate-200 rounded-[2rem] pl-10 pr-10 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] cursor-pointer appearance-none shadow-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="All">All Status</option>
                        {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>

        {selectedLeadIds.size > 0 && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 bg-[#0B2240] text-white px-8 py-5 rounded-[2.5rem] shadow-2xl border border-white/10 flex items-center gap-8 animate-slide-up">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black">{selectedLeadIds.size}</span>
              <span className="text-xs font-black uppercase tracking-widest text-blue-100">Leads Selected</span>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex gap-2">
              <button onClick={() => handleBulkStatusUpdate(LeadStatus.CONTACTED)} className="px-5 py-2 bg-yellow-500 text-[#0B2240] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all">Mark Contacted</button>
              <button onClick={() => handleBulkStatusUpdate(LeadStatus.CLOSED)} className="px-5 py-2 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 transition-all">Mark Closed</button>
              <button onClick={() => handleBulkStatusUpdate(LeadStatus.LOST)} className="px-5 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all">Mark Lost</button>
              <button onClick={() => setSelectedLeadIds(new Set())} className="p-2 text-slate-400 hover:text-white transition-all"><X size={18}/></button>
            </div>
          </div>
        )}

        <div className="bg-white shadow-sm border border-slate-200 rounded-[3rem] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-8 py-6 text-left">
                              <button onClick={toggleSelectAll} className="p-1 rounded hover:bg-slate-200 transition-colors">{selectedLeadIds.size === filteredLeads.length && filteredLeads.length > 0 ? <CheckSquare className="h-5 w-5 text-blue-600" /> : <Square className="h-5 w-5 text-slate-300" />}</button>
                            </th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Profile</th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Interest</th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {filteredLeads.map((lead) => (
                            <tr key={lead.id} className={`hover:bg-slate-50/50 transition-colors ${selectedLeadIds.has(lead.id) ? 'bg-blue-50/50' : ''}`}>
                                <td className="px-8 py-6 whitespace-nowrap">
                                  <button onClick={() => toggleSelectLead(lead.id)} className="p-1 rounded hover:bg-white transition-colors">{selectedLeadIds.has(lead.id) ? <CheckSquare className="h-5 w-5 text-blue-600" /> : <Square className="h-5 w-5 text-slate-200" />}</button>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 bg-[#0B2240] rounded-full flex items-center justify-center text-white font-bold border border-slate-200">{lead.name.charAt(0)}</div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-slate-900">{lead.name}</div>
                                            <div className="text-xs text-slate-400 font-medium">{lead.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap"><span className="text-xs font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">{lead.interest}</span></td>
                                <td className="px-8 py-6 whitespace-nowrap"><PriorityBadge priority={lead.priority} /></td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-blue-600 uppercase tracking-tighter">{lead.source || 'Direct'}</span>
                                        <span className="text-[10px] text-slate-400 font-bold">{new Date(lead.date).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <div className="relative">
                                        <select className={`text-xs font-bold border-none rounded-full px-4 py-2 cursor-pointer appearance-none pr-8 ${statusColors[lead.status] || 'bg-slate-100'}`} value={lead.status} onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}>
                                            {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none opacity-50" />
                                    </div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <button onClick={() => handleOpenView(lead)} className="inline-flex items-center px-5 py-2.5 border border-slate-200 bg-white text-slate-600 text-xs font-bold rounded-full hover:bg-slate-50 transition-all shadow-sm">
                                        <Eye className="h-3 w-3 mr-2" /> Open Profile
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {viewLead && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/70 backdrop-blur-md p-6 animate-fade-in">
                <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-5xl p-10 relative max-h-[90vh] overflow-y-auto border border-white/20">
                     <div className="flex justify-between items-center mb-10">
                         <div className="flex items-center gap-5">
                             <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl">
                                 <BrainCircuit size={32} className={isAnalyzing ? 'animate-pulse' : ''} />
                             </div>
                             <div>
                                 <h2 className="text-3xl font-black text-[#0B2240]">Lead Intelligence Hub</h2>
                                 <p className="text-slate-500 text-sm font-medium">{viewLead.name} • {viewLead.interest}</p>
                             </div>
                         </div>
                         <div className="flex gap-3">
                             <button onClick={handleReAnalyze} disabled={isAnalyzing} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm shadow-lg transition-all disabled:opacity-50">
                                 {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} 
                                 Analyze with Gemini 3
                             </button>
                             <button onClick={() => { setViewLead(null); setIsEditing(false); }} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all"><X className="h-5 w-5" /></button>
                         </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         <div className="lg:col-span-1 space-y-6">
                             <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Core Demographics</h3>
                                 <DetailRow label="Full Name" value={editedLeadData.name} isEditing={isEditing} onChange={(v) => setEditedLeadData({...editedLeadData, name: v})} />
                                 <DetailRow label="Email" value={editedLeadData.email} isEditing={isEditing} onChange={(v) => setEditedLeadData({...editedLeadData, email: v})} />
                                 <DetailRow label="Phone" value={editedLeadData.phone} isEditing={isEditing} onChange={(v) => setEditedLeadData({...editedLeadData, phone: v})} />
                                 <div className="pt-4 border-t border-slate-200">
                                     <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Priority Level</span>
                                     <select className={`w-full p-2 rounded-xl border border-slate-200 font-bold text-xs ${editedLeadData.priority === 'High' ? 'bg-red-100 text-red-700' : editedLeadData.priority === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`} value={editedLeadData.priority || 'Low'} onChange={(e) => setEditedLeadData({...editedLeadData, priority: e.target.value as any})} disabled={!isEditing}>
                                         <option value="High">High Priority</option>
                                         <option value="Medium">Medium Priority</option>
                                         <option value="Low">Low Priority</option>
                                     </select>
                                 </div>
                             </div>
                             
                             <div className="bg-[#0B2240] p-8 rounded-[2.5rem] text-white shadow-xl">
                                <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">Lead Score: {viewLead.score}</h3>
                                <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                                    <div className="bg-blue-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${viewLead.score}%` }}></div>
                                </div>
                                <p className="text-xs text-blue-100 font-medium leading-relaxed italic">"Probability of conversion is optimized. Direct call recommended within next 4 business hours."</p>
                             </div>
                         </div>

                         <div className="lg:col-span-2 space-y-6">
                             {/* AI STRATEGIC BRIEF */}
                             <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100 shadow-sm relative overflow-hidden group">
                                 <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 transition-transform group-hover:scale-110"><BrainCircuit size={160} /></div>
                                 <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-black text-blue-900 flex items-center gap-2"><Sparkles className="h-5 w-5 text-blue-600" /> Neural Intelligence Brief</h3>
                                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full border border-blue-100">Gemini 3 Pro Engine</span>
                                 </div>
                                 <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-blue-100 text-slate-700 text-sm leading-relaxed font-medium min-h-[150px] whitespace-pre-wrap">
                                     {viewLead.aiAnalysis ? viewLead.aiAnalysis : (
                                         <div className="text-center py-10">
                                             <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-300 mb-4" />
                                             <p className="text-slate-400 italic">No analysis generated yet. Click 'Analyze with Gemini' to map this lead's strategy.</p>
                                         </div>
                                     )}
                                 </div>
                             </div>

                             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                 <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Administrative History</h3>
                                 </div>
                                 <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] outline-none resize-none text-slate-900" rows={6} placeholder="Add interaction history or legal DNC requests..." value={editedLeadData.notes || ''} onChange={(e) => setEditedLeadData({...editedLeadData, notes: e.target.value})} readOnly={!isEditing}/>
                             </div>
                         </div>
                     </div>
                     
                     <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end gap-4">
                         {!isEditing ? (
                             <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-sm transition-all"><Edit2 className="h-4 w-4" /> Unlock Edit Mode</button>
                         ) : (
                             <button onClick={handleSaveChanges} className="flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-sm shadow-lg transition-all"><Save className="h-4 w-4" /> Save Record</button>
                         )}
                     </div>
                </div>
            </div>
        )}
    </div>
  );
};