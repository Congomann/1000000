
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
  portfolios: ClientPortfolio[];
  complianceDocs: ComplianceDocument[];
  addComplianceDoc: (doc: Partial<ComplianceDocument>) => void;
  advisoryFees: AdvisoryFee[];
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

  const simulateMarketingLead = useCallback((platform: 'google_ads' | 'meta_ads' | 'linkedin_ads', rawPayload: any) => {
      let normalizedLead: Partial<Lead> = { source: platform, date: new Date().toISOString(), status: LeadStatus.NEW };
      if (platform === 'google_ads') {
          normalizedLead = { ...normalizedLead, name: rawPayload.full_name || rawPayload.name, email: rawPayload.email, phone: rawPayload.phone_number || rawPayload.phone, interest: ProductType.LIFE, message: `Real-time Lead from Google Ads. Campaign: ${rawPayload.campaign_id}` };
      } else if (platform === 'meta_ads') {
          normalizedLead = { ...normalizedLead, name: rawPayload.full_name, email: rawPayload.email, phone: rawPayload.phone_number, interest: ProductType.BUSINESS, message: `Meta Instant Form Submission. ID: ${rawPayload.id}` };
      } else if (platform === 'linkedin_ads') {
          normalizedLead = { ...normalizedLead, name: `${rawPayload.firstName} ${rawPayload.lastName}`, email: rawPayload.email, phone: rawPayload.phone, interest: ProductType.INVESTMENT, message: `LinkedIn Lead Gen Form. ${rawPayload.jobTitle} @ ${rawPayload.company}` };
      }
      addLead(normalizedLead);
  }, []);

  useEffect(() => {
    const savedMessages = localStorage.getItem('nhfg_chat_v2');
    if (savedMessages) setChatMessages(JSON.parse(savedMessages).map((m: any) => ({...m, timestamp: new Date(m.timestamp)})));
    const savedLeads = localStorage.getItem('nhfg_leads_v2');
    if (savedLeads) setLeads(JSON.parse(savedLeads));
    const savedClients = localStorage.getItem('nhfg_clients_v2');
    if (savedClients) setClients(JSON.parse(savedClients));
    const savedNotifs = localStorage.getItem('nhfg_notifs_v2');
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs).map((n: any) => ({...n, timestamp: new Date(n.timestamp)})));
  }, []);

  useEffect(() => { localStorage.setItem('nhfg_chat_v2', JSON.stringify(chatMessages)); }, [chatMessages]);
  useEffect(() => { localStorage.setItem('nhfg_leads_v2', JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem('nhfg_clients_v2', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('nhfg_notifs_v2', JSON.stringify(notifications)); }, [notifications]);

  useEffect(() => {
    setColleagues(allUsers.map(u => ({ id: u.id, name: u.name, role: u.role, status: 'online', avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random` })));
  }, [allUsers]);

  const addSystemNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert' = 'info') => {
    const newNotif: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        title, message, type, timestamp: new Date(), read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addLead = (lead: Partial<Lead>, assignTo?: string) => {
    const currentLeads = leadsRef.current;
    const isDuplicate = currentLeads.some(l => (lead.email && lead.email !== 'Not Provided' && l.email === lead.email) || (lead.phone && l.phone === lead.phone));
    if (isDuplicate) return;
    const newLead: Lead = { id: Math.random().toString(36).substr(2, 9), name: lead.name || 'Unknown', email: lead.email || '', phone: lead.phone || '', interest: lead.interest || ProductType.LIFE, message: lead.message || '', date: new Date().toISOString(), status: LeadStatus.NEW, score: Math.floor(Math.random() * 40) + 60, qualification: 'Warm', assignedTo: assignTo, source: lead.source || 'manual' };
    setLeads(prev => [...prev, newLead]);
    addSystemNotification('New Lead Captured', `${newLead.name} inquired about ${newLead.interest}.`, 'success');
  };

  const updateLeadStatus = (id: string, status: LeadStatus, analysis?: string) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status, aiAnalysis: analysis || l.aiAnalysis } : l));
    addSystemNotification('Lead Status Updated', `${lead.name} moved to ${status}.`, 'info');
    if (status === LeadStatus.APPROVED) {
        const clientExists = clients.some(c => c.name === lead.name && (c.email === lead.email || c.phone === lead.phone));
        if (!clientExists) {
            const renewalDate = new Date(); renewalDate.setFullYear(renewalDate.getFullYear() + 1);
            const newClient: Client = { id: Math.random().toString(36).substr(2, 9), name: lead.name, email: lead.email, phone: lead.phone, product: lead.interest, policyNumber: `NH-${Math.floor(100000 + Math.random() * 900000)}`, premium: 0, renewalDate: renewalDate.toISOString().split('T')[0], carrier: lead.lifeDetails?.preferredCarrier || 'Pending Assignment' };
            setClients(prev => [...prev, newClient]);
            addSystemNotification('Client Created Automatically', `${lead.name} has been promoted to Client Management.`, 'success');
        }
    }
  };

  const assignLeads = (leadIds: string[], advisorId: string) => {
    setLeads(prev => prev.map(l => leadIds.includes(l.id) ? { ...l, assignedTo: advisorId, status: LeadStatus.ASSIGNED } : l));
    const advisor = allUsers.find(u => u.id === advisorId);
    addSystemNotification('Assignment Update', `${leadIds.length} leads assigned to ${advisor?.name || 'advisor'}.`, 'info');
  };

  const updateLead = (id: string, data: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
    const lead = leads.find(l => l.id === id);
    if (lead) addSystemNotification('Lead Updated', `Profile for ${lead.name} was modified.`, 'info');
  };

  const handleAdvisorLeadAction = (id: string, action: 'accept' | 'decline') => {
      const lead = leads.find(l => l.id === id);
      if (action === 'accept') {
          updateLeadStatus(id, LeadStatus.CONTACTED);
          addSystemNotification('Lead Accepted', `Advisor has claimed the lead for ${lead?.name}.`, 'success');
      } else {
          setLeads(prev => prev.map(l => l.id === id ? { ...l, assignedTo: undefined } : l));
          addSystemNotification('Lead Declined', `Advisor returned the lead for ${lead?.name} to pool.`, 'warning');
      }
  };

  const updateClient = (id: string, data: Partial<Client>) => {
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
      const client = clients.find(c => c.id === id);
      if (client) addSystemNotification('Client Profile Updated', `${client.name}'s details were updated in the database.`, 'info');
  };

  const addCallback = (req: any) => {
      setCallbacks(prev => [...prev, { ...req, id: Math.random().toString(), resolved: false }]);
      addSystemNotification('Callback Requested', `${req.name} requested a call back.`, 'info');
  };

  const addEvent = (e: any) => {
      // Rule: creator should be the current logged-in user
      const eventWithCreator = { 
        ...e, 
        id: Math.random().toString(), 
        creatorId: user?.id, 
        creatorName: user?.name 
      };
      setEvents(prev => [...prev, eventWithCreator]);
      addSystemNotification('Event Added', `New ${e.type}: ${e.title} scheduled.`, 'info');
  };

  const updateEvent = (event: CalendarEvent) => {
      setEvents(prev => prev.map(ev => ev.id === event.id ? event : ev));
      addSystemNotification('Event Updated', `The schedule for ${event.title} was changed.`, 'info');
  };

  const deleteEvent = (id: string) => {
      const event = events.find(e => e.id === id);
      setEvents(prev => prev.filter(e => e.id !== id));
      if (event) addSystemNotification('Event Cancelled', `${event.title} was removed from the calendar.`, 'warning');
  };

  const addAdvisor = (u: any) => {
      setAllUsers(prev => [...prev, { ...u, id: Math.random().toString() }]);
      addSystemNotification('New User Added', `${u.name} was added to the system as ${u.role}.`, 'success');
  };

  const deleteAdvisor = (id: string) => {
      const u = allUsers.find(user => user.id === id);
      setAllUsers(prev => prev.map(user => user.id === id ? { ...user, deletedAt: new Date().toISOString() } : user));
      if (u) addSystemNotification('User Archived', `${u.name} was moved to archives.`, 'warning');
  };

  const updateUser = (id: string, data: any) => {
      setAllUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
      const u = allUsers.find(user => user.id === id);
      if (u) addSystemNotification('Account Modified', `User profile for ${u.name} was updated.`, 'info');
  };

  const updateCompanySettings = (s: CompanySettings) => {
      setCompanySettings(s);
      addSystemNotification('Settings Changed', 'Corporate website and CRM settings were updated.', 'alert');
  };

  const completeOnboarding = () => {
      if (user) {
          const updatedUser = { ...user, onboardingCompleted: true };
          setUser(updatedUser);
          setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
          addSystemNotification('Onboarding Complete', 'Welcome to the New Holland team!', 'success');
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

    // Simulated auto-reply removed per user request to fix "auto reply it self" confusion.
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
    addSystemNotification('Application Updated', `Status moved to ${status}.`, 'info');
  };

  const updateTransactionStatus = (id: string, status: string, stage?: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: status as any, stage: (stage || t.stage) as any } : t));
    addSystemNotification('Transaction Updated', `Transaction status: ${status}.`, 'info');
  };

  const addComplianceDoc = (doc: Partial<ComplianceDocument>) => {
    const newDoc: ComplianceDocument = { id: Math.random().toString(36).substr(2, 9), title: doc.title || 'Untitled', type: doc.type || 'KYC', uploadDate: new Date().toISOString(), status: 'Pending Review', url: doc.url || '#', advisorId: user?.id || '', ...doc };
    setComplianceDocs(prev => [...prev, newDoc]);
    addSystemNotification('Document Uploaded', `${newDoc.title} has been added for compliance review.`, 'success');
  };

  const updateFeeStatus = (id: string, status: 'Paid' | 'Overdue') => {
    setAdvisoryFees(prev => prev.map(f => f.id === id ? { ...f, status } : f));
    addSystemNotification('Fee Status Updated', `Payment marked as ${status}.`, 'success');
  };

  const updateIntegrationConfig = (config: Partial<IntegrationConfig>) => { setIntegrationConfig(prev => ({ ...prev, ...config })); };

  const login = (email: string) => {
      const foundUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (foundUser) setUser(foundUser);
      else { alert('User not found. Logging in as Demo Admin.'); setUser(MOCK_USERS[0]); }
  };
  const logout = () => setUser(null);

  return (
    <DataContext.Provider value={{
      user, allUsers, leads, clients, callbacks, metrics: { totalRevenue: 1250000, activeClients: 450, pendingLeads: 24, monthlyPerformance: [], totalCommission: 85000 },
      notifications, commissions: [], events, emails: [], colleagues, chatMessages, availableCarriers: [], advisorAssignments: [],
      assignCarriers: () => {}, getAdvisorAssignments: () => [], companySettings, resources, likeResource: () => {}, dislikeResource: () => {}, shareResource: () => {}, addResourceComment: () => {}, addResource: () => {}, deleteResource: () => {},
      testimonials, addTestimonial: () => {}, approveTestimonial: () => {}, deleteTestimonial: () => {}, submitTestimonialEdit: () => {}, approveTestimonialEdit: () => {}, rejectTestimonialEdit: () => {},
      login, logout, addCallback, addLead, updateLeadStatus, updateLead, assignLeads, handleAdvisorLeadAction, updateClient,
      addEvent, updateEvent, deleteEvent, isGoogleConnected, toggleGoogleSync: () => {}, sendChatMessage, editChatMessage, deleteChatMessage, markChatRead, addAdvisor, deleteAdvisor, updateUser, restoreUser: () => {}, permanentlyDeleteUser: () => {},
      updateCompanySettings, jobApplications: [], submitJobApplication: () => {}, updateJobApplicationStatus: () => {}, applications, updateApplicationStatus,
      performanceTargets: { monthly: 50000, quarterly: 150000, presidentsClub: 1000000 }, properties, transactions, updateTransactionStatus, portfolios, complianceDocs, addComplianceDoc, advisoryFees, updateFeeStatus,
      markNotificationRead: (id) => setNotifications(n => n.map(not => not.id === id ? {...not, read: true} : not)), clearNotifications: () => setNotifications([]),
      integrationConfig, updateIntegrationConfig, integrationLogs, simulateMarketingLead, completeOnboarding
    }}>
      {children}
    </DataContext.Provider>
  );
};
