
import React, { useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { Building, Key, Home, MapPin, DollarSign, User, CheckCircle2, XCircle } from 'lucide-react';

const StatusBadge = ({ status }: { status: string }) => {
    let color = 'bg-slate-100 text-slate-700';
    if (['Active', 'Open', 'Offer Accepted'].includes(status)) color = 'bg-green-100 text-green-700';
    if (['Pending', 'Under Contract', 'Inspection', 'Appraisal'].includes(status)) color = 'bg-yellow-100 text-yellow-700';
    if (['Sold', 'Closed'].includes(status)) color = 'bg-blue-100 text-blue-700';
    if (['Cancelled', 'Off Market', 'Withdrawn'].includes(status)) color = 'bg-red-100 text-red-700';
    
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${color}`}>{status}</span>;
};

// --- 1. Property Pipeline ---
export const PropertyPipeline: React.FC = () => {
    const { properties, user } = useData();
    
    // Filter properties for current advisor
    const myProperties = properties.filter(p => p.advisorId === user?.id);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B2240]">Property Pipeline</h1>
                    <p className="text-slate-500">Manage active listings and potential inventory.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0B2240] text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-colors">
                    <Home className="h-4 w-4" /> Add Listing
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProperties.map(prop => (
                    <div key={prop.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all flex flex-col">
                        <div className="h-48 bg-slate-200 relative">
                            <img src={prop.image} alt={prop.address} className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4">
                                <StatusBadge status={prop.status} />
                            </div>
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-800">
                                {prop.type}
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-slate-900 mb-1">${prop.price.toLocaleString()}</h3>
                                <div className="flex items-center text-slate-500 text-sm font-medium">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {prop.address}, {prop.city}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                    <span className="block text-xs text-slate-400 font-bold uppercase">Beds</span>
                                    <span className="font-bold text-slate-700">{prop.bedrooms || '-'}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                    <span className="block text-xs text-slate-400 font-bold uppercase">Baths</span>
                                    <span className="font-bold text-slate-700">{prop.bathrooms || '-'}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                    <span className="block text-xs text-slate-400 font-bold uppercase">Sq Ft</span>
                                    <span className="font-bold text-slate-700">{prop.sqft?.toLocaleString() || '-'}</span>
                                </div>
                            </div>
                            
                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold text-slate-500">
                                <span>Listed: {new Date(prop.listedDate).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {prop.sellerName}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {myProperties.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-[2rem] border border-dashed border-slate-200">
                        <Building className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="font-medium">No active listings found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 2. Transactions & Escrow ---
export const TransactionsEscrow: React.FC = () => {
    const { transactions, user, updateTransactionStatus } = useData();
    
    // Filter transactions for current advisor
    const myTransactions = transactions.filter(t => t.advisorId === user?.id);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B2240]">Transactions & Escrow</h1>
                    <p className="text-slate-500">Track deals from offer to closing.</p>
                </div>
            </div>
            
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Property Address</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Stage</th>
                            <th className="px-6 py-4">Closing</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {myTransactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">{tx.propertyAddress}</div>
                                    <div className="text-xs text-slate-400 font-mono">ID: {tx.id}</div>
                                </td>
                                <td className="px-6 py-4 font-medium">{tx.clientName}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tx.role === 'Seller' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {tx.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-700">${tx.amount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={tx.stage} />
                                    <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{tx.status}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-medium">
                                    {new Date(tx.closingDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => updateTransactionStatus(tx.id, 'Closed', 'Closing')}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Mark Closed"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={() => updateTransactionStatus(tx.id, 'Cancelled')}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Cancel Transaction"
                                        >
                                            <XCircle className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {myTransactions.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                        <Key className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">No active transactions.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
