
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Backend } from '../../services/apiBackend';
import { Globe, Facebook, Linkedin, Copy, Check, Save, Zap, AlertCircle, History, Info, Play, Trash2, ShieldCheck, Database, Smartphone, Music, Key } from 'lucide-react';

export const MarketingIntegrations: React.FC = () => {
    const { integrationConfig, updateIntegrationConfig, simulateMarketingLead } = useData();
    const [activeTab, setActiveTab] = useState<'google' | 'meta' | 'tiktok' | 'logs'>('google');
    const [logs, setLogs] = useState<any[]>([]);
    const [copied, setCopied] = useState<string | null>(null);

    // Load logs from permanent backend on mount
    useEffect(() => {
        const fetchLogs = async () => {
            const data = await Backend.getLogs();
            setLogs(data);
        };
        fetchLogs();
    }, []);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleToggle = (platform: 'googleAds' | 'metaAds' | 'tiktokAds' | 'linkedinAds') => {
        const configKey = platform as keyof typeof integrationConfig;
        updateIntegrationConfig({
            [configKey]: { ...integrationConfig[configKey], enabled: !integrationConfig[configKey].enabled }
        });
    };

    const handleGoogleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateIntegrationConfig({
            googleAds: {
                ...integrationConfig.googleAds,
                developerToken: e.target.value
            }
        });
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0B2240] tracking-tight uppercase">API Marketing Terminal</h1>
                    <p className="text-slate-500 font-medium">Manage production ad-platform webhooks and ingestion logic.</p>
                </div>
                
                <div className="flex bg-white p-1 rounded-full border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
                    <button onClick={() => setActiveTab('google')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'google' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Google</button>
                    <button onClick={() => setActiveTab('meta')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'meta' ? 'bg-[#1877F2] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Meta</button>
                    <button onClick={() => setActiveTab('tiktok')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'tiktok' ? 'bg-black text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>TikTok</button>
                    <button onClick={() => setActiveTab('logs')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>API Trace</button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-6">
                    {/* Dynamic Panel based on tab */}
                    {activeTab === 'google' && (
                        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 animate-fade-in">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex gap-5">
                                    <div className="p-4 bg-red-50 text-red-500 rounded-3xl">
                                        <Globe className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800">Google Ads (Live API)</h2>
                                        <p className="text-slate-500 text-sm font-medium">Capture search-intent leads via Webhook extensions.</p>
                                    </div>
                                </div>
                                <button onClick={() => handleToggle('googleAds')} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${integrationConfig.googleAds.enabled ? 'bg-green-500' : 'bg-slate-200'}`}>
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${integrationConfig.googleAds.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            <div className="space-y-8">
                                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Webhook Production Endpoint</h3>
                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-mono text-slate-600 truncate">
                                            {integrationConfig.googleAds.webhookUrl}
                                        </div>
                                        <button onClick={() => handleCopy(integrationConfig.googleAds.webhookUrl, 'google-url')} className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-2xl shadow-sm">
                                            {copied === 'google-url' ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-2 tracking-wider">Developer Token</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            className="w-full bg-white text-slate-900 border border-slate-200 rounded-[2rem] px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent outline-none transition-all"
                                            placeholder="Enter Google Ads Developer Token"
                                            value={integrationConfig.googleAds.developerToken || ''}
                                            onChange={handleGoogleTokenChange}
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Key className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-3 ml-2 font-medium">Required for offline conversion imports and audience sync.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'meta' && (
                        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 animate-fade-in">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex gap-5">
                                    <div className="p-4 bg-[#1877F2]/10 text-[#1877F2] rounded-3xl">
                                        <Facebook className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800">Meta Ads (Facebook/Instagram)</h2>
                                        <p className="text-slate-500 text-sm font-medium">Sync leads from Lead Forms directly to CRM.</p>
                                    </div>
                                </div>
                                <button onClick={() => handleToggle('metaAds')} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${integrationConfig.metaAds.enabled ? 'bg-green-500' : 'bg-slate-200'}`}>
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${integrationConfig.metaAds.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                    <div className="mb-6">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Verify Token</h3>
                                        <input 
                                            readOnly
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-mono text-slate-600"
                                            value={integrationConfig.metaAds.verifyToken || 'nhfg_verification_token_secure'}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Callback URL</h3>
                                        <div className="flex gap-4">
                                            <div className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-mono text-slate-600 truncate">
                                                https://api.nhfg.com/webhooks/meta
                                            </div>
                                            <button onClick={() => handleCopy('https://api.nhfg.com/webhooks/meta', 'meta-url')} className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-2xl shadow-sm">
                                                {copied === 'meta-url' ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tiktok' && (
                        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 animate-fade-in">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex gap-5">
                                    <div className="p-4 bg-black text-white rounded-3xl">
                                        <Music className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800">TikTok For Business</h2>
                                        <p className="text-slate-500 text-sm font-medium">Instant form capture for high-volume campaigns.</p>
                                    </div>
                                </div>
                                <button onClick={() => handleToggle('tiktokAds')} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${integrationConfig.tiktokAds.enabled ? 'bg-green-500' : 'bg-slate-200'}`}>
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${integrationConfig.tiktokAds.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Webhook Subscription URL</h3>
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-mono text-slate-600 truncate">
                                        https://api.nhfg.com/webhooks/tiktok
                                    </div>
                                    <button onClick={() => handleCopy('https://api.nhfg.com/webhooks/tiktok', 'tiktok-url')} className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-2xl shadow-sm">
                                        {copied === 'tiktok-url' ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xl font-bold text-slate-800">API Event Stream</h3>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time DB Trace</span>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {logs.map(log => (
                                    <div key={log.id} className="p-6 hover:bg-slate-50/50 transition-colors flex gap-4">
                                        <div className={`mt-1 p-2 rounded-xl h-fit ${log.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            <Zap className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h4 className="font-bold text-slate-800 uppercase text-xs">{log.platform.replace('_', ' ')}: {log.event}</h4>
                                                <span className="text-[10px] text-slate-400 font-bold">{new Date(log.timestamp).toLocaleString()}</span>
                                            </div>
                                            <pre className="mt-2 p-3 bg-slate-900 text-green-400 text-[10px] rounded-xl overflow-x-auto max-h-32">
                                                {JSON.stringify(log.payload, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                ))}
                                {logs.length === 0 && (
                                    <div className="p-20 text-center text-slate-300">
                                        <History className="h-16 w-16 mx-auto mb-4 opacity-10" />
                                        <p className="font-bold uppercase tracking-widest text-sm">No API events detected.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="xl:col-span-1">
                    <div className="bg-[#0B2240] rounded-[2.5rem] p-8 shadow-xl text-white">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                            <Smartphone className="text-blue-400" />
                            Backend Simulator
                        </h3>
                        <p className="text-blue-100 text-sm mb-8">Test your production ingestion logic by simulating ad platform payloads directly into the permanent database.</p>
                        <div className="space-y-4">
                            <button 
                                onClick={() => simulateMarketingLead('google_ads', {})}
                                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-left flex items-center justify-between group"
                            >
                                <span className="font-bold text-sm">Test Google Webhook</span>
                                <Play className="h-4 w-4 opacity-40 group-hover:opacity-100" />
                            </button>
                            <button 
                                onClick={() => simulateMarketingLead('meta_ads', {})}
                                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-left flex items-center justify-between group"
                            >
                                <span className="font-bold text-sm">Test Meta Feed</span>
                                <Play className="h-4 w-4 opacity-40 group-hover:opacity-100" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
