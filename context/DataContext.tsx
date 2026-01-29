import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Lead, Client, DashboardMetrics, ProductType, LeadStatus, User, UserRole, Notification, CalendarEvent, ChatMessage, AdvisorCategory, CompanySettings, Resource, Carrier, AdvisorAssignment, Testimonial, Application, ApplicationStatus, IntegrationConfig, IntegrationLog, LoanApplication, Colleague, PropertyListing, EscrowTransaction, ClientPortfolio, ComplianceDocument, AdvisoryFee, JobApplication } from '../types';
import { Backend } from '../services/apiBackend';
import { analyzeLead } from '../services/geminiService';
import { socketService } from '../services/socketService';

interface DataContextType {
  user: User | null;
  allUsers: User[];
  leads: Lead[];
  clients: Client[];
  metrics: DashboardMetrics;
  notifications: Notification[];
  chatMessages: ChatMessage[];
  companySettings: CompanySettings;
  resources: Resource[];
  commissions: any[];
  events: CalendarEvent[];
  testimonials: Testimonial[];
  availableCarriers: Carrier[];
  colleagues: Colleague[];
  jobApplications: JobApplication[];
  applications: Application[];
  properties: PropertyListing[];
  transactions: EscrowTransaction[];
  portfolios: ClientPortfolio[];
  complianceDocs: ComplianceDocument[];
  advisoryFees: AdvisoryFee[];
  loanApplications: LoanApplication[];
  integrationLogs: IntegrationLog[];
  integrationConfig: IntegrationConfig;

  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  addLead: (lead: Partial<Lead>, assignTo?: string) => void;
  updateLeadStatus: (id: string, status: LeadStatus, analysis?: string) => void;
  updateLead: (id: string, data: Partial<Lead>) => void;
  assignLeads: (leadIds: string[], advisorId: string, priority?: string, notes?: string) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  updateCompanySettings: (settings: CompanySettings) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  completeOnboarding: (signatureData?: string) => void;
  updateIntegrationConfig: (config: Partial<IntegrationConfig>) => void;
  simulateMarketingLead: (platform: 'google_ads' | 'meta_ads' | 'tiktok_ads' | 'linkedin_ads', rawPayload: any) => void;
  getAdvisorAssignments: (advisorId: string) => AdvisorAssignment[];
  likeResource: (id: string) => void;
  dislikeResource: (id: string) => void;
  shareResource: (id: string) => void;
  addResourceComment: (id: string, text: string, userName: string) => void;
  addResource: (resource: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'status' | 'date'>) => void;
  approveTestimonial: (id: string) => void;
  deleteTestimonial: (id: string) => void;
  submitTestimonialEdit: (id: string, edits: Partial<Testimonial>) => void;
  approveTestimonialEdit: (id: string) => void;
  rejectTestimonialEdit: (id: string) => void;
  addCallback: (request: any) => void;
  handleAdvisorLeadAction: (id: string, action: string, reason?: string) => void;
  
  addEvent: (event: Partial<CalendarEvent>) => void;
  updateEvent: (event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  addAdvisor: (data: Partial<User>) => void;
  deleteAdvisor: (id: string) => void;
  restoreUser: (id: string) => void;
  permanentlyDeleteUser: (id: string) => void;
  assignCarriers: (advisorIds: string[], carriers: Carrier[]) => void;
  markChatRead: (id: string) => void;
  editChatMessage: (id: string, text: string) => void;
  deleteChatMessage: (id: string) => void;
  sendChatMessage: (receiverId: string, text: string, attachment?: any) => void;
  submitJobApplication: (data: any) => void;
  updateJobApplicationStatus: (id: string, status: string, config?: any) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  
  addProperty: (property: Partial<PropertyListing>) => void;
  updateProperty: (id: string, property: Partial<PropertyListing>) => void;
  deleteProperty: (id: string) => void;
  updateTransactionStatus: (id: string, status: 'Open' | 'Closed' | 'Cancelled', stage?: EscrowTransaction['stage']) => void;
  addPortfolio: (data: Partial<ClientPortfolio>) => void;
  updatePortfolio: (id: string, data: Partial<ClientPortfolio>) => void;
  deletePortfolio: (id: string) => void;
  addComplianceDoc: (data: Partial<ComplianceDocument>) => void;
  updateFeeStatus: (id: string, status: string) => void;
  addAdvisoryFee: (data: Partial<AdvisoryFee>) => void;
  updateAdvisoryFee: (id: string, data: Partial<AdvisoryFee>) => void;
  deleteAdvisoryFee: (id: string) => void;
  addLoanApplication: (data: Partial<LoanApplication>) => void;
  updateLoanApplication: (id: string, data: Partial<LoanApplication>) => void;
  deleteLoanApplication: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

const INITIAL_USERS: User[] = [
  { id: '1', name: 'NHFG Admin', email: 'admin@nhfg.com', role: UserRole.ADMIN, category: AdvisorCategory.ADMIN, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', onboardingCompleted: true },
  { id: '2', name: 'James Manager', email: 'manager@nhfg.com', role: UserRole.MANAGER, category: AdvisorCategory.ADMIN, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200', onboardingCompleted: true },
  { id: '3', name: 'Sarah SubAdmin', email: 'subadmin@nhfg.com', role: UserRole.SUB_ADMIN, category: AdvisorCategory.ADMIN, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', onboardingCompleted: true },
  { id: '4', name: 'David Insurance', email: 'insurance@nhfg.com', phone: '(555) 123-4567', role: UserRole.ADVISOR, category: AdvisorCategory.INSURANCE, productsSold: [ProductType.LIFE, ProductType.IUL, ProductType.ANNUITY], onboardingCompleted: true, micrositeEnabled: true },
  { id: '5', name: 'Linda Real Estate', email: 'realestate@nhfg.com', phone: '(555) 234-5678', role: UserRole.ADVISOR, category: AdvisorCategory.REAL_ESTATE, productsSold: [ProductType.REAL_ESTATE], onboardingCompleted: true, micrositeEnabled: true },
  { id: '6', name: 'Mark Mortgage', email: 'mortgage@nhfg.com', phone: '(555) 345-6789', role: UserRole.ADVISOR, category: AdvisorCategory.MORTGAGE, productsSold: [ProductType.MORTGAGE], onboardingCompleted: true, micrositeEnabled: true },
  { id: '7', name: 'Kevin Securities', email: 'securities@nhfg.com', phone: '(555) 456-7890', role: UserRole.ADVISOR, category: AdvisorCategory.SECURITIES, productsSold: [ProductType.SECURITIES, ProductType.INVESTMENT], onboardingCompleted: true, micrositeEnabled: true },
];

const INITIAL_INTEGRATION_CONFIG: IntegrationConfig = {
  googleAds: { enabled: true, webhookUrl: 'https://api.nhfg.com/hooks/google', developerToken: '****************' },
  metaAds: { enabled: false, verifyToken: '', accessToken: '' },
  tiktokAds: { enabled: false, webhookUrl: '', accessToken: '' },
  linkedinAds: { enabled: false, pollingInterval: 300, accessToken: '' }
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);
  const [portfolios, setPortfolios] = useState<ClientPortfolio[]>([]);
  const [complianceDocs, setComplianceDocs] = useState<ComplianceDocument[]>([]);
  const [advisoryFees, setAdvisoryFees] = useState<AdvisoryFee[]>([]);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [integrationConfig, setIntegrationConfig] = useState<IntegrationConfig>(INITIAL_INTEGRATION_CONFIG);
  const [integrationLogs, setIntegrationLogs] = useState<IntegrationLog[]>([]);
  
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
      phone: '(800) 555-0199', 
      email: 'contact@newholland.com', 
      address: '123 Finance Way', 
      city: 'New York', 
      state: 'NY', 
      zip: '10001',
      heroBackgroundType: 'image', 
      heroBackgroundUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070',
      heroTitle: 'Securing Your Future', 
      heroSubtitle: 'Comprehensive financial solutions for every stage of life.',
      footerDescription: 'Providing tailored insurance solutions that secure financial peace of mind for individuals, families, and businesses.',
      socialLinks: [
          { platform: 'Facebook', url: '#' },
          { platform: 'LinkedIn', url: '#' },
          { platform: 'X', url: '#' },
          { platform: 'Instagram', url: '#' },
          { platform: 'YouTube', url: '#' },
          { platform: 'TikTok', url: '#' }
      ],
      termsOfUse: 'Default Terms...', 
      solicitorAgreement: 'Default Agreement...',
      heroVideoPlaylist: []
  });

  const pushNotification = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert' = 'info', resourceType?: any, relatedId?: string) => {
    const newNotif: Notification = {
      id: crypto.randomUUID(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
      resourceType,
      relatedId
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  useEffect(() => {
    if (user) {
        socketService.connect();
        const unsubscribe = socketService.subscribe((data) => {
            if (data.type === 'NEW_LEAD') {
                pushNotification('New Lead Ingested', `New lead received from ${data.payload.source}`, 'success', 'lead', data.payload.id);
                Backend.getLeads().then(setLeads);
            } else if (data.type === 'CHAT_MESSAGE') {
                setChatMessages(prev => [...prev, data.payload]);
                if (data.payload.senderId !== user.id) {
                    pushNotification('New Message', `Message received from ${data.payload.senderName}`, 'info');
                }
            }
        });
        return () => {
            unsubscribe();
            socketService.disconnect();
        };
    }
  }, [user, pushNotification]);

  useEffect(() => {
    const bootstrap = async () => {
      const storedLeads = await Backend.getLeads();
      const storedUsers = await Backend.getUsers();
      const storedClients = await Backend.getClients();
      const storedSettings = await Backend.getSettings();

      setAllUsers(storedUsers.length > 0 ? storedUsers : INITIAL_USERS);
      setLeads(storedLeads);
      setClients(storedClients);
      if (storedSettings) setCompanySettings(storedSettings);
    };
    bootstrap();
  }, []);

  const addLead = useCallback(async (leadData: Partial<Lead>, assignTo?: string) => {
    const newLead: Lead = {
      id: crypto.randomUUID(),
      name: leadData.name || 'Website Inquiry',
      email: leadData.email || 'Not Provided',
      phone: leadData.phone || 'N/A',
      interest: leadData.interest || ProductType.LIFE,
      message: leadData.message || '',
      date: new Date().toISOString(),
      status: LeadStatus.NEW,
      score: 85,
      qualification: 'Hot',
      source: leadData.source || 'Website',
      assignedTo: assignTo,
      notes: leadData.notes || '',
      isArchived: false,
      priority: 'Low',
      ...leadData
    };

    await Backend.saveLead(newLead);
    setLeads(prev => [newLead, ...prev]);
    pushNotification('New Lead Received', `Inquiry from ${newLead.name} regarding ${newLead.interest}.`, 'success', 'lead', newLead.id);
    
    analyzeLead(newLead).then(analysis => {
        updateLead(newLead.id, { aiAnalysis: analysis });
    });
  }, [pushNotification]);

  const updateLead = useCallback(async (id: string, data: Partial<Lead>) => {
      const lead = leads.find(l => l.id === id);
      if (lead) {
          const updated = { ...lead, ...data };
          await Backend.saveLead(updated);
          setLeads(prev => prev.map(l => l.id === id ? updated : l));
      }
  }, [leads]);

  const updateLeadStatus = useCallback((id: string, status: LeadStatus, analysis?: string) => {
      updateLead(id, { status, aiAnalysis: analysis });
  }, [updateLead]);

  const login = async (email: string, password?: string) => {
      const apiUser = await Backend.login(email, password);
      if (apiUser) {
          setUser(apiUser);
          return true;
      }
      const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setUser(found);
        return true;
      }
      return false;
  };

  const logout = () => { Backend.logout(); setUser(null); };
  const addEvent = (e: Partial<CalendarEvent>) => setEvents(prev => [...prev, { ...e, id: crypto.randomUUID() } as CalendarEvent]);
  const updateEvent = (e: Partial<CalendarEvent>) => setEvents(prev => prev.map(ev => ev.id === e.id ? { ...ev, ...e } : ev));
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));
  const updateUser = (id: string, data: Partial<User>) => {
      setAllUsers(prev => {
          const updated = prev.map(u => u.id === id ? {...u, ...data} : u);
          const found = updated.find(u => u.id === id);
          if (found) Backend.saveUser(found);
          return updated;
      });
  };
  const updateCompanySettings = (s: CompanySettings) => { setCompanySettings(s); Backend.saveSettings(s); };
  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const clearNotifications = () => setNotifications([]);
  const completeOnboarding = (signatureData?: string) => { if (user) updateUser(user.id, { onboardingCompleted: true }); };
  const updateIntegrationConfig = (c: Partial<IntegrationConfig>) => setIntegrationConfig(prev => ({ ...prev, ...c }));
  const simulateMarketingLead = async (p: any, load: any) => { await Backend.handleWebhook(p, load); };
  const getAdvisorAssignments = () => [];
  const likeResource = () => {};
  const dislikeResource = () => {};
  const shareResource = () => {};
  const addResourceComment = () => {};
  const addResource = (r: Partial<Resource>) => {};
  const deleteResource = (id: string) => {};
  const addTestimonial = (t: any) => {};
  const approveTestimonial = (id: string) => {};
  const deleteTestimonial = (id: string) => {};
  const submitTestimonialEdit = (id: string, e: any) => {};
  const approveTestimonialEdit = (id: string) => {};
  const rejectTestimonialEdit = (id: string) => {};
  const addCallback = (r: any) => {};
  const handleAdvisorLeadAction = (id: string, a: string) => {};
  const addAdvisor = (data: Partial<User>) => {
      const newUser: User = { id: crypto.randomUUID(), name: data.name || 'New Advisor', email: data.email || 'advisor@nhfg.com', role: UserRole.ADVISOR, category: AdvisorCategory.INSURANCE, onboardingCompleted: false, ...data } as User;
      setAllUsers(prev => [...prev, newUser]);
      Backend.saveUser(newUser);
  };
  const deleteAdvisor = (id: string) => updateUser(id, { deletedAt: new Date().toISOString() });
  const restoreUser = (id: string) => updateUser(id, { deletedAt: undefined });
  const permanentlyDeleteUser = (id: string) => setAllUsers(prev => prev.filter(u => u.id !== id));
  const assignCarriers = () => {};
  const markChatRead = () => {};
  const editChatMessage = () => {};
  const deleteChatMessage = () => {};
  const sendChatMessage = (receiverId: string, text: string, attachment?: any) => {
      if (!user) return;
      const newMessage: ChatMessage = { id: crypto.randomUUID(), senderId: user.id, receiverId, text, timestamp: new Date(), read: false, attachment };
      setChatMessages(prev => [...prev, newMessage]);
      socketService.send({ type: 'CHAT_MESSAGE', payload: { ...newMessage, senderName: user.name } });
  };
  const submitJobApplication = (data: any) => { setJobApplications(prev => [...prev, { ...data, id: crypto.randomUUID(), date: new Date().toISOString(), status: 'Pending' }]); };
  const updateJobApplicationStatus = (id: string, status: string, config?: any) => {
      setJobApplications(prev => prev.map(app => {
          if (app.id === id) {
              if (status === 'Approved' && app.status !== 'Approved') {
                  const newUser: User = { id: crypto.randomUUID(), name: app.fullName, email: app.email, phone: app.phone, role: UserRole.ADVISOR, category: AdvisorCategory.INSURANCE, productsSold: config?.products || [], contractLevel: config?.contractLevel || 50, onboardingCompleted: false, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.fullName)}&background=0D8ABC&color=fff` };
                  setAllUsers(users => [...users, newUser]);
                  Backend.saveUser(newUser);
              }
              return { ...app, status: status as any };
          }
          return app;
      }));
  };
  const updateApplicationStatus = () => {};
  const addProperty = (p: any) => {};
  const updateProperty = () => {};
  const deleteProperty = () => {};
  const updateTransactionStatus = () => {};
  const addPortfolio = (p: any) => {};
  const updatePortfolio = () => {};
  const deletePortfolio = (id: string) => {};
  const addComplianceDoc = (d: any) => {};
  const updateFeeStatus = () => {};
  const addAdvisoryFee = (f: any) => {};
  const updateAdvisoryFee = (id: string, data: Partial<AdvisoryFee>) => {};
  const deleteAdvisoryFee = (id: string) => {};
  const addLoanApplication = (l: any) => {};
  const updateLoanApplication = (id: string, data: Partial<LoanApplication>) => {};
  const deleteLoanApplication = (id: string) => {};
  const updateClient = useCallback(async (id: string, data: Partial<Client>) => {
      const client = clients.find(c => c.id === id);
      if (client) {
          const updated = { ...client, ...data };
          await Backend.saveClient(updated);
          setClients(prev => prev.map(c => c.id === id ? updated : c));
      }
  }, [clients]);
  const assignLeads = useCallback(async (leadIds: string[], advisorId: string) => {
      const targetLeads = leads.filter(l => leadIds.includes(l.id));
      for (const lead of targetLeads) {
          const updatedLead: Lead = { ...lead, assignedTo: advisorId, status: LeadStatus.ASSIGNED };
          await Backend.saveLead(updatedLead);
      }
      Backend.getLeads().then(setLeads);
  }, [leads]);

  return (
    <DataContext.Provider value={{
      user, allUsers, leads, clients, metrics: { totalRevenue: 1250000, activeClients: 450, pendingLeads: 12, monthlyPerformance: [], totalCommission: 85000 },
      notifications, chatMessages, companySettings, resources: [], commissions: [], events, testimonials,
      availableCarriers: [], colleagues: [], jobApplications, applications, properties, transactions,
      portfolios, complianceDocs, advisoryFees, loanApplications, integrationLogs, integrationConfig,
      login, logout, addLead, updateLeadStatus, updateLead, assignLeads, updateClient, updateUser, updateCompanySettings,
      markNotificationRead, clearNotifications, completeOnboarding, updateIntegrationConfig, simulateMarketingLead,
      getAdvisorAssignments, likeResource, dislikeResource, shareResource, addResourceComment, addResource, deleteResource,
      addTestimonial, approveTestimonial, deleteTestimonial, submitTestimonialEdit, approveTestimonialEdit, rejectTestimonialEdit,
      addCallback, handleAdvisorLeadAction, addEvent, updateEvent, deleteEvent, addAdvisor, deleteAdvisor, restoreUser, permanentlyDeleteUser,
      assignCarriers, markChatRead, editChatMessage, deleteChatMessage, sendChatMessage, submitJobApplication, updateJobApplicationStatus,
      updateApplicationStatus, updateTransactionStatus, addPortfolio, updatePortfolio, deletePortfolio, addComplianceDoc,
      updateFeeStatus, addAdvisoryFee, updateAdvisoryFee, deleteAdvisoryFee, addLoanApplication, updateLoanApplication, deleteLoanApplication,
      addProperty, updateProperty, deleteProperty
    }}>
      {children}
    </DataContext.Provider>
  );
};