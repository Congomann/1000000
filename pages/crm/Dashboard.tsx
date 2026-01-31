
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
    Users, Wallet, TrendingUp, Activity, ArrowUpRight, 
    MonitorCheck, BarChart3, ShieldAlert, Cpu, ArrowRight,
    Search, Bell, LayoutGrid, Webhook, Bug, RefreshCw, MessageSquarePlus, ChevronRight, AlertCircle, Clock, Info, Server, Globe, Zap, ShieldCheck,
    FileText, GripVertical, CheckCircle2, Trash2, Plus
} from 'lucide-react';
import { UserRole, LeadStatus, TaskPriority, Task } from '../../types';

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

const TaskList = () => {
    const { tasks, toggleTask, deleteTask, reorderTasks, addTask, user } = useData();
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (overIndex !== index) {
            setOverIndex(index);
        }
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        if (draggedIndex !== null) {
            reorderTasks(draggedIndex, targetIndex);
        }
        setDraggedIndex(null);
        setOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setOverIndex(null);
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            addTask({
                title: newTaskTitle.trim(),
                priority: TaskPriority.MEDIUM,
                completed: false,
                advisorId: user?.id || '1'
            });
            setNewTaskTitle('');
        }
    };

    const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Strategic Priorities</h3>
                <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Manual Prioritization</span>
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                <input 
                    type="text" 
                    placeholder="New priority node..." 
                    className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                />
                <button type="submit" className="p-3 bg-[#0B2240] text-white rounded-2xl hover:bg-blue-900 transition-all shadow-lg active:scale-90">
                    <Plus size={20} />
                </button>
            </form>

            <div className="space-y-2">
                {sortedTasks.map((task, index) => (
                    <div 
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`flex items-center gap-4 p-4 bg-white/60 rounded-2xl border transition-all cursor-move group relative
                            ${draggedIndex === index ? 'opacity-30 border-blue-200 scale-95 shadow-inner' : 'border-white/80 hover:shadow-md'}
                            ${overIndex === index && draggedIndex !== index ? 'border-blue-400 bg-blue-50/30 -translate-y-1' : ''}
                        `}
                    >
                        {/* Drop Indicator Line */}
                        {overIndex === index && draggedIndex !== null && draggedIndex !== index && (
                             <div className={`absolute left-0 right-0 h-1 bg-blue-600 rounded-full z-20 ${draggedIndex > index ? '-top-1' : '-bottom-1'}`}></div>
                        )}

                        <div className="text-slate-300 group-hover:text-blue-500 transition-colors cursor-grab active:cursor-grabbing">
                            <GripVertical size={18} />
                        </div>
                        
                        <button 
                            onClick={() => toggleTask(task.id)}
                            className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-200'}`}
                        >
                            {task.completed && <CheckCircle2 size={12} strokeWidth={3} />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate tracking-tight ${task.completed ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                                {task.title}
                            </p>
                        </div>

                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md shrink-0 border ${
                            task.priority === TaskPriority.HIGH ? 'bg-red-50 text-red-600 border-red-100' :
                            task.priority === TaskPriority.MEDIUM ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                            {task.priority}
                        </span>

                        <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
                
                {sortedTasks.length === 0 && (
                    <div className="text-center py-12 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No tasks defined.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Dashboard: React.FC = () => {
    const { user, metrics, notifications, markNotificationRead, allUsers, leads, jobApplications } = useData();
    const navigate = useNavigate();
    
    const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUB_ADMIN;

    const advisorStats = [
        { title: "Total Clients", value: metrics.activeClients || "450", subtext: "Managed Accounts", icon: Users, colorClass: "bg-blue-50 text-blue-600", trend: "+12%", route: "/crm/clients" },
        { title: "Earnings YTD", value: `$${(metrics.totalCommission / 1000).toFixed(1)}k`, subtext: "Net Commission", icon: Wallet, colorClass: "bg-green-50 text-green-600", trend: "OPTIMAL", route: "/crm/commissions" },
        { title: "Pipeline Score", value: "84/100", subtext: "Lead Quality", icon: TrendingUp, colorClass: "bg-purple-50 text-purple-600", trend: "+8.2%", route: "/crm/leads" },
        { title: "Active Projects", value: "12", subtext: "Current Focus", icon: Activity, colorClass: "bg-orange-50 text-orange-600", route: "/crm/calendar" }
    ];

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
            value: jobApplications.filter(a => a.status === 'Pending').length + 3,
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
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
                        {isAdmin ? 'Administrative Control Terminal' : 'Advisor Performance Hub'}
                    </h2>
                </div>
                {isAdmin && (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 rounded-full border border-white/10 shadow-lg">
                            <Server size={12} className="text-blue-400" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Master Node: Active</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <MetricCard 
                        key={i} 
                        {...stat} 
                        onClick={() => navigate(stat.route)}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                <div className="lg:col-span-2 bg-white/40 backdrop-blur-md p-10 rounded-[3.5rem] shadow-sm border border-white/50 flex flex-col min-h-[600px]">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                                {isAdmin ? 'System Intelligence Feed' : 'Interaction & Alerts'}
                            </h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                                {isAdmin ? 'Website Health & CRM Traces' : 'Real-time Prospect Monitoring'}
                            </p>
                        </div>
                        <button onClick={() => isAdmin ? navigate('/crm/admin/marketing') : {}} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                            <RefreshCw size={16} className="text-blue-600" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {isAdmin ? (
                            <>
                                <LogItem 
                                    title="Google Ads Webhook Success" 
                                    desc="New lead ingested from 'Wealth 2024' Campaign. No latency detected in master node." 
                                    time="2m ago" 
                                    icon={Webhook} 
                                    type="success" 
                                />
                                <LogItem 
                                    title="Advisor Request: Signature Approval" 
                                    desc="Sarah RealEstate updated her professional title. Approval pending in Signature Lab." 
                                    time="15m ago" 
                                    icon={Info} 
                                    type="info" 
                                />
                                <LogItem 
                                    title="Automatic Database Backup" 
                                    desc="Incremental snapshot saved to encrypted cloud node. CRC integrity verified." 
                                    time="1h ago" 
                                    icon={ShieldCheck} 
                                    type="success" 
                                />
                                <LogItem 
                                    title="Microsite Error Flagged" 
                                    desc="Broken link detected on Advisor #4 Microsite (Profile section assets)." 
                                    time="2h ago" 
                                    icon={Bug} 
                                    type="alert" 
                                />
                                <LogItem 
                                    title="Terms of Use Update" 
                                    desc="Admin modified Step 2 of the Onboarding Flow. Action logged by Master-UID-1." 
                                    time="4h ago" 
                                    icon={FileText} 
                                    type="info" 
                                />
                            </>
                        ) : (
                            notifications.slice(0, 6).map((n) => (
                                <div key={n.id} onClick={() => handleActivityClick(n)} className="p-6 bg-white/60 rounded-[2rem] border border-white/80 hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
                                     <div className={`p-2 rounded-xl border ${getPriorityColor(n.type)}`}>
                                         <Bell size={16} />
                                     </div>
                                     <div className="flex-1">
                                         <p className="text-sm font-bold text-slate-700">{n.title}</p>
                                         <p className="text-xs text-slate-500 mt-1 font-medium">{n.message}</p>
                                     </div>
                                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(n.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                </div>
                            ))
                        )}
                        {!isAdmin && notifications.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                <Activity size={80} />
                                <p className="mt-4 font-black uppercase tracking-widest">Feed clear</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    {isAdmin ? (
                        <div className="bg-[#B7BDC5] p-10 rounded-[3rem] shadow-xl relative overflow-hidden min-h-[480px]">
                            <div className="absolute top-10 right-10 opacity-30 text-white pointer-events-none">
                                <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 30H20L30 10L50 50L60 20L70 40L80 30H120" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            
                            <h3 className="text-xl font-black text-[#5C6675] mb-12 relative z-10 uppercase tracking-widest">Active Deployments</h3>
                            
                            <div className="space-y-12 relative z-10">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-[#4E88F5] uppercase tracking-[0.3em]">Microsite Status</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-black text-[#5C6675]">{allUsers.filter(u => u.micrositeEnabled).length} Advisors Live</span>
                                        <div className="h-2.5 w-2.5 bg-[#22C55E] rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-[#4E88F5] uppercase tracking-[0.3em]">Pending Onboarding</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-black text-[#5C6675]">{jobApplications.filter(a => a.status === 'Pending').length} Apps Review</span>
                                        <button 
                                            onClick={() => navigate('/crm/onboarding')} 
                                            className="text-[10px] font-black bg-[#4E88F5] text-white px-5 py-2 rounded-xl hover:bg-blue-600 transition-all shadow-md uppercase tracking-widest"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-8 mt-12 border-t border-white/20">
                                    <button 
                                        onClick={() => navigate('/crm/admin/website')} 
                                        className="w-full py-5 bg-[#C9CFD7] text-[#5C6675] rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all flex items-center justify-center gap-3 shadow-inner border border-white/20"
                                    >
                                        <MonitorCheck size={18} /> Site Config
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#B7BDC5]/40 backdrop-blur-md p-10 rounded-[3rem] shadow-sm border border-white/50 min-h-[480px]">
                            <TaskList />
                        </div>
                    )}

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
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">{desc}</p>
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
