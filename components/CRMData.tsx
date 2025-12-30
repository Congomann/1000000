
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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
  Percent
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
  
  const [bellShake, setBellShake] = useState(false);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);
  const prevNotifCount = useRef(notifications.length);
  const prevChatCount = useRef(chatMessages.length);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  const unreadChats = useMemo(() => {
    if (!user) return 0;
    return chatMessages.filter(m => m.receiverId === user.id && !m.read).length;
  }, [chatMessages, user]);

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const totalUnreadAlerts = unreadNotifs + unreadChats;

  useEffect(() => {
    if (notifications.length > prevNotifCount.current) {
        const newNotif = notifications[0];
        if (newNotif && !newNotif.read) {
            setBellShake(true);
            setActiveToast(newNotif);
            setLastSyncTime(new Date());
            setTimeout(() => setBellShake(false), 1000);
            setTimeout(() => setActiveToast(null), 6000);
        }
    }
    prevNotifCount.current = notifications.length;
  }, [notifications]);

  useEffect(() => {
    if (chatMessages.length > prevChatCount.current) {
        setBellShake(true);
        setTimeout(() => setBellShake(false), 1000);
    }
    prevChatCount.current = chatMessages.length;
  }, [chatMessages.length]);

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
          navigate('/crm/leads', { state: { openLeadId: n.relatedId } });
      } else if (n.resourceType === 'client' && n.relatedId) {
          navigate('/crm/clients');
      }
  };

  const mainNavItems = useMemo(() => {
    if (!user) return [];
    const isAdmin = user.role === UserRole.ADMIN;
    
    const items: any[] = [
        { path: '/crm/dashboard', label: 'Dashboard', icon: LayoutGrid },
    ];

    if (!isAdmin) {
        items.push({ path: '/crm/inbox', label: 'Requests', icon: Inbox });
    }

    items.push({ path: '/crm/clients', label: 'Clients', icon: Shield });

    // Category Specific Nav Items
    if (user.category === AdvisorCategory.INSURANCE || isAdmin) {
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

    if (!isAdmin) {
        items.push({ path: '/crm/commissions', label: 'Commissions', icon: LineChart });
    }

    items.push({ path: '/crm/leads', label: 'Leads DB', icon: Database });
    items.push({ path: '/crm/calendar', label: 'Calendar', icon: Calendar });
    items.push({ path: '/crm/chat', label: 'Team Chat', icon: MessageCircle, badge: unreadChats });
    items.push({ path: '/crm/legal', label: 'Legal & Compliance', icon: Scale });

    if (user.role !== UserRole.SUB_ADMIN) {
      items.push({ path: '/crm/profile', label: 'Profile', icon: CircleUser });
    }
    return items;
  }, [user, unreadChats]);

  const adminNavItems = useMemo(() => {
    if (!user || user.role !== UserRole.ADMIN) return [];
    const items: any[] = [
        { path: '/crm/admin', label: 'User Terminal', icon: Users },
        { path: '/crm/onboarding', label: 'Onboarding Feed', icon: ClipboardCheck },
        { path: '/crm/admin/website', label: 'Site Config', icon: Settings },
        { path: '/crm/admin/carriers', label: 'Carrier Setup', icon: ShieldCheck },
        { path: '/crm/admin/testimonials', label: 'Client Reviews', icon: Award },
        { path: '/crm/admin/signature', label: 'Signature Lab', icon: PenTool },
        { path: '/crm/admin/marketing', label: 'API Integrations', icon: Webhook },
    ];
    return items;
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
            {item.badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center shadow-sm">{item.badge}</span>
            )}
        </Link>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-0 sm:p-4 font-sans text-slate-900 overflow-hidden bg-slate-100">
      {activeToast && (
          <div className="fixed top-8 right-8 z-[100] animate-slide-left w-80 bg-[#0B2240] text-white p-5 rounded-[2rem] shadow-2xl border border-white/20 flex flex-col gap-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => handleNotificationClick(activeToast)}>
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-600 rounded-xl">
                          <Zap className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Terminal Alert</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setActiveToast(null); }} className="text-slate-400 hover:text-white"><X size={14}/></button>
              </div>
              <div>
                  <h4 className="font-black text-sm uppercase tracking-tight">{activeToast.title}</h4>
                  <p className="text-xs text-blue-100 mt-1 font-medium">{activeToast.message}</p>
              </div>
              <div className="flex items-center justify-end text-[10px] font-black text-blue-400 uppercase tracking-widest gap-1">
                  View Source <ArrowRight size={10} />
              </div>
          </div>
      )}

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
                    <div className="lg:hidden w-10 h-10">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <path d="M50 0L100 40V100H0V40L50 0Z" fill="#FBBF24"/>
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
                           Active Terminal
                        </h2>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Autonomous Sync: {lastSyncTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
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
                            {totalUnreadAlerts > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-md">
                                    {totalUnreadAlerts}
                                </span>
                            )}
                        </button>

                        {isNotifOpen && (
                            <div className="absolute top-14 right-0 w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden z-50 animate-slide-up ring-1 ring-black/5">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Alert Center</h3>
                                    <button onClick={clearNotifications} className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-wider">Clear All</button>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                                    {notifications.length === 0 && unreadChats === 0 ? (
                                        <div className="p-12 text-center text-slate-300 italic text-sm font-bold">STREAMS CLEAR</div>
                                    ) : (
                                        <>
                                            {unreadChats > 0 && (
                                                <div onClick={() => { navigate('/crm/chat'); setIsNotifOpen(false); }} className="p-5 border-b border-blue-100 bg-blue-50/50 cursor-pointer hover:bg-blue-100 transition-colors group">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="text-sm font-black text-blue-900">Incoming Feed</h4>
                                                        <span className="text-[9px] font-black text-blue-400 uppercase">Chat</span>
                                                    </div>
                                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-tight">You have {unreadChats} unread team messages.</p>
                                                </div>
                                            )}
                                            {notifications.map(n => (
                                                <div 
                                                    key={n.id} 
                                                    onClick={() => handleNotificationClick(n)}
                                                    className={`p-5 border-b border-slate-50 transition-colors cursor-pointer group ${!n.read ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className={`text-sm font-black uppercase tracking-tight ${!n.read ? 'text-blue-900' : 'text-slate-800'}`}>{n.title}</h4>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(n.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-tight">{n.message}</p>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                                <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center justify-center gap-2">
                                        <CheckCircle className="h-3 w-3" /> System Synchronized
                                    </span>
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
      
      <style>{`
        @keyframes slide-left {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-left {
            animation: slide-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
