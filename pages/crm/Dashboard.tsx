
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
    Users, Wallet, TrendingUp, Activity, ArrowUpRight, 
    MonitorCheck, BarChart3, ShieldAlert, Cpu, ArrowRight,
    Search, Bell, LayoutGrid, Webhook, Bug, RefreshCw, MessageSquarePlus, ChevronRight
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
            <p className="text-6xl font-black text-slate-900 tracking-tighter mb-2">{value}</p>
            <div className="flex items-center gap-2">
                {trend && (
                    <span className={`text-xs font-black flex items-center ${trend.startsWith('+') || trend === 'OPTIMAL' ? 'text-green-500' : 'text-red-500'}`}>
                        {trend}
                    </span>
                )}
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{subtext}</span>
            </div>
        </div>
    </div>
);

export const Dashboard: React.FC = () => {
    const { user, metrics, notifications, markNotificationRead } = useData();
    const navigate = useNavigate();
    const isAdminOrSub = user?.role === UserRole.ADMIN || user?.role === UserRole.SUB_ADMIN;

    // ADVISOR VIEW (Matching Screenshot)
    const stats = [
        { 
            title: "Total Clients", 
            value: metrics.activeClients || "450", 
            subtext: "Last Month", 
            icon: Users, 
            colorClass: "bg-blue-50 text-blue-600", 
            trend: "+12% From",
            route: "/crm/clients"
        },
        { 
            title: "Total AUM", 
            value: `$${(metrics.totalAUM ? metrics.totalAUM / 1000000 : 12.4).toFixed(1)}M`, 
            subtext: "From Last Month", 
            icon: Wallet, 
            colorClass: "bg-green-50 text-green-600", 
            trend: "+8.2%",
            route: isAdminOrSub ? "/crm/admin/marketing" : "/crm/portfolio"
        },
        { 
            title: "Avg. Portfolio Return", 
            value: `+${metrics.avgPortfolioReturn || 14.2}%`, 
            subtext: "Performance", 
            icon: TrendingUp, 
            colorClass: "bg-purple-50 text-purple-600",
            trend: "YTD",
            route: isAdminOrSub ? "/crm/dashboard" : "/crm/portfolio"
        },
        { 
            title: "Active Portfolios", 
            value: metrics.activePortfolios || "48", 
            subtext: "Across All Clients", 
            icon: Activity, 
            colorClass: "bg-orange-50 text-orange-600",
            route: "/crm/leads"
        }
    ];

    const handleActivityClick = (n: any) => {
        markNotificationRead(n.id);
        if (n.resourceType === 'lead') navigate('/crm/leads');
        else if (n.resourceType === 'event') navigate('/crm/calendar');
        else if (n.resourceType === 'job_application') navigate('/crm/onboarding');
    };

    return (
        <div className="space-y-12 pb-20 animate-fade-in">
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

            {/* Content Section */}
            <div className="grid grid-cols-1 gap-10">
                <div className="bg-white/40 backdrop-blur-md p-10 rounded-[3.5rem] shadow-sm border border-white/50 flex flex-col">
                    <div className="mb-10">
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Real-time Terminal Activity</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Autonomous System Feed</p>
                    </div>
                    <div className="flex-1 flex flex-col gap-6">
                        {notifications.slice(0, 5).map((activity, i) => (
                            <div 
                                key={activity.id} 
                                onClick={() => handleActivityClick(activity)}
                                className="flex items-start gap-5 text-left p-6 bg-white/60 rounded-[2rem] border border-white/80 hover:shadow-md hover:bg-white transition-all cursor-pointer group"
                            >
                                <div className={`mt-2 h-2.5 w-2.5 rounded-full shrink-0 ${activity.type === 'success' ? 'bg-green-400' : activity.type === 'alert' ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <p className="text-base font-bold text-slate-700 leading-tight group-hover:text-slate-900">{activity.title}</p>
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{new Date(activity.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mt-1">{activity.message}</p>
                                </div>
                                <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                            </div>
                        ))}
                        {notifications.length === 0 && (
                            <div className="py-20 text-center text-slate-300 italic font-medium">No recent activity detected.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
