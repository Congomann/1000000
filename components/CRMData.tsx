
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
  Scale,
  Building2,
  Key,
  TrendingUp,
  FileCheck,
  BadgeDollarSign,
  Landmark,
  Calculator,
  Percent,
  Puzzle,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { UserRole, Notification, AdvisorCategory } from '../types';

/**
 * DEVELOPER NOTE: Terminal Layout Component
 * This wrapper provides the secure side-navigation and top-bar.
 * It dynamically filters navigation links based on AdvisorCategory 
 * (Mortgage vs Real Estate vs Securities).
 */

interface CRMLayoutProps {
  children: React.ReactNode;
}

export const CRMLayout: React.FC<CRMLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, notifications, markNotificationRead, clearNotifications } = useData();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  
  // Tour State
  const [tourStep, setTourStep] = useState<number>(-1);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleNotificationClick = (n: Notification) => {
      markNotificationRead(n.id);
      setIsNotifOpen(false);
      if (n.resourceType === 'lead' && n.relatedId) navigate('/crm/leads');
      else if (n.resourceType === 'event') navigate('/crm/calendar');
  };

  // DEVELOPER NOTE: Logic for dynamic sidebar links
  const mainNavItems = useMemo(() => {
    if (!user) return [];
    const isAdminOrSub = user.role === UserRole.ADMIN || user.role === UserRole.SUB_ADMIN;
    
    const items: any[] = [
        { path: '/crm/dashboard', label: 'Dashboard', icon: LayoutGrid },
    ];

    if (!isAdminOrSub) {
        items.push({ path: '/crm/inbox', label: 'Requests', icon: Inbox });
        items.push({ path: '/crm/clients', label: 'Clients', icon: Shield });

        // Category-Specific Routes
        if (user.category === AdvisorCategory.INSURANCE) {
          items.push({ path: '/crm/applications', label: 'Policies & Apps', icon: FileText });
        }
        if (user.category === AdvisorCategory.REAL_ESTATE) {
          items.push({ path: '/crm/properties', label: 'Property Pipeline', icon: Building2 });
          items.push({ path: '/crm/escrow', label: 'Transactions & Escrow', icon: Key });
        }
        if (user.category === AdvisorCategory.MORTGAGE) {
            items.push({ path: '/crm/loans', label: 'Loan Applications', icon: FileText });
            items.push({ path: '/crm/rates', label: 'Rate Tools', icon: Percent });
            items.push({ path: '/crm/refi-calc', label: 'Refinance Calc', icon: Calculator });
        }
        if (user.category === AdvisorCategory.SECURITIES) {
          items.push({ path: '/crm/portfolio', label: 'Portfolio Mgmt', icon: TrendingUp });
          items.push({ path: '/crm/compliance', label: 'Compliance Vault', icon: FileCheck });
          items.push({ path: '/crm/fees', label: 'Advisory Billing', icon: BadgeDollarSign });
        }
        
        items.push({ path: '/crm/commissions', label: 'Commissions', icon: LineChart });
    }

    items.push({ path: '/crm/automation', label: 'Automation Studio', icon: Zap });
    items.push({ path: '/crm/integrations', label: 'API Ecosystem', icon: Puzzle });
    items.push({ path: '/crm/leads', label: 'Leads DB', icon: Database });
    items.push({ path: '/crm/calendar', label: 'Calendar', icon: Calendar });
    items.push({ path: '/crm/chat', label: 'Team Chat', icon: MessageCircle });
    items.push({ path: '/crm/legal', label: 'Legal & Compliance', icon: Scale });
    items.push({ path: '/crm/profile', label: 'Profile', icon: CircleUser });

    return items;
  }, [user]);

  const adminNavItems = useMemo(() => {
    if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.SUB_ADMIN)) return [];
    
    return [
        { path: '/crm/admin', label: 'User Terminal', icon: Users, id: 'tour-user-terminal' },
        { path: '/crm/onboarding', label: 'Onboarding Feed', icon: ClipboardCheck, id: 'tour-onboarding' },
        { path: '/crm/admin/website', label: 'Site Config', icon: Settings, id: 'tour-site-config' },
        { path: '/crm/admin/carriers', label: 'Carrier Setup', icon: ShieldCheck, id: 'tour-carrier-setup' },
        { path: '/crm/admin/testimonials', label: 'Client Reviews', icon: Award, id: 'tour-client-reviews' },
        { path: '/crm/admin/signature', label: 'Email Signature', icon: PenTool, id: 'tour-email-signature' },
        { path: '/crm/admin/marketing', label: 'API Integrations', icon: Webhook, id: 'tour-api-integrations' },
    ];
  }, [user]);

  // TOUR CONFIGURATION
  const TOUR_STEPS = [
      { id: 'tour-user-terminal', title: 'User Terminal', text: 'Central hub for managing all system users, advisors, and permissions.' },
      { id: 'tour-onboarding', title: 'Onboarding Feed', text: 'Review and approve incoming advisor applications.' },
      { id: 'tour-site-config', title: 'Site Configuration', text: 'Customize global website settings, heroes, and legal disclaimers.' },
      { id: 'tour-carrier-setup', title: 'Carrier Setup', text: 'Manage insurance carriers and assign them to advisors.' },
      { id: 'tour-client-reviews', title: 'Client Reviews', text: 'Moderate and approve client testimonials before they go live.' },
      { id: 'tour-email-signature', title: 'Email Signature', text: 'Generate professional, compliant email signatures for your team.' },
      { id: 'tour-api-integrations', title: 'API Integrations', text: 'Connect external marketing platforms like Google Ads and Meta.' },
  ];

  const startTour = () => setTourStep(0);
  const nextStep = () => setTourStep(prev => (prev + 1 < TOUR_STEPS.length ? prev + 1 : -1));
  const endTour = () => setTourStep(-1);

  const renderNavLink = (item: any) => {
    const isActive = location.pathname === item.path || (item.path !== '/crm/dashboard' && location.pathname.startsWith(item.path));
    
    // Check if this item is currently highlighted in tour
    const isTourActive = tourStep >= 0 && TOUR_STEPS[tourStep]?.id === item.id;

    return (
        <Link 
            key={item.path} 
            to={item.path} 
            className={`flex items-center gap-4 px-5 py-3.5 text-sm font-bold rounded-2xl transition-all duration-200 group relative ${
                isActive 
                ? 'bg-[#3B82F6] text-white shadow-md' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            } ${isTourActive ? 'z-50 ring-2 ring-blue-400 ring-offset-2 ring-offset-[#1B2240] bg-white/10 shadow-[0_0_30px_rgba(59,130,246,0.6)]' : ''}`}
        >
            <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} strokeWidth={2.5} /> 
            <span className="tracking-tight">{item.label}</span>

            {/* TOUR TOOLTIP */}
            {isTourActive && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-6 w-72 bg-blue-600 text-white p-5 rounded-2xl shadow-2xl animate-fade-in cursor-default pointer-events-auto">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 transform rotate-45"></div>
                    <div className="relative z-10">
                        <h4 className="font-black text-lg mb-2">{TOUR_STEPS[tourStep].title}</h4>
                        <p className="text-xs font-medium opacity-90 leading-relaxed mb-4">{TOUR_STEPS[tourStep].text}</p>
                        <div className="flex justify-between items-center border-t border-white/20 pt-3">
                            <span className="text-[10px] font-bold opacity-60">STEP {tourStep + 1}/{TOUR_STEPS.length}</span>
                            <div className="flex gap-3">
                                 <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); endTour(); }} className="text-[10px] font-bold hover:text-blue-200 transition-colors">SKIP</button>
                                 <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextStep(); }} className="bg-white text-blue-600 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 shadow-sm transition-all">
                                    {tourStep === TOUR_STEPS.length - 1 ? 'FINISH' : 'NEXT'}
                                 </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Link>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-0 sm:p-4 font-sans text-slate-900 overflow-hidden bg-slate-100">
      {/* Tour Overlay Backdrop */}
      {tourStep >= 0 && <div className="absolute inset-0 bg-black/60 z-40 animate-fade-in backdrop-blur-sm" onClick={endTour}></div>}

      <div className="w-full h-full max-w-[1920px] bg-white sm:rounded-[2.5rem] shadow-2xl flex relative overflow-hidden ring-1 ring-black/5">
        <aside className="hidden lg:flex flex-col w-72 bg-[#1B222E] text-white h-full overflow-y-auto py-10 z-10 flex-shrink-0 no-scrollbar border-r border-white/5 relative z-50">
            <div className="px-8 mb-12 flex items-center gap-4">
                <div className="relative w-12 h-12 flex-shrink-0">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        {/* Back Card */}
                        <rect x="5" y="15" width="90" height="60" rx="12" fill="#F59E0B" />
                        {/* Front Card */}
                        <rect x="10" y="35" width="80" height="55" rx="12" fill="#FCD34D" />
                        {/* Chip */}
                        <rect x="42" y="52" width="16" height="22" rx="4" fill="#B45309" fillOpacity="0.25" />
                    </svg>
                </div>
                <div>
                    <h1 className="font-black text-xl leading-none tracking-tight text-white uppercase">New Holland</h1>
                    <p className="text-[0.6rem] text-slate-400 uppercase tracking-[0.2em] mt-1.5 font-black">Financial Group</p>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-8">
                <div className="space-y-1">
                    {mainNavItems.map(item => renderNavLink(item))}
                </div>

                {adminNavItems.length > 0 && (
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-5 mb-4">Administration</h3>
                        {adminNavItems.map(item => renderNavLink(item))}
                    </div>
                )}
            </nav>

            <div className="px-4 mt-8 pt-6 border-t border-white/5">
                <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-4 px-5 py-4 text-sm font-black text-[#FF6B6B] hover:bg-red-500/10 rounded-2xl w-full transition-all uppercase tracking-widest"
                >
                    <LogOut className="h-5 w-5" strokeWidth={2.5} /> Sign Out
                </button>
            </div>
        </aside>

        <div className="flex-1 h-full flex flex-col overflow-hidden bg-slate-50/30">
            <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between z-20">
                <div className="flex items-center gap-6">
                    <h2 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">Active Terminal</h2>
                </div>
                <div className="flex items-center gap-8">
                    {/* Tour Start Button for Admins */}
                    {(user?.role === UserRole.ADMIN || user?.role === UserRole.SUB_ADMIN) && (
                        <button 
                            onClick={startTour} 
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-600 transition-all uppercase tracking-widest"
                        >
                            <HelpCircle size={16} /> Admin Tour
                        </button>
                    )}

                    <div className="relative" ref={notifRef}>
                        <button onClick={() => setIsNotifOpen(!isNotifOpen)} className={`p-3 rounded-2xl transition-all relative ${isNotifOpen ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}>
                            <Bell className="h-5 w-5" />
                            {unreadNotifs > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-md">{unreadNotifs}</span>}
                        </button>
                    </div>
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
