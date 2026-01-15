
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Lead, LeadStatus, UserRole, ProductType } from '../../types';
import { Sparkles, Loader2, Filter, Search, X, Eye, ChevronDown, Edit2, Save } from 'lucide-react';
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

export const Leads: React.FC = () => {
  const { leads, updateLeadStatus, updateLead, user } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewLead, setViewLead] = useState<Lead | null>(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [editedLeadData, setEditedLeadData] = useState<Partial<Lead>>({});

  const isAdvisor = user?.role === UserRole.ADVISOR;

  const filteredLeads = useMemo(() => {
    let list = [...leads];
    // Advisors see: 1. Assigned to them OR 2. Unassigned pool leads
    if (isAdvisor && user) {
        list = list.filter(l => l.assignedTo === user.id || !l.assignedTo);
    }
    
    if (statusFilter !== 'All') {
        list = list.filter(l => l.status === statusFilter);
    }
    
    if (searchTerm) {
        const q = searchTerm.toLowerCase();
        list = list.filter(l => 
            l.name.toLowerCase().includes(q) || 
            l.email.toLowerCase().includes(q) ||
            l.interest.toLowerCase().includes(q)
        );
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [leads, user, isAdvisor, statusFilter, searchTerm]);

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
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leads Database</h1>
            <p className="text-slate-500 mt-1 font-medium">Capture insights, manage follow-ups, and log legal requests.</p>
          </div>
          <div className="flex gap-2">
             <Link to="/crm/intake" className="bg-[#0A62A7] text-white px-8 py-4 rounded-full text-sm font-bold shadow-xl hover:bg-blue-700 transition-all">+ New Lead</Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col md:flex-row gap-5 items-center">
            <div className="relative flex-1 md:w-80">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Filter by name, email, or interest..." 
                    className="w-full pl-12 pr-6 py-4 bg-white text-slate-900 border border-slate-200 rounded-[2rem] text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <select 
                className="bg-white text-slate-900 border border-slate-200 rounded-[2rem] px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] cursor-pointer appearance-none pr-10"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
            >
                <option value="All">All Status</option>
                {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>

        {/* Lead Table */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-[3rem] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Profile</th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Interest</th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Acquired</th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {filteredLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 bg-[#0B2240] rounded-full flex items-center justify-center text-white font-bold border border-slate-200">{lead.name.charAt(0)}</div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-slate-900">{lead.name}</div>
                                            <div className="text-xs text-slate-400 font-medium">{lead.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">{lead.interest}</span>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <div className="relative">
                                        <select 
                                            className={`text-xs font-bold border-none rounded-full px-4 py-2 cursor-pointer appearance-none pr-8 ${statusColors[lead.status] || 'bg-slate-100'}`}
                                            value={lead.status}
                                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                                        >
                                            {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none opacity-50" />
                                    </div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-tight">{new Date(lead.date).toLocaleDateString()}</div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <button onClick={() => handleOpenView(lead)} className="inline-flex items-center px-5 py-2.5 border border-slate-200 bg-white text-slate-600 text-xs font-bold rounded-full hover:bg-slate-50 transition-all shadow-sm">
                                        <Eye className="h-3 w-3 mr-2" /> Open Profile / Notes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Edit Lead & Legal Notes Modal */}
        {viewLead && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/70 backdrop-blur-md p-6 animate-fade-in">
                <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-4xl p-10 relative max-h-[90vh] overflow-y-auto border border-white/20">
                     <div className="flex justify-between items-center mb-10">
                         <div>
                             <h2 className="text-3xl font-black text-[#0B2240]">Advisor Terminal: Lead Record</h2>
                             <p className="text-slate-500 text-sm font-medium">{isEditing ? 'Editing Mode Active' : 'View record and log interaction notes'}</p>
                         </div>
                         <div className="flex gap-3">
                             {!isEditing ? (
                                 <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-sm transition-all"><Edit2 className="h-4 w-4" /> Edit Record</button>
                             ) : (
                                 <button onClick={handleSaveChanges} className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-sm shadow-lg transition-all"><Save className="h-4 w-4" /> Save Record</button>
                             )}
                             <button onClick={() => { setViewLead(null); setIsEditing(false); }} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all"><X className="h-5 w-5" /></button>
                         </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         <div className="lg:col-span-1 space-y-6">
                             <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Lead Identity</h3>
                                 <DetailRow label="Full Name" value={editedLeadData.name} isEditing={isEditing} onChange={(v) => setEditedLeadData({...editedLeadData, name: v})} />
                                 <DetailRow label="Email" value={editedLeadData.email} isEditing={isEditing} onChange={(v) => setEditedLeadData({...editedLeadData, email: v})} />
                                 <DetailRow label="Phone" value={editedLeadData.phone} isEditing={isEditing} onChange={(v) => setEditedLeadData({...editedLeadData, phone: v})} />
                                 <div className="mt-4 pt-4 border-t border-slate-200">
                                     <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Current Status</span>
                                     <select 
                                        className={`w-full p-2 rounded-xl border border-slate-200 font-bold text-xs ${statusColors[editedLeadData.status || LeadStatus.NEW]}`}
                                        value={editedLeadData.status}
                                        onChange={(e) => setEditedLeadData({...editedLeadData, status: e.target.value as LeadStatus})}
                                        disabled={!isEditing}
                                     >
                                         {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                     </select>
                                 </div>
                             </div>
                         </div>

                         <div className="lg:col-span-2 space-y-6">
                             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                 <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Internal Activity & Compliance Logs</h3>
                                    <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-lg font-bold uppercase">Legal Documentation Required</span>
                                 </div>
                                 <p className="text-[10px] text-orange-500 font-black uppercase mb-4 tracking-wider bg-orange-50 p-2 rounded-lg">Important: Immediately log "Do Not Contact" requests here to avoid potential regulatory lawsuits.</p>
                                 <textarea 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent outline-none resize-none text-slate-900 placeholder:text-slate-300"
                                    rows={8}
                                    placeholder="Add interaction history, legal DNC requests, or underwriting notes..."
                                    value={editedLeadData.notes || ''}
                                    onChange={(e) => setEditedLeadData({...editedLeadData, notes: e.target.value})}
                                    readOnly={!isEditing}
                                 />
                                 {!isEditing && <p className="text-xs text-slate-400 mt-4 italic font-medium">Advisor Note: Click 'Edit Record' to update interaction logs or status.</p>}
                             </div>

                             <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Initial Customer Message</h3>
                                 <div className="p-6 bg-white rounded-2xl border border-slate-200 text-slate-700 text-sm italic font-medium leading-relaxed">
                                     {viewLead.message || "No initial inquiry message provided by client."}
                                 </div>
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        )}
    </div>
  );
};
