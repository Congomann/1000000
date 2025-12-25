
import React, { useState } from 'react';
import { useAccounting } from '../../../context/AccountingContext';
import { AccountType } from '../../../types';
import { FileDown } from 'lucide-react';

export const Reports: React.FC = () => {
  const { accounts, calculateFinancials } = useAccounting();
  const [activeTab, setActiveTab] = useState<'bs' | 'pl'>('bs');

  const financials = calculateFinancials();

  const renderAccountGroup = (title: string, type: AccountType) => {
      const groupAccounts = accounts.filter(a => a.type === type && a.balance !== 0);
      const total = groupAccounts.reduce((sum, a) => sum + a.balance, 0);

      return (
          <div className="mb-8">
              <h4 className="text-sm font-bold text-slate-500 uppercase border-b border-slate-200 pb-2 mb-3 flex justify-between">
                  <span>{title}</span>
                  <span>Total</span>
              </h4>
              <div className="space-y-2">
                  {groupAccounts.map(acc => (
                      <div key={acc.id} className="flex justify-between text-sm text-slate-700">
                          <span>{acc.code} - {acc.name}</span>
                          <span className="font-mono">${acc.balance.toLocaleString()}</span>
                      </div>
                  ))}
                  {groupAccounts.length === 0 && <p className="text-xs text-slate-400 italic">No activity.</p>}
              </div>
              <div className="flex justify-between font-bold text-slate-900 mt-3 pt-2 border-t border-slate-100">
                  <span>Total {title}</span>
                  <span>${total.toLocaleString()}</span>
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-8 pb-10">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-[#0B2240]">Financial Reports</h1>
                <p className="text-slate-500">Real-time Balance Sheet and Income Statement.</p>
            </div>
            <button className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-slate-50 flex items-center gap-2">
                <FileDown className="h-4 w-4" /> Export PDF
            </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden min-h-[600px]">
             {/* Tab Header */}
             <div className="flex border-b border-slate-100">
                 <button 
                    onClick={() => setActiveTab('bs')}
                    className={`flex-1 py-5 text-center font-bold text-sm transition-colors ${activeTab === 'bs' ? 'text-[#0A62A7] border-b-2 border-[#0A62A7] bg-blue-50/20' : 'text-slate-500 hover:bg-slate-50'}`}
                 >
                     Balance Sheet
                 </button>
                 <button 
                    onClick={() => setActiveTab('pl')}
                    className={`flex-1 py-5 text-center font-bold text-sm transition-colors ${activeTab === 'pl' ? 'text-[#0A62A7] border-b-2 border-[#0A62A7] bg-blue-50/20' : 'text-slate-500 hover:bg-slate-50'}`}
                 >
                     Profit & Loss
                 </button>
             </div>

             <div className="p-10 max-w-3xl mx-auto">
                 {activeTab === 'bs' ? (
                     <div className="space-y-10 animate-fade-in">
                         <h2 className="text-center text-2xl font-black text-[#0B2240] mb-8">Balance Sheet <span className="text-lg font-normal text-slate-400 block mt-1">As of {new Date().toLocaleDateString()}</span></h2>
                         
                         {renderAccountGroup('Assets', AccountType.ASSET)}
                         {renderAccountGroup('Liabilities', AccountType.LIABILITY)}
                         {renderAccountGroup('Equity', AccountType.EQUITY)}

                         <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
                             <div className="flex justify-between text-lg font-bold text-[#0B2240]">
                                 <span>Total Liabilities & Equity</span>
                                 <span>${(financials.totalLiabilities + financials.totalEquity).toLocaleString()}</span>
                             </div>
                             <p className="text-xs text-slate-400 text-right mt-1">* Should match Total Assets: ${financials.totalAssets.toLocaleString()}</p>
                         </div>
                     </div>
                 ) : (
                     <div className="space-y-10 animate-fade-in">
                         <h2 className="text-center text-2xl font-black text-[#0B2240] mb-8">Income Statement <span className="text-lg font-normal text-slate-400 block mt-1">Year to Date</span></h2>
                         
                         {renderAccountGroup('Revenue', AccountType.REVENUE)}
                         {renderAccountGroup('Expenses', AccountType.EXPENSE)}

                         <div className="bg-[#0B2240] text-white p-6 rounded-xl shadow-lg mt-8">
                             <div className="flex justify-between text-xl font-bold">
                                 <span>Net Income</span>
                                 <span>${financials.netIncome.toLocaleString()}</span>
                             </div>
                         </div>
                     </div>
                 )}
             </div>
        </div>
    </div>
  );
};
