import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Puzzle, 
  CheckCircle2, 
  Plus, 
  ExternalLink, 
  MessageSquare, 
  Mail, 
  Calendar, 
  Video, 
  FileCheck, 
  Zap,
  RefreshCw,
  Search,
  ShieldCheck,
  Settings2,
  X,
  BrainCircuit,
  Loader2,
  AlertCircle,
  // Added Sparkles import to fix the error on line 154
  Sparkles
} from 'lucide-react';
import { analyzeApiLogs } from '../../services/geminiService';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'Communication' | 'Productivity' | 'Legal' | 'Automation';
  icon: any;
  status: 'connected' | 'disconnected' | 'pending';
  lastSync?: string;
  color: string;
}

export const IntegrationsHub: React.FC = () => {
  const { integrationLogs } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  
  // Intelligence State
  const [isAnalyzingLog, setIsAnalyzingLog] = useState<string | null>(null);
  const [logAnalysis, setLogAnalysis] = useState<{id: string, text: string} | null>(null);

  const integrations: Integration[] = [
    { id: '1', name: 'Slack', description: 'Real-time team communication and lead alerts.', category: 'Communication', icon: MessageSquare, status: 'connected', lastSync: '2m ago', color: 'text-purple-600 bg-purple-50' },
    { id: '2', name: 'Google Meet', description: 'Schedule video reviews directly from your NHFG calendar.', category: 'Communication', icon: Video, status: 'connected', lastSync: '1h ago', color: 'text-blue-600 bg-blue-50' },
    { id: '3', name: 'DocuSign', description: 'Securely send applications for e-signature.', category: 'Legal', icon: FileCheck, status: 'connected', lastSync: '4h ago', color: 'text-blue-800 bg-blue-100' },
    { id: '4', name: 'Outlook 365', description: 'Sync your professional inbox and contacts.', category: 'Productivity', icon: Mail, status: 'disconnected', color: 'text-sky-600 bg-sky-50' },
    { id: '6', name: 'Zapier', description: 'Connect NHFG to 5,000+ apps for automation.', category: 'Automation', icon: Zap, status: 'disconnected', color: 'text-orange-600 bg-orange-50' },
    { id: '7', name: 'Calendly', description: 'Automated scheduling for prospect discovery calls.', category: 'Productivity', icon: Calendar, status: 'pending', color: 'text-blue-700 bg-blue-50' },
  ];

  const handleSync = (id: string) => {
    setIsSyncing(id);
    setTimeout(() => setIsSyncing(null), 2000);
  };

  const handleAnalyzeLog = async (log: any) => {
    setIsAnalyzingLog(log.id);
    const result = await analyzeApiLogs(log.payload);
    setLogAnalysis({ id: log.id, text: result });
    setIsAnalyzingLog(null);
  };

  const categories = ['All', 'Communication', 'Productivity', 'Legal', 'Automation'];
  const filtered = integrations.filter(i => (activeCategory === 'All' || i.category === activeCategory) && i.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">API Ecosystem</h1>
          <p className="text-slate-500 mt-2 font-medium">Extend your terminal with enterprise-grade third-party integrations.</p>
        </div>
        <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-[2rem] border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-[#0B2240] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-[1.5rem] ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                  <item.icon size={28} />
                </div>
                {item.status === 'connected' && (
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-full">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Connected
                    </span>
                )}
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{item.name}</h3>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed font-medium">{item.description}</p>
            </div>
            <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
              {item.status === 'connected' ? (
                <div className="flex gap-2">
                  <button onClick={() => handleSync(item.id)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 border border-slate-100"><RefreshCw size={16} className={isSyncing === item.id ? 'animate-spin' : ''} /></button>
                  <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 border border-slate-100"><Settings2 size={16} /></button>
                </div>
              ) : (
                <button className="px-6 py-3 bg-[#0B2240] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20 hover:bg-blue-900 transition-all active:scale-95">Authorize App</button>
              )}
              {item.lastSync && <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Synced {item.lastSync}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* API Intelligence Traces */}
      <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 p-10">
          <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem]"><BrainCircuit size={28}/></div>
              <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Intelligence Trace Logs</h2>
                  <p className="text-slate-500 text-sm font-medium">Use Gemini 3 Flash to decipher raw ad-platform payloads instantly.</p>
              </div>
          </div>

          <div className="space-y-4">
              {integrationLogs.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active webhook traffic detected.</p>
                  </div>
              ) : (
                  integrationLogs.slice(0, 5).map(log => (
                      <div key={log.id} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 group">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div className="flex items-center gap-4">
                                  <div className={`p-2 rounded-xl ${log.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}><Zap size={18}/></div>
                                  <div>
                                      <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">{log.platform.replace('_', ' ')} : {log.event}</h4>
                                      <p className="text-[10px] text-slate-400 font-bold">{new Date(log.timestamp).toLocaleString()}</p>
                                  </div>
                              </div>
                              <button 
                                onClick={() => handleAnalyzeLog(log)}
                                disabled={isAnalyzingLog === log.id}
                                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-md transition-all active:scale-95 disabled:opacity-50"
                              >
                                  {isAnalyzingLog === log.id ? <Loader2 size={12} className="animate-spin" /> : <BrainCircuit size={12} />}
                                  Explain with AI
                              </button>
                          </div>
                          {logAnalysis?.id === log.id && (
                              <div className="mt-6 p-5 bg-blue-50 border border-blue-100 rounded-2xl animate-fade-in relative">
                                  <button onClick={() => setLogAnalysis(null)} className="absolute top-2 right-2 text-blue-300 hover:text-blue-500"><X size={14}/></button>
                                  <h5 className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><Sparkles size={10}/> Neural Insights</h5>
                                  <p className="text-xs text-blue-900 font-bold leading-relaxed">{logAnalysis.text}</p>
                              </div>
                          )}
                      </div>
                  ))
              )}
          </div>
      </div>
    </div>
  );
};
