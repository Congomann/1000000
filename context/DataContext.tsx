
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Lead, Client, DashboardMetrics, ProductType, LeadStatus, User, UserRole, Notification, CalendarEvent, ChatMessage, AdvisorCategory, CompanySettings, Resource, Carrier, AdvisorAssignment, Testimonial, Application, ApplicationStatus, IntegrationConfig, IntegrationLog, LoanApplication, Colleague, PropertyListing, EscrowTransaction, ClientPortfolio, ComplianceDocument, AdvisoryFee, JobApplication, Workflow, WorkflowTrigger, AI_ASSISTANT_ID, Task, TaskPriority } from '../types';
import { Backend } from '../services/apiBackend';
import { generateStrategicBrief, generateSmartReminder, getInternalAssistantResponse, enrichLeadContext } from '../services/geminiService';
import { socketService } from '../services/socketService';

interface AutomationMetrics {
  executions: number;
  bandwidthSaved: number; // in minutes
}

interface ProcessingState {
  leadId: string;
  activeNode: string; // 'AI BRIEF' | 'GENERATE REMINDER' | 'DRAFT SMS' | null
}

interface DataContextType {
  user: User | null;
  allUsers: User[];
  leads: Lead[];
  clients: Client[];
  tasks: Task[];
  metrics: DashboardMetrics;
  automationMetrics: AutomationMetrics;
  notifications: Notification[];
  chatMessages: ChatMessage[] ;
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
  workflows: Workflow[];
  processingLeads: ProcessingState[];

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

  addWorkflow: (workflow: Partial<Workflow>) => void;
  toggleWorkflow: (id: string) => void;
  reAnalyzeLead: (leadId: string) => Promise<void>;

  addTask: (task: Omit<Task, 'id' | 'order'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (sourceIndex: number, targetIndex: number) => void;
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
  { id: '4', name: 'David Insurance', email: 'insurance@nhfg.com', phone: '(555) 123-4567', role: UserRole.ADVISOR, category: AdvisorCategory.INSURANCE, productsSold: [ProductType.LIFE, ProductType.IUL, ProductType.ANNUITY], onboardingCompleted: true, micrositeEnabled: true },
  { id: AI_ASSISTANT_ID, name: 'Gemini Logic Hub', email: 'intelligence@nhfg.com', role: UserRole.SUB_ADMIN, category: AdvisorCategory.ADMIN, avatar: 'https://img.icons8.com/color/512/google-gemini.png', onboardingCompleted: true }
];

const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Call Smith regarding IUL proposal', priority: TaskPriority.HIGH, completed: false, order: 0, advisorId: '1' },
  { id: 't2', title: 'Verify property appraisal at 123 Main St', priority: TaskPriority.MEDIUM, completed: false, order: 1, advisorId: '1' },
  { id: 't3', title: 'Email signature approval for Sarah', priority: TaskPriority.LOW, completed: false, order: 2, advisorId: '1' },
  { id: 't4', title: 'Compliance audit: Q1 Disclosures', priority: TaskPriority.HIGH, completed: false, order: 3, advisorId: '1' },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);
  const [portfolios, setPortfolios] = useState<ClientPortfolio[]>([]);
  const [complianceDocs, setComplianceDocs] = useState<ComplianceDocument[]>([]);
  const [advisoryFees, setAdvisoryFees] = useState<AdvisoryFee[]>([]);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [integrationConfig, setIntegrationConfig] = useState<IntegrationConfig>({ googleAds: { enabled: true, webhookUrl: '', developerToken: '' }, metaAds: { enabled: false, verifyToken: '', accessToken: '' }, tiktokAds: { enabled: false, webhookUrl: '', accessToken: '' }, linkedinAds: { enabled: false, pollingInterval: 300, accessToken: '' } });
  const [integrationLogs, setIntegrationLogs] = useState<IntegrationLog[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [processingLeads, setProcessingLeads] = useState<ProcessingState[]>([]);
  
  const [automationMetrics, setAutomationMetrics] = useState<AutomationMetrics>({
    executions: 2087,
    bandwidthSaved: 521 * 60
  });

  const [companySettings, setCompanySettings] = useState<CompanySettings>({
      phone: '(800) 555-0199', email: 'contact@newholland.com', address: '123 Finance Way', city: 'New York', state: 'NY', zip: '10001',
      heroBackgroundType: 'image', heroBackgroundUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070',
      heroTitle: 'Securing Your Future', heroSubtitle: 'Comprehensive financial solutions for every stage of life.',
      footerDescription: 'Providing tailored insurance solutions that secure financial peace of mind for individuals, families, and businesses.',
      socialLinks: [{ platform: 'Facebook', url: '#' }, { platform: 'LinkedIn', url: '#' }, { platform: 'X', url: '#' }, { platform: 'Instagram', url: '#' }, { platform: 'YouTube', url: '#' }, { platform: 'TikTok', url: '#' }],
      termsOfUse: '', solicitorAgreement: '', heroVideoPlaylist: []
  });

  const pushNotification = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert' = 'info', resourceType?: any, relatedId?: string) => {
    const newNotif: Notification = { id: crypto.randomUUID(), title, message, type, timestamp: new Date(), read: false, resourceType, relatedId };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const triggerAutomation = useCallback(async (lead: Lead) => {
    pushNotification('Neural Hub Triggered', `Workflow: Neural Intake Logic active for ${lead.name}`, 'info');
    setProcessingLeads(prev => [...prev, { leadId: lead.id, activeNode: 'AI BRIEF' }]);
    
    const contextBrief = await enrichLeadContext(lead);
    const existingNotes = lead.notes || '';
    updateLead(lead.id, { notes: `${existingNotes}\n\n[AI INTEREST ANALYSIS]:\n${contextBrief}` });

    setTimeout(async () => {
      const brief = await generateStrategicBrief(lead);
      updateLead(lead.id, { aiAnalysis: brief });
      pushNotification('Neural Path: Brief', `Gemini completed strategic mapping for ${lead.name}`, 'success');
      setProcessingLeads(prev => prev.map(p => p.leadId === lead.id ? { ...p, activeNode: 'GENERATE REMINDER' } : p));

      setTimeout(async () => {
        const reminderData = await generateSmartReminder(lead);
        const newEvent: CalendarEvent = { id: crypto.randomUUID(), title: reminderData.title!, description: reminderData.description, date: reminderData.date!, time: reminderData.time!, type: 'reminder', creatorId: AI_ASSISTANT_ID, creatorName: 'NHFG Intelligence' };
        setEvents(prev => [...prev, newEvent]);
        pushNotification('Neural Path: Reminder', `Follow-up event added to your calendar for ${reminderData.date}`, 'info');
        setProcessingLeads(prev => prev.map(p => p.leadId === lead.id ? { ...p, activeNode: 'DRAFT SMS' } : p));

        setTimeout(() => {
          setProcessingLeads(prev => prev.filter(p => p.leadId !== lead.id));
          setAutomationMetrics(prev => {
            const next = { executions: prev.executions + 1, bandwidthSaved: prev.bandwidthSaved + 25 };
            localStorage.setItem('nhfg_automation_metrics', JSON.stringify(next));
            return next;
          });
        }, 1500);
      }, 1500);
    }, 2000);
  }, [pushNotification]);

  const addLead = useCallback(async (leadData: Partial<Lead>, assignTo?: string) => {
    const newLead: Lead = {
      id: crypto.randomUUID(),
      name: leadData.name || 'Website Inquiry',
      email: leadData.email || 'Not Provided',
      phone: leadData.phone || 'N/A',
      interest: leadData.interest || ProductType.LIFE,
      message: leadData.message || '',
      date: new Date().toISOString(),
      status: assignTo ? LeadStatus.ASSIGNED : LeadStatus.NEW,
      score: 85,
      qualification: 'Hot',
      source: leadData.source || 'Website',
      assignedTo: assignTo,
      notes: leadData.notes || '',
      isArchived: false,
      priority: 'Low',
      ...leadData,
    };
    await Backend.saveLead(newLead);
    setLeads(prev => [newLead, ...prev]);
    pushNotification('New Lead Received', `Inquiry from ${newLead.name}.`, 'success', 'lead', newLead.id);
    triggerAutomation(newLead);
  }, [pushNotification, triggerAutomation]);

  const updateLead = useCallback(async (id: string, data: Partial<Lead>) => {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
      const found = leads.find(l => l.id === id);
      if (found) await Backend.saveLead({ ...found, ...data });
  }, [leads]);

  // --- Task Operations ---
  const addTask = (taskData: Omit<Task, 'id' | 'order'>) => {
    const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        order: tasks.length,
    };
    setTasks(prev => [...prev, newTask]);
    pushNotification('Task Created', newTask.title, 'success');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const reorderTasks = (sourceIndex: number, targetIndex: number) => {
    setTasks(prev => {
        const sorted = [...prev].sort((a, b) => a.order - b.order);
        const [removed] = sorted.splice(sourceIndex, 1);
        sorted.splice(targetIndex, 0, removed);
        return sorted.map((item, index) => ({ ...item, order: index }));
    });
  };

  useEffect(() => {
    if (user) {
        socketService.connect();
        const unsubscribe = socketService.subscribe((data) => {
            if (data.type === 'NEW_LEAD') {
                pushNotification('New Lead Ingested', `New lead received from ${data.payload.source}`, 'success', 'lead', data.payload.id);
                Backend.getLeads().then(setLeads);
            } else if (data.type === 'CHAT_MESSAGE') {
                setChatMessages(prev => [...prev, data.payload]);
            }
        });
        return () => { unsubscribe(); socketService.disconnect(); };
    }
  }, [user, pushNotification]);

  useEffect(() => {
    const bootstrap = async () => {
      const [storedLeads, storedUsers, storedClients, storedSettings, storedWorkflows] = await Promise.all([
        Backend.getLeads(), Backend.getUsers(), Backend.getClients(), Backend.getSettings(), Backend.getWorkflows()
      ]);
      setAllUsers(storedUsers.length > 0 ? [...INITIAL_USERS, ...storedUsers.filter(u => u.id !== AI_ASSISTANT_ID && !INITIAL_USERS.find(iu => iu.id === u.id))] : INITIAL_USERS);
      setLeads(storedLeads);
      setClients(storedClients);
      if (storedSettings) setCompanySettings(storedSettings);
      if (storedWorkflows && storedWorkflows.length > 0) setWorkflows(storedWorkflows);
      const storedMetrics = localStorage.getItem('nhfg_automation_metrics');
      if (storedMetrics) setAutomationMetrics(JSON.parse(storedMetrics));
      
      const storedTasks = localStorage.getItem('nhfg_tasks');
      if (storedTasks) setTasks(JSON.parse(storedTasks));

      const storedTestimonials = localStorage.getItem('nhfg_testimonials');
      if (storedTestimonials) setTestimonials(JSON.parse(storedTestimonials));
    };
    bootstrap();
  }, []);

  useEffect(() => {
    localStorage.setItem('nhfg_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('nhfg_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  const reAnalyzeLead = async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      pushNotification('AI Intelligence', 'Running deep strategic re-analysis...', 'info');
      const brief = await generateStrategicBrief(lead);
      updateLead(leadId, { aiAnalysis: brief });
      pushNotification('AI Intelligence', 'Strategic brief updated successfully.', 'success');
    }
  };

  const updateLeadStatus = useCallback((id: string, status: LeadStatus, analysis?: string) => { updateLead(id, { status, aiAnalysis: analysis }); }, [updateLead]);
  const login = async (email: string, password?: string) => {
      const apiUser = await Backend.login(email, password);
      if (apiUser) { setUser(apiUser); return true; }
      const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) { setUser(found); return true; }
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
  
  const addTestimonial = (testimonial: Omit<Testimonial, 'id' | 'status' | 'date'>) => {
    setTestimonials(prev => [...prev, { ...testimonial, id: crypto.randomUUID(), status: 'pending', date: new Date().toISOString() } as Testimonial]);
  };
  const approveTestimonial = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t));
  };
  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };
  const submitTestimonialEdit = (id: string, edits: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { 
        ...t, 
        status: 'pending_edit',
        editedClientName: edits.clientName,
        editedRating: edits.rating,
        editedReviewText: edits.reviewText
    } : t));
  };
  const approveTestimonialEdit = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { 
        ...t, 
        status: 'approved',
        clientName: t.editedClientName || t.clientName,
        rating: t.editedRating || t.rating,
        reviewText: t.editedReviewText || t.reviewText,
        editedClientName: undefined,
        editedRating: undefined,
        editedReviewText: undefined
    } : t));
  };
  const rejectTestimonialEdit = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { 
        ...t, 
        status: 'approved',
        editedClientName: undefined,
        editedRating: undefined,
        editedReviewText: undefined
    } : t));
  };

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
  const markChatRead = (id: string) => {
    setChatMessages(prev => prev.map(m => (m.senderId === id || m.receiverId === id) ? { ...m, read: true } : m));
  };
  const editChatMessage = (id: string, text: string) => {
    setChatMessages(prev => prev.map(m => m.id === id ? { ...m, text, isEdited: true } : m));
  };
  const deleteChatMessage = (id: string) => {
    setChatMessages(prev => prev.filter(m => m.id !== id));
  };

  const sendChatMessage = async (receiverId: string, text: string, attachment?: any) => {
      if (!user) return;
      const newMessage: ChatMessage = { id: crypto.randomUUID(), senderId: user.id, receiverId, text, timestamp: new Date(), read: false, attachment };
      setChatMessages(prev => [...prev, newMessage]);
      socketService.send({ type: 'CHAT_MESSAGE', payload: { ...newMessage, senderName: user.name } });

      if (receiverId === AI_ASSISTANT_ID) {
          const history = chatMessages
            .filter(m => (m.senderId === user.id && m.receiverId === AI_ASSISTANT_ID) || (m.senderId === AI_ASSISTANT_ID && m.receiverId === user.id))
            .slice(-10)
            .map(m => ({ role: m.senderId === user.id ? 'user' as const : 'model' as const, text: m.text }));
          
          const assistantReply = await getInternalAssistantResponse(text, `User Role: ${user.role}, Name: ${user.name}`, history);
          
          const aiMessage: ChatMessage = { id: crypto.randomUUID(), senderId: AI_ASSISTANT_ID, receiverId: user.id, text: assistantReply, timestamp: new Date(), read: false };
          
          setTimeout(() => {
            setChatMessages(prev => [...prev, aiMessage]);
            pushNotification('Intelligence Update', 'New insights available in your Neural Hub.', 'info');
          }, 1000);
      }
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
  const updateApplicationStatus = (id: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };
  const addProperty = (p: any) => {
      const newProp: PropertyListing = { id: crypto.randomUUID(), address: '', city: '', state: '', zip: '', price: 0, type: 'Residential', status: 'Active', listedDate: new Date().toISOString(), sellerName: '', advisorId: user?.id || '', image: '', ...p };
      setProperties(prev => [newProp, ...prev]);
  };
  const updateProperty = (id: string, property: Partial<PropertyListing>) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...property } : p));
  };
  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };
  const updateTransactionStatus = (id: string, status: 'Open' | 'Closed' | 'Cancelled', stage?: EscrowTransaction['stage']) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status, stage: stage || t.stage } : t));
  };
  const addPortfolio = (p: Partial<ClientPortfolio>) => {
    const newP: ClientPortfolio = {
        id: crypto.randomUUID(),
        advisorId: user?.id || '1',
        lastRebalanced: new Date().toISOString(),
        clientName: p.clientName || 'New Portfolio',
        totalValue: p.totalValue || 0,
        ytdReturn: p.ytdReturn || 0,
        riskProfile: p.riskProfile || 'Moderate',
        holdings: p.holdings || [],
        clientId: p.clientId || 'unknown',
        ...p
    };
    setPortfolios(prev => [...prev, newP]);
  };
  const updatePortfolio = (id: string, data: Partial<ClientPortfolio>) => {
    setPortfolios(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };
  const deletePortfolio = (id: string) => {
    setPortfolios(prev => prev.filter(p => p.id !== id));
  };
  const addComplianceDoc = (data: Partial<ComplianceDocument>) => {
    const newDoc: ComplianceDocument = {
        id: crypto.randomUUID(),
        title: data.title || 'Untitled Doc',
        type: data.type || 'KYC',
        uploadDate: new Date().toISOString(),
        status: 'Pending Review',
        url: data.url || '#',
        advisorId: user?.id || '1',
        ...data
    };
    setComplianceDocs(prev => [...prev, newDoc]);
  };
  const updateFeeStatus = (id: string, status: string) => {
    setAdvisoryFees(prev => prev.map(f => f.id === id ? { ...f, status: status as any } : f));
  };
  const addAdvisoryFee = (data: Partial<AdvisoryFee>) => {
    const newFee: AdvisoryFee = {
        id: crypto.randomUUID(),
        advisorId: user?.id || '1',
        clientName: data.clientName || 'Unnamed Client',
        clientId: data.clientId || 'unknown',
        aum: data.aum || 0,
        feeRate: data.feeRate || 0.01,
        billingPeriod: data.billingPeriod || 'Q1',
        amount: data.amount || 0,
        status: data.status || 'Invoiced',
        dueDate: data.dueDate || new Date().toISOString(),
        ...data
    };
    setAdvisoryFees(prev => [...prev, newFee]);
  };
  const updateAdvisoryFee = (id: string, data: Partial<AdvisoryFee>) => {
    setAdvisoryFees(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  };
  const deleteAdvisoryFee = (id: string) => {
    setAdvisoryFees(prev => prev.filter(f => f.id !== id));
  };
  const addLoanApplication = (l: Partial<LoanApplication>) => {
    const newApp: LoanApplication = {
        id: `LOAN-${Math.floor(Math.random() * 10000)}`,
        createdAt: new Date().toISOString(),
        advisorId: user?.id || '1',
        clientName: l.clientName || 'Unnamed Client',
        loanAmount: l.loanAmount || 0,
        loanType: l.loanType || 'Purchase',
        status: 'Applied',
        interestRate: l.interestRate || 6.5,
        propertyValue: l.propertyValue || 0,
        ltv: l.ltv || 80,
        creditScore: l.creditScore || 700,
        ...l
    };
    setLoanApplications(prev => [...prev, newApp]);
  };
  const updateLoanApplication = (id: string, data: Partial<LoanApplication>) => {
    setLoanApplications(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };
  const deleteLoanApplication = (id: string) => {
    setLoanApplications(prev => prev.filter(l => l.id !== id));
  };
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
  const addWorkflow = (wf: Partial<Workflow>) => {
      const newWorkflow: Workflow = { id: `wf-${Math.random().toString(36).substr(2, 9)}`, name: wf.name || 'New Workflow', description: wf.description || 'Custom autonomous neural path.', trigger: wf.trigger || WorkflowTrigger.LEAD_INGESTION, actions: wf.actions || [], status: 'active', impact: wf.impact || 'MEDIUM', category: wf.category || 'OPERATIONS', executionsYTD: 0, createdAt: new Date().toISOString() };
      setWorkflows(prev => [newWorkflow, ...prev]);
      Backend.saveWorkflow(newWorkflow);
      pushNotification('Workflow Deployed', `New logic engine node "${newWorkflow.name}" is now operational.`, 'success');
  };
  const toggleWorkflow = (id: string) => {
      setWorkflows(prev => prev.map(wf => {
          if (wf.id === id) {
              const nextStatus = wf.status === 'active' ? 'paused' : 'active';
              const updated = { ...wf, status: nextStatus as any };
              Backend.saveWorkflow(updated);
              return updated;
          }
          return wf;
      }));
  };

  return (
    <DataContext.Provider value={{
      user, allUsers, leads, clients, tasks, metrics: { totalRevenue: 1250000, activeClients: 450, pendingLeads: 12, monthlyPerformance: [], totalCommission: 85000 },
      automationMetrics, workflows, processingLeads,
      notifications, chatMessages, companySettings, resources: [], commissions: [], events, testimonials,
      availableCarriers: [], colleagues: [], jobApplications, applications, portfolios, complianceDocs, advisoryFees, loanApplications, integrationLogs, integrationConfig,
      login, logout, addLead, updateLeadStatus, updateLead, assignLeads, updateClient, updateUser, updateCompanySettings,
      markNotificationRead, clearNotifications, completeOnboarding, updateIntegrationConfig, simulateMarketingLead,
      getAdvisorAssignments, likeResource, dislikeResource, shareResource, addResourceComment, addResource, deleteResource,
      addTestimonial, approveTestimonial, deleteTestimonial, submitTestimonialEdit, approveTestimonialEdit, rejectTestimonialEdit,
      addCallback, handleAdvisorLeadAction, addEvent, updateEvent, deleteEvent, addAdvisor, deleteAdvisor, restoreUser, permanentlyDeleteUser,
      assignCarriers, markChatRead, editChatMessage, deleteChatMessage, sendChatMessage, submitJobApplication, updateJobApplicationStatus,
      updateApplicationStatus, updateTransactionStatus, addPortfolio, updatePortfolio, deletePortfolio, addComplianceDoc,
      updateFeeStatus, addAdvisoryFee, updateAdvisoryFee, deleteAdvisoryFee, addLoanApplication, updateLoanApplication, deleteLoanApplication,
      addProperty, updateProperty, deleteProperty, addWorkflow, toggleWorkflow, reAnalyzeLead, properties, transactions,
      addTask, toggleTask, deleteTask, reorderTasks
    }}>
      {children}
    </DataContext.Provider>
  );
};
