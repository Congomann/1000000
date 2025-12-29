
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
    DollarSign, FileText, BadgeDollarSign, Calendar, ChevronRight, FileCheck, 
    Landmark, Briefcase, RefreshCw, Activity, PhoneIncoming, Zap, 
    CheckCircle2, Globe, Database, Key, Mail, UserPlus, 
    AlertCircle, Search, Terminal, ShieldCheck, Loader2, Building2, TrendingUp
} from 'lucide-react';
import { UserRole, ApplicationStatus, ProductType, User, AdvisorCategory } from '../../types';

const StatCard = ({ icon: Icon, colorClass, bgClass, label, value, subtext }: any) => (
    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex items-center gap-6 hover:scale-[1.01] transition-all duration-300 group">
        <div className={`p-5 rounded-[1.5rem] ${bgClass} ${colorClass} group-hover:scale-105 transition-transform duration-300`}>
            <Icon className="h-8 w-8"/>
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
            {subtext && <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tight">{subtext}</p>}
        </div>
    </div>
);

const SystemStatusCard = ({ label, status, icon: Icon, color }: { label: string, status: string, icon: any, color: string }) => (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-slate-50 ${color}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-sm font-bold text-slate-700">{status}</p>
            </div>
        </div>
        <div className={`h-2.5 w-2.5 rounded-full ${status === 'Healthy' || status === 'Connected' || status === 'Optimized' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
    </div>
);

export const Dashboard: React.FC = () => {
    const { user, leads, metrics, callbacks, applications, notifications, allUsers, updateUser, addAdvisor } = useData();
    const [activeGraphTab, setActiveGraphTab] = useState<string>('ALL');
    const [lastSync, setLastSync] = useState(new Date());
    const navigate = useNavigate();

    const [provisionName, setProvisionName] = useState('');
    const [provisionAlias, setProvisionAlias] = useState('');
    const [advisorSearch, setAdvisorSearch] = useState('');
    const [isProvisioning, setIsProvisioning] = useState(false);

    const isAdmin = user?.role === UserRole.ADMIN;

    useEffect(() => {
        const interval = setInterval(() => {
            if (notifications.length > 0) setLastSync(new Date());
        }, 30000);
        return () => clearInterval(interval);
    }, [notifications.length]);

    const statCards = useMemo(() => {
        const cards: any[] = [];
        cards.push({ icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50", label: "Written Production", value: `$${metrics.totalRevenue.toLocaleString()}`, sub: "Gross Written YTD" });
        cards.push({ icon: FileText, color: "text-purple-600", bg: "bg-purple-50", label: "Active Pipeline", value: user?.category === AdvisorCategory.REAL_ESTATE ? leads.length : applications.filter(a => a.status !== ApplicationStatus.ISSUED).length, sub: user?.category === AdvisorCategory.REAL_ESTATE ? "Potential Listings" : "In Underwriting" });
        cards.push({ icon: BadgeDollarSign, color: "text-green-600", bg: "bg-green-50", label: "Pending Payout", value: `$${metrics.totalCommission.toLocaleString()}`, sub: "Unpaid Commission" });
        cards.push({ icon: PhoneIncoming, color: "text-red-600", bg: "bg-red-50", label: "Callbacks", value: callbacks.filter(c => !c.resolved).length, sub: "Immediate Response" });
        return cards;
    }, [metrics, applications, callbacks, user, leads]);

    const graphData = useMemo(() => {
        return [
            { month: 'JAN', value: 450000 }, { month: 'FEB', value: 520000 }, { month: 'MAR', value: 480000 },
            { month: 'APR', value: 610000 }, { month: 'MAY', value: 750000 }, { month: 'JUN', value: 890000 },
        ];
    }, []);

    const authorizedTooling = useMemo(() => {
        if (!user) return [];
        const tools: any[] = [];
        
        if (user.category === AdvisorCategory.REAL_ESTATE) {
            tools.push({ label: 'NEW LISTING', icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50', action: () => navigate('/crm/properties') });
            tools.push({ label: 'ESCROW TRACK', icon: Key, color: 'text-blue-600', bg: 'bg-blue-50', action: () => navigate('/crm/escrow') });
            tools.push({ label: 'CALENDAR', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50', action: () => navigate('/crm/calendar') });
        } else if (user.category === AdvisorCategory.SECURITIES) {
            tools.push({ label: 'PORTFOLIO SYNC', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', action: () => navigate('/crm/portfolio') });
            tools.push({ label: 'COMPLIANCE', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', action: () => navigate('/crm/compliance') });
            tools.push({ label: 'BILLING', icon: BadgeDollarSign, color: 'text-blue-600', bg: 'bg-blue-50', action: () => navigate('/crm/fees') });
        } else {
            // Default/Insurance
            tools.push({ label: 'NEW QUOTE', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', action: () => navigate('/crm/intake') });
            tools.push({ label: 'SUBMIT APP', icon: FileCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', action: () => navigate('/crm/applications') });
            tools.push({ label: 'CALENDAR', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50', action: () => navigate('/crm/calendar') });
        }
        
        return tools;
    }, [navigate, user]);

    const handleProvisionEmail = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProvisioning(true);
        setTimeout(() => {
            const finalEmail = `${provisionAlias.toLowerCase()}@newhollandfinancial.com`;
            addAdvisor({
                id: Math.random().toString(36).substr(2, 9),
                name: provisionName,
                email: finalEmail,
                role: UserRole.ADVISOR,
                category: AdvisorCategory.INSURANCE,
                productsSold: [ProductType.LIFE],
                micrositeEnabled: true,
                onboardingCompleted: false
            });
            setProvisionName('');
            setProvisionAlias('');
            setIsProvisioning(false);
        }, 1500);
    };

    const handleResetPassword = (name: string) => {
        if(window.confirm(`Issue a password reset secure link to ${name}?`)) {
            alert("Reset link dispatched to advisor terminal and secondary email.");
        }
    };

    const filteredAdvisors = allUsers.filter(u => 
        u.role === UserRole.ADVISOR && 
        u.name.toLowerCase().includes(advisorSearch.toLowerCase())
    ).slice(0, 5);

    if (isAdmin) {
        return (
            <div className="space-y-10 pb-20">
                <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden border border-white/5">
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="p-4 bg-white/10 rounded-[1.5rem] backdrop-blur-md">
                            <Terminal className="h-7 w-7 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tighter">System Operations Console</h2>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 opacity-80 flex items-center gap-2">
                               <ShieldCheck size={12} className="text-blue-400" /> Infrastructure Root Access: Level 1
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Master System Clock</p>
                            <p className="text-sm font-bold font-mono">{lastSync.toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SystemStatusCard label="Website Health" status="Healthy" icon={Globe} color="text-blue-500" />
                    <SystemStatusCard label="CRM Database" status="Optimized" icon={Database} color="text-indigo-500" />
                    <SystemStatusCard label="API Endpoints" status="Connected" icon={Activity} color="text-green-500" />
                    <SystemStatusCard label="Auth Service" status="Healthy" icon={Key} color="text-purple-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-100 flex flex-col h-[600px]">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Troubleshooting Log</h3>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Real-time System Event Feed</p>
                            </div>
                            <button className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-200">
                                <RefreshCw size={16} className="text-slate-600" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {[
                                { time: '11:42 AM', event: 'Google Lead Webhook received', type: 'success' },
                                { time: '11:30 AM', event: 'Daily database redundancy backup completed', type: 'info' },
                                { time: '10:15 AM', event: 'CRM API latency surge detected (340ms)', type: 'warning' },
                                { time: '09:45 AM', event: 'Email dispatch server throttle released', type: 'success' },
                                { time: '08:45 AM', event: 'System core synchronization optimized', type: 'success' },
                                { time: 'Yesterday', event: 'SSL certificate verification successful', type: 'success' },
                                { time: 'Yesterday', event: 'Meta Ads integration polling restart', type: 'info' }
                            ].map((log, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all">
                                    <div className={`p-2 rounded-xl flex-shrink-0 ${
                                        log.type === 'success' ? 'bg-green-100 text-green-600' :
                                        log.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                        <AlertCircle size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-700 truncate">{log.event}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8 flex flex-col h-[600px]">
                        <div className="bg-slate-900 rounded-[3rem] p-10 flex flex-col flex-1 shadow-2xl border border-white/5">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Advisor Identity Control</h4>
                            
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <input 
                                    type="text" 
                                    placeholder="Search advisor account..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={advisorSearch}
                                    onChange={e => setAdvisorSearch(e.target.value)}
                                />
                            </div>

                            <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar mb-8">
                                {filteredAdvisors.map(adv => (
                                    <div key={adv.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between group">
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-white truncate">{adv.name}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{adv.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleResetPassword(adv.name)}
                                                className="p-2 bg-white/5 hover:bg-blue-600 rounded-lg text-slate-400 hover:text-white transition-all"
                                                title="Reset Password"
                                            >
                                                <Key size={14} />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    const newMail = window.prompt(`Change primary email for ${adv.name}:`, adv.email);
                                                    if (newMail) updateUser(adv.id, { email: newMail });
                                                }}
                                                className="p-2 bg-white/5 hover:bg-green-600 rounded-lg text-slate-400 hover:text-white transition-all"
                                                title="Change Email"
                                            >
                                                <Mail size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/10">
                                <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Provision Corporate Mail</h5>
                                <form onSubmit={handleProvisionEmail} className="space-y-3">
                                    <input 
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder:text-slate-600 outline-none"
                                        placeholder="Full Name (e.g. Mike Ross)"
                                        value={provisionName}
                                        onChange={e => setProvisionName(e.target.value)}
                                    />
                                    <div className="flex items-center gap-2">
                                        <input 
                                            required
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder:text-slate-600 outline-none"
                                            placeholder="alias"
                                            value={provisionAlias}
                                            onChange={e => setProvisionAlias(e.target.value)}
                                        />
                                        <span className="text-[9px] font-black text-slate-500 uppercase">@newhollandfinancial.com</span>
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={isProvisioning}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isProvisioning ? <Loader2 size={14} className="animate-spin" /> : <><UserPlus size={14} /> Provision Mailbox</>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden border border-white/5">
                <div className="flex items-center gap-5 relative z-10">
                    <div className="p-4 bg-white/10 rounded-[1.5rem] backdrop-blur-md">
                        <Zap className="h-7 w-7 text-yellow-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter">Autonomous Connectivity Active</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 opacity-80 flex items-center gap-2">
                           <CheckCircle2 size={12} className="text-green-500" /> All External Marketing Hooks Synchronized
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Last Data Ingestion</p>
                        <p className="text-sm font-bold font-mono">{lastSync.toLocaleTimeString()}</p>
                    </div>
                    <button onClick={() => setLastSync(new Date())} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group">
                        <RefreshCw className="h-5 w-5 group-active:rotate-180 transition-transform duration-500" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <StatCard 
                        key={idx}
                        icon={card.icon}
                        colorClass={card.color}
                        bgClass={card.bg}
                        label={card.label}
                        value={card.value}
                        subtext={card.sub}
                    />
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Market Growth Analytics</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Live Transaction Tracking</p>
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
                            {['ALL', 'INSURANCE'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveGraphTab(tab)}
                                    className={`px-6 py-2 rounded-full text-[10px] font-black transition-all uppercase tracking-widest ${activeGraphTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full" style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={graphData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} tickFormatter={(value) => `$${value/1000}k`} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -5px rgba(0,0,0,0.1)', padding: '16px'}}
                                    formatter={(value: number) => [`$${value.toLocaleString()}`, `Metrics`]}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="space-y-8 flex flex-col">
                    <div className="bg-slate-100 rounded-[3.5rem] p-10 flex flex-col flex-1 shadow-inner border border-slate-200/50">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 text-center">Authorized Tooling</h4>
                        <div className="flex flex-col gap-6 items-center">
                            {authorizedTooling.map((tool, idx) => (
                                <button 
                                    key={idx}
                                    onClick={tool.action}
                                    className="flex flex-col items-center justify-center p-8 bg-white hover:bg-slate-50 rounded-[3rem] border border-slate-200/50 transition-all group shadow-sm hover:shadow-md w-full max-w-[200px]"
                                >
                                    <div className={`p-5 rounded-[1.5rem] ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform mb-4 shadow-sm`}>
                                        <tool.icon className="h-8 w-8" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] text-center">{tool.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};
