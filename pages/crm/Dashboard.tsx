
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, FileText, BadgeDollarSign, Calendar, ChevronRight, FileCheck, Landmark, Briefcase, RefreshCw, Activity, PhoneIncoming } from 'lucide-react';
import { UserRole, ApplicationStatus, ProductType, LeadStatus } from '../../types';

const StatCard = ({ icon: Icon, colorClass, bgClass, label, value, subtext }: any) => (
    <div className="bg-white p-8 rounded-[3rem] shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05)] border border-white/40 flex items-center gap-6 hover:scale-[1.02] transition-all duration-300 group">
        <div className={`p-5 rounded-[1.5rem] ${bgClass} ${colorClass} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
            <Icon className="h-8 w-8"/>
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
            {subtext && <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tight">{subtext}</p>}
        </div>
    </div>
);

export const Dashboard: React.FC = () => {
    const { user, leads, metrics, callbacks, applications } = useData();
    const [activeGraphTab, setActiveGraphTab] = useState<string>('ALL');
    const navigate = useNavigate();

    const isSubAdmin = user?.role === UserRole.SUB_ADMIN;
    const myProducts = user?.productsSold || [];

    // --- DYNAMIC STAT CARDS ---
    const statCards = useMemo(() => {
        const cards: any[] = [];
        
        // Written Production
        cards.push({ icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50", label: "Written Production", value: `$${metrics.totalRevenue.toLocaleString()}`, sub: "Gross Written YTD" });

        // Active Apps
        cards.push({ icon: FileText, color: "text-purple-600", bg: "bg-purple-50", label: "Active Apps", value: applications.filter(a => a.status !== ApplicationStatus.ISSUED).length, sub: "In Underwriting" });

        // Pending Payout
        cards.push({ icon: BadgeDollarSign, color: "text-green-600", bg: "bg-green-50", label: "Pending Payout", value: `$${metrics.totalCommission.toLocaleString()}`, sub: "Unpaid Commission" });

        // Callbacks
        cards.push({ icon: PhoneIncoming, color: "text-red-600", bg: "bg-red-50", label: "Callbacks", value: callbacks.filter(c => !c.resolved).length, sub: "Immediate Response" });

        return cards;
    }, [metrics, applications, callbacks]);

    const graphData = useMemo(() => {
        // Placeholder data logic
        return [
            { month: 'JAN', value: 450000 },
            { month: 'FEB', value: 520000 },
            { month: 'MAR', value: 480000 },
            { month: 'APR', value: 610000 },
            { month: 'MAY', value: 750000 },
            { month: 'JUN', value: 890000 },
        ];
    }, []);

    const authorizedTooling = useMemo(() => {
        const tools: any[] = [];
        if (myProducts.some(p => [ProductType.LIFE, ProductType.ANNUITY, ProductType.IUL].includes(p))) {
            tools.push({ label: 'NEW QUOTE', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', action: () => {} });
            tools.push({ label: 'SUBMIT APP', icon: FileCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', action: () => {} });
        }
        tools.push({ label: 'CALENDAR', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50', action: () => navigate('/crm/calendar') });
        return tools;
    }, [myProducts, navigate]);

    return (
        <div className="space-y-10 pb-10">
            {/* 1. DYNAMIC STAT CARDS */}
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
            
            {/* 2. MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.03)] border border-white/50 flex flex-col">
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

                 {/* SIDEBAR TOOLS */}
                 <div className="space-y-8 flex flex-col">
                    <div className="bg-slate-100 rounded-[3rem] p-10 flex flex-col flex-1 shadow-inner border border-slate-200/50">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Authorized Tooling</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {authorizedTooling.map((tool, idx) => (
                                <button 
                                    key={idx}
                                    onClick={tool.action}
                                    className="flex flex-col items-center justify-center p-6 bg-white hover:bg-slate-50 rounded-[2.5rem] border border-slate-200/50 transition-all group shadow-sm hover:shadow-md"
                                >
                                    <div className={`p-4 rounded-2xl ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform mb-4 shadow-sm`}>
                                        <tool.icon className="h-6 w-6" strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] text-center">{tool.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};
