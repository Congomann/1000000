
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Zap, 
  Clock, 
  Play, 
  Pause, 
  Plus, 
  Bot,
  ShieldCheck,
  ChevronRight,
  Database,
  Smartphone,
  Cpu,
  Layers,
  Activity,
  RefreshCw
} from 'lucide-react';
import { LeadStatus } from '../../types';

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  status: 'active' | 'paused';
  impact: 'High' | 'Medium';
  category: 'Lead Nurture' | 'Compliance' | 'Operations';
  executionsYTD: number;
}

export const AutomationStudio: React.FC = () => {
  const { leads, applications, jobApplications } = useData();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const metrics = useMemo(() => {
    const totalLeads = leads.length;
    return {
      activeTasks: totalLeads + applications.length,
      timeSaved: (totalLeads * 15 + applications.length * 45) / 60,
      successRate: 99.8
    };
  }, [leads, applications]);

  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 'wf-1',
      name: 'Instant AI Follow-up',
      description: 'Automatically analyze new leads via Gemini and send personalized SMS/Email within 60 seconds of ingestion.',
      trigger: 'LEAD INGESTED (ANY SOURCE)',
      actions: ['AI ANALYSIS', 'DRAFT SMS', 'DISPATCH EMAIL'],
      status: 'active',
      impact: 'High',
      category: 'Lead Nurture',
      executionsYTD: 1245
    },
    {
      id: 'wf-2',
      name: 'Document Collection Sentinel',
      description: 'Trigger follow-ups every 48h until mandatory KYC/SSN documents are uploaded to the secure vault.',
      trigger: 'STATUS: PENDING DOCS',
      actions: ['SCAN VAULT', 'SMS REMINDER', 'LOG INTERACTION'],
      status: 'active',
      impact: 'High',
      category: 'Compliance',
      executionsYTD: 842
    },
    {
      id: 'wf-3',
      name: 'Renewal Radar',
      description: 'Scan policies 30 days before expiration and automatically initiate review meeting scheduling.',
      trigger: 'RENEWAL < 30 DAYS',
      actions: ['EMAIL CAMPAIGN', 'CALENDAR SYNC'],
      status: 'active',
      impact: 'Medium',
      category: 'Operations',
      executionsYTD: 312
    }
  ]);

  const handleToggleStatus = (id: string) => {
    setIsProcessing(id);
    setTimeout(() => {
        setWorkflows(prev => prev.map(wf => 
            wf.id === id ? { ...wf, status: wf.status === 'active' ? 'paused' : 'active' } : wf
        ));
        setIsProcessing(null);
    }, 600);
  };

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-400 rounded-lg shadow-lg shadow-yellow-400/20">
                  <Zap size={20} className="text-white fill-white" />
              </div>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Automation Framework v4.2</h2>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Logic Engine</h1>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-white/60 backdrop-blur-md p-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 px-6">
              <Activity size={14} className="text-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node: <span className="text-slate-800">Operational</span></span>
           </div>
           <button className="bg-[#0B2240] text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-900 transition-all flex items-center gap-3 active:scale-95 transform hover:-translate-y-1">
              <Plus size={16} strokeWidth={3} /> Define Workflow
           </button>
        </div>
      </div>

      {/* Logic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/60 shadow-sm flex items-center gap-8 group hover:bg-white transition-all">
            <div className="h-20 w-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
               <Bot size={36} />
            </div>
            <div>
               <p className="text-4xl font-black text-slate-900 tracking-tighter">{metrics.activeTasks.toLocaleString()}</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mt-1">Autonomous Executions</p>
            </div>
         </div>
         <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/60 shadow-sm flex items-center gap-8 group hover:bg-white transition-all">
            <div className="h-20 w-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
               <Clock size={36} />
            </div>
            <div>
               <p className="text-4xl font-black text-slate-900 tracking-tighter">{Math.floor(metrics.timeSaved)}h+</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mt-1">Human Bandwidth Saved</p>
            </div>
         </div>
         <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/60 shadow-sm flex items-center gap-8 group hover:bg-white transition-all">
            <div className="h-20 w-20 bg-amber-400 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-amber-400/20">
               <Cpu size={36} />
            </div>
            <div>
               <p className="text-4xl font-black text-slate-900 tracking-tighter">{metrics.successRate}%</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mt-1">Sync Integrity Rate</p>
            </div>
         </div>
      </div>

      {/* Main Workflow Terminal - Matches Screenshot */}
      <div className="grid grid-cols-1 gap-12">
          {workflows.map((wf) => (
            <div key={wf.id} className="bg-white/30 backdrop-blur-3xl rounded-[4rem] border border-white/80 shadow-sm overflow-hidden p-10 lg:p-16">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Content Section */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="px-5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-500 border border-rose-100/50">
                                {wf.impact} PRIORITY
                            </span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Layers size={14} /> {wf.category}
                            </span>
                        </div>
                        <h3 className="text-5xl font-black text-slate-400 tracking-tighter">{wf.name}</h3>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">{wf.description}</p>
                    </div>

                    {/* Logic Path - The Inner Box from Screenshot */}
                    <div className="bg-slate-50/50 backdrop-blur-xl rounded-[3rem] p-10 border border-white flex-shrink-0 w-full lg:w-[500px] shadow-inner relative overflow-hidden group">
                        <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.35em] mb-10 flex items-center gap-3">
                            <Database size={14} className="text-blue-400" /> Neural Chain Path
                        </h4>
                        
                        <div className="space-y-12">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.5)]"></div>
                                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{wf.trigger}</span>
                            </div>
                            
                            <div className="flex items-center justify-between gap-2 relative">
                                {/* Visual Connectors */}
                                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-slate-200 -z-10 mx-10"></div>
                                
                                {wf.actions.map((act, i) => (
                                    <div key={i} className="bg-white px-5 py-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{act}</span>
                                        {i < wf.actions.length - 1 && <ChevronRight size={14} className="text-slate-200" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Action Bar */}
                    <div className="flex flex-col items-end gap-6">
                        <div className="text-right">
                            <p className="text-3xl font-black text-slate-400 tracking-tighter">{wf.executionsYTD.toLocaleString()}</p>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mt-1">Instance Cycles</p>
                        </div>
                        <button 
                            onClick={() => handleToggleStatus(wf.id)}
                            className={`p-4 rounded-3xl transition-all shadow-lg active:scale-90 ${wf.status === 'active' ? 'bg-rose-50 text-rose-500 hover:bg-rose-100' : 'bg-green-50 text-green-500 hover:bg-green-100'}`}
                        >
                            {isProcessing === wf.id ? <RefreshCw className="animate-spin" /> : wf.status === 'active' ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
                        </button>
                    </div>
                </div>
            </div>
          ))}
      </div>

      {/* Emergency Control */}
      <div className="bg-[#0B2240] p-16 rounded-[4.5rem] text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 left-0 p-12 opacity-5 -rotate-12 transition-transform group-hover:rotate-0 duration-1000">
            <Zap size={300} />
         </div>
         <div className="relative z-10 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-red-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 mb-2">
                <ShieldCheck size={12} /> Mission Critical
            </div>
            <h2 className="text-4xl font-black tracking-tight uppercase leading-none">Emergency Re-Sync Mode</h2>
            <p className="text-blue-200 text-lg font-medium max-w-xl">Initiate a global logic refresh for all "In-Underwriting" records with detected compliance flags.</p>
         </div>
         <div className="relative z-10 mt-12 md:mt-0">
            <button className="px-16 py-8 bg-red-600 hover:bg-red-500 rounded-full font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-red-900/40 transition-all flex items-center gap-4 transform hover:scale-105 active:scale-95">
               Trigger Logic Pulse <Smartphone size={20} />
            </button>
         </div>
      </div>
    </div>
  );
};
