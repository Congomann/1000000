import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Zap, 
  Clock, 
  Bot,
  Database,
  Smartphone,
  Cpu,
  Layers,
  Activity,
  X,
  Plus,
  Terminal,
  Brain,
  ChevronRight,
  ShieldCheck,
  Pause,
  Play,
  PlayCircle,
  PlusCircle,
  Trash2,
  Loader2,
  CheckCircle2,
  ChevronDown,
  BrainCircuit,
  UserCheck
} from 'lucide-react';
import { Workflow, WorkflowTrigger } from '../../types';

export const AutomationStudio: React.FC = () => {
  const { automationMetrics, workflows, addWorkflow, toggleWorkflow, processingLeads, leads } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentSuccess, setDeploymentSuccess] = useState(false);
  
  // Architect State
  const [wfName, setWfName] = useState('');
  const [wfTrigger, setWfTrigger] = useState<WorkflowTrigger>(WorkflowTrigger.LEAD_INGESTION);
  const [wfActions, setWfActions] = useState<string[]>([]);
  const [newActionText, setNewActionText] = useState('');

  const handleInsertAction = () => {
      if (newActionText.trim()) {
          setWfActions(prev => [...prev, newActionText.trim().toUpperCase()]);
          setNewActionText('');
      }
  };

  const handleRemoveAction = (idx: number) => {
      setWfActions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDeploy = async () => {
      if (!wfName.trim() || wfActions.length === 0) {
          alert("Workflow must have a name and at least one neural action.");
          return;
      }

      setIsDeploying(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      addWorkflow({
          name: wfName,
          trigger: wfTrigger,
          actions: wfActions,
          description: `Autonomous path triggered by ${wfTrigger} executing ${wfActions.length} neural nodes.`,
          impact: 'HIGH',
          category: 'LEAD NURTURE'
      });

      setIsDeploying(false);
      setDeploymentSuccess(true);
      
      setTimeout(() => {
          setWfName('');
          setWfTrigger(WorkflowTrigger.LEAD_INGESTION);
          setWfActions([]);
          setDeploymentSuccess(false);
          setIsModalOpen(false);
      }, 1500);
  };

  const MetricCard = ({ icon: Icon, value, label, iconBg }: any) => (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-200 flex items-center gap-10 flex-1 transition-all hover:shadow-2xl group">
      <div className={`h-24 w-24 rounded-[2.5rem] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform ${iconBg}`}>
        <Icon size={44} />
      </div>
      <div>
        <p className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-2">{value}</p>
        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-24 animate-fade-in bg-[#F1F5F9] min-h-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                  <Zap size={18} className="text-white fill-white" />
              </div>
              <h2 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Automation Framework v4.2</h2>
          </div>
          <h1 className="text-6xl font-black text-[#0B2240] tracking-tighter">Logic Engine</h1>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="bg-white p-3 rounded-full border border-slate-200 shadow-md flex items-center gap-3 px-8">
              <div className={`h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] ${processingLeads.length > 0 ? 'bg-blue-500 animate-bounce' : 'bg-green-500 animate-pulse'}`}></div>
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-[0.3em]">Node: <span className={processingLeads.length > 0 ? 'text-blue-600' : 'text-green-600'}>{processingLeads.length > 0 ? 'Processing Lead' : 'Operational'}</span></span>
           </div>
           <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1E293B] text-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-slate-800 transition-all flex items-center gap-3 active:scale-95"
           >
              <Plus size={18} strokeWidth={4} /> Define Workflow
           </button>
        </div>
      </div>

      {/* Live Monitor Ingestion Strip */}
      {processingLeads.length > 0 && (
          <div className="bg-[#0B2240] p-6 rounded-full border border-white/10 shadow-2xl flex items-center justify-between animate-fade-in px-10">
              <div className="flex items-center gap-6">
                  <div className="p-3 bg-blue-500/20 text-blue-400 rounded-full animate-pulse"><BrainCircuit size={20}/></div>
                  <div>
                      <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest leading-none mb-1">Live Ingestion Stream</p>
                      <p className="text-sm font-bold text-white">Analyzing: <span className="text-blue-300">{leads.find(l => l.id === processingLeads[0].leadId)?.name || 'Incoming Lead...'}</span></p>
                  </div>
              </div>
              <div className="flex items-center gap-10">
                  <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Step:</span>
                      <span className="text-xs font-black text-white uppercase tracking-widest bg-blue-600 px-3 py-1 rounded-lg animate-pulse">{processingLeads[0].activeNode}</span>
                  </div>
                  <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
              </div>
          </div>
      )}

      {/* Main Metrics */}
      <div className="flex flex-col lg:flex-row gap-8">
        <MetricCard 
          icon={Bot} 
          value={automationMetrics?.executions.toLocaleString() || 0} 
          label="Autonomous Executions" 
          iconBg="bg-blue-600" 
        />
        <MetricCard 
          icon={Clock} 
          value={`${Math.floor((automationMetrics?.bandwidthSaved || 0) / 60)}h+`} 
          label="Human Bandwidth Saved" 
          iconBg="bg-emerald-600" 
        />
        <MetricCard 
          icon={Cpu} 
          value="99.8%" 
          label="Sync Integrity Rate" 
          iconBg="bg-amber-500" 
        />
      </div>

      {/* Workflow Engine - High Contrast Cards */}
      <div className="space-y-12">
          {workflows.map((wf) => {
            const isWfProcessing = processingLeads.length > 0 && wf.id === 'wf-1'; // Hardcoded for intake logic demo
            return (
                <div key={wf.id} className={`bg-white rounded-[4rem] border shadow-2xl overflow-hidden p-12 lg:p-20 group relative transition-all duration-500 ${isWfProcessing ? 'border-blue-400 ring-4 ring-blue-50' : 'border-slate-200'}`}>
                    {isWfProcessing && (
                        <div className="absolute top-0 right-0 p-12">
                            <span className="flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                            </span>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                        {/* Info Side - Increased Visibility */}
                        <div className="flex-1 space-y-8">
                            <div className="flex items-center gap-4">
                                <span className="px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-rose-600 text-white shadow-lg">
                                    {wf.impact} PRIORITY
                                </span>
                                <span className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em] flex items-center gap-3">
                                    <Layers size={16} className="text-blue-600" /> {wf.category}
                                </span>
                            </div>
                            <h3 className="text-7xl font-black text-[#0B2240] tracking-tighter leading-none">{wf.name}</h3>
                            <p className="text-slate-600 text-xl font-bold leading-relaxed max-w-2xl">{wf.description}</p>
                        </div>

                        {/* Visual Path Module - Dark Mode Contrast */}
                        <div className="bg-[#0F172A] rounded-[4rem] p-12 border border-slate-700 flex-shrink-0 w-full lg:w-[600px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden">
                            {/* Technical Background Elements */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                <Brain size={400} className="text-white" />
                            </div>

                            <div className="flex items-center justify-between mb-12">
                                <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] flex items-center gap-3">
                                    <Database size={16} className="text-blue-400" /> Neural Chain Path
                                </h4>
                                <Activity size={16} className={`text-blue-400 ${isWfProcessing ? 'animate-pulse text-blue-300' : ''}`} />
                            </div>
                            
                            <div className="space-y-14 relative z-10">
                                {/* Trigger Dot Line */}
                                <div className="flex items-center gap-5">
                                    <div className={`w-5 h-5 rounded-full ${isWfProcessing ? 'bg-blue-400 shadow-[0_0_30px_rgba(96,165,250,0.9)] animate-ping' : 'bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-pulse'}`}></div>
                                    <span className={`text-base font-black uppercase tracking-[0.2em] ${isWfProcessing ? 'text-blue-300' : 'text-white'}`}>{wf.trigger}</span>
                                </div>
                                
                                {/* Path Sequence - Dark Tech Look */}
                                <div className="flex items-center justify-start gap-4 relative overflow-x-auto no-scrollbar pb-4">
                                    {/* Connector Line */}
                                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-slate-700 -z-10 mx-6"></div>
                                    
                                    {wf.actions.map((act, i) => {
                                        const isStepActive = isWfProcessing && processingLeads[0].activeNode === act;
                                        return (
                                            <React.Fragment key={i}>
                                                <div className={`px-6 py-4 rounded-2xl border shadow-xl flex items-center justify-center min-w-[140px] shrink-0 transform transition-all duration-500 border-l-4 ${
                                                    isStepActive 
                                                    ? 'bg-blue-900/50 border-blue-400 scale-110 border-l-white ring-4 ring-blue-500/20' 
                                                    : 'bg-slate-800 border-slate-600 border-l-blue-500 opacity-70 group-hover:opacity-100'
                                                }`}>
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${isStepActive ? 'text-white' : 'text-blue-100'}`}>{act}</span>
                                                    {isStepActive && <Loader2 size={10} className="ml-2 animate-spin text-white" />}
                                                </div>
                                                {i < wf.actions.length - 1 && (
                                                    <ChevronRight size={18} className={`shrink-0 transition-colors ${isStepActive ? 'text-blue-400' : 'text-slate-500'}`} />
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Workflow Controls */}
                        <div className="flex flex-col items-end gap-8">
                            <div className="text-right">
                                <p className="text-5xl font-black text-[#0B2240] tracking-tighter leading-none">{wf.executionsYTD.toLocaleString()}</p>
                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3">Instance Cycles</p>
                            </div>
                            <button 
                                onClick={() => toggleWorkflow(wf.id)}
                                className={`p-6 rounded-[2.5rem] transition-all shadow-2xl active:scale-95 flex items-center justify-center transform hover:rotate-3 ${wf.status === 'active' ? 'bg-[#0B2240] text-white' : 'bg-green-600 text-white hover:bg-green-700'}`}
                            >
                                {wf.status === 'active' ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                            </button>
                        </div>
                    </div>
                </div>
            );
          })}
      </div>

      {/* Global Pulse Section - High Contrast Footer */}
      <div className="bg-[#1E293B] p-16 rounded-[5rem] text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden group border border-slate-700">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none transform group-hover:scale-110 transition-transform duration-[5s]">
            <Zap size={600} strokeWidth={1} />
         </div>

         <div className="relative z-10 space-y-6 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-3 bg-blue-500/20 px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-blue-400 border border-blue-500/30 shadow-sm backdrop-blur-sm">
                <ShieldCheck size={14} className="animate-pulse" /> Global System Sync
            </div>
            <h2 className="text-6xl font-black tracking-tight uppercase leading-none">Trigger Logic Pulse</h2>
            <p className="text-slate-300 text-xl font-bold leading-relaxed">Instantly force-recalibrate all Neural Chain nodes across the terminal to resolve high-priority lead pipelines.</p>
         </div>
         <div className="relative z-10 mt-12 md:mt-0">
            <button 
              className="px-20 py-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black text-sm uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all flex items-center gap-5 transform hover:scale-105 active:scale-95"
            >
               Initiate Pulse <Terminal size={24} />
            </button>
         </div>
      </div>

      {/* Workflow Architect Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B2240]/90 backdrop-blur-xl p-4 animate-fade-in">
              <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-5xl p-16 relative border border-white/20">
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    disabled={isDeploying}
                    className="absolute top-10 right-10 p-4 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-400 transition-all disabled:opacity-50"
                  >
                    <X size={32}/>
                  </button>
                  
                  {deploymentSuccess ? (
                      <div className="text-center py-20 animate-fade-in">
                          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce-subtle">
                              <CheckCircle2 size={60} />
                          </div>
                          <h2 className="text-5xl font-black text-[#0B2240] tracking-tight uppercase">Node Operational</h2>
                          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-4">Logic sequence has been provisioned to the cluster.</p>
                      </div>
                  ) : (
                      <>
                        <div className="flex items-center gap-5 mb-12">
                            <div className="p-4 bg-blue-600 text-white rounded-[2rem] shadow-xl">
                                <BrainCircuit size={40} />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-[#0B2240] tracking-tighter uppercase">Workflow Architect</h2>
                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Configure Autonomous Neural Path</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            {/* Left: Configuration */}
                            <div className="space-y-10">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-1">Workflow Name</label>
                                    <input 
                                        className="w-full bg-slate-100 border-2 border-transparent focus:border-blue-600 rounded-[1.5rem] px-8 py-5 text-sm font-black text-slate-800 outline-none transition-all shadow-inner" 
                                        placeholder="e.g. Wealth Strategy Dispatch" 
                                        value={wfName}
                                        disabled={isDeploying}
                                        onChange={e => setWfName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-1">Trigger Event</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full bg-slate-100 border-2 border-transparent focus:border-blue-600 rounded-[1.5rem] px-8 py-5 text-sm font-black text-slate-800 outline-none appearance-none cursor-pointer shadow-inner"
                                            value={wfTrigger}
                                            disabled={isDeploying}
                                            onChange={e => setWfTrigger(e.target.value as WorkflowTrigger)}
                                        >
                                            {Object.values(WorkflowTrigger).map(trigger => (
                                                <option key={trigger} value={trigger}>{trigger}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Build Sequence */}
                            <div className="space-y-4">
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-1">Logic Chain</label>
                                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6 shadow-inner min-h-[300px] flex flex-col">
                                    
                                    {/* Start Node */}
                                    <div className="flex items-center justify-between p-5 bg-slate-800 rounded-2xl border border-slate-700 shadow-md">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                                                <PlayCircle size={18} />
                                            </div>
                                            <span className="text-xs font-black text-white uppercase tracking-widest">Start Path</span>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-500" />
                                    </div>

                                    {/* Dynamic Action Nodes */}
                                    {wfActions.map((action, idx) => (
                                        <div key={idx} className="flex items-center gap-3 animate-slide-up">
                                            <div className="flex-1 flex items-center justify-between p-5 bg-slate-800 rounded-2xl border border-blue-500/30 shadow-xl border-l-4 border-l-blue-500">
                                                <span className="text-xs font-black text-blue-100 uppercase tracking-widest">{action}</span>
                                                <button 
                                                    disabled={isDeploying}
                                                    onClick={() => handleRemoveAction(idx)} 
                                                    className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            {idx < wfActions.length - 1 && <ChevronRight size={16} className="text-slate-600" />}
                                        </div>
                                    ))}

                                    {/* Action Input - Dark Mode UI */}
                                    {!isDeploying && (
                                        <div className="mt-auto space-y-3 pt-6 border-t border-slate-800">
                                            <div className="flex gap-2">
                                                <input 
                                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-600 shadow-inner" 
                                                    placeholder="Enter neural action..." 
                                                    value={newActionText}
                                                    onChange={e => setNewActionText(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && handleInsertAction()}
                                                />
                                                <button 
                                                    onClick={handleInsertAction}
                                                    className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-md active:scale-90"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="pt-16 flex gap-6 border-t border-slate-100 mt-8">
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                disabled={isDeploying}
                                className="flex-1 py-6 rounded-[1.5rem] font-black text-xs bg-slate-100 text-slate-400 uppercase tracking-[0.3em] hover:bg-slate-200 transition-all active:scale-95"
                            >
                                Discard Draft
                            </button>
                            <button 
                                onClick={handleDeploy}
                                disabled={isDeploying || wfActions.length === 0}
                                className="flex-1 py-6 rounded-[1.5rem] font-black text-xs bg-blue-600 text-white uppercase tracking-[0.3em] hover:bg-blue-700 shadow-2xl shadow-blue-600/40 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {isDeploying ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" /> Provisioning Node...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={16} className="fill-current" /> Deploy to Production
                                    </>
                                )}
                            </button>
                        </div>
                      </>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};
