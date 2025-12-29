
import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { TrendingUp, FileText, BadgeDollarSign, PieChart, Download, Plus, Upload, CheckCircle2, AlertTriangle, Search, Filter, Briefcase, Trash2, Edit2, X, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RechartsPieChart, Pie, Legend } from 'recharts';
import { ClientPortfolio, AdvisoryFee, ComplianceDocument } from '../../../types';

// --- 1. Portfolio Management ---
export const PortfolioMgmt: React.FC = () => {
    const { portfolios, user, addPortfolio, updatePortfolio, deletePortfolio } = useData();
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingPortfolio, setEditingPortfolio] = useState<ClientPortfolio | null>(null);
    
    // Form State
    const [formData, setFormData] = useState<Partial<ClientPortfolio>>({
        clientName: '',
        totalValue: 0,
        riskProfile: 'Moderate'
    });

    // Filter for current advisor
    const myPortfolios = portfolios.filter(p => p.advisorId === user?.id);
    const selectedPortfolio = myPortfolios.find(p => p.id === selectedPortfolioId) || myPortfolios[0];

    // Prepare chart data
    const allocationData = selectedPortfolio ? [
        { name: 'Equity', value: selectedPortfolio.holdings?.filter(h => h.assetClass === 'Equity').reduce((acc, h) => acc + h.allocation, 0) || 60 },
        { name: 'Fixed Income', value: selectedPortfolio.holdings?.filter(h => h.assetClass === 'Fixed Income').reduce((acc, h) => acc + h.allocation, 0) || 30 },
        { name: 'Cash', value: selectedPortfolio.holdings?.filter(h => h.assetClass === 'Cash').reduce((acc, h) => acc + h.allocation, 0) || 5 },
        { name: 'Alternative', value: selectedPortfolio.holdings?.filter(h => h.assetClass === 'Alternative').reduce((acc, h) => acc + h.allocation, 0) || 5 },
    ].filter(d => d.value > 0) : [];

    const COLORS = ['#0A62A7', '#10B981', '#F59E0B', '#8B5CF6'];

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPortfolio) {
            updatePortfolio(editingPortfolio.id, formData);
        } else {
            addPortfolio(formData);
        }
        setIsAddModalOpen(false);
        setEditingPortfolio(null);
        setFormData({ clientName: '', totalValue: 0, riskProfile: 'Moderate' });
    };

    const handleEdit = (p: ClientPortfolio) => {
        setEditingPortfolio(p);
        setFormData(p);
        setIsAddModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this portfolio record?')) {
            deletePortfolio(id);
            if (selectedPortfolioId === id) setSelectedPortfolioId(null);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#0B2240] tracking-tight">Portfolio Management</h1>
                    <p className="text-slate-500 mt-2">Track client asset allocation, performance, and holdings.</p>
                </div>
                <button 
                    onClick={() => { setEditingPortfolio(null); setFormData({ clientName: '', totalValue: 0, riskProfile: 'Moderate' }); setIsAddModalOpen(true); }}
                    className="bg-[#0A62A7] text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" /> Add Portfolio
                </button>
            </div>

            {myPortfolios.length === 0 ? (
                <div className="w-full min-h-[450px] border-2 border-dashed border-slate-200 rounded-[3rem] flex items-center justify-center bg-white/50">
                    <p className="text-slate-400 font-bold text-xl tracking-tight uppercase">No portfolios assigned.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List */}
                    <div className="lg:col-span-1 space-y-4">
                        {myPortfolios.map(port => (
                            <div 
                                key={port.id}
                                onClick={() => setSelectedPortfolioId(port.id)}
                                className={`p-8 rounded-[2.5rem] border cursor-pointer transition-all hover:shadow-lg group relative ${selectedPortfolio?.id === port.id ? 'bg-[#0B2240] text-white border-[#0B2240] shadow-xl scale-[1.02]' : 'bg-white text-slate-700 border-slate-100 hover:border-slate-200'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg leading-tight truncate pr-10">{port.clientName}</h3>
                                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => { e.stopPropagation(); handleEdit(port); }} className="p-1.5 hover:bg-white/10 rounded-lg"><Edit2 className="h-3.5 w-3.5" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(port.id); }} className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="h-3.5 w-3.5" /></button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className={`text-sm ${selectedPortfolio?.id === port.id ? 'text-blue-200' : 'text-slate-500'}`}>
                                        {port.riskProfile} Profile
                                    </p>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${selectedPortfolio?.id === port.id ? 'bg-white/10 text-white' : 'bg-green-100 text-green-700'}`}>
                                        +{port.ytdReturn || 0}%
                                    </span>
                                </div>
                                <p className="text-3xl font-black tracking-tighter mt-6">
                                    ${port.totalValue.toLocaleString()}
                                </p>
                                <p className={`text-[10px] uppercase font-bold tracking-widest mt-1 ${selectedPortfolio?.id === port.id ? 'text-blue-300' : 'text-slate-400'}`}>Current AUM</p>
                            </div>
                        ))}
                    </div>

                    {/* Detail View */}
                    <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                        {selectedPortfolio && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-[#0B2240] tracking-tight">{selectedPortfolio.clientName}</h2>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Last Rebalanced: {new Date(selectedPortfolio.lastRebalanced).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-600 transition-all">
                                            <Download className="h-5 w-5" />
                                        </button>
                                        <button className="px-6 py-3 bg-[#0A62A7] text-white rounded-2xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10">
                                            Rebalance Portfolio
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="min-w-0" style={{ height: '320px' }}>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Current Asset Allocation</h4>
                                        <ResponsiveContainer width="100%" height={260}>
                                            <RechartsPieChart>
                                                <Pie
                                                    data={allocationData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={70}
                                                    outerRadius={95}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {allocationData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                                    formatter={(val: number) => [`${val}%`, 'Allocation']} 
                                                />
                                                <Legend iconType="circle" />
                                            </RechartsPieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Holdings Matrix</h4>
                                        <div className="space-y-4">
                                            {selectedPortfolio.holdings && selectedPortfolio.holdings.length > 0 ? selectedPortfolio.holdings.map(h => (
                                                <div key={h.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                                                    <div>
                                                        <div className="font-black text-[#0B2240] text-sm">{h.ticker}</div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase">{h.name}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-mono text-sm font-black text-slate-700">${h.value.toLocaleString()}</div>
                                                        <div className="text-[10px] text-green-600 font-bold">{h.allocation}% Weight</div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-center py-16 text-slate-300 italic text-sm font-medium">No holdings data provided.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Portfolio Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 relative border border-white/20">
                        <button onClick={() => setIsAddModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors"><X size={24}/></button>
                        <h2 className="text-2xl font-black text-[#0B2240] mb-8 tracking-tight">{editingPortfolio ? 'Modify Portfolio' : 'Authorize New Portfolio'}</h2>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Client Name</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none" required value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} placeholder="e.g. Apex Global Wealth" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Assets Under Mgmt ($)</label>
                                <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none" required value={formData.totalValue} onChange={e => setFormData({...formData, totalValue: Number(e.target.value)})} placeholder="1,000,000" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Risk Profile</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black focus:ring-2 focus:ring-[#0A62A7] outline-none appearance-none cursor-pointer" value={formData.riskProfile} onChange={e => setFormData({...formData, riskProfile: e.target.value as any})}>
                                    <option value="Conservative">Conservative</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Aggressive">Aggressive</option>
                                    <option value="Growth">Growth</option>
                                </select>
                            </div>
                            <div className="pt-6 flex gap-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-400 font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-slate-200">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-[#0B2240] text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-blue-900/20 active:scale-95 transition-all">Submit Entry</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- 2. Compliance Vault ---
// FIX: Added missing ComplianceDocs component implementation
export const ComplianceDocs: React.FC = () => {
    const { complianceDocs, user, addComplianceDoc } = useData();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [newDoc, setNewDoc] = useState<Partial<ComplianceDocument>>({ title: '', type: 'KYC' });

    const myDocs = complianceDocs.filter(d => d.advisorId === user?.id);

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        addComplianceDoc(newDoc);
        setIsUploadOpen(false);
        setNewDoc({ title: '', type: 'KYC' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B2240]">Compliance Vault</h1>
                    <p className="text-slate-500">Secure storage for KYC, ADV, and regulatory documents.</p>
                </div>
                <button 
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0B2240] text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-colors"
                >
                    <Upload className="h-4 w-4" /> Upload Document
                </button>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Document Title</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Upload Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {myDocs.map(doc => (
                            <tr key={doc.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-bold text-slate-900">{doc.title}</td>
                                <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{doc.type}</span></td>
                                <td className="px-6 py-4">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                        doc.status === 'Valid' ? 'bg-green-100 text-green-700' : 
                                        doc.status === 'Expired' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {doc.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 font-bold hover:underline">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {myDocs.length === 0 && <div className="p-8 text-center text-slate-400 italic">No compliance documents found.</div>}
            </div>

            {isUploadOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Upload Compliance Doc</h2>
                            <button onClick={() => setIsUploadOpen(false)}><X /></button>
                        </div>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Document Title</label>
                                <input 
                                    className="w-full border rounded-xl px-4 py-2" 
                                    required 
                                    value={newDoc.title}
                                    onChange={e => setNewDoc({...newDoc, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Document Type</label>
                                <select 
                                    className="w-full border rounded-xl px-4 py-2"
                                    value={newDoc.type}
                                    onChange={e => setNewDoc({...newDoc, type: e.target.value as any})}
                                >
                                    <option value="KYC">KYC</option>
                                    <option value="Form ADV">Form ADV</option>
                                    <option value="IPS">IPS</option>
                                    <option value="Annual Review">Annual Review</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">Upload</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- 3. Advisory Billing ---
export const AdvisoryFees: React.FC = () => {
    const { advisoryFees, user, updateFeeStatus, addAdvisoryFee, updateAdvisoryFee, deleteAdvisoryFee } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFee, setEditingFee] = useState<AdvisoryFee | null>(null);

    const [formData, setFormData] = useState<Partial<AdvisoryFee>>({
        clientName: '',
        aum: 0,
        amount: 0,
        billingPeriod: 'Q1',
        status: 'Invoiced',
        dueDate: new Date().toISOString().split('T')[0]
    });
    
    const myFees = advisoryFees.filter(f => f.advisorId === user?.id);
    const totalCollected = myFees.filter(f => f.status === 'Paid').reduce((acc, f) => acc + f.amount, 0);
    const totalPending = myFees.filter(f => f.status !== 'Paid').reduce((acc, f) => acc + f.amount, 0);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFee) {
            updateAdvisoryFee(editingFee.id, formData);
        } else {
            addAdvisoryFee(formData);
        }
        setIsModalOpen(false);
        setEditingFee(null);
        setFormData({ clientName: '', aum: 0, amount: 0, billingPeriod: 'Q1', status: 'Invoiced', dueDate: new Date().toISOString().split('T')[0] });
    };

    const handleEdit = (f: AdvisoryFee) => {
        setEditingFee(f);
        setFormData(f);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-[#0B2240] tracking-tight">Advisory Billing</h1>
                <p className="text-slate-500 mt-2">Billing overview, collected fees, and invoice status.</p>
            </div>

            {/* Stat Cards from Screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Fees Collected */}
                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] p-10 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-500/20 flex flex-col justify-between h-56 relative overflow-hidden group">
                    <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <DollarSign size={180} strokeWidth={3} />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div className="p-3.5 bg-white/20 rounded-[1.25rem] backdrop-blur-md">
                            <BadgeDollarSign className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-[10px] font-black bg-white/20 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">YTD</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[11px] font-black text-emerald-50 uppercase tracking-[0.2em] mb-2 opacity-80">Fees Collected</p>
                        <p className="text-6xl font-black tracking-tighter">${totalCollected.toLocaleString()}</p>
                    </div>
                </div>

                {/* Right: Pending Invoices */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-56 relative group">
                    <div className="flex justify-between items-start">
                        <div className="p-3.5 bg-orange-50 rounded-[1.25rem] text-orange-500 shadow-inner">
                            <AlertTriangle className="h-8 w-8" />
                        </div>
                        <span className="text-[10px] font-black bg-slate-100 px-4 py-1.5 rounded-full uppercase tracking-widest text-slate-500 border border-slate-200">Outstanding</span>
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Pending Invoices</p>
                        <p className="text-6xl font-black text-slate-900 tracking-tighter">${totalPending.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
                <div className="p-10 border-b border-slate-50 bg-white flex justify-between items-center">
                    <h3 className="text-xl font-black text-[#0B2240] tracking-tight">Fee Schedule & Invoices</h3>
                    <button 
                        onClick={() => { setEditingFee(null); setFormData({ clientName: '', aum: 0, amount: 0, billingPeriod: 'Q1', status: 'Invoiced', dueDate: new Date().toISOString().split('T')[0] }); setIsModalOpen(true); }}
                        className="px-8 py-4 bg-slate-50 text-[#0B2240] border border-slate-200 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm active:scale-95"
                    >
                        Generate Invoice
                    </button>
                </div>
                <div className="overflow-x-auto px-4 pb-4">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50/50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                            <tr>
                                <th className="px-8 py-6">Client Name</th>
                                <th className="px-8 py-6">Period</th>
                                <th className="px-8 py-6">AUM Basis</th>
                                <th className="px-8 py-6">Fee Amount</th>
                                <th className="px-8 py-6">Due Date</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {myFees.map(fee => (
                                <tr key={fee.id} className="hover:bg-slate-50/30 group transition-all">
                                    <td className="px-8 py-7">
                                        <div className="font-black text-slate-800 text-base">{fee.clientName}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Asset Advisory Account</div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-black">{fee.billingPeriod}</span>
                                    </td>
                                    <td className="px-8 py-7 font-bold text-slate-600">${fee.aum.toLocaleString()}</td>
                                    <td className="px-8 py-7">
                                        <div className="font-black text-slate-800 text-lg tracking-tight">${fee.amount.toLocaleString()}</div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="text-xs font-bold text-slate-500 bg-slate-100/50 w-fit px-3 py-1 rounded-lg">{new Date(fee.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                            fee.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                                            fee.status === 'Overdue' ? 'bg-red-50 text-red-600 border border-red-100' : 
                                            'bg-blue-50 text-blue-700 border border-blue-100'
                                        }`}>
                                            {fee.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-7 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            {fee.status !== 'Paid' && (
                                                <button 
                                                    onClick={() => updateFeeStatus(fee.id, 'Paid')}
                                                    className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                    title="Mark Paid"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button onClick={() => handleEdit(fee)} className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"><Edit2 className="h-4 w-4" /></button>
                                            <button onClick={() => deleteAdvisoryFee(fee.id)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {myFees.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-20">
                                            <BadgeDollarSign size={80} strokeWidth={1} />
                                            <p className="mt-4 font-black uppercase tracking-[0.4em] text-sm">Ledger Clean</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg p-12 relative border border-white/10">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors"><X size={24}/></button>
                        <h2 className="text-2xl font-black text-[#0B2240] mb-10 tracking-tight">{editingFee ? 'Edit Advisory Invoice' : 'Issue New Advisory Invoice'}</h2>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Account Entity</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#0A62A7] outline-none" required value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} placeholder="e.g. Sterling Family Trust" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">AUM Managed ($)</label>
                                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none" required value={formData.aum} onChange={e => setFormData({...formData, aum: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Calculated Fee ($)</label>
                                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent outline-none" required value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Billing Period</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black focus:ring-2 focus:ring-[#0A62A7] outline-none cursor-pointer appearance-none" value={formData.billingPeriod} onChange={e => setFormData({...formData, billingPeriod: e.target.value as any})}>
                                        <option value="Q1">Q1 (Jan-Mar)</option>
                                        <option value="Q2">Q2 (Apr-Jun)</option>
                                        <option value="Q3">Q3 (Jul-Sep)</option>
                                        <option value="Q4">Q4 (Oct-Dec)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Due Date</label>
                                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none" required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                                </div>
                            </div>
                            <div className="pt-8 flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl font-black text-[11px] bg-slate-50 text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-4 rounded-2xl font-black text-[11px] bg-[#0B2240] text-white uppercase tracking-widest hover:bg-slate-800 shadow-2xl shadow-blue-900/20 active:scale-95 transition-all">Commit Invoice</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
