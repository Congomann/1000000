
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { Lead, Client, CallbackRequest, DashboardMetrics, ProductType, LeadStatus, User, UserRole, Notification, Commission, CalendarEvent, Email, Colleague, ChatMessage, AdvisorCategory, CompanySettings, Resource, Carrier, AdvisorAssignment, Testimonial, Application, ApplicationStatus, PerformanceTargets, LifeDetails, ChatAttachment, JobApplication, PropertyListing, EscrowTransaction, ClientPortfolio, ComplianceDocument, AdvisoryFee, IntegrationConfig, IntegrationLog } from '../types';

interface DataContextType {
  user: User | null;
  allUsers: User[];
  leads: Lead[];
  clients: Client[];
  callbacks: CallbackRequest[];
  metrics: DashboardMetrics;
  notifications: Notification[];
  commissions: Commission[];
  events: CalendarEvent[];
  emails: Email[];
  colleagues: Colleague[];
  chatMessages: ChatMessage[];
  availableCarriers: Carrier[];
  advisorAssignments: AdvisorAssignment[];
  assignCarriers: (advisorIds: string[], carriers: Carrier[]) => void;
  getAdvisorAssignments: (advisorId: string) => AdvisorAssignment[];
  companySettings: CompanySettings;
  resources: Resource[];
  likeResource: (id: string) => void;
  dislikeResource: (id: string) => void;
  shareResource: (id: string) => void;
  addResourceComment: (id: string, text: string, userName: string) => void;
  addResource: (resource: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'status' | 'date'>) => void;
  approveTestimonial: (id: string) => void;
  deleteTestimonial: (id: string) => void;
  submitTestimonialEdit: (id: string, edits: Partial<Testimonial>) => void;
  approveTestimonialEdit: (id: string) => void;
  rejectTestimonialEdit: (id: string) => void;
  login: (email: string) => void;
  logout: () => void;
  addCallback: (request: Partial<CallbackRequest>) => void;
  addLead: (lead: Partial<Lead>, assignTo?: string) => void;
  updateLeadStatus: (id: string, status: LeadStatus, analysis?: string) => void;
  updateLead: (id: string, data: Partial<Lead>) => void;
  assignLeads: (leadIds: string[], advisorId: string, priority?: string, notes?: string) => void;
  handleAdvisorLeadAction: (leadId: string, action: 'accept' | 'decline', reason?: string) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  addEvent: (event: Partial<CalendarEvent>) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  isGoogleConnected: boolean;
  toggleGoogleSync: () => void;
  sendChatMessage: (receiverId: string, text: string, attachment?: ChatAttachment) => void;
  editChatMessage: (id: string, newText: string) => void;
  deleteChatMessage: (id: string) => void;
  markChatRead: (targetId: string) => void;
  addAdvisor: (user: User) => void;
  deleteAdvisor: (id: string) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  restoreUser: (id: string) => void;
  permanentlyDeleteUser: (id: string) => void;
  updateCompanySettings: (settings: CompanySettings) => void;
  jobApplications: JobApplication[];
  submitJobApplication: (application: Omit<JobApplication, 'id' | 'status' | 'date'>) => void;
  updateJobApplicationStatus: (id: string, status: 'Approved' | 'Rejected' | 'Pending', config?: any) => void;
  applications: Application[];
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  performanceTargets: PerformanceTargets;
  properties: PropertyListing[];
  transactions: EscrowTransaction[];
  updateTransactionStatus: (id: string, status: string, stage?: string) => void;
  
  // Portfolios
  portfolios: ClientPortfolio[];
  addPortfolio: (p: Partial<ClientPortfolio>) => void;
  updatePortfolio: (id: string, p: Partial<ClientPortfolio>) => void;
  deletePortfolio: (id: string) => void;

  complianceDocs: ComplianceDocument[];
  addComplianceDoc: (doc: Partial<ComplianceDocument>) => void;
  
  // Advisory Fees
  advisoryFees: AdvisoryFee[];
  addAdvisoryFee: (f: Partial<AdvisoryFee>) => void;
  updateAdvisoryFee: (id: string, f: Partial<AdvisoryFee>) => void;
  deleteAdvisoryFee: (id: string) => void;
  updateFeeStatus: (id: string, status: 'Paid' | 'Overdue') => void;
  
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  completeOnboarding: () => void;
  
  // Marketing Integrations
  integrationConfig: IntegrationConfig;
  updateIntegrationConfig: (config: Partial<IntegrationConfig>) => void;
  integrationLogs: IntegrationLog[];
  simulateMarketingLead: (platform: 'google_ads' | 'meta_ads' | 'linkedin_ads', rawPayload: any) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

const DEFAULT_TERMS = `This NHFG Terms of Use (this "Agreement") is a binding agreement between New Holland Financial Group, LLC ("NHFG"), and either you as an independent insurance broker, advisor, agency, licensed broker-dealer, or other financial institution ("You," "Your," or "Yours"), or Your employer or other organization ("Organization"). ...`;
const DEFAULT_AGREEMENT = `1. Scope of Relationship ...`;

const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@nhfg.com', role: UserRole.ADMIN, category: AdvisorCategory.ADMIN, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', onboardingCompleted: true },
  { id: '2', name: 'John Advisor', email: 'insurance@nhfg.com', role: UserRole.ADVISOR, category: AdvisorCategory.INSURANCE, productsSold: [ProductType.LIFE, ProductType.ANNUITY], micrositeEnabled: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', onboardingCompleted: true },
  { id: '3', name: 'Sarah RealEstate', email: 'realestate@nhfg.com', role: UserRole.ADVISOR, category: AdvisorCategory.REAL_ESTATE, productsSold: [ProductType.REAL_ESTATE], micrositeEnabled: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', onboardingCompleted: true },
  { id: '7', name: 'New Approved Advisor', email: 'newbie@nhfg.com', role: UserRole.ADVISOR, category: AdvisorCategory.INSURANCE, onboardingCompleted: false, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200' },
  { id: '4', name: 'Mike Securities', email: 'securities@nhfg.com', role: UserRole.ADVISOR, category: AdvisorCategory.SECURITIES, productsSold: [ProductType.SECURITIES, ProductType.INVESTMENT], micrositeEnabled: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', onboardingCompleted: true },
  { id: '5', name: 'Michael Manager', email: 'manager@nhfg.com', role: UserRole.MANAGER, category: AdvisorCategory.INSURANCE, onboardingCompleted: true },
  { id: '6', name: 'Sarah SubAdmin', email: 'subadmin@nhfg.com', role: UserRole.SUB_ADMIN, category: AdvisorCategory.ADMIN, onboardingCompleted: true },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [callbacks, setCallbacks] = useState<CallbackRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);
  const [portfolios, setPortfolios] = useState<ClientPortfolio[]>([]);
  const [complianceDocs, setComplianceDocs] = useState<ComplianceDocument[]>([]);
  const [advisoryFees, setAdvisoryFees] = useState<AdvisoryFee[]>([]);
  
  // FIX: Added missing advisorAssignments state definition
  const [advisorAssignments, setAdvisorAssignments] = useState<AdvisorAssignment[]>([]);

  const [companySettings, setCompanySettings] = useState<CompanySettings>({
      phone: '(800) 555-0199', email: 'contact@newholland.com', address: '123 Finance Way', city: 'New York', state: 'NY', zip: '10001',
      heroBackgroundType: 'image', heroBackgroundUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070',
      heroTitle: 'Securing Your Future', heroSubtitle: 'Comprehensive financial solutions for every stage of life.',
      termsOfUse: DEFAULT_TERMS,
      solicitorAgreement: DEFAULT_AGREEMENT
  });

  const [integrationConfig, setIntegrationConfig] = useState<IntegrationConfig>({
      googleAds: { enabled: true, webhookUrl: 'https://api.nhfg.com/hooks/google', developerToken: 'G-77X-NHFG' },
      metaAds: { enabled: true, verifyToken: 'NHFG_VERIFY_123', accessToken: 'EAABw...' },
      linkedinAds: { enabled: true, pollingInterval: 5, accessToken: 'AQX_v...' }
  });
  const [integrationLogs, setIntegrationLogs] = useState<IntegrationLog[]>([]);

  const leadsRef = useRef<Lead[]>([]);
  useEffect(() => { leadsRef.current = leads; }, [leads]);

  // Initial Load with Mock Data if empty
  useEffect(() => {
    const savedPortfolios = localStorage.getItem('nhfg_portfolios');
    if (savedPortfolios) {
      setPortfolios(JSON.parse(savedPortfolios));
    } else {
      // Add realistic mock portfolios for Mike Securities (ID 4)
      const mockPorts: ClientPortfolio[] = [
        {
          id: 'p1', clientId: 'c1', clientName: 'High Growth Venture Fund', totalValue: 1250000, ytdReturn: 14.2, riskProfile: 'Aggressive', advisorId: '4', lastRebalanced: new Date().toISOString(),
          holdings: [
            { id: 'h1', ticker: 'AAPL', name: 'Apple Inc.', shares: 100, price: 175.20, value: 17520, allocation: 40, assetClass: 'Equity' },
            { id: 'h2', ticker: 'VTI', name: 'Vanguard Total Stock Market', shares: 50, price: 220.10, value: 11005, allocation: 60, assetClass: 'Equity' }
          ]
        },
        {
          id: 'p2', clientId: 'c2', clientName: 'Sarah Miller Retirement', totalValue: 450000, ytdReturn: 6.8, riskProfile: 'Moderate', advisorId: '4', lastRebalanced: new Date().toISOString(),
          holdings: [
            { id: 'h3', ticker: 'BND', name: 'Vanguard Total Bond Market', shares: 200, price: 72.40, value: 14480, allocation: 70, assetClass: 'Fixed Income' },
            { id: 'h4', ticker: 'VXUS', name: 'Vanguard Total Intl Stock', shares: 80, price: 55.20, value: 4416, allocation: 30, assetClass: 'Equity' }
          ]
        }
      ];
      setPortfolios(mockPorts);
    }

    const savedFees = localStorage.getItem('nhfg_fees');
    if (savedFees) {
      setAdvisoryFees(JSON.parse(savedFees));
    } else {
      // Add realistic mock advisory fees
      const mockFees: AdvisoryFee[] = [
        { id: 'f1', clientId: 'c1', clientName: 'Apex Global Assets', aum: 5000000, feeRate: 1.0, billingPeriod: 'Q1', amount: 12500, status: 'Paid', dueDate: '2024-03-31', advisorId: '4' },
        { id: 'f2', clientId: 'c2', clientName: 'Miller Family Trust', aum: 1200000, feeRate: 0.85, billingPeriod: 'Q1', amount: 2550, status: 'Invoiced', dueDate: '2024-04-15', advisorId: '4' },
        { id: 'f3', clientId: 'c3', clientName: 'Riverside Capital', aum: 850000, feeRate: 1.2, billingPeriod: 'Q2', amount: 10200, status: 'Overdue', dueDate: '2024-06-30', advisorId: '4' }
      ];
      setAdvisoryFees(mockFees);
    }
    
    // Other loads...
    const savedMessages = localStorage.getItem('nhfg_chat_v2');
    if (savedMessages) setChatMessages(JSON.parse(savedMessages).map((m: any) => ({...m, timestamp: new Date(m.timestamp)})));
    const savedLeads = localStorage.getItem('nhfg_leads_v2');
    if (savedLeads) setLeads(JSON.parse(savedLeads));
    const savedClients = localStorage.getItem('nhfg_clients_v2');
    if (savedClients) setClients(JSON.parse(savedClients));
    const savedNotifs = localStorage.getItem('nhfg_notifs_v2');
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs).map((n: any) => ({...n, timestamp: new Date(n.timestamp)})));
    const savedApps = localStorage.getItem('nhfg_apps_v2');
    if (savedApps) setApplications(JSON.parse(savedApps));
  }, []);

  // Sync Persistence
  useEffect(() => { localStorage.setItem('nhfg_chat_v2', JSON.stringify(chatMessages)); }, [chatMessages]);
  useEffect(() => { localStorage.setItem('nhfg_leads_v2', JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem('nhfg_clients_v2', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('nhfg_notifs_v2', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('nhfg_apps_v2', JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem('nhfg_portfolios', JSON.stringify(portfolios)); }, [portfolios]);
  useEffect(() => { localStorage.setItem('nhfg_fees', JSON.stringify(advisoryFees)); }, [advisoryFees]);

  const addSystemNotification = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert' = 'info', resourceType?: any, relatedId?: string) => {
    const newNotif: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        title, message, type, timestamp: new Date(), read: false,
        resourceType, relatedId
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const addLead = useCallback((lead: Partial<Lead>, assignTo?: string) => {
    const currentLeads = leadsRef.current;
    const isDuplicate = currentLeads.some(l => (lead.email && lead.email !== 'Not Provided' && l.email === lead.email) || (lead.phone && l.phone === lead.phone));
    if (isDuplicate) return;
    
    const newLead: Lead = { 
        id: Math.random().toString(36).substr(2, 9), 
        name: lead.name || 'Unknown Inquiry', 
        email: lead.email || 'Not Provided', 
        phone: lead.phone || 'N/A', 
        interest: lead.interest || ProductType.LIFE, 
        message: lead.message || '', 
        date: new Date().toISOString(), 
        status: lead.status || LeadStatus.NEW, 
        score: Math.floor(Math.random() * 40) + 60, 
        qualification: 'Warm', 
        assignedTo: assignTo, 
        source: lead.source || 'manual' 
    };
    
    setLeads(prev => [...prev, newLead]);
    addSystemNotification('New Lead Sync', `${newLead.name} inquiring about ${newLead.interest}.`, 'success', 'lead', newLead.id);
  }, [addSystemNotification]);

  const updateLeadStatus = (id: string, status: LeadStatus, analysis?: string) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status, aiAnalysis: analysis || l.aiAnalysis } : l));
    addSystemNotification('Lead Status Migration', `${lead.name} moved to ${status}.`, 'info', 'lead', id);
  };

  const addPortfolio = (p: Partial<ClientPortfolio>) => {
    const newP: ClientPortfolio = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: p.clientId || '',
      clientName: p.clientName || 'Untitled Portfolio',
      totalValue: p.totalValue || 0,
      ytdReturn: p.ytdReturn || 0,
      riskProfile: p.riskProfile || 'Moderate',
      holdings: p.holdings || [],
      lastRebalanced: new Date().toISOString(),
      advisorId: user?.id || ''
    };
    setPortfolios(prev => [...prev, newP]);
    addSystemNotification('Portfolio Created', `New portfolio assigned to ${newP.clientName}.`, 'success');
  };

  const updatePortfolio = (id: string, p: Partial<ClientPortfolio>) => {
    setPortfolios(prev => prev.map(item => item.id === id ? { ...item, ...p } : item));
  };

  const deletePortfolio = (id: string) => {
    setPortfolios(prev => prev.filter(p => p.id !== id));
  };

  const addAdvisoryFee = (f: Partial<AdvisoryFee>) => {
    const newF: AdvisoryFee = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: f.clientId || '',
      clientName: f.clientName || 'Untitled Client',
      aum: f.aum || 0,
      feeRate: f.feeRate || 1,
      billingPeriod: f.billingPeriod || 'Q1',
      amount: f.amount || 0,
      status: f.status || 'Invoiced',
      dueDate: f.dueDate || new Date().toISOString().split('T')[0],
      advisorId: user?.id || ''
    };
    setAdvisoryFees(prev => [...prev, newF]);
    addSystemNotification('Invoice Generated', `New advisory fee invoice for ${newF.clientName}.`, 'info');
  };

  const updateAdvisoryFee = (id: string, f: Partial<AdvisoryFee>) => {
    setAdvisoryFees(prev => prev.map(item => item.id === id ? { ...item, ...f } : item));
  };

  const deleteAdvisoryFee = (id: string) => {
    setAdvisoryFees(prev => prev.filter(f => f.id !== id));
  };

  const updateFeeStatus = (id: string, status: 'Paid' | 'Overdue') => {
    setAdvisoryFees(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  const login = (email: string) => {
      const foundUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (foundUser) setUser(foundUser);
      else setUser(MOCK_USERS[0]);
  };
  const logout = () => setUser(null);

  const assignLeads = (leadIds: string[], advisorId: string) => {
    setLeads(prev => prev.map(l => leadIds.includes(l.id) ? { ...l, assignedTo: advisorId, status: LeadStatus.ASSIGNED } : l));
  };

  const updateLead = (id: string, data: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const handleAdvisorLeadAction = (id: string, action: 'accept' | 'decline') => {
      if (action === 'accept') updateLeadStatus(id, LeadStatus.CONTACTED);
      else setLeads(prev => prev.map(l => l.id === id ? { ...l, assignedTo: undefined } : l));
  };

  const updateClient = (id: string, data: Partial<Client>) => {
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const addCallback = (req: any) => {
      setCallbacks(prev => [...prev, { ...req, id: Math.random().toString(), resolved: false }]);
  };

  const addEvent = (e: any) => {
      setEvents(prev => [...prev, { ...e, id: Math.random().toString(), creatorId: user?.id, creatorName: user?.name }]);
  };

  const updateEvent = (event: CalendarEvent) => {
      setEvents(prev => prev.map(ev => ev.id === event.id ? event : ev));
  };

  const deleteEvent = (id: string) => {
      setEvents(prev => prev.filter(e => e.id !== id));
  };

  const addAdvisor = (u: any) => {
      setAllUsers(prev => [...prev, { ...u, id: Math.random().toString() }]);
  };

  const deleteAdvisor = (id: string) => {
      setAllUsers(prev => prev.map(user => user.id === id ? { ...user, deletedAt: new Date().toISOString() } : user));
  };

  const updateUser = (id: string, data: any) => {
      setAllUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  };

  const restoreUser = (id: string) => {
    setAllUsers(prev => prev.map(u => u.id === id ? { ...u, deletedAt: undefined } : u));
  };

  const permanentlyDeleteUser = (id: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== id));
  };

  const updateCompanySettings = (s: CompanySettings) => {
      setCompanySettings(s);
  };

  const completeOnboarding = () => {
      if (user) {
          const updatedUser = { ...user, onboardingCompleted: true };
          setUser(updatedUser);
          setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      }
  };

  const sendChatMessage = (receiverId: string, text: string, attachment?: ChatAttachment) => {
    if (!user) return;
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: user.id,
      receiverId,
      text,
      timestamp: new Date(),
      read: false,
      attachment
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const editChatMessage = (id: string, newText: string) => {
    setChatMessages(prev => prev.map(m => m.id === id ? { ...m, text: newText, isEdited: true } : m));
  };

  const deleteChatMessage = (id: string) => {
    setChatMessages(prev => prev.filter(m => m.id !== id));
  };

  const markChatRead = (targetId: string) => {
    setChatMessages(prev => prev.map(m => (m.senderId === targetId && m.receiverId === user?.id) || (m.receiverId === targetId && m.senderId === user?.id) ? { ...m, read: true } : m));
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const updateTransactionStatus = (id: string, status: string, stage?: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: status as any, stage: (stage || t.stage) as any } : t));
  };

  const addComplianceDoc = (doc: Partial<ComplianceDocument>) => {
    const newDoc: ComplianceDocument = { id: Math.random().toString(36).substr(2, 9), title: doc.title || 'Untitled', type: doc.type || 'KYC', uploadDate: new Date().toISOString(), status: 'Pending Review', url: doc.url || '#', advisorId: user?.id || '', ...doc };
    setComplianceDocs(prev => [...prev, newDoc]);
  };

  const updateIntegrationConfig = (config: Partial<IntegrationConfig>) => { setIntegrationConfig(prev => ({ ...prev, ...config })); };

  // Library/Client methods implementation
  const likeResource = (id: string) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };
  const dislikeResource = (id: string) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, dislikes: r.dislikes + 1 } : r));
  };
  const shareResource = (id: string) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, shares: r.shares + 1 } : r));
  };
  const addResourceComment = (id: string, text: string, userName: string) => {
    const newComment = { id: Math.random().toString(36).substr(2, 5), user: userName, text, date: new Date().toISOString() };
    setResources(prev => prev.map(r => r.id === id ? { ...r, comments: [...r.comments, newComment] } : r));
  };
  const addResource = (r: Partial<Resource>) => {
    const newR: Resource = { id: Math.random().toString(36).substr(2, 9), title: r.title || 'Untitled', type: r.type || 'Link', url: r.url || '#', description: r.description || '', content: r.content || '', thumbnail: r.thumbnail || '', dateAdded: new Date().toISOString(), likes: 0, dislikes: 0, shares: 0, comments: [], tags: r.tags || [] };
    setResources(prev => [newR, ...prev]);
  };
  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };
  const addTestimonial = (t: Omit<Testimonial, 'id' | 'status' | 'date'>) => {
    const newT: Testimonial = { ...t, id: Math.random().toString(36).substr(2, 9), status: 'pending', date: new Date().toISOString() };
    setTestimonials(prev => [newT, ...prev]);
  };
  const approveTestimonial = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t));
  };
  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };
  const submitTestimonialEdit = (id: string, edits: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: 'pending_edit', editedClientName: edits.clientName, editedRating: edits.rating, editedReviewText: edits.reviewText } : t));
  };
  const approveTestimonialEdit = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: 'approved', clientName: t.editedClientName || t.clientName, rating: t.editedRating || t.rating, reviewText: t.editedReviewText || t.reviewText, editedClientName: undefined, editedRating: undefined, editedReviewText: undefined } : t));
  };
  const rejectTestimonialEdit = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: 'approved', editedClientName: undefined, editedRating: undefined, editedReviewText: undefined } : t));
  };
  const submitJobApplication = (app: Omit<JobApplication, 'id' | 'status' | 'date'>) => {
    const newApp: JobApplication = { ...app, id: Math.random().toString(36).substr(2, 9), status: 'Pending', date: new Date().toISOString() };
    setJobApplications(prev => [newApp, ...prev]);
  };
  const updateJobApplicationStatus = (id: string, status: 'Approved' | 'Rejected' | 'Pending', config?: any) => {
    setJobApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (status === 'Approved') {
        const applicant = jobApplications.find(a => a.id === id);
        if (applicant) {
            addAdvisor({ id: Math.random().toString(36).substr(2, 9), name: applicant.fullName, email: applicant.email, role: UserRole.ADVISOR, category: AdvisorCategory.INSURANCE, productsSold: config?.products || [ProductType.LIFE], contractLevel: config?.contractLevel || 50, micrositeEnabled: true, onboardingCompleted: false });
        }
    }
  };
  const assignCarriers = (advisorIds: string[], carriers: Carrier[]) => {
      const newAssignments: AdvisorAssignment[] = [];
      advisorIds.forEach(advId => {
          carriers.forEach(c => {
              newAssignments.push({ id: Math.random().toString(36).substr(2, 9), advisorId: advId, carrierName: c.name, category: c.category, assignedBy: user?.name || 'Admin', assignedAt: new Date().toISOString() });
          });
      });
      // FIX: Correctly call setAdvisorAssignments
      setAdvisorAssignments(prev => [...prev, ...newAssignments]);
  };
  const getAdvisorAssignments = (advisorId: string) => {
      // FIX: Correctly reference advisorAssignments state
      return advisorAssignments.filter(a => a.advisorId === advisorId);
  };
  const toggleGoogleSync = () => setIsGoogleConnected(prev => !prev);
  // FIX: Removed duplicate updateIntegrationConfig definition (redundant with line 422)
  
  const simulateMarketingLead = useCallback((platform: 'google_ads' | 'meta_ads' | 'linkedin_ads', rawPayload: any) => {
    const logId = Math.random().toString(36).substr(2, 9);
    const newLog: IntegrationLog = { id: logId, timestamp: new Date().toISOString(), platform, event: `Incoming Lead via ${platform.replace('_', ' ')}`, status: 'success', payload: rawPayload };
    setIntegrationLogs(prev => [newLog, ...prev]);
    let leadData: Partial<Lead> = {};
    if (platform === 'google_ads') { leadData = { name: rawPayload.full_name || 'GAds Lead', email: rawPayload.email, phone: rawPayload.phone_number, interest: ProductType.LIFE, source: 'google_ads' }; }
    else if (platform === 'meta_ads') { leadData = { name: rawPayload.full_name || 'Meta Lead', email: rawPayload.email, phone: rawPayload.phone_number, interest: ProductType.BUSINESS, source: 'meta_ads' }; }
    else if (platform === 'linkedin_ads') { leadData = { name: `${rawPayload.firstName} ${rawPayload.lastName}`, email: rawPayload.email, phone: rawPayload.phone, interest: ProductType.INVESTMENT, source: 'linkedin_ads' }; }
    addLead(leadData);
  }, [addLead]);

  return (
    <DataContext.Provider value={{
      user, allUsers, leads, clients, callbacks, metrics: { totalRevenue: 1250000, activeClients: 450, pendingLeads: 24, monthlyPerformance: [], totalCommission: 85000 },
      notifications, commissions: [], events, emails: [], colleagues, chatMessages, availableCarriers: [], 
      // FIX: Correctly reference advisorAssignments state
      advisorAssignments,
      assignCarriers, getAdvisorAssignments, companySettings, resources, likeResource, dislikeResource, shareResource, addResourceComment, addResource, deleteResource,
      testimonials, addTestimonial, approveTestimonial, deleteTestimonial, submitTestimonialEdit, approveTestimonialEdit, rejectTestimonialEdit,
      login, logout, addCallback, addLead, updateLeadStatus, updateLead, assignLeads, handleAdvisorLeadAction, updateClient,
      addEvent, updateEvent, deleteEvent, isGoogleConnected, toggleGoogleSync, sendChatMessage, editChatMessage, deleteChatMessage, markChatRead, addAdvisor, deleteAdvisor, updateUser, restoreUser, permanentlyDeleteUser,
      updateCompanySettings, jobApplications, submitJobApplication, updateJobApplicationStatus, applications, updateApplicationStatus,
      performanceTargets: { monthly: 50000, quarterly: 150000, presidentsClub: 1000000 }, properties, transactions, updateTransactionStatus, portfolios, addPortfolio, updatePortfolio, deletePortfolio, complianceDocs, addComplianceDoc, advisoryFees, addAdvisoryFee, updateAdvisoryFee, deleteAdvisoryFee, updateFeeStatus,
      markNotificationRead: (id) => setNotifications(n => n.map(not => not.id === id ? {...not, read: true} : not)), clearNotifications: () => setNotifications([]),
      integrationConfig, updateIntegrationConfig, integrationLogs, simulateMarketingLead, completeOnboarding
    }}>
      {children}
    </DataContext.Provider>
  );
};
