
import React, { useState } from 'react';
import { useAccounting } from '../../../context/AccountingContext';
import { useData } from '../../../context/DataContext';
import { UserRole, BankRule } from '../../../types';
import { Plus, CreditCard, RefreshCw, CheckCircle2, ArrowUpRight, ArrowDownLeft, Building2, ChevronDown, Check, Loader2, ShieldCheck, Lock, Wand2, Trash2, Settings } from 'lucide-react';

// MOCK PLAID INSTITUTIONS LIST
const INSTITUTIONS = [
    { id: 'ins_1', name: 'Chase', logo: 'https://logo.clearbit.com/chase.com' },
    { id: 'ins_2', name: 'Bank of America', logo: 'https://logo.clearbit.com/bankofamerica.com' },
    { id: 'ins_3', name: 'Wells Fargo', logo: 'https://logo.clearbit.com/wellsfargo.com' },
    { id: 'ins_4', name: 'American Express', logo: 'https://logo.clearbit.com/americanexpress.com' },
    { id: 'ins_5', name: 'Citi', logo: 'https://logo.clearbit.com/citi.com' },
];

export const BankFeeds: React.FC = () => {
  const { 
      bankAccounts, 
      bankTransactions, 
      connectBankAccount, 
      refreshBankFeeds, 
      expenseCategories, 
      reconcileTransaction, 
      isLoadingBanks,
      bankRules,
      addBankRule,
      deleteBankRule
  } = useAccounting();
  const { user } = useData();
  
  const [activeTab, setActiveTab] = useState<'feeds' | 'rules'>('feeds');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  // Plaid Simulation State
  const [plaidStep, setPlaidStep] = useState<'select' | 'auth' | 'success'>('select');
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);
  
  // Categorization State
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [txNotes, setTxNotes] = useState('');

  // Rules State
  const [newRule, setNewRule] = useState<Partial<BankRule>>({ name: '', conditions: [{ field: 'merchant', operator: 'contains', value: '' }], assignCategory: '' });

  // Filter accounts based on role
  const myAccounts = bankAccounts.filter(acc => {
      if (user?.role === UserRole.ADVISOR) return acc.userId === user.id;
      if (user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER) return acc.userId === 'company';
      return false;
  });

  const activeAccount = myAccounts.find(a => a.id === selectedAccount) || myAccounts[0];
  const activeTransactions = bankTransactions
    .filter(t => t.bankAccountId === activeAccount?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // --- Plaid Flow Handlers ---
  const startPlaidFlow = () => {
      setPlaidStep('select');
      setSelectedInstitution(null);
      setIsConnectModalOpen(true);
  };

  const handleSelectInstitution = (inst: any) => {
      setSelectedInstitution(inst);
      setPlaidStep('auth');
  };

  const handlePlaidSuccess = async () => {
      // Simulate connecting
      if (selectedInstitution) {
          await connectBankAccount(selectedInstitution.id);
          setPlaidStep('success');
          setTimeout(() => {
              setIsConnectModalOpen(false);
              setPlaidStep('select');
          }, 1500);
      }
  };

  // --- Transaction Handlers ---
  const handleReconcile = () => {
      if (selectedTxId && selectedCategory) {
          reconcileTransaction(selectedTxId, selectedCategory, txNotes);
          setSelectedTxId(null);
          setSelectedCategory('');
          setTxNotes('');
      }
  };

  const openReconcile = (txId: string, suggestedCat: string) => {
      // Try to find category by exact name, else default
      const catId = expenseCategories.find(c => c.name === suggestedCat)?.id || '';
      setSelectedTxId(txId);
      setSelectedCategory(catId);
      setTxNotes('');
  };

  // --- Rules Handlers ---
  const handleAddRule = () => {
      if (newRule.name && newRule.conditions?.[0].value && newRule.assignCategory) {
          addBankRule({
              name: newRule.name,
              conditions: newRule.conditions as any,
              assignCategory: newRule.assignCategory,
              userId: user?.id || 'company'
          });
          setNewRule({ name: '', conditions: [{ field: 'merchant', operator: 'contains', value: '' }], assignCategory: '' });
      }
  };

  return (
    <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <h1 className="text-2xl font-bold text-[#0B2240]">Banking & Expenses</h1>
                <p className="text-slate-500">Securely connect accounts, track real-time spending, and automate tax savings.</p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={() => setActiveTab('rules')}
                    className={`px-5 py-3 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'rules' ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                    <Wand2 className="h-4 w-4" /> Rules Engine
                </button>
                <button 
                    onClick={() => setActiveTab('feeds')}
                    className={`px-5 py-3 rounded-full font-bold text-sm transition-colors ${activeTab === 'feeds' ? 'bg-[#0B2240] text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                    Transactions
                </button>
            </div>
        </div>

        {activeTab === 'feeds' && (
            <>
                {/* Account Cards */}
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {myAccounts.map(acc => (
                        <div 
                            key={acc.id}
                            onClick={() => setSelectedAccount(acc.id)}
                            className={`min-w-[300px] p-6 rounded-[2rem] border transition-all cursor-pointer flex flex-col justify-between h-52 shadow-sm ${selectedAccount === acc.id || (!selectedAccount && acc === myAccounts[0]) ? 'bg-[#0B2240] text-white border-[#0B2240] shadow-xl transform scale-[1.02]' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide ${acc.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {acc.status === 'active' ? '● Live Feed' : '● Disconnected'}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm opacity-80 mb-1">{acc.institutionName} - {acc.type}</p>
                                <p className="text-2xl font-black tracking-tight font-mono">**** {acc.mask}</p>
                                <div className="flex justify-between items-end mt-2">
                                    <p className={`text-3xl font-bold ${acc.balance < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        ${Math.abs(acc.balance).toLocaleString()}
                                    </p>
                                    <span className="text-[10px] opacity-60">Avail Balance</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div 
                        onClick={startPlaidFlow}
                        className="min-w-[200px] h-52 p-6 rounded-[2rem] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                        <Plus className="h-10 w-10 mb-3 opacity-30" />
                        <p className="font-bold text-sm">Add Account</p>
                    </div>
                </div>

                {/* Transactions Feed */}
                {activeAccount && (
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-lg font-bold text-[#0B2240]">{activeAccount.accountName} Activity</h2>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3 text-green-600" />
                                    Secure connection • Last synced: {new Date(activeAccount.lastSynced).toLocaleTimeString()}
                                </p>
                            </div>
                            <button 
                                onClick={() => refreshBankFeeds(activeAccount.id)}
                                disabled={isLoadingBanks}
                                className="p-2 hover:bg-white rounded-full transition-colors text-blue-600 hover:shadow-sm border border-transparent hover:border-slate-100 disabled:opacity-50"
                            >
                                <RefreshCw className={`h-5 w-5 ${isLoadingBanks ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {activeTransactions.map(tx => (
                                <div key={tx.id} className={`p-5 hover:bg-slate-50 transition-colors group flex flex-col md:flex-row items-center gap-4 ${tx.isRuleMatch ? 'bg-blue-50/30' : ''}`}>
                                    {/* Icon & Details */}
                                    <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                                        <div className={`p-3 rounded-full flex-shrink-0 ${tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {tx.amount > 0 ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-900 truncate flex items-center gap-2">
                                                {tx.merchant}
                                                {tx.isRuleMatch && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Wand2 className="h-3 w-3"/> Rule Match</span>}
                                            </p>
                                            <p className="text-xs text-slate-500 font-medium">{new Date(tx.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="text-right min-w-[120px]">
                                        <span className={`font-mono font-bold text-lg ${tx.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </span>
                                    </div>

                                    {/* Status & Action */}
                                    <div className="w-full md:w-64 flex justify-end">
                                        {tx.status === 'reconciled' ? (
                                            <span className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 uppercase tracking-wide">
                                                <CheckCircle2 className="h-3 w-3" />
                                                {tx.category}
                                            </span>
                                        ) : (
                                            <div className="flex gap-2">
                                                {tx.isRuleMatch && tx.category ? (
                                                    <button 
                                                        onClick={() => {
                                                            const catId = expenseCategories.find(c => c.name === tx.category)?.id;
                                                            if (catId) reconcileTransaction(tx.id, catId, 'Auto-Rule Applied');
                                                        }}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-full text-xs font-bold hover:bg-green-700 shadow-md flex items-center gap-1"
                                                    >
                                                        <Check className="h-3 w-3" /> Accept: {tx.category}
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => openReconcile(tx.id, tx.category || '')}
                                                        className="w-full md:w-auto px-5 py-2.5 bg-blue-600 text-white shadow-lg shadow-blue-500/30 rounded-full text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                                                    >
                                                        Review
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {activeTransactions.length === 0 && (
                                <div className="p-16 text-center text-slate-400">
                                    <RefreshCw className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                    <p className="italic">No transactions found for this period.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </>
        )}

        {activeTab === 'rules' && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#0B2240] flex items-center gap-2">
                        <Wand2 className="h-6 w-6 text-blue-600" /> Automation Rules
                    </h2>
                    <p className="text-slate-500">Create rules to automatically categorize transactions from your bank feed.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Create New Rule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Rule Name</label>
                            <input 
                                className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                                placeholder="e.g. Coffee Shops"
                                value={newRule.name}
                                onChange={e => setNewRule({...newRule, name: e.target.value})}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">If Merchant Contains</label>
                            <input 
                                className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                                placeholder="e.g. Starbucks"
                                value={newRule.conditions?.[0].value}
                                onChange={e => setNewRule({ ...newRule, conditions: [{ field: 'merchant', operator: 'contains', value: e.target.value }] })}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Assign Category</label>
                            <select 
                                className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                                value={newRule.assignCategory}
                                onChange={e => setNewRule({ ...newRule, assignCategory: e.target.value })}
                            >
                                <option value="">Select Category...</option>
                                {expenseCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <button 
                            onClick={handleAddRule}
                            className="bg-[#0B2240] text-white p-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                        >
                            Create Rule
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {bankRules.map(rule => (
                        <div key={rule.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="font-bold text-slate-800">{rule.name}</p>
                                <p className="text-xs text-slate-500">
                                    If {rule.conditions[0].field} {rule.conditions[0].operator} <span className="font-bold">"{rule.conditions[0].value}"</span>
                                    → Assign to <span className="font-bold text-blue-600">{expenseCategories.find(c => c.id === rule.assignCategory)?.name}</span>
                                </p>
                            </div>
                            <button onClick={() => deleteBankRule(rule.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    {bankRules.length === 0 && <p className="text-center text-slate-400 italic py-4">No rules defined.</p>}
                </div>
            </div>
        )}

        {/* Plaid Link Modal */}
        {isConnectModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-[400px] overflow-hidden min-h-[500px] flex flex-col relative">
                    {/* Plaid Header */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Plaid_logo.svg" alt="Plaid" className="h-6" />
                        <button onClick={() => setIsConnectModalOpen(false)}><Lock className="h-4 w-4 text-slate-400" /></button>
                    </div>

                    {/* Step 1: Institution Selection */}
                    {plaidStep === 'select' && (
                        <div className="flex-1 overflow-y-auto p-4">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 px-2">Select your bank</h3>
                            <div className="space-y-2">
                                {INSTITUTIONS.map(inst => (
                                    <button 
                                        key={inst.id}
                                        onClick={() => handleSelectInstitution(inst)}
                                        className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                                    >
                                        <img src={inst.logo} alt={inst.name} className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-100 p-1" />
                                        <span className="font-bold text-slate-700 group-hover:text-blue-600">{inst.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Authentication (Simulated) */}
                    {plaidStep === 'auth' && selectedInstitution && (
                        <div className="flex-1 flex flex-col p-8 text-center animate-fade-in">
                            <img src={selectedInstitution.logo} alt={selectedInstitution.name} className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white border border-slate-100 p-2 shadow-lg" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Authenticate with {selectedInstitution.name}</h3>
                            <p className="text-slate-500 text-sm mb-8">Enter your credentials to allow Plaid to securely access your account data.</p>
                            
                            <div className="space-y-4 mb-auto">
                                <input disabled className="w-full bg-slate-100 border-none rounded-lg py-3 px-4 text-sm font-bold text-slate-500 cursor-not-allowed" value="user_good" />
                                <input disabled type="password" className="w-full bg-slate-100 border-none rounded-lg py-3 px-4 text-sm font-bold text-slate-500 cursor-not-allowed" value="pass_good" />
                            </div>

                            <button 
                                onClick={handlePlaidSuccess}
                                disabled={isLoadingBanks}
                                className="w-full py-4 bg-black text-white font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            >
                                {isLoadingBanks ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Submit'}
                            </button>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {plaidStep === 'success' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                                <Check className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Success!</h3>
                            <p className="text-slate-500 mt-2">Your account has been linked.</p>
                        </div>
                    )}
                    
                    <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
                        <p className="text-[10px] text-slate-400">Secure connection via Plaid</p>
                    </div>
                </div>
            </div>
        )}

        {/* Categorize Modal */}
        {selectedTxId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/40 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8">
                    <h3 className="text-lg font-bold text-[#0B2240] mb-4">Categorize Transaction</h3>
                    
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Category</label>
                        <div className="grid grid-cols-2 gap-2">
                            {expenseCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Notes / Memo</label>
                        <textarea 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none text-slate-900"
                            rows={2}
                            placeholder="Client lunch, office supplies..."
                            value={txNotes}
                            onChange={e => setTxNotes(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setSelectedTxId(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">Cancel</button>
                        <button onClick={handleReconcile} disabled={!selectedCategory} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg disabled:opacity-50">
                            Confirm & Save
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
