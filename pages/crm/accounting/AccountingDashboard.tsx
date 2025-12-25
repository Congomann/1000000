
import React from 'react';
import { useAccounting } from '../../../context/AccountingContext';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowRight, Activity, FileText, CreditCard, AlertCircle } from 'lucide-react';

export const AccountingDashboard: React.FC = () => {
  const { calculateFinancials, journalEntries, bankTransactions } = useAccounting();
  const financials = calculateFinancials();

  // Calculate Tax Estimate (Simplified)
  const estTax = financials.netIncome * 0.21;
  const pendingTransactions = bankTransactions.filter(t => t.status === 'pending').length;

  const StatCard = ({ label, value, icon: Icon, color, sub }: any) => (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            {sub && <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">{sub}</span>}
        </div>
        <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-black text-[#0B2240]">Financial Overview</h1>
                <p className="text-slate-500 font-medium mt-1">Real-time accounting snapshot.</p>
            </div>
            <div className="flex gap-3">
                <Link to="/crm/accounting/ledger" className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-full font-bold text-sm hover:bg-slate-50 transition-colors">
                    General Ledger
                </Link>
                <Link to="/crm/accounting/advisor-comp" className="bg-[#0A62A7] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-colors">
                    Advisor Payouts
                </Link>
            </div>
        </div>

        {/* Banking Alert */}
        {pendingTransactions > 0 && (
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem] flex items-center justify-between shadow-sm animate-fade-in">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Action Required</h3>
                        <p className="text-slate-500">You have <span className="font-bold text-orange-600">{pendingTransactions} unreconciled transactions</span> from your connected bank feeds.</p>
                    </div>
                </div>
                <Link to="/crm/accounting/banking" className="px-6 py-3 bg-white text-orange-600 font-bold rounded-full text-sm shadow-sm hover:bg-orange-50 transition-colors">
                    Review Transactions
                </Link>
            </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Revenue" value={financials.totalRevenue} icon={TrendingUp} color="bg-green-500" sub="YTD" />
            <StatCard label="Total Expenses" value={financials.totalExpenses} icon={TrendingDown} color="bg-red-500" sub="YTD" />
            <StatCard label="Net Income" value={financials.netIncome} icon={DollarSign} color="bg-blue-600" />
            <StatCard label="Est. Tax Liability" value={estTax} icon={Wallet} color="bg-purple-500" sub="21%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Links / Actions */}
            <div className="bg-[#0B2240] text-white p-8 rounded-[2.5rem] flex flex-col justify-between shadow-xl">
                <div>
                    <h3 className="text-2xl font-bold mb-4">Bookkeeping Tools</h3>
                    <p className="text-blue-200 mb-8 text-sm leading-relaxed">Access core accounting functions, generate reports, and manage payroll.</p>
                    
                    <div className="space-y-3">
                        <Link to="/crm/accounting/banking" className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <CreditCard className="h-5 w-5 text-blue-400" />
                                <span className="font-bold">Bank Feeds</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </Link>
                        <Link to="/crm/accounting/reports" className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-yellow-400" />
                                <span className="font-bold">Financial Reports</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </Link>
                        <Link to="/crm/accounting/ledger" className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors cursor-pointer group">
                             <div className="flex items-center gap-3">
                                <Activity className="h-5 w-5 text-green-400" />
                                <span className="font-bold">Journal Entries</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Journal Entries</h3>
                <div className="space-y-4">
                    {journalEntries.slice(0, 4).map(entry => (
                        <div key={entry.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div>
                                <p className="font-bold text-slate-900">{entry.description}</p>
                                <p className="text-xs text-slate-500 font-medium">{new Date(entry.createdAt).toLocaleDateString()} • Ref: {entry.reference || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider">Posted</span>
                            </div>
                        </div>
                    ))}
                    {journalEntries.length === 0 && (
                        <p className="text-center text-slate-400 py-4">No transactions recorded yet.</p>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
