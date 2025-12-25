
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Globe, Facebook, Linkedin, Copy, Check, Save, Zap, AlertCircle, History, Info, Play, Trash2, ShieldCheck, Database } from 'lucide-react';

export const MarketingIntegrations: React.FC = () => {
    const { integrationConfig, updateIntegrationConfig, integrationLogs, simulateMarketingLead } = useData();
    const [activeTab, setActiveTab] = useState<'google' | 'meta' | 'linkedin' | 'logs'>('google');
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleToggle = (platform: 'googleAds' | 'metaAds' | 'linkedinAds') => {
        updateIntegrationConfig({
            [platform]: { ...integrationConfig[platform], enabled: !integrationConfig[platform].enabled }
        });
    };

    // Simulation Handlers
    const testGoogle = () => {
        simulateMarketingLead('google_ads', {
            campaign_id: 'GADS_LIFE_2025',
            adgroup_id: 'AG_TERM',
            ad_id: 'AD_001',
            full_name: 'Google Test Lead',
            email: 'google@test.com',
            phone_number: '555-000-1111',
            timestamp: new Date().toISOString()
        });
    };

    const testMeta = () => {
        simulateMarketingLead('meta_ads', {
            id: 'META_123456',
            form_id: 'FORM_FACEBOOK_01',
            campaign_id: 'FB_BUSINESS_INS',
            full_name: 'Meta Test Lead',
            email: 'meta@test.com',
            phone_number: '555-000-2222'
        });
    };

    const testLinkedIn = () => {
        simulateMarketingLead('linkedin_ads', {
            formId: 'LI_FORM_99',
            campaignId: 'LI_RET_PLAN',
            firstName: 'LinkedIn',
            lastName: 'Test Lead',
            email: 'linkedin@test.com',
            phone: '555-000-3333',
            jobTitle: 'Financial Analyst',
            company: 'Sample Corp'
        });
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0B2240] tracking-tight">Marketing Integrations</h1>
                    <p className="text-slate-500 font-medium">Connect external ad platforms to automate lead ingestion.</p>
                </div>
                
                <div className="flex bg-white p-1 rounded-full border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
                    <button onClick={() => setActiveTab('google')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'google' ? 'bg-[#0B2240] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Google</button>
                    <button onClick={() => setActiveTab('meta')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'meta' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Meta</button>
                    <button onClick={() => setActiveTab('linkedin')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'linkedin' ? 'bg-[#0077B5] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>LinkedIn</button>
                    <button onClick={() => setActiveTab('logs')} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Event Logs</button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                <div className="xl:col-span-2 space-y-6">
                    {activeTab === 'google' && (
                        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 animate-fade-in">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex gap-5">
                                    <div className="p-4 bg-red-50 text-red-500 rounded-3xl">
                                        <Globe className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800">Google Ads Lead Forms</h2>
                                        <p className="text-slate-500 text-sm font-medium">Webhook-based ingestion for Search & Video campaigns.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleToggle('googleAds')}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${integrationConfig.googleAds.enabled ? 'bg-green-500' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${integrationConfig.googleAds.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Webhook Endpoint</h3>
                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-mono text-slate-600 truncate">
                                            {integrationConfig.googleAds.webhookUrl}
                                        </div>
                                        <button 
                                            onClick={() => handleCopy(integrationConfig.googleAds.webhookUrl, 'google-url')}
                                            className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-2xl shadow-sm transition-all"
                                        >
                                            {copied === 'google-url' ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-wide flex items-center gap-2">
                                        <Info className="h-3 w-3" /> Paste this URL into your Google Ads Form Extension settings.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-6 bg-white border border-slate-200 rounded-[2rem]">
                                        <h4 className="text-sm font-bold text-slate-700 mb-4">Ingestion Status</h4>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                            <div className={`h-2 w-2 rounded-full ${integrationConfig.googleAds.enabled ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                            {integrationConfig.googleAds.enabled ? 'Listening for Webhooks' : 'Integration Offline'}
                                        </div>
                                    </div>
                                    <div className="p-6 bg-white border border-slate-200 rounded-[2rem]">
                                        <h4 className="text-sm font-bold text-slate-700 mb-4">Deduplication</h4>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                            <ShieldCheck className="h-5 w-5 text-blue-500" />
                                            Active: Email + Phone Match
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'meta' && (
                        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 animate-fade-in">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex gap-5">
                                    <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl">
                                        <Facebook className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800">Meta Instant Forms</h2>
                                        <p className="text-slate-500 text-sm font-medium">Real-time lead sync for Facebook & Instagram Ads.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleToggle('metaAds')}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${integrationConfig.metaAds.enabled ? 'bg-green-500' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${integrationConfig.metaAds.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Verify Token</h3>
                                        <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
                                            <span className="text-xs font-mono font-bold text-slate-600 truncate">{integrationConfig.metaAds.verifyToken}</span>
                                            <button onClick={() => handleCopy(integrationConfig.metaAds.verifyToken, 'meta-token')} className="text-slate-300 hover:text-blue-500"><Copy size={14}/></button>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">First Touch Lock</h3>
                                        <div className="flex items-center gap-2 text-blue-700 font-black text-xs uppercase tracking-tighter">
                                            <Database size={16}/> meta_ads attribution
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'linkedin' && (
                        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 animate-fade-in">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex gap-5">
                                    <div className="p-4 bg-sky-50 text-sky-600 rounded-3xl">
                                        <Linkedin className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800">LinkedIn Lead Gen</h2>
                                        <p className="text-slate-500 text-sm font-medium">Periodic polling service for LinkedIn Campaign Manager.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleToggle('linkedinAds')}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${integrationConfig.linkedinAds.enabled ? 'bg-green-500' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${integrationConfig.linkedinAds.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-700 mb-4">Polling Frequency</h3>
                                    <div className="flex items-center gap-6">
                                        <input 
                                            type="range" min="5" max="60" step="5"
                                            className="flex-1 accent-[#0077B5]"
                                            value={integrationConfig.linkedinAds.pollingInterval}
                                            onChange={e => updateIntegrationConfig({ linkedinAds: { ...integrationConfig.linkedinAds, pollingInterval: parseInt(e.target.value) } })}
                                        />
                                        <span className="font-black text-xl text-[#0077B5] w-24 text-right">{integrationConfig.linkedinAds.pollingInterval} mins</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden animate-fade-in min-h-[600px] flex flex-col">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xl font-bold text-slate-800">Integration Event Stream</h3>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">Clear History</button>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto max-h-[700px] no-scrollbar">
                                {integrationLogs.map(log => (
                                    <div key={log.id} className="p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors flex gap-6">
                                        <div className={`mt-1 p-2 rounded-xl flex-shrink-0 ${log.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {log.status === 'success' ? <Zap className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-slate-900">{log.event}</h4>
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                                    log.platform === 'google_ads' ? 'bg-red-100 text-red-700' :
                                                    log.platform === 'meta_ads' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-[#0077B5]/10 text-[#0077B5]'
                                                }`}>{log.platform.replace('_', ' ')}</span>
                                                <span className={`text-[10px] font-bold ${log.status === 'success' ? 'text-green-600' : 'text-red-500'}`}>{log.status.toUpperCase()}</span>
                                            </div>
                                            {log.error && <p className="text-xs bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 mb-3 font-bold">{log.error}</p>}
                                            <div className="bg-slate-900 rounded-2xl p-4 text-[11px] font-mono text-green-400 overflow-x-auto max-h-40">
                                                <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {integrationLogs.length === 0 && (
                                    <div className="p-20 text-center text-slate-300">
                                        <History className="h-16 w-16 mx-auto mb-4 opacity-10" />
                                        <p className="font-bold uppercase tracking-[0.2em] text-sm">No Events Recorded</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="xl:col-span-1 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">Testing Lab</h3>
                        <div className="space-y-4">
                            <button 
                                onClick={testGoogle}
                                className="w-full group p-5 bg-white border border-slate-200 rounded-[2rem] hover:bg-red-50 hover:border-red-200 transition-all text-left flex items-center gap-4"
                            >
                                <div className="p-3 bg-red-100 text-red-600 rounded-2xl group-hover:scale-110 transition-transform"><Play className="h-4 w-4 fill-current"/></div>
                                <div className="flex-1">
                                    <p className="font-black text-slate-700 text-sm">Simulate Google Lead</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Test Webhook & Norm</p>
                                </div>
                            </button>
                            <button 
                                onClick={testMeta}
                                className="w-full group p-5 bg-white border border-slate-200 rounded-[2rem] hover:bg-blue-50 hover:border-blue-200 transition-all text-left flex items-center gap-4"
                            >
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform"><Play className="h-4 w-4 fill-current"/></div>
                                <div className="flex-1">
                                    <p className="font-black text-slate-700 text-sm">Simulate Meta Lead</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Test Graph API Payload</p>
                                </div>
                            </button>
                            <button 
                                onClick={testLinkedIn}
                                className="w-full group p-5 bg-white border border-slate-200 rounded-[2rem] hover:bg-sky-50 hover:border-sky-200 transition-all text-left flex items-center gap-4"
                            >
                                <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl group-hover:scale-110 transition-transform"><Play className="h-4 w-4 fill-current"/></div>
                                <div className="flex-1">
                                    <p className="font-black text-slate-700 text-sm">Simulate LinkedIn Lead</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Test Polling Logic</p>
                                </div>
                            </button>
                        </div>
                        
                        <div className="mt-10 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Zap className="h-3 w-3" /> System Specs
                            </h4>
                            <ul className="space-y-2 text-[10px] text-blue-600 font-bold uppercase leading-relaxed">
                                <li>• Deduplication: Email + Phone</li>
                                <li>• Attribution: source_lock_on_creation</li>
                                <li>• Failure Logic: 48hr Retry Window</li>
                                <li>• Stack: Node.js / Express (Cloud Run)</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
