
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
  
  // Real Estate Property Management
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
  { id: '1', name: 'Admin User', email: 'admin@nhfg.com', role: UserRole.ADMIN, category: AdvisorCategory.ADMIN, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', onboardingCompleted: true },
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

  const performLeadMaintenance = useCallback(async (currentLeads: Lead[]) => {
      const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      let modified = false;
      
      const nextLeads = currentLeads.map(l => {
          const leadDate = new Date(l.date).getTime();
          if (!l.isArchived && (now - leadDate) > FIFTEEN_DAYS_MS) {
              modified = true;
              return { ...l, isArchived: true, deletedAt: new Date().toISOString(), status: LeadStatus.LOST };
          }
          return l;
      });

      if (modified) {
          setLeads(nextLeads);
          pushNotification('System Maintenance', 'Auto-cleanup moved expired leads to archive.', 'warning');
          for (const l of nextLeads.filter(x => x.isArchived)) {
              await Backend.saveLead(l);
          }
      }
  }, [pushNotification]);

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
      performLeadMaintenance(storedLeads);
    };
    bootstrap();
    const interval = setInterval(() => {
        setLeads(prev => { performLeadMaintenance(prev); return prev; });
    }, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [performLeadMaintenance]);

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
          if (data.status) {
            pushNotification('Lead Status Update', `${lead.name} shifted to ${data.status}.`, 'info', 'lead', id);
          }
      }
  }, [leads, pushNotification]);

  const updateLeadStatus = useCallback((id: string, status: LeadStatus, analysis?: string) => {
      updateLead(id, { status, aiAnalysis: analysis });
  }, [updateLead]);

  const sendChatMessage = (receiverId: string, text: string, attachment?: any) => {
      if (!user) return;
      const newMessage: ChatMessage = {
          id: crypto.randomUUID(),
          senderId: user.id,
          receiverId,
          text,
          timestamp: new Date(),
          read: false,
          attachment
      };
      setChatMessages(prev => [...prev, newMessage]);
      socketService.send({
          type: 'CHAT_MESSAGE',
          payload: { ...newMessage, senderName: user.name }
      });
  };

  const login = async (email: string, password?: string) => {
      const apiUser = await Backend.login(email, password);
      if (apiUser) {
          setUser(apiUser);
          pushNotification('Security Alert', `Login successful via API: ${apiUser.email}.`, 'info');
          return true;
      }
      const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setUser(found);
        pushNotification('Security Alert', `Login detected for account: ${found.email}.`, 'info');
        return true;
      }
      return false;
  };

  const logout = () => { Backend.logout(); setUser(null); };
  
  const addEvent = (e: Partial<CalendarEvent>) => setEvents(prev => [...prev, { ...e, id: crypto.randomUUID() } as CalendarEvent]);
  const updateEvent = (e: Partial<CalendarEvent>) => setEvents(prev => prev.map(ev => ev.id === e.id ? { ...ev, ...e } : ev));
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));
  const updateUser = (id: string, data: Partial<User>) => setAllUsers(prev => prev.map(u => u.id === id ? {...u, ...data} : u));
  const updateCompanySettings = (s: CompanySettings) => { setCompanySettings(s); Backend.saveSettings(s); };
  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const clearNotifications = () => setNotifications([]);
  
  const completeOnboarding = (signatureData?: string) => { 
      if (user) {
          updateUser(user.id, { onboardingCompleted: true }); 
      }
  };
  
  const updateIntegrationConfig = (c: Partial<IntegrationConfig>) => setIntegrationConfig(prev => ({ ...prev, ...c }));
  const simulateMarketingLead = async (p: any, load: any) => { await Backend.handleWebhook(p, load); };
  const getAdvisorAssignments = () => [];
  const likeResource = () => {};
  const dislikeResource = () => {};
  const shareResource = () => {};
  const addResourceComment = () => {};
  const addResource = () => {};
  const deleteResource = () => {};
  const addTestimonial = () => {};
  const approveTestimonial = () => {};
  const deleteTestimonial = () => {};
  const submitTestimonialEdit = () => {};
  const approveTestimonialEdit = () => {};
  const rejectTestimonialEdit = () => {};
  const addCallback = () => {};
  const handleAdvisorLeadAction = () => {};
  const addAdvisor = (data: Partial<User>) => {
      const newUser: User = {
          id: crypto.randomUUID(),
          name: data.name || 'New Advisor',
          email: data.email || 'advisor@nhfg.com',
          role: UserRole.ADVISOR,
          category: AdvisorCategory.INSURANCE,
          onboardingCompleted: false,
          ...data
      } as User;
      setAllUsers(prev => [...prev, newUser]);
      Backend.saveUser(newUser);
  };
  const deleteAdvisor = (id: string) => setAllUsers(prev => prev.map(u => u.id === id ? { ...u, deletedAt: new Date().toISOString() } : u));
  const restoreUser = (id: string) => setAllUsers(prev => prev.map(u => u.id === id ? { ...u, deletedAt: undefined } : u));
  const permanentlyDeleteUser = (id: string) => setAllUsers(prev => prev.filter(u => u.id !== id));
  
  const assignCarriers = () => {};
  const markChatRead = () => {};
  const editChatMessage = () => {};
  const deleteChatMessage = () => {};
  
  const submitJobApplication = (data: any) => {
      setJobApplications(prev => [...prev, { ...data, id: crypto.randomUUID(), date: new Date().toISOString(), status: 'Pending' }]);
  };

  const updateJobApplicationStatus = useCallback((id: string, status: string, config?: any) => {
      setJobApplications(prev => prev.map(app => {
          if (app.id === id) {
              if (status === 'Approved' && app.status !== 'Approved') {
                  const tempPassword = "Welcome123!";
                  const newUser: User = {
                      id: crypto.randomUUID(),
                      name: app.fullName,
                      email: app.email,
                      phone: app.phone,
                      role: UserRole.ADVISOR,
                      category: AdvisorCategory.INSURANCE, 
                      productsSold: config?.products || [],
                      contractLevel: config?.contractLevel || 50,
                      onboardingCompleted: false,
                      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.fullName)}&background=0D8ABC&color=fff`
                  };
                  
                  setAllUsers(users => [...users, newUser]);
                  Backend.saveUser(newUser);
                  
                  pushNotification('Onboarding Email Sent', `Welcome credentials sent to ${app.email}.`, 'success');
              }
              return { ...app, status: status as any };
          }
          return app;
      }));
  }, [pushNotification]);

  const updateApplicationStatus = () => {};
  const addProperty = () => {};
  const updateProperty = () => {};
  const deleteProperty = () => {};
  const updateTransactionStatus = () => {};
  const addPortfolio = () => {};
  const updatePortfolio = () => {};
  const deletePortfolio = () => {};
  const addComplianceDoc = () => {};
  const updateFeeStatus = () => {};
  const addAdvisoryFee = () => {};
  const updateAdvisoryFee = () => {};
  const deleteAdvisoryFee = () => {};
  const addLoanApplication = () => {};
  const updateLoanApplication = () => {};
  const deleteLoanApplication = () => {};

  const updateClient = useCallback(async (id: string, data: Partial<Client>) => {
      const client = clients.find(c => c.id === id);
      if (client) {
          const updated = { ...client, ...data };
          await Backend.saveClient(updated);
          setClients(prev => prev.map(c => c.id === id ? updated : c));
          pushNotification('Client Updated', `${updated.name} record updated.`, 'success');
      }
  }, [clients, pushNotification]);

  const assignLeads = useCallback(async (leadIds: string[], advisorId: string, priority?: string, notes?: string) => {
      const targetLeads = leads.filter(l => leadIds.includes(l.id));
      const advisors = allUsers.filter(u => u.role === UserRole.ADVISOR);
      
      if (advisors.length === 0) {
          pushNotification('Assignment Failed', 'No advisors found.', 'warning');
          return;
      }

      const updates: Lead[] = [];
      const advisorLoad: Record<string, number> = {};
      
      advisors.forEach(a => {
          advisorLoad[a.id] = leads.filter(l => l.assignedTo === a.id && l.status !== LeadStatus.CLOSED && l.status !== LeadStatus.LOST).length;
      });

      for (const lead of targetLeads) {
          let targetAdvisorId = advisorId;

          if (advisorId === 'DISTRIBUTE_EVENLY') {
              const sorted = [...advisors].sort((a, b) => (advisorLoad[a.id] || 0) - (advisorLoad[b.id] || 0));
              targetAdvisorId = sorted[0].id;
          } else if (advisorId === 'DISTRIBUTE_SPECIALIZED') {
              const specialists = advisors.filter(a => a.productsSold?.includes(lead.interest));
              const pool = specialists.length > 0 ? specialists : advisors;
              const sorted = [...pool].sort((a, b) => (advisorLoad[a.id] || 0) - (advisorLoad[b.id] || 0));
              targetAdvisorId = sorted[0].id;
          }

          if (targetAdvisorId && !['DISTRIBUTE_EVENLY', 'DISTRIBUTE_SPECIALIZED'].includes(targetAdvisorId)) {
              const updatedLead: Lead = {
                  ...lead,
                  assignedTo: targetAdvisorId,
                  status: LeadStatus.ASSIGNED,
                  priority: (priority as any) || lead.priority,
                  notes: notes ? (lead.notes ? `${lead.notes}\n${notes}` : notes) : lead.notes
              };
              
              await Backend.saveLead(updatedLead);
              updates.push(updatedLead);
              advisorLoad[targetAdvisorId] = (advisorLoad[targetAdvisorId] || 0) + 1;
              
              const advisorName = allUsers.find(u => u.id === targetAdvisorId)?.name;
              pushNotification('Lead Assigned', `${lead.name} assigned to ${advisorName}`, 'success');
          }
      }

      if (updates.length > 0) {
          setLeads(prev => prev.map(l => {
              const updated = updates.find(u => u.id === l.id);
              return updated || l;
          }));
      }
  }, [leads, allUsers, pushNotification]);

  return (
    <DataContext.Provider value={{
      user, allUsers, leads, clients, metrics: { totalRevenue: 0, activeClients: 0, pendingLeads: 0, monthlyPerformance: [], totalCommission: 0 },
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
