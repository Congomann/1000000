
import React, { useState, useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { Landmark, FileText, Percent, Calculator, Search, Filter, ArrowUpRight, CheckCircle2, XCircle, Clock, Plus, ArrowRight, DollarSign, RefreshCw, TrendingUp, Edit2, Trash2, X, ChevronDown, Award, PieChart, Wallet, Briefcase, Zap, ShieldCheck, Check } from 'lucide-react';
import { LoanApplication } from '../../../types';

// --- Helper Components for Smart Hub ---
const OutcomeCard = ({ icon: Icon, label, value, colorClass, sub }: any) => (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${colorClass} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon className="h-5 w-5" />
            </div>
            {sub && <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-widest">{sub}</span>}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
        </div>
    </div>
);

// --- 1. Loan Applications ---
export const LoanApplications: React.FC = () => {
    const { loanApplications, user, addLoanApplication, updateLoanApplication, deleteLoanApplication } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [viewingLoan, setViewingLoan] = useState<LoanApplication | null>(null);

    const [formData, setFormData] = useState<Partial<LoanApplication>>({
        clientName: '',
        loanAmount: 0,
        propertyValue: 0,
        loanType: 'Purchase',
        status: 'Applied',
        interestRate: 6.5,
        currentRate: 0,
        ltv: 80,
        creditScore: 700,
        strategicGoal: 'Lower Payment'
    });

    const myLoans = loanApplications.filter(l => l.advisorId === user?.id);
    const filteredLoans = myLoans.filter(l => l.clientName.toLowerCase().includes(searchTerm.toLowerCase()));

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Approved': case 'Closed': return 'bg-green-100 text-green-700';
            case 'Underwriting': return 'bg-orange-100 text-orange-700';
            case 'Processing': return 'bg-yellow-100 text-yellow-700';
            case 'Declined': return 'bg-red-100 text-red-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    const handleOpenAdd = () => {
        setViewingLoan(null);
        setFormData({
            clientName: '',
            loanAmount: 0,
            propertyValue: 0,
            loanType: 'Purchase',
            status: 'Applied',
            interestRate: 6.5,
            currentRate: 0,
            ltv: 80,
            creditScore: 700,
            strategicGoal: 'Lower Payment'
        });
        setIsAddModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Calc automated smart fields if refi
        const smartData = { ...formData };
        if (smartData.loanType?.includes('Refi') && smartData.currentRate && smartData.interestRate && smartData.loanAmount) {
            const savings = (smartData.currentRate - smartData.interestRate) * (smartData.loanAmount / 100) / 12;
            smartData.monthlySavings = Math.max(0, savings);
            smartData.lifetimeInterestSavings = smartData.monthlySavings * 360; // 30yr projection
        }
        
        addLoanApplication(smartData);
        setIsAddModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Archive this loan application?')) {
            deleteLoanApplication(id);
        }
    };

    return (
        <div className="space-y-8 pb-10 animate-fade-in">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-[#0B2240] tracking-tight">Lending Terminal</h1>
                    <p className="text-slate-500 mt-2 font-medium">Strategic mortgage management and equity optimization.</p>
                </div>
                <button 
                    onClick={handleOpenAdd}
                    className="bg-[#0A62A7] text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all flex items-center gap-2 transform active:scale-95"
                >
                    <Plus className="h-5 w-5" /> New Loan App
                </button>
            </div>

            <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden min-h-[500px]">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                    <div className="relative max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <input 
                            type="text" 
                            placeholder="Search client names..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[2rem] text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none transition-all placeholder:text-slate-300 shadow-sm"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                            <tr>
                                <th className="px-10 py-6">Client Entity</th>
                                <th className="px-10 py-6">Loan Amount</th>
                                <th className="px-10 py-6 text-center">Type</th>
                                <th className="px-10 py-6 text-center">Outcome Status</th>
                                <th className="px-10 py-6">Rate Metrics</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLoans.map(loan => (
                                <tr key={loan.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-10 py-8">
                                        <div className="font-black text-slate-900 text-base">{loan.clientName}</div>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{loan.strategicGoal || 'Transactional'}</span>
                                            <span className="text-[10px] text-slate-300">|</span>
                                            <span className="text-[10px] text-slate-400 font-mono uppercase">ID: {loan.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="font-black text-slate-800 text-lg tracking-tighter">${loan.loanAmount.toLocaleString()}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Value: ${loan.propertyValue?.toLocaleString()}</div>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200/50">{loan.loanType}</span>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(loan.status)}`}>
                                            {loan.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2">
                                            <div className="text-base font-black text-slate-800 tracking-tight">{loan.interestRate}%</div>
                                            {loan.currentRate && loan.currentRate > loan.interestRate && (
                                                <div className="flex items-center text-green-500 font-black text-[10px] bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                                    ↓ {(loan.currentRate - loan.interestRate).toFixed(2)}%
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">{loan.ltv}% LTV</div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button 
                                                onClick={() => setViewingLoan(loan)}
                                                className="text-[#0A62A7] font-black text-sm hover:underline flex items-center gap-1.5 bg-blue-50 px-4 py-2 rounded-xl"
                                            >
                                                View Pipeline
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(loan.id)}
                                                className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Strategy Hub Modal (Detail View) */}
            {viewingLoan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/60 backdrop-blur-md p-4 animate-fade-in">
                    <div className="bg-slate-50 rounded-[4rem] shadow-2xl w-full max-w-6xl overflow-hidden relative border border-white/10 max-h-[95vh] flex flex-col">
                        <div className="bg-white p-10 flex justify-between items-center border-b border-slate-100">
                            <div className="flex items-center gap-6">
                                <div className="p-5 bg-[#0B2240] text-white rounded-[2rem] shadow-lg">
                                    <Landmark size={32} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-[#0B2240] tracking-tight">{viewingLoan.clientName}</h2>
                                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest mt-1">Strategic Path: <span className="text-blue-600">{viewingLoan.strategicGoal || 'Custom Lending'}</span></p>
                                </div>
                            </div>
                            <button onClick={() => setViewingLoan(null)} className="p-4 hover:bg-slate-100 rounded-full text-slate-300 hover:text-slate-600 transition-all"><X size={32}/></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left Col: Strategic Outcomes */}
                                <div className="lg:col-span-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <OutcomeCard 
                                            icon={DollarSign} 
                                            label="Monthly Cash Flow" 
                                            value={viewingLoan.monthlySavings ? `+$${viewingLoan.monthlySavings.toLocaleString()}` : 'N/A'} 
                                            colorClass="bg-emerald-500" 
                                            sub="Profitability"
                                        />
                                        <OutcomeCard 
                                            icon={TrendingUp} 
                                            label="Lifetime Savings" 
                                            value={viewingLoan.lifetimeInterestSavings ? `$${viewingLoan.lifetimeInterestSavings.toLocaleString()}` : 'Analysis Pending'} 
                                            colorClass="bg-blue-600" 
                                            sub="Strategic Wealth"
                                        />
                                        <OutcomeCard 
                                            icon={Briefcase} 
                                            label="Available Equity" 
                                            value={`$${(viewingLoan.propertyValue - viewingLoan.loanAmount).toLocaleString()}`} 
                                            colorClass="bg-indigo-600" 
                                            sub="Equity Cushion"
                                        />
                                    </div>

                                    {/* Smart Analysis Block */}
                                    <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 transition-transform group-hover:scale-110"><PieChart size={200}/></div>
                                        <h3 className="text-xl font-black text-[#0B2240] mb-8 flex items-center gap-3">
                                            <Zap className="h-6 w-6 text-yellow-500 fill-current" /> Financial Optimization Logic
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rate Spread</span>
                                                    <span className="font-black text-slate-700">{viewingLoan.currentRate ? `${(viewingLoan.currentRate - viewingLoan.interestRate).toFixed(2)}% Improvement` : 'Market Quote'}</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Equity Usage</span>
                                                    <span className="font-black text-slate-700">{viewingLoan.ltv}% LTV (Secure Range)</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Risk Factor</span>
                                                    <span className={`font-black uppercase tracking-tighter ${viewingLoan.creditScore > 720 ? 'text-green-600' : 'text-orange-500'}`}>
                                                        {viewingLoan.creditScore > 740 ? 'Premium' : viewingLoan.creditScore > 700 ? 'Secure' : 'Standard'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Advisor Recommendation</h4>
                                                <p className="text-sm text-slate-600 leading-relaxed italic">"Proceed with {viewingLoan.loanType} to secure long-term liquidity. Current market conditions favor the proposed term of 30 years to maximize cash-on-hand for further investments."</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Col: Pipeline Progress */}
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm h-full">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 text-center border-b border-slate-50 pb-4">Underwriting Velocity</h3>
                                        <div className="space-y-10">
                                            {[
                                                { label: 'Application Received', status: 'done' },
                                                { label: 'Credit & Identity Verif', status: 'done' },
                                                { label: 'Asset Documentation', status: 'active' },
                                                { label: 'Property Appraisal', status: 'pending' },
                                                { label: 'Underwriting Review', status: 'pending' },
                                                { label: 'Closing Disclosure', status: 'pending' }
                                            ].map((step, i) => (
                                                <div key={i} className="flex gap-5 relative group">
                                                    {i !== 5 && <div className={`absolute left-[13px] top-[26px] h-[calc(100%+40px)] w-0.5 ${step.status === 'done' ? 'bg-blue-600' : 'bg-slate-100'}`} />}
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 border-2 transition-all ${step.status === 'done' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : step.status === 'active' ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50' : 'bg-white border-slate-200 text-slate-300'}`}>
                                                        {/* Check icon for completed steps with bounce animation */}
                                                        {step.status === 'done' ? <Check size={14} strokeWidth={4} className="animate-bounce-subtle" /> : <div className={`w-1.5 h-1.5 rounded-full ${step.status === 'active' ? 'bg-blue-600 animate-pulse' : 'bg-slate-200'}`} />}
                                                    </div>
                                                    <span className={`text-xs font-black uppercase tracking-widest ${step.status === 'active' ? 'text-blue-600' : step.status === 'done' ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-12">
                                            <button className="w-full py-4 bg-[#0A62A7] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all transform active:scale-95">Accelerate Pipeline</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 border-t border-slate-100 flex justify-between items-center px-10">
                            <div className="flex gap-4">
                                <button className="px-6 py-3 border border-slate-200 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Client Portal Invite</button>
                                <button className="px-6 py-3 border border-slate-200 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Document Checklist</button>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-green-500"/> Compliant & Secure</span>
                                <button className="px-10 py-4 bg-[#0B2240] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 shadow-xl transition-all flex items-center gap-3">
                                    <FileText size={16} /> Generate Strategy Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Smart Intake Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/60 backdrop-blur-md p-4 animate-fade-in">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl p-12 relative border border-white/10 max-h-[95vh] overflow-y-auto no-scrollbar">
                        <button onClick={() => setIsAddModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors"><X size={32}/></button>
                        <h2 className="text-3xl font-black text-[#0B2240] mb-2 tracking-tight">Initiate Smart Loan App</h2>
                        <p className="text-slate-400 font-medium mb-10">Capture real-world financials to analyze path-to-wealth.</p>
                        
                        <form onSubmit={handleSave} className="space-y-10">
                            {/* Entity & Goal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Client Full Name</label>
                                    <input 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all" 
                                        required 
                                        value={formData.clientName} 
                                        onChange={e => setFormData({...formData, clientName: e.target.value})} 
                                        placeholder="Ethan Wright" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Strategic Goal</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 focus:ring-4 focus:ring-blue-50 outline-none appearance-none cursor-pointer"
                                        value={formData.strategicGoal}
                                        onChange={e => setFormData({...formData, strategicGoal: e.target.value as any})}
                                    >
                                        <option value="Lower Payment">Lower Monthly Payment</option>
                                        <option value="Equity Access">Unlock Home Equity</option>
                                        <option value="Debt Consolidation">Consolidate High-Interest Debt</option>
                                        <option value="Wealth Building">Build Strategic Wealth</option>
                                    </select>
                                </div>
                            </div>

                            {/* Property Data */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Prop. Value ($)</label>
                                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black focus:ring-4 focus:ring-blue-50 outline-none" value={formData.propertyValue} onChange={e => setFormData({...formData, propertyValue: Number(e.target.value)})} placeholder="600,000" />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Loan Amount ($)</label>
                                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black focus:ring-4 focus:ring-blue-50 outline-none" value={formData.loanAmount} onChange={e => setFormData({...formData, loanAmount: Number(e.target.value)})} placeholder="450,000" />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Loan Type</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black focus:ring-4 focus:ring-blue-50 outline-none appearance-none" value={formData.loanType} onChange={e => setFormData({...formData, loanType: e.target.value as any})}>
                                        <option value="Purchase">Purchase</option>
                                        <option value="Refinance">Refinance</option>
                                        <option value="Cash-Out Refi">Cash-Out Refi</option>
                                        <option value="HELOC">HELOC</option>
                                    </select>
                                </div>
                            </div>

                            {/* Rate Spread Analysis */}
                            <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100 shadow-inner">
                                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><PieChart size={14}/> Optimization Metrics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-1">Current Interest Rate (%)</label>
                                        <input type="number" step="0.01" className="w-full bg-white border border-blue-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 focus:ring-4 focus:ring-blue-200 outline-none" value={formData.currentRate} onChange={e => setFormData({...formData, currentRate: Number(e.target.value)})} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-1">New Quoted Rate (%)</label>
                                        <input type="number" step="0.01" className="w-full bg-white border border-blue-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 focus:ring-4 focus:ring-blue-200 outline-none" value={formData.interestRate} onChange={e => setFormData({...formData, interestRate: Number(e.target.value)})} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-6">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-5 rounded-[1.5rem] font-black text-[10px] bg-slate-100 text-slate-400 uppercase tracking-[0.2em] hover:bg-slate-200 transition-all">Cancel Draft</button>
                                <button type="submit" className="flex-1 py-5 rounded-[1.5rem] font-black text-[10px] bg-[#0B2240] text-white uppercase tracking-[0.2em] hover:bg-slate-800 shadow-2xl shadow-blue-900/20 active:scale-95 transition-all">Commit Strategy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- 2. Rate Tools ---
export const RateTools: React.FC = () => {
    const marketRates = [
        { term: '30-Year Fixed', rate: '6.45%', change: -0.02, trend: 'down' },
        { term: '15-Year Fixed', rate: '5.85%', change: 0.05, trend: 'up' },
        { term: '5/1 ARM', rate: '5.95%', change: 0.00, trend: 'stable' },
        { term: '30-Year Jumbo', rate: '6.80%', change: -0.10, trend: 'down' },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-black text-[#0B2240] tracking-tight">Wholesale Rate Terminal</h1>
                <p className="text-slate-500 mt-2 font-medium">Real-time pricing for A-rated mortgage lenders.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {marketRates.map((r, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">{r.term}</p>
                        <div className="flex items-end justify-between">
                            <p className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-[#0A62A7] transition-colors">{r.rate}</p>
                            <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${r.change < 0 ? 'bg-green-50 text-green-700 border-green-100' : r.change > 0 ? 'bg-red-50 text-red-700 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                {r.change > 0 ? '↑' : r.change < 0 ? '↓' : ''}{Math.abs(r.change).toFixed(2)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[#0B2240] text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12 scale-150"><Percent size={220} /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md">
                            <RefreshCw className="h-8 w-8 text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight uppercase">Lock Engine Connectivity</h2>
                    </div>
                    <p className="text-blue-100 max-w-2xl mb-10 text-lg leading-relaxed font-medium">Pricing updated every 15 minutes via national wholesale API. Final quotes subject to LTV/DTI underwriting verification.</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] transition-all shadow-xl shadow-blue-900/40 flex items-center gap-3 active:scale-95">
                        <RefreshCw size={20} className="animate-spin-slow" /> Trigger Manual Pricing Sync
                    </button>
                </div>
            </div>
            
            <style>{`
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

// --- 3. Refinance Calculator ---
export const RefinanceCalc: React.FC = () => {
    const [calc, setCalc] = useState({
        currentBalance: 350000,
        currentRate: 6.5,
        newRate: 5.75,
        term: 30
    });

    const calculateSavings = () => {
        const i_old = (calc.currentRate / 100) / 12;
        const i_new = (calc.newRate / 100) / 12;
        const n = calc.term * 12;
        
        const pmt_old = (calc.currentBalance * i_old * Math.pow(1 + i_old, n)) / (Math.pow(1 + i_old, n) - 1);
        const pmt_new = (calc.currentBalance * i_new * Math.pow(1 + i_new, n)) / (Math.pow(1 + i_new, n) - 1);
        
        const monthly = pmt_old - pmt_new;
        return { monthly, annual: monthly * 12, lifetime: monthly * n };
    };

    const savings = calculateSavings();

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-black text-[#0B2240] tracking-tight">Smart Refi Analysis</h1>
                <p className="text-slate-500 mt-2 font-medium">Wealth building through rate and term optimization.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-black text-[#0B2240] mb-10 flex items-center gap-3"><Calculator className="h-8 w-8 text-[#0A62A7]" /> Wealth Inputs</h2>
                    <div className="space-y-8">
                        <div>
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3 ml-2">Mortgage Balance ($)</label>
                            <input 
                                type="number" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-5 text-2xl font-black text-[#0B2240] outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-[#0A62A7] transition-all shadow-inner"
                                value={calc.currentBalance}
                                onChange={e => setCalc({...calc, currentBalance: Number(e.target.value)})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3 ml-2">Current Rate (%)</label>
                                <input 
                                    type="number" step="0.1"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-5 text-2xl font-black text-[#0B2240] outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-[#0A62A7] transition-all shadow-inner"
                                    value={calc.currentRate}
                                    onChange={e => setCalc({...calc, currentRate: Number(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3 ml-2">Proposed Rate (%)</label>
                                <input 
                                    type="number" step="0.1"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-5 text-2xl font-black text-[#0A62A7] outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-[#0A62A7] transition-all shadow-inner"
                                    value={calc.newRate}
                                    onChange={e => setCalc({...calc, newRate: Number(e.target.value)})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3 ml-2">New Term (Years)</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-5 text-2xl font-black text-[#0B2240] outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-blue-50/50"
                                    value={calc.term}
                                    onChange={e => setCalc({...calc, term: Number(e.target.value)})}
                                >
                                    <option value={30}>30 Years</option>
                                    <option value={20}>20 Years</option>
                                    <option value={15}>15 Years</option>
                                    <option value={10}>10 Years</option>
                                </select>
                                <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-300 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0B2240] text-white p-12 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(11,34,64,0.3)] flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500 rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black mb-12 flex items-center gap-3 text-blue-400 uppercase tracking-widest"><TrendingUp className="h-7 w-7" /> Financial Outcomes</h2>
                        <div className="space-y-12">
                            <div>
                                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-4">Cash Flow Impact (Monthly)</p>
                                <p className="text-7xl font-black text-emerald-400 tracking-tighter shadow-sm">${savings.monthly.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-2">Added to Discretionary Income</p>
                            </div>
                            <div className="grid grid-cols-2 gap-10 border-t border-white/5 pt-12">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Annual Savings</p>
                                    <p className="text-3xl font-black tracking-tight">${savings.annual.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Net Interest Savings</p>
                                    <p className="text-3xl font-black text-blue-400 tracking-tight">${savings.lifetime.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-12 relative z-10">
                        <button className="w-full py-6 bg-blue-600 hover:bg-blue-500 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-3">
                            <Plus size={20}/> Generate Refi Strategy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
