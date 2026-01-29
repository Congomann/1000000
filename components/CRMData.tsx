import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  Inbox, 
  Shield, 
  FileText, 
  LineChart, 
  Database, 
  Calendar, 
  MessageCircle, 
  CircleUser, 
  LogOut, 
  Bell, 
  Users,
  Settings,
  ShieldCheck,
  Award,
  PenTool,
  Webhook,
  ClipboardCheck,
  Building2,
  Key,
  TrendingUp,
  FileCheck,
  BadgeDollarSign,
  Calculator,
  Percent,
  Puzzle,
  Zap,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Scale,
  Sparkles,
  Smartphone,
  Landmark
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { UserRole, AdvisorCategory, ProductType } from '../types';

/**
 * EXHAUSTIVE TOUR DEFINITION
 * Covers all 16 requested modules.
 */
const ADMIN_TOUR_STEPS = [
  { id: 'nav-dashboard', title: 'Dashboard', text: 'Overview of system-wide KPIs and health.', targetId: 'nav-dashboard', path: '/crm/dashboard' },
  { id: 'nav-automation', title: 'Automation Studio', text: 'Configure neural-chain logic for lead follow-ups.', targetId: 'nav-automation', path: '/crm/automation' },
  { id: 'nav-integrations', title: 'API Ecosystem', text: 'Manage 3rd-party tool connections like Slack or DocuSign.', targetId: 'nav-integrations', path: '/crm/integrations' },
  { id: 'nav-leads', title: 'Leads DB', text: 'Central repository for all incoming prospect data.', targetId: 'nav-leads', path: '/crm/leads' },
  { id: 'nav-calendar', title: 'Calendar', text: 'Coordinate organization-wide meetings and events.', targetId: 'nav-calendar', path: '/crm/calendar' },
  { id: 'nav-chat', title: 'Team Chat', text: 'Encrypted real-time messaging for internal collaboration.', targetId: 'nav-chat', path: '/crm/chat' },
  { id: 'nav-legal', title: 'Legal & Compliance', text: 'Corporate policies and signed solicitor agreements.', targetId: 'nav-legal', path: '/crm/legal' },
  { id: 'nav-profile', title: 'Profile', text: 'Manage your bio and public microsite presence.', targetId: 'nav-profile', path: '/crm/profile' },
  
  // ADMINISTRATION SECTION
  { id: 'nav-user-terminal', title: 'Administration / User Terminal', text: 'The master switch for user permissions and advisor management.', targetId: 'nav-user-terminal', path: '/crm/admin' },
  { id: 'nav-onboarding', title: 'Onboarding Feed', text: 'Review and approve new advisor applications.', targetId: 'nav-onboarding', path: '/crm/onboarding' },
  { id: 'nav-site-config', title: 'Site Config', text: 'CMS controls for the public-facing corporate website.', targetId: 'nav-site-config', path: '/crm/admin/website' },
  { id: 'nav-carrier-setup', title: 'Carrier Setup', text: 'Provision specific insurance carriers to advisor tiers.', targetId: 'nav-carrier-setup', path: '/crm/admin/carriers' },
  { id: 'nav-client-reviews', title: 'Client Reviews', text: 'Moderate and approve testimonials before they go live.', targetId: 'nav-client-reviews', path: '/crm/admin/testimonials' },
  { id: 'nav-email-signature', title: 'Email Signature', text: 'Generate branded HTML signatures for the whole group.', targetId: 'nav-email-signature', path: '/crm/admin/signature' },
  { id: 'nav-api-integrations', title: 'API Integrations', text: 'Trace raw webhook data from Google and Meta Ads.', targetId: 'nav-api-integrations', path: '/crm/admin/marketing' }
];

interface CRMLayoutProps {
  children: React.ReactNode;
}

export const CRMLayout: React.FC<CRMLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, notifications } = useData();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // --- TOUR STATE ---
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const unreadNotifs = notifications.filter(n => !n.read).length;
  
  // ADMIN PERMISSIONS: Updated to exclude SUB_ADMIN as per user request to lock the section to main admins only
  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER;

  // Filter tour steps based on user visibility
  const currentTourSteps = useMemo(() => {
    return isAdmin ? ADMIN_TOUR_STEPS : ADMIN_TOUR_STEPS.filter(step => !step.id.includes('admin') && !['nav-user-terminal', 'nav-onboarding', 'nav-carrier-setup', 'nav-site-config', 'nav-client-reviews', 'nav-email-signature', 'nav-api-integrations'].includes(step.id));
  }, [isAdmin]);

  const currentStep = currentTourSteps[currentStepIndex];

  // --- AUTO-SCROLL LOGIC ---
  useEffect(() => {
    if (isTourActive && currentStep?.targetId) {
      const timer = setTimeout(() => {
          const element = document.getElementById(currentStep.targetId);
          if (element && sidebarRef.current) {
              const elementRect = element.getBoundingClientRect();
              const sidebarRect = sidebarRef.current.getBoundingClientRect();
              
              // Only scroll if it's not clearly visible
              if (elementRect.top < sidebarRect.top || elementRect.bottom > sidebarRect.bottom) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
          }
      }, 200); 
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, isTourActive, currentStep?.targetId]);

  const handleLogout = () => { logout(); navigate('/'); };

  const startTour = () => {
    setIsTourActive(true);
    setCurrentStepIndex(0);
    navigate(currentTourSteps[0].path);
  };

  const handleNext = () => {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < currentTourSteps.length) {
          setCurrentStepIndex(nextIndex);
          navigate(currentTourSteps[nextIndex].path);
      } else {
          setIsTourActive(false);
      }
  };

  const handlePrev = () => {
      const prevIndex = currentStepIndex - 1;
      if (prevIndex >= 0) {
          setCurrentStepIndex(prevIndex);
          navigate(currentTourSteps[prevIndex].path);
      }
  };

  // --- NAVIGATION LOGIC ---
  const navStructure = useMemo(() => {
    if (!user) return { main: [], vertical: [], admin: [] };

    const main = [
      { path: '/crm/dashboard', label: 'Dashboard', icon: LayoutGrid, tourId: 'nav-dashboard' },
      { path: '/crm/automation', label: 'Automation Studio', icon: Zap, tourId: 'nav-automation' },
      { path: '/crm/integrations', label: 'API Ecosystem', icon: Puzzle, tourId: 'nav-integrations' },
      { path: '/crm/leads', label: 'Leads DB', icon: Database, tourId: 'nav-leads' },
      { path: '/crm/calendar', label: 'Calendar', icon: Calendar, tourId: 'nav-calendar' },
      { path: '/crm/chat', label: 'Team Chat', icon: MessageCircle, tourId: 'nav-chat' },
    ];

    const vertical = [];
    const products = user.productsSold || [];
    
    // STRICT INSURANCE FEATURES
    if (user.category === AdvisorCategory.INSURANCE || products.includes(ProductType.LIFE)) {
        vertical.push({ path: '/crm/applications', label: 'Policies & Apps', icon: FileText });
        vertical.push({ path: '/crm/commissions', label: 'Commissions', icon: LineChart });
    }

    // STRICT REAL ESTATE FEATURES
    if (user.category === AdvisorCategory.REAL_ESTATE || products.includes(ProductType.REAL_ESTATE)) {
        vertical.push({ path: '/crm/properties', label: 'Property Pipeline', icon: Building2 });
        vertical.push({ path: '/crm/escrow', label: 'Transactions & Escrow', icon: Key });
    }

    // STRICT MORTGAGE FEATURES
    if (user.category === AdvisorCategory.MORTGAGE || products.includes(ProductType.MORTGAGE)) {
        vertical.push({ path: '/crm/loans', label: 'Loan Applications', icon: FileText });
        vertical.push({ path: '/crm/rates', label: 'Rate Tools', icon: Percent });
        vertical.push({ path: '/crm/refi-calc', label: 'Refinance Calc', icon: Calculator });
    }

    // STRICT SECURITIES FEATURES
    if (user.category === AdvisorCategory.SECURITIES || products.includes(ProductType.SECURITIES)) {
        vertical.push({ path: '/crm/portfolio', label: 'Portfolio Mgmt', icon: TrendingUp });
        vertical.push({ path: '/crm/compliance', label: 'Compliance Vault', icon: FileCheck });
        vertical.push({ path: '/crm/fees', label: 'Advisory Billing', icon: BadgeDollarSign });
    }

    const shared = [
      { path: '/crm/legal', label: 'Legal & Compliance', icon: Scale, tourId: 'nav-legal' },
      { path: '/crm/profile', label: 'Profile', icon: CircleUser, tourId: 'nav-profile' },
    ];

    const admin = isAdmin ? [
        { path: '/crm/admin', label: 'User Terminal', icon: Users, tourId: 'nav-user-terminal' },
        { path: '/crm/onboarding', label: 'Onboarding Feed', icon: ClipboardCheck, tourId: 'nav-onboarding' },
        { path: '/crm/admin/website', label: 'Site Config', icon: Settings, tourId: 'nav-site-config' },
        { path: '/crm/admin/carriers', label: 'Carrier Setup', icon: ShieldCheck, tourId: 'nav-carrier-setup' },
        { path: '/crm/admin/testimonials', label: 'Client Reviews', icon: Award, tourId: 'nav-client-reviews' },
        { path: '/crm/admin/signature', label: 'Email Signature', icon: PenTool, tourId: 'nav-email-signature' },
        { path: '/crm/admin/marketing', label: 'API Integrations', icon: Webhook, tourId: 'nav-api-integrations' },
    ] : [];

    return { main, vertical, shared, admin };
  }, [user, isAdmin]);

  const renderNavLink = (item: any) => {
    const isActive = location.pathname === item.path || (item.path !== '/crm/dashboard' && location.pathname.startsWith(item.path));
    const isHighlighted = isTourActive && currentStep?.targetId === item.tourId;

    return (
        <Link 
            key={item.path}
            to={item.path} 
            id={item.tourId}
            className={`flex items-center gap-4 px-5 py-3 text-sm font-bold rounded-2xl transition-all duration-300 group relative ${
                isActive 
                ? 'bg-[#3B82F6] text-white shadow-md' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            } ${isHighlighted ? 'z-[70] ring-4 ring-blue-500 bg-blue-600 text-white shadow-[0_0_50px_rgba(59,130,246,0.8)] scale-105' : ''}`}
        >
            <item.icon className={`h-5 w-5 transition-colors ${isActive || isHighlighted ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} strokeWidth={2.5} /> 
            <span className="tracking-tight">{item.label}</span>
            {isHighlighted && <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full animate-ping"></span>}
        </Link>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-0 sm:p-4 font-sans text-slate-900 overflow-hidden bg-slate-100">
      
      {isTourActive && currentStep && (
          <>
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] z-[60] animate-fade-in" onClick={() => setIsTourActive(false)} />
            <div className="fixed bottom-10 right-10 w-[420px] bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] z-[100] border border-slate-200 animate-slide-up overflow-hidden">
                <div className="bg-[#0B2240] p-8 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles size={100} /></div>
                    <div className="flex justify-between items-start relative z-10">
                        <h4 className="font-black text-2xl tracking-tighter leading-none mb-2">{currentStep.title}</h4>
                        <button onClick={() => setIsTourActive(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
                    </div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] relative z-10">System Walkthrough</p>
                </div>
                
                <div className="p-10">
                    <p className="text-slate-600 font-medium leading-relaxed mb-10 text-lg">{currentStep.text}</p>
                    <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                        <span className="text-xl font-black text-[#0B2240]">{currentStepIndex + 1} <span className="text-slate-300">/ {currentTourSteps.length}</span></span>
                        <div className="flex gap-3">
                            {currentStepIndex > 0 && (
                                <button onClick={handlePrev} className="p-4 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"><ChevronLeft size={20}/></button>
                            )}
                            <button onClick={handleNext} className="bg-[#3B82F6] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-blue-500/20 transition-all">
                                {currentStepIndex === currentTourSteps.length - 1 ? 'Finish' : 'Next Step'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </>
      )}

      <div className="w-full h-full max-w-[1920px] bg-white sm:rounded-[2.5rem] shadow-2xl flex relative overflow-hidden ring-1 ring-black/5">
        <aside ref={sidebarRef} className={`hidden lg:flex flex-col w-72 bg-[#1B222E] text-white h-full overflow-y-auto py-10 flex-shrink-0 no-scrollbar border-r border-white/5 relative ${isTourActive ? 'z-[65]' : 'z-10'}`}>
            <div className="px-8 mb-12 flex items-center gap-4">
                <div className="relative w-12 h-12 flex-shrink-0">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <rect x="5" y="15" width="90" height="60" rx="12" fill="#F59E0B" />
                        <rect x="10" y="35" width="80" height="55" rx="12" fill="#FCD34D" />
                        <rect x="42" y="52" width="16" height="22" rx="4" fill="#B45309" fillOpacity="0.25" />
                    </svg>
                </div>
                <div>
                    <h1 className="font-black text-xl leading-none tracking-tight text-white uppercase">New Holland</h1>
                    <p className="text-[0.6rem] text-slate-400 uppercase tracking-[0.2em] mt-1.5 font-black">Financial Group</p>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-8">
                <div className="space-y-1">{navStructure.main.map(renderNavLink)}</div>

                {navStructure.vertical.length > 0 && (
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-5 mb-4">Vertical Tools</h3>
                        {navStructure.vertical.map(renderNavLink)}
                    </div>
                )}

                <div className="space-y-1">{navStructure.shared.map(renderNavLink)}</div>

                {navStructure.admin.length > 0 && (
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-5 mb-4">Administration</h3>
                        {navStructure.admin.map(renderNavLink)}
                    </div>
                )}
            </nav>

            <div className="px-4 mt-8 pt-6 border-t border-white/5">
                <button onClick={handleLogout} className="flex items-center gap-4 px-5 py-4 text-sm font-black text-[#FF6B6B] hover:bg-red-500/10 rounded-2xl w-full transition-all uppercase tracking-widest">
                    <LogOut className="h-5 w-5" strokeWidth={2.5} /> Sign Out
                </button>
            </div>
        </aside>

        <div className="flex-1 h-full flex flex-col overflow-hidden bg-slate-50/30">
            <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between z-20">
                <div className="flex items-center gap-6">
                    <h2 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">Terminal Console</h2>
                </div>
                <div className="flex items-center gap-8">
                    <button onClick={startTour} className="flex items-center gap-3 px-6 py-3 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-full text-[10px] font-black text-slate-600 transition-all uppercase tracking-[0.2em] shadow-sm active:scale-95 group border border-slate-100">
                        <HelpCircle size={16} className="text-blue-500 group-hover:text-white transition-colors" /> Start Tour
                    </button>
                    <div className="flex items-center gap-4 pl-8 border-l border-slate-100">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-slate-900">{user?.name}</p>
                            <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">{user?.role}</p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-md">
                             {user?.avatar ? <img src={user.avatar} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center font-black text-slate-400">{user?.name[0]}</div>}
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar relative">{children}</main>
        </div>
      </div>
    </div>
  );
};