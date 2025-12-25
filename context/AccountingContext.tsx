
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Account, AccountType, JournalEntry, JournalLine, TaxConfig, BankAccount, BankTransaction, ExpenseCategory, UserRole, BankRule } from '../types';
import { useData } from './DataContext';
import { BankingService } from '../services/bankingService';

// Initial Chart of Accounts (Standard GAAP structure)
const INITIAL_ACCOUNTS: Account[] = [
  // ASSETS (1000-1999)
  { id: '1000', code: '1000', name: 'Business Checking', type: AccountType.ASSET, category: 'Cash & Equivalents', normalBalance: 'debit', balance: 154200 },
  { id: '1100', code: '1100', name: 'Accounts Receivable', type: AccountType.ASSET, category: 'Current Assets', normalBalance: 'debit', balance: 24500 },
  { id: '1200', code: '1200', name: 'Undeposited Funds', type: AccountType.ASSET, category: 'Current Assets', normalBalance: 'debit', balance: 0 },
  
  // LIABILITIES (2000-2999)
  { id: '2000', code: '2000', name: 'Accounts Payable', type: AccountType.LIABILITY, category: 'Current Liabilities', normalBalance: 'credit', balance: 4200 },
  { id: '2100', code: '2100', name: 'Tax Payable', type: AccountType.LIABILITY, category: 'Current Liabilities', normalBalance: 'credit', balance: 12500 },
  { id: '2200', code: '2200', name: 'Commissions Payable', type: AccountType.LIABILITY, category: 'Current Liabilities', normalBalance: 'credit', balance: 0 },
  { id: '2300', code: '2300', name: 'Corporate Credit Card', type: AccountType.LIABILITY, category: 'Current Liabilities', normalBalance: 'credit', balance: 3450 },
  
  // EQUITY (3000-3999)
  { id: '3000', code: '3000', name: 'Retained Earnings', type: AccountType.EQUITY, category: 'Equity', normalBalance: 'credit', balance: 100000 },
  { id: '3100', code: '3100', name: 'Owner Investment', type: AccountType.EQUITY, category: 'Equity', normalBalance: 'credit', balance: 50000 },
  
  // REVENUE (4000-4999)
  { id: '4000', code: '4000', name: 'Insurance Commissions', type: AccountType.REVENUE, category: 'Revenue', normalBalance: 'credit', balance: 185000 },
  { id: '4100', code: '4100', name: 'Real Estate Fees', type: AccountType.REVENUE, category: 'Revenue', normalBalance: 'credit', balance: 65000 },
  
  // EXPENSES (5000-8999)
  { id: '5000', code: '5000', name: 'Advisor Commission Exp', type: AccountType.EXPENSE, category: 'Cost of Goods Sold', normalBalance: 'debit', balance: 92500 },
  { id: '6100', code: '6100', name: 'Rent Expense', type: AccountType.EXPENSE, category: 'Operating Expenses', normalBalance: 'debit', balance: 24000 },
  { id: '6200', code: '6200', name: 'Marketing Expense', type: AccountType.EXPENSE, category: 'Operating Expenses', normalBalance: 'debit', balance: 15000 },
  { id: '6300', code: '6300', name: 'Software & CRM', type: AccountType.EXPENSE, category: 'Operating Expenses', normalBalance: 'debit', balance: 3500 },
  { id: '6400', code: '6400', name: 'Travel & Meals', type: AccountType.EXPENSE, category: 'Operating Expenses', normalBalance: 'debit', balance: 4200 },
  { id: '6500', code: '6500', name: 'Office Supplies', type: AccountType.EXPENSE, category: 'Operating Expenses', normalBalance: 'debit', balance: 1200 },
  { id: '8000', code: '8000', name: 'Income Tax Expense', type: AccountType.EXPENSE, category: 'Tax', normalBalance: 'debit', balance: 12500 },
];

const INITIAL_EXPENSE_CATEGORIES: ExpenseCategory[] = [
    { id: 'cat-1', name: 'Office Supplies', glAccountId: '6500', taxDeductible: true, keywords: ['staples', 'office depot', 'amazon', 'paper', 'usps'] },
    { id: 'cat-2', name: 'Travel', glAccountId: '6400', taxDeductible: true, keywords: ['uber', 'delta', 'marriott', 'airbnb', 'hotel', 'flight', 'shell', 'exxon'] },
    { id: 'cat-3', name: 'Meals & Ent', glAccountId: '6400', taxDeductible: true, keywords: ['starbucks', 'restaurant', 'cafe', 'diner', 'grill'] },
    { id: 'cat-4', name: 'Software/CRM', glAccountId: '6300', taxDeductible: true, keywords: ['adobe', 'salesforce', 'slack', 'zoom', 'google', 'aws'] },
    { id: 'cat-5', name: 'Marketing', glAccountId: '6200', taxDeductible: true, keywords: ['facebook ads', 'google ads', 'linkedin', 'print'] },
    { id: 'cat-6', name: 'Rent', glAccountId: '6100', taxDeductible: true, keywords: ['property management', 'lease'] },
    { id: 'cat-7', name: 'Revenue/Income', glAccountId: '4000', taxDeductible: false, keywords: ['deposit', 'payment', 'commission'] }, // For deposits
];

const DEFAULT_TAX_CONFIG: TaxConfig = {
    id: 'tax-1',
    name: 'Corporate Tax',
    rate: 0.21,
    liabilityAccountId: '2100',
    expenseAccountId: '8000',
    state: 'Federal'
};

const INITIAL_RULES: BankRule[] = [
    { 
        id: 'rule-1', 
        name: 'Coffee Shops', 
        conditions: [{ field: 'merchant', operator: 'contains', value: 'Starbucks' }], 
        assignCategory: 'cat-3', 
        userId: 'company' 
    },
    { 
        id: 'rule-2', 
        name: 'Software Subs', 
        conditions: [{ field: 'merchant', operator: 'contains', value: 'Adobe' }], 
        assignCategory: 'cat-4', 
        userId: 'company' 
    }
];

interface AccountingContextType {
  accounts: Account[];
  journalEntries: JournalEntry[];
  taxConfig: TaxConfig;
  bankAccounts: BankAccount[];
  bankTransactions: BankTransaction[];
  expenseCategories: ExpenseCategory[];
  bankRules: BankRule[];
  
  // Basic GL
  postEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'status'>) => void;
  recordDeal: (revenue: number, advisorId: string, commissionRate: number, description: string) => void;
  getAccountBalance: (accountId: string) => number;
  getAdvisorBalance: (advisorId: string) => number;
  calculateFinancials: () => {
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
  };

  // Banking
  isLoadingBanks: boolean;
  connectBankAccount: (institutionId: string) => Promise<void>;
  refreshBankFeeds: (accountId: string) => Promise<void>;
  reconcileTransaction: (transactionId: string, categoryId: string, notes?: string) => void;
  
  // Rules Engine
  addBankRule: (rule: Omit<BankRule, 'id'>) => void;
  deleteBankRule: (id: string) => void;
  
  // Tax
  updateTaxConfig: (config: Partial<TaxConfig>) => void;
  calculateEstimatedTax: (userId: string) => { taxableIncome: number; estimatedTax: number; savingsRate: number };
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export const useAccounting = () => {
  const context = useContext(AccountingContext);
  if (!context) {
    throw new Error('useAccounting must be used within an AccountingProvider');
  }
  return context;
};

export const AccountingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useData();
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [taxConfig, setTaxConfig] = useState<TaxConfig>(DEFAULT_TAX_CONFIG);
  
  // Banking State
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
  const [expenseCategories] = useState<ExpenseCategory[]>(INITIAL_EXPENSE_CATEGORIES);
  const [bankRules, setBankRules] = useState<BankRule[]>(INITIAL_RULES);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);

  // Load Persistence
  useEffect(() => {
    const storedEntries = localStorage.getItem('nhfg_journal');
    const storedAccounts = localStorage.getItem('nhfg_accounts');
    const storedRules = localStorage.getItem('nhfg_bank_rules');
    
    if (storedEntries) setJournalEntries(JSON.parse(storedEntries));
    if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
    if (storedRules) setBankRules(JSON.parse(storedRules));
    
    // Load banking data for current user
    if (user) {
        const userScopeId = user.role === UserRole.ADVISOR ? user.id : 'company';
        const userAccounts = BankingService.getAccounts(userScopeId);
        setBankAccounts(userAccounts);
        
        // Collect transactions for all accounts
        let allTx: BankTransaction[] = [];
        userAccounts.forEach((acc: BankAccount) => {
            const txs = BankingService.getTransactions(acc.id);
            allTx = [...allTx, ...txs];
        });
        
        // Apply Rules immediately on load for any pending
        const processedTxs = applyBankRules(allTx, bankRules);
        setBankTransactions(processedTxs.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, [user]);

  // Sync Persistence
  useEffect(() => {
    if (accounts.length > 0) localStorage.setItem('nhfg_accounts', JSON.stringify(accounts));
    if (journalEntries.length > 0) localStorage.setItem('nhfg_journal', JSON.stringify(journalEntries));
    localStorage.setItem('nhfg_bank_rules', JSON.stringify(bankRules));
  }, [accounts, journalEntries, bankRules]);

  // --- Rules Engine ---
  
  // Logic to apply rules to transactions
  const applyBankRules = (transactions: BankTransaction[], rules: BankRule[]): BankTransaction[] => {
      return transactions.map(tx => {
          // If already reconciled, skip
          if (tx.status === 'reconciled') return tx;

          // Find first matching rule
          const match = rules.find(rule => {
              return rule.conditions.every(condition => {
                  const txValue = condition.field === 'merchant' ? tx.merchant : tx.amount.toString();
                  if (condition.operator === 'contains') {
                      return txValue.toLowerCase().includes(condition.value.toLowerCase());
                  } else if (condition.operator === 'equals') {
                      return txValue.toLowerCase() === condition.value.toLowerCase();
                  }
                  return false;
              });
          });

          if (match) {
              const categoryName = expenseCategories.find(c => c.id === match.assignCategory)?.name;
              return { 
                  ...tx, 
                  category: categoryName || tx.category, 
                  isRuleMatch: true, 
                  matchedRuleId: match.id 
              };
          }
          
          return tx;
      });
  };

  const addBankRule = (ruleData: Omit<BankRule, 'id'>) => {
      const newRule = { ...ruleData, id: `rule-${Math.random().toString(36).substr(2,9)}` };
      const updatedRules = [...bankRules, newRule];
      setBankRules(updatedRules);
      
      // Re-run rules on existing pending transactions
      setBankTransactions(prev => applyBankRules(prev, updatedRules));
  };

  const deleteBankRule = (id: string) => {
      setBankRules(prev => prev.filter(r => r.id !== id));
  };

  // --- GL Logic ---

  const postEntry = (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'status'>) => {
    const totalDebit = entryData.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = entryData.lines.reduce((sum, line) => sum + line.credit, 0);

    // Strict Double Entry Check
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      console.error(`Entry unbalanced: Dr ${totalDebit} != Cr ${totalCredit}`);
      alert("Journal Entry Unbalanced. Debit must equal Credit.");
      return; 
    }

    const newEntry: JournalEntry = {
      ...entryData,
      id: `je-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'posted'
    };

    setJournalEntries(prev => [newEntry, ...prev]);

    // Update Account Balances
    const updatedAccounts = [...accounts];
    entryData.lines.forEach(line => {
       const accountIndex = updatedAccounts.findIndex(a => a.id === line.accountId);
       if (accountIndex > -1) {
           const acc = updatedAccounts[accountIndex];
           // Debit increases Assets/Expenses, decreases Liabilities/Equity/Revenue
           // Credit increases Liabilities/Equity/Revenue, decreases Assets/Expenses
           if (acc.normalBalance === 'debit') {
               acc.balance += (line.debit - line.credit);
           } else {
               acc.balance += (line.credit - line.debit);
           }
           updatedAccounts[accountIndex] = acc;
       }
    });
    setAccounts(updatedAccounts);
  };

  const recordDeal = (revenue: number, advisorId: string, commissionRate: number, description: string) => {
      const commissionAmount = revenue * commissionRate;
      
      const lines: JournalLine[] = [
          { id: '1', accountId: '1100', debit: revenue, credit: 0, description: `AR - ${description}` }, 
          { id: '2', accountId: '4000', debit: 0, credit: revenue, description: `Rev - ${description}` }, 
      ];

      if (commissionAmount > 0) {
          lines.push(
              { id: '3', accountId: '5000', debit: commissionAmount, credit: 0, description: `Comm Exp - ${description}` },
              { id: '4', accountId: '2200', debit: 0, credit: commissionAmount, description: `Comm Payable - ${description}`, advisorId: advisorId }
          );
      }

      postEntry({
          date: new Date().toISOString().split('T')[0],
          description: `Closed Deal: ${description}`,
          reference: `DEAL-${Math.floor(Math.random() * 10000)}`,
          lines
      });
  };

  const getAccountBalance = (accountId: string) => {
      const acc = accounts.find(a => a.id === accountId);
      return acc ? acc.balance : 0;
  };

  const getAdvisorBalance = (advisorId: string) => {
      let balance = 0;
      journalEntries.forEach(entry => {
          entry.lines.forEach(line => {
              if (line.accountId === '2200' && line.advisorId === advisorId) {
                  balance += (line.credit - line.debit);
              }
          });
      });
      return balance;
  };

  const calculateFinancials = () => {
      let totalAssets = 0, totalLiabilities = 0, totalEquity = 0, totalRevenue = 0, totalExpenses = 0;

      accounts.forEach(acc => {
          if (acc.type === AccountType.ASSET) totalAssets += acc.balance;
          if (acc.type === AccountType.LIABILITY) totalLiabilities += acc.balance;
          if (acc.type === AccountType.EQUITY) totalEquity += acc.balance;
          if (acc.type === AccountType.REVENUE) totalRevenue += acc.balance;
          if (acc.type === AccountType.EXPENSE) totalExpenses += acc.balance;
      });

      const netIncome = totalRevenue - totalExpenses;
      return { totalAssets, totalLiabilities, totalEquity, totalRevenue, totalExpenses, netIncome };
  };

  // --- Banking Integration (Using Simulated Service) ---

  const connectBankAccount = async (institutionId: string) => {
      if (!user) return;
      setIsLoadingBanks(true);
      
      try {
          const userId = user.role === UserRole.ADVISOR ? user.id : 'company';
          
          // 1. Get Link Token (Simulation)
          const { link_token } = await BankingService.createLinkToken(userId);
          
          // 2. "Open Plaid Link" & Exchange Token (Simulation)
          const newAccount = await BankingService.exchangeTokenAndGetAccounts('public-token-123', institutionId, userId);
          
          setBankAccounts(prev => [...prev, newAccount]);
          
          // 3. Fetch Initial Transactions
          await refreshBankFeeds(newAccount.id);
      } catch (error) {
          console.error("Bank Connection Error", error);
      } finally {
          setIsLoadingBanks(false);
      }
  };

  const refreshBankFeeds = async (accountId: string) => {
      setIsLoadingBanks(true);
      try {
          const txs = await BankingService.syncTransactions(accountId);
          
          // Apply Rules Engine
          const processedTxs = applyBankRules(txs, bankRules);

          // Update transactions state, avoiding duplicates
          setBankTransactions(prev => {
              const existingIds = new Set(prev.map(t => t.id));
              const newTxs = processedTxs.filter((t: BankTransaction) => !existingIds.has(t.id));
              return [...newTxs, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          });
      } finally {
          setIsLoadingBanks(false);
      }
  };

  // The Core of QuickBooks functionality: Convert Bank Feed -> General Ledger
  const reconcileTransaction = (transactionId: string, categoryId: string, notes?: string) => {
      const tx = bankTransactions.find(t => t.id === transactionId);
      const cat = expenseCategories.find(c => c.id === categoryId);
      
      if (!tx || !cat) return;

      // Determine GL Impact
      // Is Expense (negative)? -> Debit Expense Category, Credit Bank Asset (or Increase Credit Liability)
      // Is Income (positive)? -> Debit Bank Asset, Credit Revenue Category
      
      const absAmount = Math.abs(tx.amount);
      const bankAccount = bankAccounts.find(b => b.id === tx.bankAccountId);
      
      // Determine the GL Account for the specific Bank Account
      // In a real system, bankAccount object would have a `glAccountId` field mapping it.
      // We will map dynamically based on type for this demo:
      let bankGLId = '1000'; // Default Checking
      if (bankAccount?.type === 'Credit Card') bankGLId = '2300'; // Corporate Card

      const lines: JournalLine[] = [];
      
      if (tx.amount < 0) {
          // Expense
          lines.push(
              { id: '1', accountId: cat.glAccountId, debit: absAmount, credit: 0, description: `${tx.merchant} (${cat.name})` },
              { id: '2', accountId: bankGLId, debit: 0, credit: absAmount, description: 'Withdrawal' } 
          );
      } else {
          // Income
          lines.push(
              { id: '1', accountId: bankGLId, debit: absAmount, credit: 0, description: 'Deposit' },
              { id: '2', accountId: cat.glAccountId, debit: 0, credit: absAmount, description: `${tx.merchant} (${cat.name})` }
          );
      }

      // Create GL Entry
      postEntry({
          date: tx.date,
          description: `${tx.merchant} - ${notes || 'Reconciled'}`,
          reference: 'BANK-FEED',
          lines
      });

      // Update Service status
      BankingService.reconcile(transactionId, cat.name, 'JE-PENDING');

      // Update Local State
      setBankTransactions(prev => prev.map(t => 
          t.id === transactionId 
          ? { ...t, status: 'reconciled', category: cat.name, isRuleMatch: false } 
          : t
      ));
  };

  // --- Tax Logic ---
  
  const updateTaxConfig = (config: Partial<TaxConfig>) => {
      setTaxConfig(prev => ({...prev, ...config}));
  };

  const calculateEstimatedTax = (userId: string) => {
      // For Advisors: Taxable Income = Commissions Paid - Deductible Expenses
      let totalIncome = 0;
      
      // Look at GL for payments to this advisor (Debits to Comm Payable)
      journalEntries.forEach(je => {
          je.lines.forEach(line => {
              if (line.accountId === '2200' && line.advisorId === userId && line.debit > 0) {
                  totalIncome += line.debit;
              }
          });
      });

      // Look at Reconciled Expenses in Banking
      const advisorBankAccounts = bankAccounts.filter(b => b.userId === userId).map(b => b.id);
      const deductibleExpenses = bankTransactions
        .filter(t => 
            advisorBankAccounts.includes(t.bankAccountId) && 
            t.status === 'reconciled' &&
            expenseCategories.find(c => c.name === t.category)?.taxDeductible
        )
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const taxableIncome = Math.max(0, totalIncome - deductibleExpenses);
      const estimatedTax = taxableIncome * taxConfig.rate;

      return { taxableIncome, estimatedTax, savingsRate: taxConfig.rate };
  };

  return (
    <AccountingContext.Provider value={{
      accounts,
      journalEntries,
      taxConfig,
      bankAccounts,
      bankTransactions,
      expenseCategories,
      bankRules,
      isLoadingBanks,
      postEntry,
      recordDeal,
      getAccountBalance,
      getAdvisorBalance,
      calculateFinancials,
      connectBankAccount,
      refreshBankFeeds,
      reconcileTransaction,
      addBankRule,
      deleteBankRule,
      updateTaxConfig,
      calculateEstimatedTax
    }}>
      {children}
    </AccountingContext.Provider>
  );
};
