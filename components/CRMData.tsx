
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
  CheckCircle,
  Menu,
  X,
  Zap,
  ArrowRight,
  RefreshCw,
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
  Clock,
  ChevronRight
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { UserRole, ProductType, Notification, AdvisorCategory } from '../types';

interface CRMLayoutProps {
  children: React.ReactNode;
}

export const CRMLayout: React.FC<CRMLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, notifications, chatMessages, markNotificationRead, clearNotifications } = useData();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

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
      if (n.resourceType === 'lead' && n.relatedId) {
          navigate('/crm/leads');
      } else if (n.resourceType === 'event') {
          navigate('/crm/calendar');
      } else if (n.resourceType === 'job_application') {
          navigate('/crm/onboarding');
      }
  };

  const mainNavItems = useMemo(() => {
    if (!user) return [];
    const isAdminOrSub = user.role === UserRole.ADMIN || user.role === UserRole.SUB_ADMIN;
    
    const items: any[] = [
        { path: '/crm/dashboard', label: 'Dashboard', icon: LayoutGrid },
    ];

    if (!isAdminOrSub) {
        items.push({ path: '/crm/inbox', label: 'Requests', icon: Inbox });
    }

    if (!isAdminOrSub) {
        items.push({ path: '/crm/clients', label: 'Clients', icon: Shield });

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

    items.push({ path: '/crm/leads', label: 'Leads DB', icon: Database });
    items.push({ path: '/crm/calendar', label: 'Calendar', icon: Calendar });
    items.push({ path: '/crm/chat', label: 'Team Chat', icon: MessageCircle });
    items.push({ path: '/crm/legal', label: 'Legal & Compliance', icon: Scale });

    if (user.role !== UserRole.SUB_ADMIN) {
      items.push({ path: '/crm/profile', label: 'Profile', icon: CircleUser });
    }
    return items;
  }, [user]);

  const adminNavItems = useMemo(() => {
    if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.SUB_ADMIN)) return [];
    
    if (user.role === UserRole.SUB_ADMIN) {
        return [
            { path: '/crm/admin', label: 'User Terminal', icon: Users },
            { path: '/crm/onboarding', label: 'Onboarding Feed', icon: ClipboardCheck },
        ];
    }

    return [
        { path: '/crm/admin', label: 'User Terminal', icon: Users },
        { path: '/crm/onboarding', label: 'Onboarding Feed', icon: ClipboardCheck },
        { path: '/crm/admin/website', label: 'Site Config', icon: Settings },
        { path: '/crm/admin/carriers', label: 'Carrier Setup', icon: ShieldCheck },
        { path: '/crm/admin/testimonials', label: 'Client Reviews', icon: Award },
        { path: '/crm/admin/signature', label: 'Signature Lab', icon: PenTool },
        { path: '/crm/admin/marketing', label: 'API Integrations', icon: Webhook },
    ];
  }, [user]);

  const renderNavLink = (item: any) => {
    const isActive = location.pathname === item.path || (item.path !== '/crm/dashboard' && location.pathname.startsWith(item.path));
    return (
        <Link 
            key={item.path} 
            to={item.path} 
            className={`flex items-center justify-between gap-4 px-5 py-3.5 text-sm font-bold rounded-2xl transition-all duration-200 group ${
                isActive 
                ? 'bg-[#3B82F6] text-white shadow-md' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
        >
            <div className="flex items-center gap-4">
                 <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} strokeWidth={2.5} /> 
                 <span className="tracking-tight">{item.label}</span>
            </div>
        </Link>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-0 sm:p-4 font-sans text-slate-900 overflow-hidden bg-slate-100">
      <div className="w-full h-full max-w-[1920px] bg-white sm:rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] flex relative overflow-hidden ring-1 ring-black/5">
        <aside className="hidden lg:flex flex-col w-72 bg-[#1B222E] text-white h-full overflow-y-auto py-10 z-10 flex-shrink-0 no-scrollbar border-r border-white/5">
            <div className="px-8 mb-12 flex items-center gap-4">
                <div className="relative w-12 h-12 flex-shrink-0">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path d="M50 0L100 40V100H0V40L50 0Z" fill="#FBBF24"/>
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
                    <div className="flex flex-col">
                        <h2 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
                           Active Terminal
                        </h2>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time Autonomous Sync</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="relative" ref={notifRef}>
                        <button 
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className={`p-3 rounded-2xl transition-all relative group ${isNotifOpen ? 'bg-blue-600 text-white shadow-lg' : 'bg-white hover:bg-slate-50 text-slate-400 border border-slate-200'}`}
                        >
                            <Bell className={`h-5 w-5`} />
                            {unreadNotifs > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-md">
                                    {unreadNotifs}
                                </span>
                            )}
                        </button>

                        {isNotifOpen && (
                            <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in">
                                <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Activity Feed</h3>
                                    <button onClick={clearNotifications} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Clear All</button>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                                    {notifications.length > 0 ? notifications.map(n => (
                                        <div 
                                            key={n.id} 
                                            onClick={() => handleNotificationClick(n)}
                                            className={`p-5 border-b border-slate-50 transition-colors cursor-pointer hover:bg-slate-50 flex gap-4 ${!n.read ? 'bg-blue-50/20' : ''}`}
                                        >
                                            <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.type === 'success' ? 'bg-green-500' : n.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-black text-slate-900 leading-tight mb-1">{n.title}</p>
                                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{n.message}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">{new Date(n.timestamp).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-12 text-center text-slate-300">
                                            <Bell className="h-10 w-10 mx-auto mb-4 opacity-10" />
                                            <p className="text-xs font-bold uppercase tracking-widest">Feed Empty</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 pl-8 border-l border-slate-100">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-slate-900 leading-none tracking-tight">{user?.name}</p>
                            <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1.5">{user?.role}</p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-md ring-1 ring-slate-200">
                             {user?.avatar ? <img src={user.avatar} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center font-black text-slate-400">{user?.name[0]}</div>}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar relative">
                {children}
            </main>
        </div>
      </div>
    </div>
  );
};
