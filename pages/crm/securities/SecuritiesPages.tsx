
import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { TrendingUp, FileText, BadgeDollarSign, PieChart, Download, Plus, Upload, CheckCircle2, AlertTriangle, Search, Filter, Briefcase } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RechartsPieChart, Pie, Legend } from 'recharts';

// --- 1. Portfolio Management ---
export const PortfolioMgmt: React.FC = () => {
    const { portfolios, user } = useData();
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);

    // Filter for current advisor
    const myPortfolios = portfolios.filter(p => p.advisorId === user?.id);
    const selectedPortfolio = myPortfolios.find(p => p.id === selectedPortfolioId) || myPortfolios[0];

    // Prepare chart data
    const allocationData = selectedPortfolio ? [
        { name: 'Equity', value: selectedPortfolio.holdings.filter(h => h.assetClass === 'Equity').reduce((acc, h) => acc + h.allocation, 0) },
        { name: 'Fixed Income', value: selectedPortfolio.holdings.filter(h => h.assetClass === 'Fixed Income').reduce((acc, h) => acc + h.allocation, 0) },
        { name: 'Cash', value: selectedPortfolio.holdings.filter(h => h.assetClass === 'Cash').reduce((acc, h) => acc + h.allocation, 0) },
        { name: 'Alternative', value: selectedPortfolio.holdings.filter(h => h.assetClass === 'Alternative').reduce((acc, h) => acc + h.allocation, 0) },
    ].filter(d => d.value > 0) : [];

    const COLORS = ['#0A62A7', '#10B981', '#F59E0B', '#8B5CF6'];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-[#0B2240]">Portfolio Management</h1>
                <p className="text-slate-500">Track client asset allocation, performance, and holdings.</p>
            </div>

            {myPortfolios.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500 font-medium">No portfolios assigned.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List */}
                    <div className="lg:col-span-1 space-y-4">
                        {myPortfolios.map(port => (
                            <div 
                                key={port.id}
                                onClick={() => setSelectedPortfolioId(port.id)}
                                className={`p-6 rounded-[2rem] border cursor-pointer transition-all hover:shadow-md ${selectedPortfolio?.id === port.id ? 'bg-[#0B2240] text-white border-[#0B2240] shadow-lg scale-[1.02]' : 'bg-white text-slate-700 border-slate-100 hover:border-slate-200'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{port.clientName}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${selectedPortfolio?.id === port.id ? 'bg-white/10 text-white' : 'bg-green-100 text-green-700'}`}>
                                        +{port.ytdReturn}%
                                    </span>
                                </div>
                                <p className={`text-sm mb-4 ${selectedPortfolio?.id === port.id ? 'text-blue-200' : 'text-slate-500'}`}>
                                    Risk Profile: {port.riskProfile}
                                </p>
                                <p className="text-2xl font-black tracking-tight">
                                    ${port.totalValue.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Detail View */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                        {selectedPortfolio && (
                            <div className="space-y-8">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-[#0B2240]">{selectedPortfolio.clientName} Portfolio</h2>
                                        <p className="text-slate-500 text-sm">Last Rebalanced: {new Date(selectedPortfolio.lastRebalanced).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-slate-50 rounded-full border border-slate-200 text-slate-600">
                                            <Download className="h-5 w-5" />
                                        </button>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
                                            Rebalance
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="min-w-0" style={{ height: '300px' }}>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase mb-4 text-center">Asset Allocation</h4>
                                        <ResponsiveContainer width="100%" height={260}>
                                            <RechartsPieChart>
                                                <Pie
                                                    data={allocationData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {allocationData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(val: number) => `${val}%`} />
                                                <Legend />
                                            </RechartsPieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase mb-4">Top Holdings</h4>
                                        <div className="space-y-3">
                                            {selectedPortfolio.holdings.map(h => (
                                                <div key={h.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-sm">{h.ticker}</div>
                                                        <div className="text-xs text-slate-500">{h.name}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-mono text-sm font-medium">${h.value.toLocaleString()}</div>
                                                        <div className="text-xs text-slate-400">{h.allocation}%</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- 2. Compliance Docs ---
export const ComplianceDocs: React.FC = () => {
    const { complianceDocs, user, addComplianceDoc } = useData();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    
    // Filter docs for advisor
    const myDocs = complianceDocs.filter(d => d.advisorId === user?.id);

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Valid': return 'bg-green-100 text-green-700';
            case 'Expired': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B2240]">Compliance Documents</h1>
                    <p className="text-slate-500">Manage Form ADV, KYC, and regulatory filings.</p>
                </div>
                <button 
                    onClick={() => setIsUploadOpen(true)}
                    className="bg-[#0A62A7] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Upload className="h-4 w-4" /> Upload Document
                </button>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Document Name</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Client Associated</th>
                            <th className="px-6 py-4">Upload Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {myDocs.map(doc => (
                            <tr key={doc.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900 flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        {doc.title}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">{doc.type}</span>
                                </td>
                                <td className="px-6 py-4 italic text-slate-500">
                                    {doc.clientName || 'General / Firm'}
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">
                                    {new Date(doc.uploadDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(doc.status)}`}>
                                        {doc.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:text-blue-800 font-bold text-xs">Download</button>
                                </td>
                            </tr>
                        ))}
                        {myDocs.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No compliance documents found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- 3. Advisory Fees ---
export const AdvisoryFees: React.FC = () => {
    const { advisoryFees, user, updateFeeStatus } = useData();
    
    const myFees = advisoryFees.filter(f => f.advisorId === user?.id);
    const totalCollected = myFees.filter(f => f.status === 'Paid').reduce((acc, f) => acc + f.amount, 0);
    const totalPending = myFees.filter(f => f.status !== 'Paid').reduce((acc, f) => acc + f.amount, 0);

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-[#0B2240]">Advisory Fees</h1>
                <p className="text-slate-500">Billing overview, collected fees, and invoice status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-[2rem] text-white shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                            <BadgeDollarSign className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-lg">YTD</span>
                    </div>
                    <p className="text-sm font-bold text-green-100 uppercase tracking-widest mb-1">Fees Collected</p>
                    <p className="text-4xl font-black">${totalCollected.toLocaleString()}</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 rounded-2xl text-orange-500">
                            <AlertTriangle className="h-8 w-8" />
                        </div>
                        <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-lg text-slate-500">Outstanding</span>
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Invoices</p>
                    <p className="text-4xl font-black text-slate-900">${totalPending.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-[#0B2240]">Fee Schedule & Invoices</h3>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm">
                        Generate Invoice
                    </button>
                </div>
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Client Name</th>
                            <th className="px-6 py-4">Period</th>
                            <th className="px-6 py-4">AUM Basis</th>
                            <th className="px-6 py-4">Fee Amount</th>
                            <th className="px-6 py-4">Due Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {myFees.map(fee => (
                            <tr key={fee.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-bold text-slate-900">{fee.clientName}</td>
                                <td className="px-6 py-4 font-mono text-xs">{fee.billingPeriod}</td>
                                <td className="px-6 py-4">${fee.aum.toLocaleString()}</td>
                                <td className="px-6 py-4 font-bold text-slate-700">${fee.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 text-xs">{new Date(fee.dueDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                        fee.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                                        fee.status === 'Overdue' ? 'bg-red-100 text-red-700' : 
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        {fee.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {fee.status !== 'Paid' && (
                                        <button 
                                            onClick={() => updateFeeStatus(fee.id, 'Paid')}
                                            className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            Mark Paid
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
