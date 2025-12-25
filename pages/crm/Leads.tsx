
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Lead, LeadStatus, UserRole, ProductType } from '../../types';
import { analyzeLead } from '../../services/geminiService';
import { Sparkles, Loader2, Flame, Thermometer, Snowflake, Filter, UserPlus, CheckSquare, Square, Search, X, Info, HelpCircle, Eye, ChevronDown, DollarSign, Edit2, Save, CheckCircle, XCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface DetailRowProps {
  label: string;
  value: any;
  isEditing: boolean;
  onChange: (val: any) => void;
  type?: string;
}

// Helper component for form fields
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
                className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

interface DynamicDetailsProps {
  details: any;
  isEditing: boolean;
  onChange: (key: string, val: any) => void;
}

// Helper to render dynamic detail objects
const DynamicDetails: React.FC<DynamicDetailsProps> = ({ details, isEditing, onChange }) => {
    if (!details) return null;

    // Helper to format camelCase to Title Case
    const formatLabel = (str: string) => {
        return str
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            {Object.entries(details).map(([key, value]) => (
                <DetailRow 
                    key={key}
                    label={formatLabel(key)}
                    value={value}
                    isEditing={isEditing}
                    onChange={(val) => onChange(key, val)}
                />
            ))}
        </div>
    );
};

export const Leads: React.FC = () => {
  const { leads, updateLeadStatus, updateLead, user, allUsers, assignLeads, handleAdvisorLeadAction } = useData();
  const location = useLocation();
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  
  // Selection State
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  
  // Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isScoreInfoOpen, setIsScoreInfoOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState<Lead | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  // View/Edit Lead State
  const [viewLead, setViewLead] = useState<Lead | null>(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [editedLeadData, setEditedLeadData] = useState<Partial<Lead>>({});
  
  // Deal Closing State
  const [isClosingDeal, setIsClosingDeal] = useState<Lead | null>(null); 
  const [dealAmount, setDealAmount] = useState('');
  const [assignAdvisorId, setAssignAdvisorId] = useState('');
  const [assignPriority, setAssignPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [assignNotes, setAssignNotes] = useState('');
  
  // Filter State
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Access Control Helpers
  const canAssign = [UserRole.ADMIN, UserRole.MANAGER, UserRole.SUB_ADMIN].includes(user?.role as UserRole);
  const isAdvisor = user?.role === UserRole.ADVISOR;

  // Handle incoming navigation state (linking from notification)
  useEffect(() => {
      if (location.state && (location.state as any).openLeadId) {
          const leadToOpen = leads.find(l => l.id === (location.state as any).openLeadId);
          if (leadToOpen) {
              handleOpenView(leadToOpen);
          }
          // Clear state to prevent re-opening on refresh
          window.history.replaceState({}, document.title);
      }
  }, [location.state, leads]);

  // Filter leads based on role & search
  const filteredLeads = useMemo(() => {
    let list = leads;
    if (isAdvisor && user) {
        // STRICT RESTRICTION: Advisors only see leads assigned to them.
        list = list.filter(l => l.assignedTo === user.id);
    }
    if (statusFilter !== 'All') {
        if (statusFilter === 'Unassigned') {
            list = list.filter(l => !l.assignedTo);
        } else {
            list = list.filter(l => l.status === statusFilter);
        }
    }
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter(l => 
            l.name.toLowerCase().includes(q) || 
            l.email.toLowerCase().includes(q) ||
            l.interest.toLowerCase().includes(q)
        );
    }
    return list;
  }, [leads, user, isAdvisor, statusFilter, searchQuery]);

  const handleAnalyze = async (lead: Lead) => {
    setAnalyzingId(lead.id);
    const insight = await analyzeLead(lead);
    updateLeadStatus(lead.id, lead.status, insight);
    setAnalyzingId(null);
  };

  const toggleSelectAll = () => {
      if (selectedLeadIds.size === filteredLeads.length) {
          setSelectedLeadIds(new Set());
      } else {
          setSelectedLeadIds(new Set(filteredLeads.map(l => l.id)));
      }
  };

  const toggleSelectLead = (id: string) => {
      const newSet = new Set(selectedLeadIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedLeadIds(newSet);
  };

  const handleBulkAssign = () => {
      if (assignAdvisorId && selectedLeadIds.size > 0) {
          assignLeads(Array.from(selectedLeadIds), assignAdvisorId, assignPriority, assignNotes);
          setIsAssignModalOpen(false);
          setSelectedLeadIds(new Set());
          setAssignNotes('');
          setAssignAdvisorId('');
      }
  };

  const handleCloseDeal = (e: React.FormEvent) => {
      e.preventDefault();
      if (isClosingDeal && dealAmount) {
          const amount = parseFloat(dealAmount);
          
          updateLeadStatus(isClosingDeal.id, LeadStatus.CLOSED);
          
          setIsClosingDeal(null);
          setDealAmount('');
          alert(`Deal closed! $${amount} revenue recorded.`);
      }
  };

  const handleDeclineSubmit = () => {
      if (isDeclineModalOpen && declineReason) {
          handleAdvisorLeadAction(isDeclineModalOpen.id, 'decline', declineReason);
          setIsDeclineModalOpen(null);
          setDeclineReason('');
      }
  };

  // View/Edit Logic
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

  const handleDetailUpdate = (detailType: 'lifeDetails' | 'realEstateDetails' | 'securitiesDetails' | 'customDetails', key: string, value: any) => {
      setEditedLeadData(prev => ({
          ...prev,
          [detailType]: {
              ...prev[detailType],
              [key]: value
          }
      }));
  };

  // Identify which detail object is populated
  const getActiveDetails = (lead: Partial<Lead>) => {
      if (lead.lifeDetails && Object.keys(lead.lifeDetails).length > 0) return { type: 'lifeDetails', data: lead.lifeDetails };
      if (lead.realEstateDetails && Object.keys(lead.realEstateDetails).length > 0) return { type: 'realEstateDetails', data: lead.realEstateDetails };
      if (lead.securitiesDetails && Object.keys(lead.securitiesDetails).length > 0) return { type: 'securitiesDetails', data: lead.securitiesDetails };
      if (lead.customDetails && Object.keys(lead.customDetails).length > 0) return { type: 'customDetails', data: lead.customDetails };
      return null;
  };

  const availableAdvisors = allUsers.filter(u => u.role === UserRole.ADVISOR);

  const statusColors: any = {
    [LeadStatus.NEW]: 'bg-blue-100 text-blue-800',
    [LeadStatus.CONTACTED]: 'bg-yellow-100 text-yellow-800',
    [LeadStatus.PROPOSAL]: 'bg-purple-100 text-purple-800',
    [LeadStatus.APPROVED]: 'bg-green-100 text-green-800', // Added
    [LeadStatus.CLOSED]: 'bg-gray-100 text-gray-800',
    [LeadStatus.LOST]: 'bg-red-100 text-red-800',
    [LeadStatus.ASSIGNED]: 'bg-indigo-100 text-indigo-800',
  };

  const getScoreBadge = (score: number, level: string) => {
    let color = 'bg-slate-100 text-slate-600';
    let Icon = Snowflake;
    if (level === 'Hot') { color = 'bg-red-100 text-red-600'; Icon = Flame; } 
    else if (level === 'Warm') { color = 'bg-orange-100 text-orange-600'; Icon = Thermometer; }
    return (
      <div className="flex items-center space-x-2">
        <div className={`flex items-center px-4 py-2 rounded-full text-xs font-bold ${color}`}>
          <Icon className="w-3 h-3 mr-1.5" />
          {level} ({score})
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
       {/* Header & Filters */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leads & Inquiries</h1>
            <p className="text-slate-500 mt-1 font-medium">
                {isAdvisor ? 'Manage your active opportunities.' : 'Manage pipeline, assignments, and AI qualification.'}
            </p>
          </div>
          <div className="flex gap-2">
              {canAssign && (
                <Link to="/crm/intake" className="bg-[#0A62A7] text-white px-8 py-4 rounded-full text-sm font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all hover:scale-105">
                    + New Manual Lead
                </Link>
              )}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col md:flex-row gap-5 items-center justify-between">
            <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search leads..." 
                        className="w-full pl-12 pr-6 py-4 bg-white text-slate-900 border border-slate-200 rounded-[2rem] text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                {/* Advisor Filter for Managers/Admins */}
                {canAssign && (
                    <div className="relative">
                        <select
                            className="bg-white text-slate-900 border border-slate-200 rounded-[2rem] px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent cursor-pointer appearance-none pr-10"
                            onChange={(e) => setSearchQuery(e.target.value)} // Reusing searchQuery for now, but ideally separate state
                        >
                            <option value="">Filter by Advisor</option>
                            {availableAdvisors.map(adv => (
                                <option key={adv.id} value={adv.name}>{adv.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                )}
                <div className="relative">
                    <select 
                        className="bg-white text-slate-900 border border-slate-200 rounded-[2rem] px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent cursor-pointer appearance-none pr-10"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        {/* Only Admins see Unassigned leads filter option to distribute them */}
                        {!isAdvisor && <option value="Unassigned">Unassigned</option>}
                        {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {canAssign && (
                <button 
                    disabled={selectedLeadIds.size === 0}
                    onClick={() => setIsAssignModalOpen(true)}
                    className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md"
                >
                    <UserPlus className="h-5 w-5" />
                    Assign Selected ({selectedLeadIds.size})
                </button>
            )}
        </div>

        {/* Lead Table */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-[3rem] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            {canAssign && (
                                <th className="px-8 py-6 w-20">
                                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600 transition-colors">
                                        {selectedLeadIds.size > 0 && selectedLeadIds.size === filteredLeads.length ? <CheckSquare className="h-6 w-6 text-[#0A62A7]" /> : <Square className="h-6 w-6" />}
                                    </button>
                                </th>
                            )}
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Name</th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Interest</th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <button onClick={() => setIsScoreInfoOpen(true)} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                    Score <Info className="h-4 w-4" />
                                </button>
                            </th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned To</th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-8 py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {filteredLeads.map((lead) => (
                            <React.Fragment key={lead.id}>
                            <tr className={`hover:bg-slate-50 transition-colors ${selectedLeadIds.has(lead.id) ? 'bg-blue-50/30' : ''}`}>
                                {canAssign && (
                                    <td className="px-8 py-6">
                                        <button onClick={() => toggleSelectLead(lead.id)} className="text-slate-400 hover:text-slate-600">
                                            {selectedLeadIds.has(lead.id) ? <CheckSquare className="h-6 w-6 text-[#0A62A7]" /> : <Square className="h-6 w-6" />}
                                        </button>
                                    </td>
                                )}
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-base border border-slate-200">
                                            {lead.name.charAt(0)}
                                        </div>
                                        <div className="ml-5">
                                            <div className="text-sm font-bold text-slate-900">{lead.name}</div>
                                            <div className="text-xs text-slate-500 font-medium">{lead.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">{lead.interest}</span>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    {getScoreBadge(lead.score, lead.qualification)}
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap text-sm text-slate-500">
                                    {lead.assignedTo ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                                                {allUsers.find(u => u.id === lead.assignedTo)?.name.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">{allUsers.find(u => u.id === lead.assignedTo)?.name.split(' ')[0]}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic pl-1 font-medium">Unassigned</span>
                                    )}
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    {isAdvisor && lead.assignedTo === user?.id && lead.status === LeadStatus.ASSIGNED ? (
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleAdvisorLeadAction(lead.id, 'accept')} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-xs font-bold hover:bg-green-200">Accept</button>
                                            <button onClick={() => setIsDeclineModalOpen(lead)} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-xs font-bold hover:bg-red-200">Decline</button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <select 
                                                className={`text-xs font-bold border-none rounded-full px-4 py-2 cursor-pointer focus:ring-2 focus:ring-blue-500 appearance-none pr-8 ${statusColors[lead.status] || 'bg-slate-100 text-slate-800'}`}
                                                value={lead.status}
                                                onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                                                // Removed disabled={isAdvisor} to allow Advisors to change status to Approved/Closed etc.
                                            >
                                                {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none opacity-50" />
                                        </div>
                                    )}
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleOpenView(lead)}
                                            className="inline-flex items-center px-4 py-2 border border-slate-200 bg-white text-slate-600 text-xs font-bold rounded-full shadow-sm hover:bg-slate-50 transition-all"
                                        >
                                            <Eye className="h-3 w-3 mr-2" /> View
                                        </button>
                                        
                                        {lead.status !== LeadStatus.CLOSED && lead.status !== LeadStatus.APPROVED && (canAssign || (isAdvisor && lead.assignedTo === user?.id)) && (
                                            <button 
                                                onClick={() => setIsClosingDeal(lead)}
                                                className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 border border-green-200 text-xs font-bold rounded-full hover:bg-green-200 transition-all shadow-sm hover:shadow-md"
                                            >
                                                <DollarSign className="h-3 w-3 mr-1" /> Close
                                            </button>
                                        )}

                                        <button 
                                            onClick={() => handleAnalyze(lead)}
                                            disabled={!!lead.aiAnalysis || analyzingId === lead.id}
                                            className={`inline-flex items-center px-4 py-2 border border-transparent text-xs font-bold rounded-full shadow-sm text-white transition-all ${lead.aiAnalysis ? 'bg-purple-300 cursor-default' : 'bg-purple-600 hover:bg-purple-700'}`}
                                        >
                                            {analyzingId === lead.id ? <Loader2 className="animate-spin h-3 w-3 mr-2"/> : <Sparkles className="h-3 w-3 mr-2" />}
                                            {lead.aiAnalysis ? 'AI Done' : 'Analyze'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {lead.aiAnalysis && (
                                <tr className="bg-purple-50/50">
                                    <td colSpan={canAssign ? 8 : 7} className="px-8 py-6 border-t border-purple-100/50">
                                        <div className="flex items-start bg-white p-6 rounded-[2rem] border border-purple-100 shadow-sm">
                                            <div className="p-3 bg-purple-100 rounded-full mr-4 flex-shrink-0">
                                                <Sparkles className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">Gemini AI Analysis</h4>
                                                <p className="text-sm text-purple-900 whitespace-pre-wrap leading-relaxed font-medium">{lead.aiAnalysis}</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                {filteredLeads.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                        <p className="text-lg font-medium">No leads found.</p>
                        {isAdvisor && <p className="text-sm mt-1">You currently have no leads assigned to you.</p>}
                    </div>
                )}
            </div>
        </div>

        {/* Improved View Details / Edit Modal */}
        {viewLead && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/60 backdrop-blur-md p-6 animate-fade-in">
                <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-4xl p-10 relative max-h-[90vh] overflow-y-auto border border-white/20">
                     <div className="flex justify-between items-center mb-6">
                         <div>
                             <h2 className="text-3xl font-black text-[#0B2240]">Lead Details</h2>
                             <p className="text-slate-500 text-sm font-medium">
                                 {isEditing ? 'Editing mode enabled' : 'View and manage lead information'}
                             </p>
                         </div>
                         <div className="flex gap-3">
                             {!isEditing && canAssign ? (
                                 <button 
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-sm transition-colors"
                                 >
                                     <Edit2 className="h-4 w-4" /> Edit Info
                                 </button>
                             ) : isEditing && (
                                 <button 
                                    onClick={handleSaveChanges}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-sm shadow-lg shadow-green-600/20 transition-all"
                                 >
                                     <Save className="h-4 w-4" /> Save Changes
                                 </button>
                             )}
                             <button 
                                onClick={() => { setViewLead(null); setIsEditing(false); }} 
                                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
                             >
                                <X className="h-5 w-5" />
                             </button>
                         </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         <div className="lg:col-span-1 space-y-6">
                             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
                                 <h3 className="text-sm font-black text-[#0B2240] uppercase tracking-wider mb-6 border-b border-slate-200 pb-2">Contact Info</h3>
                                 <div className="space-y-4">
                                     <DetailRow label="Full Name" value={editedLeadData.name} isEditing={isEditing} onChange={(v) => setEditedLeadData({...editedLeadData, name: v})} />
                                     <DetailRow label="Email" value={editedLeadData.email} isEditing={isEditing} onChange={(v) => setEditedLeadData({...editedLeadData, email: v})} />
                                     <DetailRow label="Phone" value={editedLeadData.phone} isEditing={isEditing} onChange={(v) => setEditedLeadData({...editedLeadData, phone: v})} />
                                     {!isEditing && (
                                        <div className="pt-4 mt-4 border-t border-slate-200">
                                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase ${statusColors[editedLeadData.status || LeadStatus.NEW]}`}>
                                                {editedLeadData.status}
                                            </span>
                                        </div>
                                     )}
                                 </div>
                             </div>
                             {!isEditing && (
                                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
                                    <h3 className="text-sm font-black text-[#0B2240] uppercase tracking-wider mb-4">Qualification</h3>
                                    <div className="flex flex-col gap-3">
                                        {getScoreBadge(viewLead.score, viewLead.qualification)}
                                        <span className="text-xs text-slate-500 font-medium leading-relaxed">
                                            AI Score based on interest type, data completeness, and intent.
                                        </span>
                                    </div>
                                 </div>
                             )}
                         </div>

                         <div className="lg:col-span-2 space-y-6">
                             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                 <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-2">
                                     <h3 className="text-sm font-black text-[#0B2240] uppercase tracking-wider">
                                        Product Details: <span className="text-blue-600">{editedLeadData.interest}</span>
                                     </h3>
                                     {isEditing && (
                                         <select 
                                            className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-900"
                                            value={editedLeadData.interest}
                                            onChange={(e) => setEditedLeadData({...editedLeadData, interest: e.target.value as ProductType})}
                                         >
                                             {Object.values(ProductType).map(t => <option key={t} value={t}>{t}</option>)}
                                         </select>
                                     )}
                                 </div>
                                 
                                 {(() => {
                                     const activeDetail = getActiveDetails(editedLeadData);
                                     if (activeDetail) {
                                         return (
                                             <DynamicDetails 
                                                details={activeDetail.data}
                                                isEditing={isEditing}
                                                onChange={(key, val) => handleDetailUpdate(activeDetail.type as any, key, val)}
                                             />
                                         );
                                     } else {
                                         return <p className="text-slate-400 italic text-sm">No specific product details captured yet.</p>;
                                     }
                                 })()}
                             </div>

                             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
                                 <h3 className="text-sm font-black text-[#0B2240] uppercase tracking-wider mb-4">Client Message</h3>
                                  <div className="p-6 bg-white rounded-2xl border border-slate-200 text-slate-700 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                                      {editedLeadData.message || <span className="italic text-slate-400">No message provided.</span>}
                                  </div>
                                  <h3 className="text-sm font-black text-[#0B2240] uppercase tracking-wider mb-4 mt-6">Internal Notes</h3>
                                  {isEditing ? (
                                     <textarea 
                                        className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent resize-none text-slate-900"
                                        rows={4}
                                        value={editedLeadData.notes || ''}
                                        onChange={(e) => setEditedLeadData({...editedLeadData, notes: e.target.value})}
                                     />
                                 ) : (
                                     <div className="p-6 bg-white rounded-2xl border border-slate-200 text-slate-700 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                                         {editedLeadData.notes || <span className="italic text-slate-400">No notes provided.</span>}
                                     </div>
                                 )}
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        )}

        {isDeclineModalOpen && (
             <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B2240]/60 backdrop-blur-md p-6 animate-fade-in">
                <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 relative">
                    <button onClick={() => setIsDeclineModalOpen(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full"><X className="h-6 w-6" /></button>
                    <h2 className="text-2xl font-black text-[#0B2240] mb-2">Decline Lead</h2>
                    <p className="text-slate-500 text-sm mb-6">You are returning <strong>{isDeclineModalOpen.name}</strong> to the lead pool. Please provide a reason.</p>
                    <textarea 
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        rows={4}
                        placeholder="e.g., Not interested, wrong number, not a good fit for my products..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900"
                    />
                    <div className="flex gap-4 mt-6">
                        <button onClick={() => setIsDeclineModalOpen(null)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200">Cancel</button>
                        <button onClick={handleDeclineSubmit} disabled={!declineReason} className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">Confirm Decline</button>
                    </div>
                </div>
             </div>
        )}

        {/* Close Deal Modal */}
        {isClosingDeal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B2240]/60 backdrop-blur-md p-6 animate-fade-in">
                <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 relative">
                    <button onClick={() => setIsClosingDeal(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full"><X className="h-6 w-6" /></button>
                    
                    <h2 className="text-2xl font-black text-[#0B2240] mb-2 flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-full text-green-600"><DollarSign className="h-6 w-6" /></div>
                        Close Deal
                    </h2>
                    <p className="text-slate-500 text-sm mb-8">Closing <strong>{isClosingDeal.name}</strong>. This will record revenue.</p>

                    <form onSubmit={handleCloseDeal} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Total Premium / Revenue</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input 
                                    type="number" 
                                    required
                                    min="0"
                                    className="w-full bg-white text-slate-900 border border-slate-200 rounded-[2rem] pl-10 pr-6 py-4 font-bold text-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="0.00"
                                    value={dealAmount}
                                    onChange={e => setDealAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <button type="submit" className="w-full bg-green-600 text-white font-bold py-4 rounded-full hover:bg-green-700 transition-all shadow-lg shadow-green-600/30 transform active:scale-95">
                            Confirm & Post Entry
                        </button>
                    </form>
                </div>
            </div>
        )}

        {/* Assign Modal (Existing) */}
        {isAssignModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/60 backdrop-blur-md p-6 animate-fade-in">
                <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-lg p-12 relative">
                    <button onClick={() => setIsAssignModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 p-3 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                    <h2 className="text-3xl font-bold text-[#0B2240] mb-3">Assign Leads</h2>
                    <p className="text-sm text-slate-500 mb-10 font-medium">Assigning {selectedLeadIds.size} lead(s) to an advisor.</p>
                    <div className="space-y-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-2 tracking-wider">Select Advisor</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-white text-slate-900 border border-slate-200 rounded-[2rem] px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent appearance-none"
                                    value={assignAdvisorId}
                                    onChange={e => setAssignAdvisorId(e.target.value)}
                                >
                                    <option value="">Select Advisor...</option>
                                    {availableAdvisors.map(adv => (
                                        <option key={adv.id} value={adv.id}>{adv.name} ({adv.category})</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="pt-8 flex gap-4">
                            <button onClick={() => setIsAssignModalOpen(false)} className="flex-1 py-4 rounded-full font-bold text-slate-500 hover:bg-slate-100 transition-colors bg-white border border-slate-200">Cancel</button>
                            <button 
                                onClick={handleBulkAssign}
                                disabled={!assignAdvisorId}
                                className="flex-1 py-4 rounded-full font-bold bg-[#0A62A7] text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                            >
                                Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
