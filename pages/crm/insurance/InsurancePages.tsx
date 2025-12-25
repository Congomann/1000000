
import React, { useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { ApplicationStatus, LeadStatus, ProductType } from '../../../types';
import { FileText, CheckCircle, Hourglass, XCircle, Briefcase, Car, Truck, AlertTriangle, RefreshCw, Plus, Search, Filter } from 'lucide-react';

const StatusBadge = ({ status }: { status: string }) => {
    let color = 'bg-slate-100 text-slate-700';
    if (['Approved', 'Issued', 'Active'].includes(status)) color = 'bg-green-100 text-green-700';
    if (['Pending', 'Underwriting', 'New'].includes(status)) color = 'bg-yellow-100 text-yellow-700';
    if (['Declined', 'Lost', 'Expired'].includes(status)) color = 'bg-red-100 text-red-700';
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${color}`}>{status}</span>;
};

// --- 1. Policies & Apps ---
export const PoliciesApps: React.FC = () => {
    const { applications, updateApplicationStatus, user } = useData();
    
    // In a real app, verify user.id matches lead.assignedTo for strict data visibility
    const myApps = applications; // Using all for demo visibility

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B2240]">Policies & Applications</h1>
                    <p className="text-slate-500">Track application status from submission to issuance.</p>
                </div>
            </div>
            
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Carrier</th>
                            <th className="px-6 py-4">Policy #</th>
                            <th className="px-6 py-4">Premium</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {myApps.map(app => (
                            <tr key={app.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-bold text-slate-900">{app.clientName}</td>
                                <td className="px-6 py-4">{app.carrier}</td>
                                <td className="px-6 py-4 font-mono text-xs">{app.policyNumber}</td>
                                <td className="px-6 py-4 font-medium">${app.premium.toLocaleString()}</td>
                                <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                                <td className="px-6 py-4 text-right">
                                    <select 
                                        className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={app.status}
                                        onChange={(e) => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                                    >
                                        {Object.values(ApplicationStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {myApps.length === 0 && <div className="p-8 text-center text-slate-400 italic">No applications found.</div>}
            </div>
        </div>
    );
};

// --- 2. Commercial Quotes ---
export const CommercialQuotes: React.FC = () => {
    const { leads, user } = useData();
    
    // Filter leads interested in Commercial/Business
    const commercialLeads = leads.filter(l => 
        [ProductType.BUSINESS, ProductType.COMMERCIAL, ProductType.EO].includes(l.interest) &&
        (l.assignedTo === user?.id || !l.assignedTo) // Show assigned or pool
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0B2240]">Commercial Quotes</h1>
                <p className="text-slate-500">Manage B2B leads and commercial insurance requests.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                {commercialLeads.map(lead => (
                    <div key={lead.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{lead.name}</h3>
                                <p className="text-sm text-slate-500">{lead.message}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded font-medium text-slate-600">{lead.interest}</span>
                                    <StatusBadge status={lead.status} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="text-xs font-bold text-slate-400">Score: {lead.score} ({lead.qualification})</span>
                            <button className="px-5 py-2 bg-purple-600 text-white rounded-full text-xs font-bold hover:bg-purple-700 transition-colors">
                                View Quote
                            </button>
                        </div>
                    </div>
                ))}
                {commercialLeads.length === 0 && <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">No active commercial quotes.</div>}
            </div>
        </div>
    );
};

// --- 3. Policies & Renewals ---
export const PoliciesRenewals: React.FC = () => {
    const { clients, user } = useData();
    
    // Filter clients with upcoming renewals (mock logic: all clients for demo)
    const upcomingRenewals = useMemo(() => {
        return clients.sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());
    }, [clients]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0B2240]">Policies & Renewals</h1>
                <p className="text-slate-500">Monitor upcoming policy expirations and renewal status.</p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex gap-2">
                    <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">Upcoming (30 Days)</button>
                    <button className="px-4 py-2 bg-white text-slate-500 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50">All Active</button>
                </div>
                <div className="divide-y divide-slate-100">
                    {upcomingRenewals.map(client => {
                        const daysLeft = Math.ceil((new Date(client.renewalDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                        return (
                            <div key={client.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${daysLeft < 30 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        <RefreshCw className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{client.name}</h4>
                                        <p className="text-xs text-slate-500">{client.product} • {client.policyNumber}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-bold ${daysLeft < 30 ? 'text-red-600' : 'text-slate-700'}`}>
                                        {daysLeft < 0 ? 'Expired' : `${daysLeft} Days Left`}
                                    </p>
                                    <p className="text-xs text-slate-400">{new Date(client.renewalDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- 4. Auto Quotes ---
export const AutoQuotes: React.FC = () => {
    const { leads, user } = useData();
    const autoLeads = leads.filter(l => l.interest === ProductType.AUTO && (l.assignedTo === user?.id || !l.assignedTo));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#0B2240]">Auto Quotes</h1>
                <p className="text-slate-500">Personal and commercial auto insurance inquiries.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {autoLeads.map(lead => (
                    <div key={lead.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-full hover:shadow-lg transition-all">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Car className="h-6 w-6"/></div>
                                <StatusBadge status={lead.status} />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-1">{lead.name}</h3>
                            <p className="text-xs text-slate-500 mb-4">{new Date(lead.date).toLocaleDateString()}</p>
                            
                            <div className="bg-slate-50 p-3 rounded-xl mb-4">
                                <p className="text-xs font-medium text-slate-600 line-clamp-2">"{lead.message}"</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">View</button>
                            <button className="flex-1 py-2 bg-[#0B2240] text-white rounded-xl text-xs font-bold hover:bg-slate-800">Quote</button>
                        </div>
                    </div>
                ))}
                {autoLeads.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-[2rem] border border-dashed border-slate-200">
                        No auto insurance leads available.
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 5. Fleet Manager ---
export const FleetManager: React.FC = () => {
    // Mock Fleet Data
    const fleets = [
        { id: 1, client: 'Green Earth Landscaping', vehicles: 8, premium: 28000, status: 'Active', renewal: '2024-01-15' },
        { id: 2, client: 'Metro Logistics', vehicles: 12, premium: 45000, status: 'Underwriting', renewal: 'Pending' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B2240]">Fleet Manager</h1>
                    <p className="text-slate-500">Commercial fleet policies and vehicle schedules.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0B2240] text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-colors">
                    <Plus className="h-4 w-4" /> Add Fleet
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fleets.map(fleet => (
                    <div key={fleet.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Truck className="h-32 w-32 text-blue-900" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-slate-900 mb-1">{fleet.client}</h3>
                            <p className="text-sm text-slate-500 font-medium mb-6">Commercial Auto Policy</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <span className="block text-xs font-bold text-slate-400 uppercase">Vehicles</span>
                                    <span className="text-2xl font-black text-slate-800">{fleet.vehicles}</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <span className="block text-xs font-bold text-slate-400 uppercase">Premium</span>
                                    <span className="text-2xl font-black text-slate-800">${(fleet.premium/1000).toFixed(1)}k</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <StatusBadge status={fleet.status} />
                                <span className="text-xs font-bold text-slate-400">Renews: {fleet.renewal}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 6. Claims ---
export const Claims: React.FC = () => {
    // Mock Claims Data
    const claims = [
        { id: 'CLM-001', client: 'Sarah Connor', type: 'Auto Accident', date: '2023-11-01', status: 'Open', adjuster: 'Jane Doe' },
        { id: 'CLM-002', client: 'Estate Ventures', type: 'Property Damage', date: '2023-10-15', status: 'Closed', adjuster: 'Mike Ross' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B2240]">Claims Center</h1>
                    <p className="text-slate-500">Track and manage active insurance claims.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-full font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-200">
                    <AlertTriangle className="h-4 w-4" /> Report New Claim
                </button>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Claim ID</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Date Filed</th>
                            <th className="px-6 py-4">Adjuster</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {claims.map(claim => (
                            <tr key={claim.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-mono font-bold text-slate-900">{claim.id}</td>
                                <td className="px-6 py-4 font-medium">{claim.client}</td>
                                <td className="px-6 py-4">{claim.type}</td>
                                <td className="px-6 py-4">{new Date(claim.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{claim.adjuster}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${claim.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {claim.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
