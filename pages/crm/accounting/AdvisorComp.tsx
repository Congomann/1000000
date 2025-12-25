
import React, { useState, useEffect } from 'react';
import { useData } from '../../../context/DataContext';
import { useAccounting } from '../../../context/AccountingContext';
import { UserRole } from '../../../types';
import { DollarSign, CheckCircle2, History, TrendingUp } from 'lucide-react';

export const AdvisorComp: React.FC = () => {
  const { allUsers } = useData();
  const { postEntry, getAdvisorBalance, journalEntries } = useAccounting();
  const [successMsg, setSuccessMsg] = useState('');
  
  // Filter for Advisors
  const advisors = allUsers.filter(u => u.role === UserRole.ADVISOR);

  // Calculate balances live from the Ledger
  const advisorData = advisors.map(adv => ({
      ...adv,
      balance: getAdvisorBalance(adv.id)
  }));

  const handlePayAdvisor = (advisorId: string, amount: number, name: string) => {
      if (amount <= 0) return;

      // Create Journal Entry: Debit Payable, Credit Cash
      postEntry({
          date: new Date().toISOString().split('T')[0],
          description: `Commission Payout - ${name}`,
          reference: `PAY-${Math.floor(Math.random() * 10000)}`,
          lines: [
              { id: '1', accountId: '2200', debit: amount, credit: 0, description: 'Clear Payable', advisorId: advisorId }, // Dr Comm Payable
              { id: '2', accountId: '1000', debit: 0, credit: amount, description: 'Cash Payout' }   // Cr Cash
          ]
      });
      
      setSuccessMsg(`Payment of $${amount.toLocaleString()} processed for ${name}.`);
      setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-8 pb-10">
         <div className="flex justify-between items-end">
            <div>
                <h1 className="text-2xl font-bold text-[#0B2240]">Advisor Compensation</h1>
                <p className="text-slate-500">Real-time payable commissions calculated from General Ledger.</p>
            </div>
            <div className="bg-blue-50 px-6 py-3 rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-blue-200 rounded-full text-blue-800"><TrendingUp className="h-5 w-5" /></div>
                <div>
                    <p className="text-xs font-bold text-blue-800 uppercase">Total Payable</p>
                    <p className="text-lg font-black text-[#0B2240]">
                        ${advisorData.reduce((acc, curr) => acc + curr.balance, 0).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>

        {successMsg && (
            <div className="bg-green-100 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center animate-fade-in">
                <CheckCircle2 className="h-5 w-5 mr-3" />
                {successMsg}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advisorData.map(adv => (
                <div key={adv.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                             <div className="h-14 w-14 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                                 {adv.avatar ? <img src={adv.avatar} className="w-full h-full object-cover" /> : null}
                             </div>
                             <div>
                                 <h3 className="font-bold text-slate-900 text-lg">{adv.name}</h3>
                                 <p className="text-xs text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded-lg inline-block mt-1">{adv.category}</p>
                             </div>
                        </div>
                        
                        <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Outstanding Balance</p>
                            <p className={`text-3xl font-black ${adv.balance > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                                ${adv.balance.toLocaleString()}
                            </p>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Recent Activity</p>
                            <ul className="space-y-2">
                                {journalEntries
                                    .filter(je => je.lines.some(l => l.advisorId === adv.id))
                                    .slice(0, 3)
                                    .map(je => {
                                        const line = je.lines.find(l => l.advisorId === adv.id);
                                        const isCredit = (line?.credit || 0) > 0;
                                        return (
                                            <li key={je.id} className="text-xs flex justify-between text-slate-600 border-b border-slate-100 pb-1 last:border-0">
                                                <span className="truncate max-w-[140px]">{je.description}</span>
                                                <span className={`font-mono font-bold ${isCredit ? 'text-green-600' : 'text-red-500'}`}>
                                                    {isCredit ? '+' : '-'}${((line?.credit || 0) + (line?.debit || 0)).toLocaleString()}
                                                </span>
                                            </li>
                                        );
                                    })}
                                {journalEntries.filter(je => je.lines.some(l => l.advisorId === adv.id)).length === 0 && (
                                    <li className="text-xs text-slate-400 italic">No recent activity</li>
                                )}
                            </ul>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => handlePayAdvisor(adv.id, adv.balance, adv.name)}
                        disabled={adv.balance <= 0}
                        className="w-full bg-[#0A62A7] text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <DollarSign className="h-5 w-5" /> Pay Full Balance
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
};
