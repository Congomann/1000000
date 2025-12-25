
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Archive, Mail, Phone, FileText, Inbox as InboxIcon, Clock, PhoneIncoming, FileQuestion, ChevronDown, MessageSquare } from 'lucide-react';
import { LeadStatus, UserRole } from '../../types';

export const Inbox: React.FC = () => {
  const { leads, updateLeadStatus, user } = useData();
  
  // --- Inquiries State ---
  const [filterType, setFilterType] = useState<'new' | 'active' | 'closed'>('new');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // --- Filter Leads for Inbox ---
  // STRICT: Advisors only see their assigned leads. Admin/Managers see assigned OR unassigned.
  const myLeads = leads.filter(l => {
      if (user?.role === UserRole.ADVISOR) {
          return l.assignedTo === user.id;
      }
      return l.assignedTo === user?.id || !l.assignedTo;
  });

  const filteredLeads = myLeads.filter(lead => {
      if (filterType === 'new') return lead.status === LeadStatus.NEW || lead.status === LeadStatus.ASSIGNED;
      if (filterType === 'active') return lead.status === LeadStatus.CONTACTED || lead.status === LeadStatus.PROPOSAL;
      if (filterType === 'closed') return lead.status === LeadStatus.CLOSED || lead.status === LeadStatus.LOST;
      return false;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const selectedLead = myLeads.find(l => l.id === selectedLeadId);

  // Helper for Request Icon
  const getRequestIcon = (msg: string) => {
      if (msg.toLowerCase().includes('callback')) return <PhoneIncoming className="h-5 w-5 text-blue-500" />;
      if (msg.toLowerCase().includes('quote')) return <FileText className="h-5 w-5 text-green-500" />;
      return <MessageSquare className="h-5 w-5 text-purple-500" />;
  };

  return (
    <div className="h-full flex flex-col bg-white/40 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/50 overflow-hidden relative">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-blue-100/50 pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="h-24 px-8 flex items-center justify-between z-20 border-b border-white/20">
        <h2 className="text-2xl font-black text-[#0B2240] tracking-tight flex items-center gap-3">
            <InboxIcon className="h-6 w-6 text-blue-600" /> Requests & Inquiries
        </h2>
        
        {/* Search Bar - Floating */}
        <div className="relative max-w-md w-full ml-6 hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
                type="text" 
                className="bg-white backdrop-blur-xl block w-full pl-12 pr-6 py-3.5 border-none rounded-full text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all hover:bg-white/80 text-slate-900" 
                placeholder="Search requests..." 
            />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Sidebar - Navigation */}
        <div className="w-80 flex-shrink-0 border-r border-white/20 bg-white/20 backdrop-blur-lg flex flex-col">
           <div className="p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 px-2">Folders</h3>
            
            <nav className="space-y-2">
                <button 
                    onClick={() => setFilterType('new')} 
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] text-sm font-bold transition-all duration-300 ${filterType === 'new' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:bg-white/40'}`}
                >
                    <span className="flex items-center">
                        <InboxIcon className="h-5 w-5 mr-3" />
                        New Requests
                    </span>
                    {myLeads.filter(l => l.status === 'New' || l.status === 'Assigned').length > 0 && (
                        <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-1 rounded-full shadow-sm">
                            {myLeads.filter(l => l.status === 'New' || l.status === 'Assigned').length}
                        </span>
                    )}
                </button>

                <button 
                    onClick={() => setFilterType('active')} 
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] text-sm font-bold transition-all duration-300 ${filterType === 'active' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-500 hover:bg-white/40'}`}
                >
                    <span className="flex items-center">
                        <Clock className="h-5 w-5 mr-3" />
                        In Progress
                    </span>
                    {myLeads.filter(l => l.status === 'Contacted' || l.status === 'Proposal').length > 0 && (
                        <span className="text-[10px] font-black bg-orange-500 text-white px-2 py-1 rounded-full shadow-sm">
                            {myLeads.filter(l => l.status === 'Contacted' || l.status === 'Proposal').length}
                        </span>
                    )}
                </button>

                <button 
                    onClick={() => setFilterType('closed')} 
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] text-sm font-bold transition-all duration-300 ${filterType === 'closed' ? 'bg-white text-green-600 shadow-md' : 'text-slate-500 hover:bg-white/40'}`}
                >
                    <span className="flex items-center">
                        <Archive className="h-5 w-5 mr-3" />
                        Archived
                    </span>
                </button>
            </nav>
           </div>
        </div>

        {/* Requests List */}
        <div className={`w-96 border-r border-white/20 bg-white/30 backdrop-blur-md overflow-y-auto ${selectedLeadId ? 'hidden md:block' : 'block'}`}>
            {filteredLeads.map(lead => (
                <div 
                    key={lead.id} 
                    onClick={() => setSelectedLeadId(lead.id)}
                    className={`cursor-pointer border-b border-white/20 p-6 transition-all duration-300 ${selectedLeadId === lead.id ? 'bg-white/60 backdrop-blur-xl' : 'hover:bg-white/30'}`}
                >
                    <div className="flex justify-between items-baseline mb-2">
                        <span className={`truncate text-sm ${lead.status === 'New' ? 'text-[#0B2240] font-black' : 'text-slate-600 font-bold'}`}>{lead.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold bg-white/50 px-2 py-1 rounded-lg">{new Date(lead.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        {getRequestIcon(lead.message)}
                        <span className={`text-xs font-bold uppercase tracking-wide ${lead.status === 'New' ? 'text-blue-600' : 'text-slate-500'}`}>{lead.interest}</span>
                    </div>
                    <div className="text-xs text-slate-500 truncate font-medium leading-relaxed">{lead.message}</div>
                </div>
            ))}
            {filteredLeads.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm italic font-medium">No requests found in this folder.</div>
            )}
        </div>

        {/* Detail Pane - Paper Style */}
        <div className={`flex-1 bg-white/80 backdrop-blur-xl overflow-y-auto flex flex-col relative ${!selectedLeadId ? 'hidden md:flex' : 'flex absolute inset-0 md:static z-20'}`}>
            {selectedLead ? (
                <>
                    <div className="md:hidden p-6 border-b border-slate-100 flex items-center text-slate-500 font-bold cursor-pointer hover:bg-slate-50" onClick={() => setSelectedLeadId(null)}>
                    ← Back to List
                    </div>

                    <div className="p-10 border-b border-slate-100/50 flex justify-between items-start">
                        <div className="flex gap-5">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
                                {selectedLead.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-1 leading-tight">{selectedLead.name}</h2>
                                <div className="flex flex-col text-sm text-slate-500 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> {selectedLead.email}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Phone className="h-3 w-3" /> {selectedLead.phone}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="relative">
                                <select 
                                    className="appearance-none bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 pr-8 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={selectedLead.status}
                                    onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value as LeadStatus)}
                                >
                                    {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <ChevronDown className="h-3 w-3 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Current Status</span>
                        </div>
                    </div>
                    
                    <div className="p-12 flex-1">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <FileQuestion className="h-4 w-4" /> Request Details
                            </h4>
                            <p className="text-slate-800 leading-loose text-base font-medium whitespace-pre-wrap">
                                {selectedLead.message}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 rounded-2xl border border-slate-100">
                                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Product Interest</span>
                                <span className="font-bold text-slate-700">{selectedLead.interest}</span>
                            </div>
                            <div className="p-4 rounded-2xl border border-slate-100">
                                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Lead Score</span>
                                <span className={`font-bold ${selectedLead.qualification === 'Hot' ? 'text-red-500' : 'text-slate-700'}`}>
                                    {selectedLead.qualification} ({selectedLead.score})
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8 border-t border-slate-100 flex gap-4 bg-white/50 backdrop-blur-md sticky bottom-0">
                        <a href={`tel:${selectedLead.phone}`} className="flex-1 px-4 py-3.5 bg-[#0B2240] text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
                            <Phone className="h-4 w-4" /> Call Client
                        </a>
                        <a href={`mailto:${selectedLead.email}`} className="flex-1 px-4 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                            <Mail className="h-4 w-4" /> Send Email
                        </a>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                    <InboxIcon className="h-24 w-24 mb-4 opacity-20" />
                    <p className="font-bold text-xl">Select a request to view details</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
