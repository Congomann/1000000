
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
    Users, Wallet, TrendingUp, Activity, ArrowUpRight, 
    MonitorCheck, BarChart3, ShieldAlert, Cpu, ArrowRight,
    Search, Bell, LayoutGrid, Webhook, Bug, RefreshCw, MessageSquarePlus, ChevronRight, AlertCircle, Clock, Info, Server, Globe, Zap, ShieldCheck,
    // FIX: Added missing FileText icon import
    FileText
} from 'lucide-react';
import { UserRole, LeadStatus } from '../../types';

const MetricCard = ({ title, value, subtext, icon: Icon, colorClass, trend, onClick }: any) => (
    <div 
        onClick={onClick}
        className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white/40 hover:shadow-xl hover:bg-white transition-all group cursor-pointer flex flex-col justify-between min-h-[220px]"
    >
        <div className="flex justify-between items-start mb-6">
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.25em]">{title}</p>
            <div className={`p-3 rounded-2xl ${colorClass || 'bg-slate-50 text-slate-400'} group-hover:scale-110 transition-transform shadow-sm`}>
                <Icon size={20} strokeWidth={2.5} />
            </div>
        </div>
        <div>
            <p className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{value}</p>
            <div className="flex items-center gap-2">
                {trend && (
                    <span className={`text-xs font-black flex items-center ${trend.includes('OK') || trend.includes('UP') || trend.includes('100%') ? 'text-green-500' : 'text-orange-500'}`}>
                        {trend}
                    </span>
                )}
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{subtext}</span>
            </div>
        </div>
    </div>
);

export const Dashboard: React.FC = () => {
    const { user, metrics, notifications, markNotificationRead, allUsers, leads, jobApplications } = useData();
    const navigate = useNavigate();
    const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUB_ADMIN;

    // ADVISOR VIEW STATS (Keep for Advisors)
    const advisorStats = [
        { title: "Total Clients", value: metrics.activeClients || "450", subtext: "Managed Accounts", icon: Users, colorClass: "bg-blue-50 text-blue-600", trend: "+12%", route: "/crm/clients" },
        { title: "Earnings YTD", value: `$${(metrics.totalCommission / 1000).toFixed(1)}k`, subtext: "Net Commission", icon: Wallet, colorClass: "bg-green-50 text-green-600", trend: "OPTIMAL", route: "/crm/commissions" },
        { title: "Pipeline Score", value: "84/100", subtext: "Lead Quality", icon: TrendingUp, colorClass: "bg-purple-50 text-purple-600", trend: "+8.2%", route: "/crm/leads" },
        { title: "Active Projects", value: "12", subtext: "Current Focus", icon: Activity, colorClass: "bg-orange-50 text-orange-600", route: "/crm/calendar" }
    ];

    // ADMIN VIEW STATS (New Health & Ops Focus)
    const adminStats = [
        { 
            title: "Website Health", 
            value: "99.9%", 
            subtext: "Current Uptime", 
            icon: Globe, 
            colorClass: "bg-emerald-50 text-emerald-600", 
            trend: "STATUS: UP",
            route: "/crm/admin/website"
        },
        { 
            title: "API Ingestion", 
            value: "100%", 
            subtext: "Sync Success Rate", 
            icon: Zap, 
            colorClass: "bg-blue-50 text-blue-600", 
            trend: "OK: GOOGLE/META",
            route: "/crm/admin/marketing"
        },
        { 
            title: "Advisor Requests", 
            value: jobApplications.filter(a => a.status === 'Pending').length + 3, // Mock +3 for other requests
            subtext: "Action Required", 
            icon: MessageSquarePlus, 
            colorClass: "bg-orange-50 text-orange-600",
            trend: "5 URGENT",
            route: "/crm/onboarding"
        },
        { 
            title: "Security & CRM", 
            value: "SECURE", 
            subtext: "System Encryption", 
            icon: ShieldCheck, 
            colorClass: "bg-purple-50 text-purple-600",
            trend: "AES-256",
            route: "/crm/legal"
        }
    ];

    const stats = isAdmin ? adminStats : advisorStats;

    const handleActivityClick = (n: any) => {
        markNotificationRead(n.id);
        if (n.resourceType === 'lead') navigate('/crm/leads');
        else if (n.resourceType === 'event') navigate('/crm/calendar');
        else if (n.resourceType === 'job_application') navigate('/crm/onboarding');
    };

    const getPriorityColor = (type: string) => {
        switch (type) {
            case 'alert': return 'text-red-500 bg-red-50 border-red-100';
            case 'warning': return 'text-orange-500 bg-orange-50 border-orange-100';
            case 'success': return 'text-green-500 bg-green-50 border-green-100';
            default: return 'text-blue-500 bg-blue-50 border-blue-100';
        }
    };

    return (
        <div className="space-y-12 pb-20 animate-fade-in">
            {/* Context Awareness Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
                        {isAdmin ? 'Administrative Control Terminal' : 'Advisor Performance Hub'}
                    </h2>
                </div>
                {isAdmin && (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 rounded-full border border-white/10">
                            <Server size={12} className="text-blue-400" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Master Node: Active</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <MetricCard 
                        key={i} 
                        {...stat} 
                        onClick={() => navigate(stat.route)}
                    />
                ))}
            </div>

            {/* Admin Specific Content Blocks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* 1. System logs & Trace (Lefthand Column) */}
                <div className="lg:col-span-2 bg-white/40 backdrop-blur-md p-10 rounded-[3.5rem] shadow-sm border border-white/50 flex flex-col min-h-[600px]">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">System Intelligence Feed</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Website Health & CRM Traces</p>
                        </div>
                        <button onClick={() => navigate('/crm/admin/marketing')} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                            <RefreshCw size={16} className="text-blue-600" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {isAdmin ? (
                            // Admin specific logs (Mocking technical events)
                            <>
                                <LogItem 
                                    title="Google Ads Webhook Success" 
                                    desc="New lead ingested from 'Wealth 2024' Campaign." 
                                    time="2m ago" 
                                    icon={Webhook} 
                                    type="success" 
                                />
                                <LogItem 
                                    title="Advisor Request: Signature Approval" 
                                    desc="Sarah RealEstate updated her professional title." 
                                    time="15m ago" 
                                    icon={Info} 
                                    type="info" 
                                />
                                <LogItem 
                                    title="Automatic Database Backup" 
                                    desc="Incremental snapshot saved to encrypted cloud node." 
                                    time="1h ago" 
                                    icon={ShieldCheck} 
                                    type="success" 
                                />
                                <LogItem 
                                    title="Microsite Error Flagged" 
                                    desc="Broken link detected on Advisor #4 Microsite (Profile)." 
                                    time="2h ago" 
                                    icon={Bug} 
                                    type="alert" 
                                />
                                <LogItem 
                                    title="Terms of Use Update" 
                                    desc="Admin modified Step 2 of the Onboarding Flow." 
                                    time="4h ago" 
                                    icon={FileText} 
                                    type="info" 
                                />
                            </>
                        ) : (
                            // Standard Advisor Notifications
                            notifications.slice(0, 6).map((n) => (
                                <div key={n.id} onClick={() => handleActivityClick(n)} className="p-6 bg-white/60 rounded-[2rem] border border-white/80 hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
                                     <div className={`p-2 rounded-xl border ${getPriorityColor(n.type)}`}>
                                         <Bell size={16} />
                                     </div>
                                     <div className="flex-1">
                                         <p className="text-sm font-bold text-slate-700">{n.title}</p>
                                         <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                                     </div>
                                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(n.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 2. Pending Actions Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0B2240] text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Activity size={150}/></div>
                        <h3 className="text-xl font-black mb-6 relative z-10 uppercase tracking-tight">Active Deployments</h3>
                        
                        <div className="space-y-6 relative z-10">
                            <div className="p-5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-3">Microsite Status</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold">{allUsers.filter(u => u.micrositeEnabled).length} Advisors Live</span>
                                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                                </div>
                            </div>

                            <div className="p-5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-3">Pending Onboarding</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold">{jobApplications.filter(a => a.status === 'Pending').length} Apps Review</span>
                                    <button onClick={() => navigate('/crm/onboarding')} className="text-[10px] font-black bg-blue-500 text-white px-3 py-1 rounded-lg">View</button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <button onClick={() => navigate('/crm/admin/website')} className="w-full py-4 bg-white text-[#0B2240] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                                    <MonitorCheck size={16} /> Site Config
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Internal Service Health</h3>
                        <div className="space-y-4">
                            <HealthIndicator label="Database Engine" status="Optimal" />
                            <HealthIndicator label="Lead Ingestion" status="Active" />
                            <HealthIndicator label="Email SMTP" status="Active" />
                            <HealthIndicator label="Auth Gateway" status="Stable" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const LogItem = ({ title, desc, time, icon: Icon, type }: any) => {
    const colors = {
        success: 'text-green-500 bg-green-50 border-green-100',
        alert: 'text-red-500 bg-red-50 border-red-100',
        info: 'text-blue-500 bg-blue-50 border-blue-100',
        warning: 'text-orange-500 bg-orange-50 border-orange-100'
    };
    return (
        <div className="flex items-start gap-5 p-6 bg-white/60 rounded-[2rem] border border-white/80 hover:shadow-md transition-all group">
            <div className={`p-2.5 rounded-xl border ${colors[type as keyof typeof colors]}`}>
                <Icon size={16} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-baseline">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{title}</p>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{time}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
};

const HealthIndicator = ({ label, status }: { label: string, status: string }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
        <span className="text-xs font-bold text-slate-500">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-green-600 uppercase">{status}</span>
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
        </div>
    </div>
);
