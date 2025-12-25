
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { UserRole, Carrier } from '../../types';
import { Shield, CheckSquare, Square, Search, UserCheck } from 'lucide-react';

export const CarrierAssignment: React.FC = () => {
  const { allUsers, availableCarriers, assignCarriers } = useData();
  const [selectedAdvisorIds, setSelectedAdvisorIds] = useState<Set<string>>(new Set());
  const [selectedCarrierNames, setSelectedCarrierNames] = useState<Set<string>>(new Set());
  const [advisorSearch, setAdvisorSearch] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Filter Advisors
  const advisors = allUsers.filter(u => 
    u.role === UserRole.ADVISOR && 
    u.name.toLowerCase().includes(advisorSearch.toLowerCase())
  );

  // Group Carriers by Category
  const groupedCarriers = availableCarriers.reduce((acc, carrier) => {
    if (!acc[carrier.category]) acc[carrier.category] = [];
    acc[carrier.category].push(carrier);
    return acc;
  }, {} as Record<string, Carrier[]>);

  // Handlers
  const toggleAdvisor = (id: string) => {
    const newSet = new Set(selectedAdvisorIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedAdvisorIds(newSet);
  };

  const toggleCarrier = (name: string) => {
    const newSet = new Set(selectedCarrierNames);
    if (newSet.has(name)) newSet.delete(name);
    else newSet.add(name);
    setSelectedCarrierNames(newSet);
  };

  const handleBulkAssign = () => {
    if (selectedAdvisorIds.size === 0 || selectedCarrierNames.size === 0) return;

    const selectedCarriers = availableCarriers.filter(c => selectedCarrierNames.has(c.name));
    assignCarriers(Array.from(selectedAdvisorIds), selectedCarriers);
    
    setIsSuccess(true);
    setSelectedAdvisorIds(new Set());
    setSelectedCarrierNames(new Set());
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const toggleSelectAllCarriers = (category: string) => {
    const carriersInCategory = groupedCarriers[category];
    const allSelected = carriersInCategory.every(c => selectedCarrierNames.has(c.name));
    
    const newSet = new Set(selectedCarrierNames);
    carriersInCategory.forEach(c => {
        if (allSelected) newSet.delete(c.name);
        else newSet.add(c.name);
    });
    setSelectedCarrierNames(newSet);
  };

  return (
    <div className="space-y-8 pb-10">
        <div>
            <h1 className="text-2xl font-bold text-[#0B2240]">Bulk Carrier Assignment</h1>
            <p className="text-slate-500">Manage advisor appointments with insurance carriers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Advisors */}
            <div className="lg:col-span-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col h-[800px]">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-[#0B2240] mb-4">1. Select Advisors</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search advisors..." 
                            value={advisorSearch}
                            onChange={e => setAdvisorSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent text-slate-900"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {advisors.map(adv => (
                        <div 
                            key={adv.id}
                            onClick={() => toggleAdvisor(adv.id)}
                            className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${selectedAdvisorIds.has(adv.id) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'}`}
                        >
                            <div className={`mr-3 ${selectedAdvisorIds.has(adv.id) ? 'text-blue-600' : 'text-slate-300'}`}>
                                {selectedAdvisorIds.has(adv.id) ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                    {adv.avatar ? <img src={adv.avatar} className="h-full w-full" /> : <div className="h-full w-full flex items-center justify-center font-bold text-slate-500 text-xs">{adv.name[0]}</div>}
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${selectedAdvisorIds.has(adv.id) ? 'text-blue-900' : 'text-slate-700'}`}>{adv.name}</p>
                                    <p className="text-xs text-slate-500">{adv.category}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs font-bold text-slate-500">
                    {selectedAdvisorIds.size} Advisors Selected
                </div>
            </div>

            {/* Right Col: Carriers */}
            <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col h-[800px]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[#0B2240]">2. Select Carriers</h3>
                    <div className="text-sm text-slate-500">
                        {selectedCarrierNames.size} Carriers Selected
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {Object.entries(groupedCarriers).map(([category, carriers]: [string, Carrier[]]) => (
                        <div key={category}>
                            <div className="flex items-center justify-between mb-3 sticky top-0 bg-white z-10 py-2 border-b border-slate-50">
                                <h4 className="text-sm font-bold text-[#0B2240] uppercase tracking-wider">{category}</h4>
                                <button 
                                    onClick={() => toggleSelectAllCarriers(category)}
                                    className="text-xs text-blue-600 font-bold hover:underline"
                                >
                                    Select All
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {carriers.map(carrier => (
                                    <div 
                                        key={carrier.name}
                                        onClick={() => toggleCarrier(carrier.name)}
                                        className={`flex items-start p-3 rounded-xl cursor-pointer border transition-all ${selectedCarrierNames.has(carrier.name) ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-slate-50 border-slate-100 hover:border-blue-200'}`}
                                    >
                                        <div className={`mt-0.5 mr-3 ${selectedCarrierNames.has(carrier.name) ? 'text-blue-600' : 'text-slate-300'}`}>
                                            {selectedCarrierNames.has(carrier.name) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                                        </div>
                                        <span className={`text-sm font-medium ${selectedCarrierNames.has(carrier.name) ? 'text-blue-900' : 'text-slate-600'}`}>
                                            {carrier.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50 rounded-b-[2rem]">
                    <div>
                        {isSuccess && (
                            <span className="flex items-center text-green-600 font-bold animate-fade-in">
                                <Shield className="h-5 w-5 mr-2" />
                                Assignments Saved Successfully!
                            </span>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => { setSelectedAdvisorIds(new Set()); setSelectedCarrierNames(new Set()); }}
                            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            Reset
                        </button>
                        <button 
                            onClick={handleBulkAssign}
                            disabled={selectedAdvisorIds.size === 0 || selectedCarrierNames.size === 0}
                            className="px-8 py-3 bg-[#0A62A7] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <UserCheck className="h-5 w-5" />
                            Assign To Selected
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
