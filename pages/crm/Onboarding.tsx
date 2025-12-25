import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { JobApplication, ProductType } from '../../types';
import { UserPlus, Check, X, FileText, Search, Mail, Phone, Calendar, Clock, Download, DollarSign, Briefcase } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { jobApplications, updateJobApplicationStatus } = useData();
  const [filter, setFilter] = useState<'Pending' | 'All'>('Pending');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Approval Modal State
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalConfig, setApprovalConfig] = useState({
      contractLevel: 50, // Default 50%
      products: [ProductType.LIFE] as ProductType[]
  });

  const filteredApps = jobApplications
    .filter(app => filter === 'All' ? true : app.status === filter)
    .filter(app => app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || app.email.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleStatusUpdate = (status: 'Approved' | 'Rejected') => {
      if (selectedApp) {
          if (status === 'Approved') {
              // Open Configuration Modal instead of direct confirm
              setIsApprovalModalOpen(true);
          } else {
              if (window.confirm(`Reject application for ${selectedApp.fullName}?`)) {
                  updateJobApplicationStatus(selectedApp.id, status);
                  setSelectedApp(null);
              }
          }
      }
  };

  const handleConfirmApproval = () => {
      if (selectedApp) {
          updateJobApplicationStatus(selectedApp.id, 'Approved', approvalConfig);
          setIsApprovalModalOpen(false);
          setSelectedApp(null);
          // Reset Config
          setApprovalConfig({ contractLevel: 50, products: [ProductType.LIFE] });
      }
  };

  const toggleProduct = (product: ProductType) => {
      setApprovalConfig(prev => {
          const exists = prev.products.includes(product);
          if (exists) {
              return { ...prev, products: prev.products.filter(p => p !== product) };
          } else {
              return { ...prev, products: [...prev.products, product] };
          }
      });
  };

  const StatusBadge = ({ status }: { status: string }) => {
      switch(status) {
          case 'Approved': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">Approved</span>;
          case 'Rejected': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">Rejected</span>;
          default: return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase">Pending Review</span>;
      }
  };

  return (
    <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <h1 className="text-3xl font-black text-[#0B2240] tracking-tight">Advisor Onboarding</h1>
                <p className="text-slate-500 mt-1 font-medium">Review applications and onboard new talent.</p>
            </div>
            
            <div className="flex bg-white p-1 rounded-full border border-slate-200 shadow-sm">
                <button 
                    onClick={() => setFilter('Pending')}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === 'Pending' ? 'bg-[#0B2240] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Pending
                </button>
                <button 
                    onClick={() => setFilter('All')}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === 'All' ? 'bg-[#0B2240] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    All Applications
                </button>
            </div>
        </div>

        {/* Application List */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search applicants..." 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Applicant</th>
                            <th className="px-6 py-4">Date Applied</th>
                            <th className="px-6 py-4">License #</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredApps.map(app => (
                            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                                            {app.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#0B2240]">{app.fullName}</p>
                                            <p className="text-xs text-slate-400">{app.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <span>{new Date(app.date).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-500">
                                    {app.licenseNumber || 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={app.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => setSelectedApp(app)}
                                        className="text-[#0A62A7] hover:bg-blue-50 px-4 py-2 rounded-lg font-bold text-xs transition-colors"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredApps.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No applications found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Details Modal */}
        {selectedApp && !isApprovalModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/60 backdrop-blur-md p-4 animate-fade-in">
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative border border-white/20 flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="p-8 pb-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                        <div>
                            <h2 className="text-2xl font-black text-[#0B2240]">{selectedApp.fullName}</h2>
                            <p className="text-slate-500 font-medium mt-1">Application ID: {selectedApp.id}</p>
                        </div>
                        <button 
                            onClick={() => setSelectedApp(null)}
                            className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 overflow-y-auto flex-1 space-y-8">
                        {/* Status Bar */}
                        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                                <Clock className="h-4 w-4" /> 
                                Submitted on {new Date(selectedApp.date).toLocaleString()}
                            </div>
                            <StatusBadge status={selectedApp.status} />
                        </div>

                        {/* Contact Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                                <a href={`mailto:${selectedApp.email}`} className="flex items-center gap-2 text-slate-700 font-medium hover:text-blue-600">
                                    <Mail className="h-4 w-4" /> {selectedApp.email}
                                </a>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone</label>
                                <a href={`tel:${selectedApp.phone}`} className="flex items-center gap-2 text-slate-700 font-medium hover:text-blue-600">
                                    <Phone className="h-4 w-4" /> {selectedApp.phone}
                                </a>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">License Number</label>
                                <div className="flex items-center gap-2 text-slate-700 font-mono bg-slate-100 px-3 py-1 rounded-lg inline-block text-sm">
                                    {selectedApp.licenseNumber || 'Not Provided'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Address</label>
                                <div className="text-slate-700 text-sm">
                                    {selectedApp.address}
                                </div>
                            </div>
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Experience & Background</label>
                            <div className="p-6 bg-slate-50 rounded-2xl text-slate-700 text-sm leading-relaxed border border-slate-100">
                                {selectedApp.experience}
                            </div>
                        </div>

                        {/* Resume */}
                        {selectedApp.resumeName && (
                            <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl">
                                <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900 text-sm">{selectedApp.resumeName}</p>
                                    <p className="text-xs text-slate-400">Resume / CV</p>
                                </div>
                                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600" title="Download (Demo)">
                                    <Download className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {selectedApp.status === 'Pending' && (
                        <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
                            <button 
                                onClick={() => handleStatusUpdate('Rejected')}
                                className="flex-1 py-4 bg-white border border-slate-200 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                            >
                                <X className="h-5 w-5" /> Reject Application
                            </button>
                            <button 
                                onClick={() => handleStatusUpdate('Approved')}
                                className="flex-1 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                <UserPlus className="h-5 w-5" /> Approve & Onboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Approval Configuration Modal */}
        {isApprovalModalOpen && selectedApp && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B2240]/70 backdrop-blur-md p-4 animate-fade-in">
                <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg p-10 relative">
                    <button onClick={() => setIsApprovalModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500">
                        <X className="h-5 w-5" />
                    </button>
                    
                    <h2 className="text-2xl font-black text-[#0B2240] mb-2">Configure Contract</h2>
                    <p className="text-slate-500 mb-8">Set commission levels and product authorization for {selectedApp.fullName}.</p>

                    <div className="space-y-8">
                        {/* Contract Level */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 tracking-wider">Commission Contract Level (%)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input 
                                    type="number" 
                                    min="0" 
                                    max="100" 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] pl-12 pr-6 py-4 text-xl font-bold text-slate-900 focus:ring-2 focus:ring-[#0A62A7] outline-none"
                                    value={approvalConfig.contractLevel}
                                    onChange={e => setApprovalConfig({...approvalConfig, contractLevel: parseInt(e.target.value) || 0})}
                                />
                            </div>
                            <div className="mt-2 text-xs text-slate-400 bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-center">
                                Example: On $1,000 monthly premium (Annualized $12,000), <br/>
                                Advisor earns <span className="font-bold text-blue-700">${(12000 * (approvalConfig.contractLevel/100)).toLocaleString()}</span> commission.
                            </div>
                        </div>

                        {/* Products */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 tracking-wider">Authorized Products</label>
                            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {Object.values(ProductType).map(pt => (
                                    <button 
                                        key={pt}
                                        onClick={() => toggleProduct(pt)}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold text-left transition-all ${approvalConfig.products.includes(pt) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${approvalConfig.products.includes(pt) ? 'bg-white border-white' : 'border-slate-300'}`}>
                                            {approvalConfig.products.includes(pt) && <Check className="h-3 w-3 text-blue-600" />}
                                        </div>
                                        {pt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button 
                                onClick={() => setIsApprovalModalOpen(false)} 
                                className="flex-1 py-4 rounded-full font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmApproval}
                                className="flex-1 py-4 rounded-full font-bold bg-green-600 text-white hover:bg-green-700 shadow-xl shadow-green-600/20 transition-all hover:scale-105"
                            >
                                Confirm Onboarding
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};