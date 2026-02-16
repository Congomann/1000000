
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { PropertyListing } from '../../types';
import { 
  Home, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Search, 
  Filter, 
  Trash2, 
  AlertCircle, 
  User, 
  MapPin, 
  DollarSign, 
  Clock,
  X,
  Check,
  Building2,
  Image as ImageIcon
} from 'lucide-react';

export const RealEstateAdmin: React.FC = () => {
  const { properties, updateProperty, deleteProperty, allUsers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pending Approval');
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = p.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sellerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime());
  }, [properties, searchTerm, statusFilter]);

  const handleApprove = (id: string) => {
    updateProperty(id, { status: 'Active' });
    setSelectedProperty(null);
  };

  const handleReject = (id: string) => {
    if (window.confirm('Are you sure you want to reject this listing? It will not be visible on the public site.')) {
      updateProperty(id, { status: 'Rejected' });
      setSelectedProperty(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Permanently delete this property record? This action cannot be undone.')) {
      deleteProperty(id);
      setSelectedProperty(null);
    }
  };

  const getAdvisorName = (id: string) => {
    return allUsers.find(u => u.id === id)?.name || 'System / Pool';
  };

  const statusColors: any = {
    'Pending Approval': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Active': 'bg-green-100 text-green-800 border-green-200',
    'Rejected': 'bg-red-100 text-red-800 border-red-200',
    'Sold': 'bg-blue-100 text-blue-800 border-blue-200',
    'Off Market': 'bg-slate-100 text-slate-800 border-slate-200'
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0B2240] tracking-tight uppercase">Listing Management</h1>
          <p className="text-slate-500 font-medium mt-1">Review and authorize property listings before they go live on the public site.</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search address or owner..." 
            className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-[2rem] text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          {['Pending Approval', 'Active', 'Rejected', 'All'].map(s => (
            <button 
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-6 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-[#0B2240] text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Pending/Current */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProperties.map(prop => (
          <div 
            key={prop.id} 
            className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group flex flex-col"
          >
            <div className="h-56 relative overflow-hidden bg-slate-100">
               {prop.image ? (
                 <img src={prop.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ImageIcon size={48} />
                 </div>
               )}
               <div className="absolute top-6 left-6">
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-sm ${statusColors[prop.status] || 'bg-white text-slate-600 border-slate-200'}`}>
                    {prop.status}
                 </span>
               </div>
               <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xl">
                 <p className="text-xl font-black text-slate-900">${prop.price.toLocaleString()}</p>
               </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 truncate">{prop.address}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-6">
                  <MapPin size={14} className="text-blue-500" /> {prop.city}, {prop.state}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Listed By</p>
                    <p className="text-xs font-black text-slate-700 truncate">{getAdvisorName(prop.advisorId)}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</p>
                    <p className="text-xs font-black text-slate-700">{prop.type}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
                <button 
                  onClick={() => setSelectedProperty(prop)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <Eye size={14} /> Full Review
                </button>
                {prop.status === 'Pending Approval' && (
                  <button 
                    onClick={() => handleApprove(prop.id)}
                    className="flex-1 py-3.5 bg-green-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Check size={14} strokeWidth={3} /> Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredProperties.length === 0 && (
          <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-200">
            <Building2 className="h-16 w-16 mx-auto mb-6 text-slate-200" />
            <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">No matching listings</h3>
            <p className="text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-widest">Adjust filters to see active or rejected records.</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-[4rem] w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]">
            <button 
              onClick={() => setSelectedProperty(null)}
              className="absolute top-8 right-8 z-20 p-3 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full backdrop-blur-md transition-all"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="relative h-[400px] w-full bg-slate-900">
                <img src={selectedProperty.image} className="w-full h-full object-cover opacity-80" alt="" />
                <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/90 to-transparent text-white">
                   <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                      <div>
                        <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">{selectedProperty.address}</h2>
                        <p className="text-xl font-bold text-blue-300">{selectedProperty.city}, {selectedProperty.state}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-5xl font-black tracking-tighter text-white">${selectedProperty.price.toLocaleString()}</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-3 opacity-60">Status: {selectedProperty.status}</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                 <div className="lg:col-span-2 space-y-10">
                    <div>
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Listing Description</h3>
                      <p className="text-slate-700 leading-relaxed text-lg font-medium whitespace-pre-wrap">{selectedProperty.description || 'No description provided.'}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Beds</span>
                        <span className="text-2xl font-black text-slate-800">{selectedProperty.bedrooms}</span>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Baths</span>
                        <span className="text-2xl font-black text-slate-800">{selectedProperty.bathrooms}</span>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sq Ft</span>
                        <span className="text-2xl font-black text-slate-800">{selectedProperty.sqft?.toLocaleString()}</span>
                      </div>
                    </div>
                 </div>

                 <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-200 pb-3">Advisor Context</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Assigned Advisor</p>
                          <p className="text-sm font-black text-[#0B2240]">{getAdvisorName(selectedProperty.advisorId)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Seller Entity</p>
                          <p className="text-sm font-black text-[#0B2240]">{selectedProperty.sellerName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Listed Since</p>
                          <p className="text-sm font-black text-[#0B2240]">{new Date(selectedProperty.listedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-6">
                      {selectedProperty.status === 'Pending Approval' && (
                        <button 
                          onClick={() => handleApprove(selectedProperty.id)}
                          className="w-full py-5 bg-green-600 text-white font-black rounded-3xl text-xs uppercase tracking-widest hover:bg-green-700 shadow-xl shadow-green-600/20 transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={20} /> Approve & Publish
                        </button>
                      )}
                      {selectedProperty.status !== 'Rejected' && (
                        <button 
                          onClick={() => handleReject(selectedProperty.id)}
                          className="w-full py-5 bg-white border border-red-200 text-red-600 font-black rounded-3xl text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                        >
                          <XCircle size={20} /> Reject Listing
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(selectedProperty.id)}
                        className="w-full py-5 text-slate-400 hover:text-red-500 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} /> Permanently Delete
                      </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
