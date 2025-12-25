
import { BankAccount, BankTransaction, AccountType } from '../types';

// MOCK BACKEND DATABASE
const STORAGE_KEYS = {
  ACCOUNTS: 'nhfg_real_bank_accounts',
  TRANSACTIONS: 'nhfg_real_transactions'
};

const MOCK_INSTITUTIONS = [
  { id: 'ins_1', name: 'Chase', logo: 'https://logo.clearbit.com/chase.com' },
  { id: 'ins_2', name: 'Bank of America', logo: 'https://logo.clearbit.com/bankofamerica.com' },
  { id: 'ins_3', name: 'Wells Fargo', logo: 'https://logo.clearbit.com/wellsfargo.com' },
  { id: 'ins_4', name: 'American Express', logo: 'https://logo.clearbit.com/americanexpress.com' },
  { id: 'ins_5', name: 'Citi', logo: 'https://logo.clearbit.com/citi.com' },
];

// Helper to simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const BankingService = {
  // 1. Simulate getting a Link Token from backend (Plaid)
  createLinkToken: async (userId: string) => {
    await delay(800);
    return { link_token: `link-sandbox-${Math.random().toString(36).substr(2)}` };
  },

  // 2. Simulate exchanging public token for access token & getting accounts
  exchangeTokenAndGetAccounts: async (publicToken: string, institutionId: string, userId: string) => {
    await delay(1500); // Simulate secure server exchange
    
    const institution = MOCK_INSTITUTIONS.find(i => i.id === institutionId) || MOCK_INSTITUTIONS[0];
    const isCredit = institution.name === 'American Express' || institution.name === 'Citi';

    const newAccount: BankAccount = {
      id: `ba_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      institutionName: institution.name,
      accountName: isCredit ? `${institution.name} Platinum` : `${institution.name} Business Checking`,
      mask: Math.floor(1000 + Math.random() * 9000).toString(),
      type: isCredit ? 'Credit Card' : 'Checking',
      balance: isCredit ? -(Math.floor(Math.random() * 5000)) : Math.floor(Math.random() * 150000),
      lastSynced: new Date().toISOString(),
      status: 'active'
    };

    // Persist to "DB"
    const currentAccounts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || '[]');
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify([...currentAccounts, newAccount]));

    // Generate initial transaction history
    await BankingService.syncTransactions(newAccount.id);

    return newAccount;
  },

  // 3. Simulate fetching transactions (The "Sync")
  syncTransactions: async (accountId: string) => {
    await delay(1000);
    
    // Generate realistic random transactions
    const merchants = [
        { name: 'Starbucks', cat: 'Meals & Ent', amountRange: [5, 25] },
        { name: 'Uber Technologies', cat: 'Travel', amountRange: [15, 60] },
        { name: 'Delta Airlines', cat: 'Travel', amountRange: [200, 800] },
        { name: 'Staples', cat: 'Office Supplies', amountRange: [20, 150] },
        { name: 'Amazon Web Services', cat: 'Software & CRM', amountRange: [50, 500] },
        { name: 'Apple Store', cat: 'Office Supplies', amountRange: [1000, 3000] },
        { name: 'Shell Oil', cat: 'Travel', amountRange: [30, 80] },
        { name: 'Marriott Hotels', cat: 'Travel', amountRange: [150, 400] },
        { name: 'Salesforce.com', cat: 'Software & CRM', amountRange: [100, 300] },
        { name: 'USPS', cat: 'Office Supplies', amountRange: [5, 50] },
        { name: 'Client Payment', cat: 'Revenue', amountRange: [1000, 5000], isIncome: true }
    ];

    const numTx = Math.floor(Math.random() * 5) + 2; // 2-7 new transactions
    const newTransactions: BankTransaction[] = [];

    for (let i = 0; i < numTx; i++) {
        const merch = merchants[Math.floor(Math.random() * merchants.length)];
        const amount = (Math.floor(Math.random() * (merch.amountRange[1] - merch.amountRange[0])) + merch.amountRange[0]);
        
        // Income is positive, Expense is negative
        const finalAmount = merch.isIncome ? amount : -amount;

        newTransactions.push({
            id: `tx_${Math.random().toString(36).substr(2, 12)}`,
            bankAccountId: accountId,
            date: new Date().toISOString().split('T')[0],
            merchant: merch.name,
            amount: finalAmount,
            category: '', // Raw from bank = uncategorized in our system initially
            status: 'pending'
        });
    }

    // Persist
    const currentTx = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    const updatedTx = [...newTransactions, ...currentTx];
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTx));

    return updatedTx.filter((t: any) => t.bankAccountId === accountId);
  },

  // 4. Get Data
  getAccounts: (userId: string) => {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || '[]');
      // In a real app, backend filters. Here we filter locally.
      // If user is admin (company), return company accounts. If advisor, return theirs.
      return all.filter((a: any) => a.userId === userId); 
  },

  getTransactions: (accountId: string) => {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
      return all.filter((t: any) => t.bankAccountId === accountId);
  },

  // 5. Update Status
  reconcile: (txId: string, category: string, journalEntryId: string) => {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
      const updated = all.map((t: any) => 
          t.id === txId 
          ? { ...t, status: 'reconciled', category, journalEntryId } 
          : t
      );
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
  }
};
