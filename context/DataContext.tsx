
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Lead, Client, DashboardMetrics, ProductType, LeadStatus, User, UserRole, Notification, CalendarEvent, ChatMessage, AdvisorCategory, CompanySettings, Resource, Carrier, AdvisorAssignment, Testimonial, Application, ApplicationStatus, IntegrationConfig, IntegrationLog, LoanApplication, Colleague, PropertyListing, EscrowTransaction, ClientPortfolio, ComplianceDocument, AdvisoryFee, JobApplication } from '../types';
import { Backend } from '../services/apiBackend';

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

  login: (email: string) => void;
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
  completeOnboarding: () => void;
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
  { id: '2', name: 'John Insurance', email: 'insurance@nhfg.com', role: UserRole.ADVISOR, category: AdvisorCategory.INSURANCE, productsSold: [ProductType.LIFE, ProductType.ANNUITY], micrositeEnabled: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', onboardingCompleted: true },
  { id: '3', name: 'Sarah RealEstate', email: 'realestate@nhfg.com', role: UserRole.ADVISOR, category: AdvisorCategory.REAL_ESTATE, productsSold: [ProductType.REAL_ESTATE], micrositeEnabled: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', onboardingCompleted: true },
  { id: '4', name: 'Mike Mortgage', email: 'mortgage@nhfg.com', role: UserRole.ADVISOR, category: AdvisorCategory.MORTGAGE, productsSold: [ProductType.MORTGAGE], micrositeEnabled: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', onboardingCompleted: true },
  { id: '5', name: 'Emily Securities', email: 'securities@nhfg.com', role: UserRole.ADVISOR, category: AdvisorCategory.SECURITIES, productsSold: [ProductType.SECURITIES, ProductType.INVESTMENT], micrositeEnabled: true, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', onboardingCompleted: true },
  { id: '6', name: 'Kevin Manager', email: 'manager@nhfg.com', role: UserRole.MANAGER, category: AdvisorCategory.ADMIN, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200', onboardingCompleted: true },
  { id: '7', name: 'Alex SubAdmin', email: 'subadmin@nhfg.com', role: UserRole.SUB_ADMIN, category: AdvisorCategory.ADMIN, avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200', onboardingCompleted: true },
  { id: '8', name: 'New Advisor', email: 'newbie@nhfg.com', role: UserRole.ADVISOR, category: AdvisorCategory.INSURANCE, productsSold: [ProductType.LIFE], micrositeEnabled: true, avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=200', onboardingCompleted: false },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
  
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
      phone: '(800) 555-0199', email: 'contact@newholland.com', address: '123 Finance Way', city: 'New York', state: 'NY', zip: '10001',
      heroBackgroundType: 'image', heroBackgroundUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070',
      heroTitle: 'Securing Your Future', heroSubtitle: 'Comprehensive financial solutions for every stage of life.',
      termsOfUse: 'Default Terms...', solicitorAgreement: 'Default Agreement...'
  });

  // REAL-TIME NOTIFICATION ENGINE
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
    
    // Play alert sound logic could go here if requested
    console.log(`[ACTIVITY LOG]: ${title} - ${message}`);
  }, []);

  // LEAD MAINTENANCE (15 DAYS)
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
      isArchived: false
    };

    await Backend.saveLead(newLead);
    setLeads(prev => [newLead, ...prev]);
    pushNotification(
        'New Lead Received', 
        `Inquiry from ${newLead.name} regarding ${newLead.interest}.`, 
        'success', 
        'lead', 
        newLead.id
    );
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

  const addEvent = useCallback((event: Partial<CalendarEvent>) => {
    const newEv = { ...event, id: crypto.randomUUID() } as CalendarEvent;
    setEvents(prev => [...prev, newEv]);
    pushNotification('Calendar Entry', `New ${newEv.type}: ${newEv.title} scheduled.`, 'info', 'event', newEv.id);
  }, [pushNotification]);

  const deleteEvent = useCallback((id: string) => {
    const ev = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    if (ev) pushNotification('Calendar Update', `Event "${ev.title}" has been removed.`, 'warning');
  }, [events, pushNotification]);

  const submitJobApplication = useCallback((data: any) => {
    const newApp: JobApplication = { ...data, id: crypto.randomUUID(), date: new Date().toISOString(), status: 'Pending' };
    setJobApplications(prev => [newApp, ...prev]);
    pushNotification('Job Application', `New application from ${newApp.fullName}.`, 'success', 'job_application', newApp.id);
  }, [pushNotification]);

  const login = (email: string) => {
      const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setUser(found);
        pushNotification('Security Alert', `Login detected for account: ${found.email}.`, 'info');
      } else {
        const fallback = { id: crypto.randomUUID(), name: 'Guest Access', email, role: UserRole.ADVISOR, category: AdvisorCategory.INSURANCE };
        setUser(fallback);
      }
  };

  const logout = () => {
    if (user) pushNotification('Security Alert', `Logout successful for ${user.email}.`, 'info');
    setUser(null);
  };

  const updateUser = async (id: string, data: any) => { 
      const u = allUsers.find(x => x.id === id); 
      if(u) { 
          const n = {...u, ...data}; 
          await Backend.saveUser(n); 
          setAllUsers(p => p.map(i => i.id === id ? n : i)); 
          pushNotification('System Update', `Profile for ${n.name} has been modified.`, 'info');
      } 
  };

  return (
    <DataContext.Provider value={{
      user, allUsers, leads: leads.filter(l => !l.isArchived), clients, metrics: { totalRevenue: 1250000, activeClients: 450, pendingLeads: 24, monthlyPerformance: [], totalCommission: 85000 },
      notifications, chatMessages: [], companySettings, resources: [], login, logout, addLead, 
      updateLeadStatus: (id, status, analysis) => updateLead(id, { status, aiAnalysis: analysis }), 
      updateLead,
      assignLeads: () => {}, updateClient: () => {}, updateUser, updateCompanySettings: () => {}, 
      markNotificationRead: (id) => setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n)),
      clearNotifications: () => setNotifications([]),
      completeOnboarding: () => { if(user) { updateUser(user.id, {onboardingCompleted: true}); pushNotification('Onboarding Complete', 'Advisor has accessed the main terminal.', 'success'); } },
      integrationConfig: { googleAds: { enabled: true, webhookUrl: '', developerToken: '' }, metaAds: { enabled: true, verifyToken: '', accessToken: '' }, tiktokAds: { enabled: true, webhookUrl: '', accessToken: '' }, linkedinAds: { enabled: true, pollingInterval: 5, accessToken: '' } },
      updateIntegrationConfig: () => {}, integrationLogs: [], simulateMarketingLead: () => {},
      getAdvisorAssignments: () => [], likeResource: () => {}, dislikeResource: () => {}, shareResource: () => {}, addResourceComment: () => {}, addResource: () => {}, deleteResource: () => {},
      addTestimonial: () => {}, approveTestimonial: () => {}, deleteTestimonial: () => {}, submitTestimonialEdit: () => {}, approveTestimonialEdit: () => {}, rejectTestimonialEdit: () => {},
      addCallback: () => {}, handleAdvisorLeadAction: () => {},
      commissions: [], events, addEvent,
      updateEvent: (e) => { setEvents(prev => prev.map(ev => ev.id === e.id ? {...ev, ...e} : ev)); pushNotification('Calendar Update', `Entry "${e.title}" modified.`, 'info'); },
      deleteEvent,
      addAdvisor: (data) => { const n = {...data, id: crypto.randomUUID(), role: UserRole.ADVISOR} as User; setAllUsers(prev => [...prev, n]); pushNotification('User Provisioning', `New advisor account created for ${n.name}.`, 'success'); },
      deleteAdvisor: (id) => { setAllUsers(prev => prev.map(u => u.id === id ? {...u, deletedAt: new Date().toISOString()} : u)); pushNotification('Security Update', 'Advisor account deactivated.', 'warning'); },
      restoreUser: (id) => setAllUsers(prev => prev.map(u => u.id === id ? {...u, deletedAt: undefined} : u)),
      permanentlyDeleteUser: (id) => setAllUsers(prev => prev.filter(u => u.id !== id)),
      testimonials, availableCarriers: [], assignCarriers: () => {}, colleagues: [], markChatRead: () => {},
      editChatMessage: () => {}, deleteChatMessage: () => {}, sendChatMessage: () => {}, submitJobApplication,
      jobApplications, updateJobApplicationStatus: () => {}, applications, 
      updateApplicationStatus: (id, status) => { setApplications(prev => prev.map(a => a.id === id ? {...a, status} : a)); pushNotification('Policy Gateway', `Policy status updated to ${status}.`, 'info'); },
      properties, transactions, 
      // FIX: Corrected state update typing and ensured status is assignable to union type
      updateTransactionStatus: (id, status, stage) => { 
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, status, stage: stage || t.stage } : t)); 
        pushNotification('Real Estate Hub', `Transaction status changed to ${status}.`, 'success'); 
      },
      portfolios, addPortfolio: () => {},
      updatePortfolio: () => {}, deletePortfolio: () => {}, complianceDocs, addComplianceDoc: () => {},
      advisoryFees, updateFeeStatus: () => {}, addAdvisoryFee: () => {}, updateAdvisoryFee: () => {},
      deleteAdvisoryFee: () => {}, loanApplications, addLoanApplication: () => {}, updateLoanApplication: () => {},
      deleteLoanApplication: () => {},
    }}>
      {children}
    </DataContext.Provider>
  );
};
