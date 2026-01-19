
import React, { useState, useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { Building, Key, Home, MapPin, DollarSign, User, CheckCircle2, XCircle, Plus, X, Upload, Video, Info } from 'lucide-react';
import { PropertyListing } from '../../../types';

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
    const { properties, user, addProperty } = useData();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'media'>('basic');
    
    // Initial Form State
    const initialFormState: Partial<PropertyListing> = {
        address: '',
        city: '',
        state: '',
        zip: '',
        county: '',
        price: 0,
        type: 'Residential',
        bedrooms: 0,
        bathrooms: 0,
        sqft: 0,
        sellerName: '',
        image: '',
        videoUrl: '',
        description: '',
        zoning: '',
        restrictions: '',
        hoa: false,
        hoaFee: 0,
        taxAmount: 0
    };
    
    const [formData, setFormData] = useState<Partial<PropertyListing>>(initialFormState);

    // Filter properties for current advisor
    const myProperties = properties.filter(p => p.advisorId === user?.id);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        addProperty(formData);
        setFormData(initialFormState);
        setIsAddModalOpen(false);
        setActiveTab('basic');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Simulate Video Upload via file selection
    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
             // For demo, we just create a fake URL to simulate it being uploaded
             setFormData(prev => ({ ...prev, videoUrl: URL.createObjectURL(file) }));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B2240]">Property Pipeline</h1>
                    <p className="text-slate-500">Manage active listings and potential inventory.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0B2240] text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg"
                >
                    <Home className="h-4 w-4" /> Add Listing
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProperties.map(prop => (
                    <div key={prop.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all flex flex-col group">
                        <div className="h-48 bg-slate-200 relative overflow-hidden">
                            <img 
                                src={prop.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'} 
                                alt={prop.address} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
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
                    <div className="col-span-full py-24 text-center text-slate-400 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                        <Building className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="font-medium">No active listings found.</p>
                        <p className="text-sm mt-1">Click "Add Listing" to get started.</p>
                    </div>
                )}
            </div>

            {/* Add Listing Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl p-10 relative border border-white/20 max-h-[90vh] overflow-y-auto no-scrollbar flex flex-col">
                        <button 
                            onClick={() => setIsAddModalOpen(false)} 
                            className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors"
                        >
                            <X size={24}/>
                        </button>
                        <h2 className="text-2xl font-black text-[#0B2240] mb-2 tracking-tight">Create New Listing</h2>
                        <p className="text-slate-500 mb-8 font-medium">Add a new property to the public marketplace.</p>
                        
                        {/* Tabs */}
                        <div className="flex border-b border-slate-100 mb-8">
                            <button onClick={() => setActiveTab('basic')} className={`pb-4 px-4 text-sm font-bold transition-colors ${activeTab === 'basic' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Basic Info</button>
                            <button onClick={() => setActiveTab('details')} className={`pb-4 px-4 text-sm font-bold transition-colors ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Property Details</button>
                            <button onClick={() => setActiveTab('media')} className={`pb-4 px-4 text-sm font-bold transition-colors ${activeTab === 'media' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Photos & Video</button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            
                            {/* Tab 1: Basic Info */}
                            {activeTab === 'basic' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Street Address</label>
                                        <input 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none" 
                                            required 
                                            placeholder="123 Ocean Drive"
                                            value={formData.address}
                                            onChange={e => setFormData({...formData, address: e.target.value})}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">City</label>
                                            <input 
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none" 
                                                required 
                                                placeholder="Miami"
                                                value={formData.city}
                                                onChange={e => setFormData({...formData, city: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">State</label>
                                            <input 
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none" 
                                                required 
                                                placeholder="FL"
                                                value={formData.state}
                                                onChange={e => setFormData({...formData, state: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Zip Code</label>
                                            <input 
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none" 
                                                required 
                                                placeholder="33101"
                                                value={formData.zip}
                                                onChange={e => setFormData({...formData, zip: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">County</label>
                                            <input 
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none" 
                                                placeholder="Miami-Dade"
                                                value={formData.county}
                                                onChange={e => setFormData({...formData, county: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Listing Price ($)</label>
                                            <input 
                                                type="number"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none" 
                                                required 
                                                placeholder="850000"
                                                value={formData.price || ''}
                                                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Property Type</label>
                                            <select 
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none cursor-pointer appearance-none"
                                                value={formData.type}
                                                onChange={e => setFormData({...formData, type: e.target.value as any})}
                                            >
                                                <option value="Residential">Residential</option>
                                                <option value="Commercial">Commercial</option>
                                                <option value="Land">Land</option>
                                                <option value="Multi-Family">Multi-Family</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Beds</label>
                                            <input 
                                                type="number"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none text-center" 
                                                value={formData.bedrooms || ''}
                                                onChange={e => setFormData({...formData, bedrooms: Number(e.target.value)})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Baths</label>
                                            <input 
                                                type="number"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none text-center" 
                                                value={formData.bathrooms || ''}
                                                onChange={e => setFormData({...formData, bathrooms: Number(e.target.value)})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Sq Ft</label>
                                            <input 
                                                type="number"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none text-center" 
                                                value={formData.sqft || ''}
                                                onChange={e => setFormData({...formData, sqft: Number(e.target.value)})}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab 2: Detailed Info */}
                            {activeTab === 'details' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Info className="h-4 w-4"/> Associations & Taxes</h3>
                                        
                                        <div className="flex items-center gap-6 mb-6">
                                            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                                                <label className="text-xs font-bold text-slate-600">HOA Community?</label>
                                                <input 
                                                    type="checkbox" 
                                                    className="w-5 h-5 accent-blue-600"
                                                    checked={formData.hoa}
                                                    onChange={e => setFormData({...formData, hoa: e.target.checked})}
                                                />
                                            </div>
                                            {formData.hoa && (
                                                <div className="flex-1">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 ml-1">HOA Fee ($/mo)</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none" 
                                                        value={formData.hoaFee || ''}
                                                        onChange={e => setFormData({...formData, hoaFee: Number(e.target.value)})}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Annual Tax ($)</label>
                                                <input 
                                                    type="number" 
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none" 
                                                    value={formData.taxAmount || ''}
                                                    onChange={e => setFormData({...formData, taxAmount: Number(e.target.value)})}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Zoning Code</label>
                                                <input 
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none" 
                                                    placeholder="R-1, C-2"
                                                    value={formData.zoning}
                                                    onChange={e => setFormData({...formData, zoning: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Restrictions / Covenants</label>
                                        <input 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] outline-none" 
                                            placeholder="e.g. No short-term rentals, 55+ community"
                                            value={formData.restrictions}
                                            onChange={e => setFormData({...formData, restrictions: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Property Info Notes</label>
                                        <textarea 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] outline-none resize-none" 
                                            rows={4}
                                            placeholder="Describe the property features, recent upgrades, and neighborhood highlights..."
                                            value={formData.description}
                                            onChange={e => setFormData({...formData, description: e.target.value})}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Seller Name (Internal)</label>
                                        <input 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0A62A7] outline-none" 
                                            placeholder="John Smith"
                                            value={formData.sellerName}
                                            onChange={e => setFormData({...formData, sellerName: e.target.value})}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Tab 3: Media */}
                            {activeTab === 'media' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="relative group cursor-pointer border-2 border-dashed border-slate-200 rounded-2xl h-48 bg-slate-50 flex items-center justify-center overflow-hidden hover:bg-slate-100 transition-colors">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                            onChange={handleImageUpload}
                                        />
                                        {formData.image ? (
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center text-slate-400">
                                                <Upload className="h-10 w-10 mx-auto mb-3 text-blue-500" />
                                                <p className="text-sm font-bold text-slate-600">Upload Main Photo</p>
                                                <p className="text-[10px] uppercase font-bold tracking-widest mt-1">High Res Required</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative group cursor-pointer border-2 border-dashed border-slate-200 rounded-2xl h-32 bg-slate-50 flex items-center justify-center overflow-hidden hover:bg-slate-100 transition-colors">
                                        <input 
                                            type="file" 
                                            accept="video/*" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                            onChange={handleVideoUpload}
                                        />
                                        {formData.videoUrl ? (
                                            <div className="text-center text-green-600">
                                                <CheckCircle2 className="h-8 w-8 mx-auto mb-2" />
                                                <p className="text-xs font-bold uppercase">Video File Selected</p>
                                            </div>
                                        ) : (
                                            <div className="text-center text-slate-400">
                                                <Video className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                                                <p className="text-sm font-bold text-slate-600">Upload 3-Min Tour Video</p>
                                                <p className="text-[10px] uppercase font-bold tracking-widest mt-1">MP4 / WebM</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-center text-xs text-slate-400 italic">Media will be processed and optimized for web display.</p>
                                </div>
                            )}

                            <div className="pt-6 flex gap-4 border-t border-slate-100">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-400 font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-[#0B2240] text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
                                    Publish Listing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
