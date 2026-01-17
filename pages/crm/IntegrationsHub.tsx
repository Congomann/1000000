
import React, { useState } from 'react';
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
  X
} from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const integrations: Integration[] = [
    { id: '1', name: 'Slack', description: 'Real-time team communication and lead alerts.', category: 'Communication', icon: MessageSquare, status: 'connected', lastSync: '2m ago', color: 'text-purple-600 bg-purple-50' },
    { id: '2', name: 'Google Meet', description: 'Schedule video reviews directly from your NHFG calendar.', category: 'Communication', icon: Video, status: 'connected', lastSync: '1h ago', color: 'text-blue-600 bg-blue-50' },
    { id: '3', name: 'DocuSign', description: 'Securely send applications for e-signature.', category: 'Legal', icon: FileCheck, status: 'connected', lastSync: '4h ago', color: 'text-blue-800 bg-blue-100' },
    { id: '4', name: 'Outlook 365', description: 'Sync your professional inbox and contacts.', category: 'Productivity', icon: Mail, status: 'disconnected', color: 'text-sky-600 bg-sky-50' },
    { id: '5', name: 'Zoom', description: 'High-definition video conferencing for client webinars.', category: 'Communication', icon: Video, status: 'disconnected', color: 'text-blue-500 bg-blue-50' },
    { id: '6', name: 'Zapier', description: 'Connect NHFG to 5,000+ apps for automation.', category: 'Automation', icon: Zap, status: 'disconnected', color: 'text-orange-600 bg-orange-50' },
    { id: '7', name: 'Calendly', description: 'Automated scheduling for prospect discovery calls.', category: 'Productivity', icon: Calendar, status: 'pending', color: 'text-blue-700 bg-blue-50' },
  ];

  const handleSync = (id: string) => {
    setIsSyncing(id);
    setTimeout(() => setIsSyncing(null), 2000);
  };

  const categories = ['All', 'Communication', 'Productivity', 'Legal', 'Automation'];

  const filtered = integrations.filter(i => 
    (activeCategory === 'All' || i.category === activeCategory) &&
    (i.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">API Ecosystem</h1>
          <p className="text-slate-500 mt-2 font-medium">Extend your terminal with enterprise-grade third-party integrations.</p>
        </div>
        <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-[2rem] border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-[#0B2240] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search tools (e.g. DocuSign, Slack)..." 
          className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[2.5rem] text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none shadow-sm transition-all"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-[1.5rem] ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                  <item.icon size={28} />
                </div>
                <div className="flex flex-col items-end">
                  {item.status === 'connected' ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-full">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Connected
                    </span>
                  ) : item.status === 'pending' ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1.5 rounded-full">
                       Authorizing
                    </span>
                  ) : (
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
                      Offline
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{item.name}</h3>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed font-medium">{item.description}</p>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
              {item.status === 'connected' ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSync(item.id)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-all border border-slate-100"
                    title="Manual Data Sync"
                  >
                    <RefreshCw size={16} className={isSyncing === item.id ? 'animate-spin' : ''} />
                  </button>
                  <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-all border border-slate-100">
                    <Settings2 size={16} />
                  </button>
                </div>
              ) : (
                <button className="px-6 py-3 bg-[#0B2240] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20 hover:bg-blue-900 transition-all active:scale-95">
                  Authorize App
                </button>
              )}
              
              {item.lastSync && (
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Synced {item.lastSync}
                </span>
              )}
            </div>
          </div>
        ))}

        <div className="border-4 border-dashed border-slate-100 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-200 transition-all min-h-[320px]">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:scale-110 transition-all">
            <Plus className="text-slate-300 group-hover:text-blue-600" size={32} />
          </div>
          <h3 className="text-slate-400 font-black uppercase tracking-widest text-sm">Request Custom API</h3>
          <p className="text-slate-300 text-xs mt-2 font-medium">Missing a tool? Contact the NHFG Technical Team.</p>
        </div>
      </div>

      {/* Security Banner */}
      <div className="bg-[#0B2240] p-10 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 p-10 opacity-5 -rotate-12"><ShieldCheck size={200} /></div>
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl font-black tracking-tight uppercase">NHFG Data Security Gateway</h2>
          <p className="text-blue-200 text-sm font-medium">All third-party integrations use OAuth 2.0 with AES-256 encryption. Client data never leaves the terminal without multi-factor authorization.</p>
        </div>
        <div className="relative z-10 mt-6 md:mt-0">
          <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-full font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center gap-3">
             Audit Connection Logs <ExternalLink size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
};
