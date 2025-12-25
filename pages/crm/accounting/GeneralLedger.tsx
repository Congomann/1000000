
import React, { useState } from 'react';
import { useAccounting } from '../../../context/AccountingContext';
import { Plus, X, Trash2, Search, Filter } from 'lucide-react';
import { AccountType } from '../../../types';

export const GeneralLedger: React.FC = () => {
  const { journalEntries, accounts, postEntry } = useAccounting();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [desc, setDesc] = useState('');
  const [ref, setRef] = useState('');
  const [entryLines, setEntryLines] = useState([
      { accountId: '', debit: '', credit: '' },
      { accountId: '', debit: '', credit: '' }
  ]);

  const filteredEntries = journalEntries.filter(je => 
      je.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      je.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLine = () => {
      setEntryLines([...entryLines, { accountId: '', debit: '', credit: '' }]);
  };

  const handleRemoveLine = (index: number) => {
      const newLines = [...entryLines];
      newLines.splice(index, 1);
      setEntryLines(newLines);
  };

  const handleLineChange = (index: number, field: string, value: string) => {
      const newLines = [...entryLines];
      (newLines[index] as any)[field] = value;
      setEntryLines(newLines);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Convert to numbers
      const lines = entryLines.map(l => ({
          id: Math.random().toString(36).substr(2, 5),
          accountId: l.accountId,
          debit: parseFloat(l.debit) || 0,
          credit: parseFloat(l.credit) || 0,
          description: desc
      }));
      
      postEntry({
          date: new Date().toISOString().split('T')[0],
          description: desc,
          reference: ref,
          lines
      });

      setIsModalOpen(false);
      setDesc('');
      setRef('');
      setEntryLines([
        { accountId: '', debit: '', credit: '' },
        { accountId: '', debit: '', credit: '' }
      ]);
  };

  // Calculate totals for validation display
  const totalDebit = entryLines.reduce((acc, curr) => acc + (parseFloat(curr.debit) || 0), 0);
  const totalCredit = entryLines.reduce((acc, curr) => acc + (parseFloat(curr.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  return (
    <div className="space-y-8 pb-10">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-[#0B2240]">General Ledger</h1>
                <p className="text-slate-500">View transaction history and post manual journal entries.</p>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0A62A7] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
                <Plus className="h-4 w-4" /> New Journal Entry
            </button>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex gap-4">
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search transactions..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                    />
                 </div>
                 <button className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
                     <Filter className="h-4 w-4 text-slate-600" />
                 </button>
             </div>

             <div className="divide-y divide-slate-100">
                 {filteredEntries.map(entry => (
                     <div key={entry.id} className="p-6 hover:bg-slate-50 transition-colors group">
                         <div className="flex justify-between items-start mb-4">
                             <div>
                                 <h3 className="font-bold text-slate-900 text-lg">{entry.description}</h3>
                                 <p className="text-xs text-slate-500 font-medium">{new Date(entry.createdAt).toLocaleDateString()} • Ref: {entry.reference || 'N/A'} • ID: {entry.id}</p>
                             </div>
                             <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">Posted</span>
                         </div>
                         
                         {/* Lines */}
                         <div className="bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden">
                             <table className="w-full text-sm text-slate-600">
                                 <thead className="bg-slate-100 text-xs font-bold text-slate-500 uppercase text-left">
                                     <tr>
                                         <th className="px-4 py-2 w-1/2">Account</th>
                                         <th className="px-4 py-2 text-right">Debit</th>
                                         <th className="px-4 py-2 text-right">Credit</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                     {entry.lines.map((line, idx) => {
                                         const acc = accounts.find(a => a.id === line.accountId);
                                         return (
                                             <tr key={idx}>
                                                 <td className="px-4 py-2 font-medium">
                                                     {acc ? `${acc.code} - ${acc.name}` : 'Unknown Account'}
                                                 </td>
                                                 <td className="px-4 py-2 text-right font-mono">
                                                     {line.debit > 0 ? `$${line.debit.toLocaleString()}` : '-'}
                                                 </td>
                                                 <td className="px-4 py-2 text-right font-mono">
                                                     {line.credit > 0 ? `$${line.credit.toLocaleString()}` : '-'}
                                                 </td>
                                             </tr>
                                         );
                                     })}
                                 </tbody>
                             </table>
                         </div>
                     </div>
                 ))}
                 {filteredEntries.length === 0 && (
                     <div className="p-12 text-center text-slate-400 italic">No entries found.</div>
                 )}
             </div>
        </div>

        {/* New Entry Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl p-8 animate-fade-in max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#0B2240]">Post Journal Entry</h2>
                        <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="h-6 w-6 text-slate-400" /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                                <input 
                                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent" 
                                    required
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}
                                    placeholder="e.g. Monthly Rent Payment"
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reference</label>
                                <input 
                                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent" 
                                    value={ref}
                                    onChange={e => setRef(e.target.value)}
                                    placeholder="e.g. INV-2023-001"
                                />
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                             <div className="grid grid-cols-12 gap-4 mb-2 text-xs font-bold text-slate-500 uppercase">
                                 <div className="col-span-6">Account</div>
                                 <div className="col-span-2">Debit</div>
                                 <div className="col-span-2">Credit</div>
                                 <div className="col-span-2"></div>
                             </div>
                             <div className="space-y-3">
                                 {entryLines.map((line, index) => (
                                     <div key={index} className="grid grid-cols-12 gap-4 items-center">
                                         <div className="col-span-6">
                                             <select 
                                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#0A62A7]"
                                                value={line.accountId}
                                                onChange={e => handleLineChange(index, 'accountId', e.target.value)}
                                                required
                                             >
                                                 <option value="">Select Account...</option>
                                                 {accounts.map(acc => (
                                                     <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                                                 ))}
                                             </select>
                                         </div>
                                         <div className="col-span-2">
                                              <input 
                                                type="number" step="0.01"
                                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#0A62A7]"
                                                value={line.debit}
                                                onChange={e => handleLineChange(index, 'debit', e.target.value)}
                                                placeholder="0.00"
                                              />
                                         </div>
                                         <div className="col-span-2">
                                              <input 
                                                type="number" step="0.01"
                                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#0A62A7]"
                                                value={line.credit}
                                                onChange={e => handleLineChange(index, 'credit', e.target.value)}
                                                placeholder="0.00"
                                              />
                                         </div>
                                         <div className="col-span-2 text-right">
                                             <button type="button" onClick={() => handleRemoveLine(index)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                             <button type="button" onClick={handleAddLine} className="mt-4 text-sm font-bold text-[#0A62A7] hover:underline flex items-center gap-1">
                                 <Plus className="h-4 w-4" /> Add Line
                             </button>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                             <div className={`text-sm font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                                 Total Dr: ${totalDebit.toFixed(2)} | Total Cr: ${totalCredit.toFixed(2)}
                                 {!isBalanced && <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">Unbalanced</span>}
                             </div>
                             <button 
                                type="submit" 
                                disabled={!isBalanced}
                                className="bg-[#0A62A7] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                             >
                                 Post Entry
                             </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};
