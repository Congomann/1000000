
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { RealEstateResourceLink } from '../../types';
import { 
  Home, 
  FileText, 
  Users, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Save, 
  ExternalLink, 
  BookOpen, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export const RealEstateCms: React.FC = () => {
  const { companySettings, updateCompanySettings } = useData();
  const [activeTab, setActiveTab] = useState<'about' | 'resources' | 'contact'>('about');
  const [formData, setFormData] = useState({
      about: companySettings.realEstateAbout || '',
      contactCta: companySettings.realEstateContactCta || '',
      resources: companySettings.realEstateResources || []
  });
  
  const [newResource, setNewResource] = useState<Partial<RealEstateResourceLink>>({
      title: '',
      url: '',
      description: '',
      type: 'Buying'
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleGlobalSave = () => {
      updateCompanySettings({
          ...companySettings,
          realEstateAbout: formData.about,
          realEstateContactCta: formData.contactCta,
          realEstateResources: formData.resources
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
  };

  const addResource = () => {
      if (newResource.title && newResource.url) {
          const resourceWithId = { ...newResource, id: crypto.randomUUID() } as RealEstateResourceLink;
          setFormData(prev => ({
              ...prev,
              resources: [...prev.resources, resourceWithId]
          }));
          setNewResource({ title: '', url: '', description: '', type: 'Buying' });
      }
  };

  const removeResource = (id: string) => {
      setFormData(prev => ({
          ...prev,
          resources: prev.resources.filter(r => r.id !== id)
      }));
  };

  return (
    <div className="space-y-8 pb-24 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0B2240] tracking-tight uppercase">Real Estate CMS</h1>
          <p className="text-slate-500 font-medium mt-1">Manage specialized content for the high-end real estate portal.</p>
        </div>
        <div className="flex items-center gap-4">
            {isSaved && <span className="text-green-600 font-black text-[10px] uppercase tracking-widest animate-fade-in">Changes Synced</span>}
            <button 
                onClick={handleGlobalSave}
                className="bg-[#0A62A7] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2"
            >
                <Save className="h-4 w-4" /> Commit Changes
            </button>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[600px]">
          <div className="flex border-b border-slate-100 bg-slate-50/50 p-2">
              <button 
                onClick={() => setActiveTab('about')}
                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${activeTab === 'about' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  <Users className="h-4 w-4" /> Our Story
              </button>
              <button 
                onClick={() => setActiveTab('resources')}
                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${activeTab === 'resources' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  <BookOpen className="h-4 w-4" /> Market Resources
              </button>
              <button 
                onClick={() => setActiveTab('contact')}
                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${activeTab === 'contact' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  <MessageSquare className="h-4 w-4" /> Contact Config
              </button>
          </div>

          <div className="p-12">
              {/* ABOUT US CMS */}
              {activeTab === 'about' && (
                  <div className="space-y-8 animate-fade-in">
                      <div className="flex items-center gap-4 mb-6">
                          <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl shadow-inner"><Users className="h-8 w-8" /></div>
                          <div>
                              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Real Estate Heritage</h3>
                              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Main descriptive text for the About section.</p>
                          </div>
                      </div>
                      <textarea 
                        className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 text-lg font-medium text-slate-700 leading-relaxed outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner h-64"
                        placeholder="Tell the story of the Real Estate division..."
                        value={formData.about}
                        onChange={e => setFormData({...formData, about: e.target.value})}
                      />
                      <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
                          <Zap className="h-5 w-5 text-blue-500 mt-1" />
                          <p className="text-sm text-blue-700 font-bold leading-relaxed italic">
                              Tip: Focus on the "Years of Experience" and "Legacy Building" aspects that match the brand voice.
                          </p>
                      </div>
                  </div>
              )}

              {/* RESOURCES CMS */}
              {activeTab === 'resources' && (
                  <div className="space-y-10 animate-fade-in">
                      <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center gap-4">
                              <div className="p-4 bg-amber-50 text-amber-600 rounded-3xl shadow-inner"><BookOpen className="h-8 w-8" /></div>
                              <div>
                                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Specialized Intel</h3>
                                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Educational guides and market reports.</p>
                              </div>
                          </div>
                      </div>

                      {/* Add New Resource Form */}
                      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                          <div className="md:col-span-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Title</label>
                              <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" value={newResource.title} onChange={e => setNewResource({...newResource, title: e.target.value})} placeholder="e.g. 2024 Market Forecast" />
                          </div>
                          <div className="md:col-span-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Category</label>
                              <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold appearance-none cursor-pointer" value={newResource.type} onChange={e => setNewResource({...newResource, type: e.target.value as any})}>
                                  <option value="Buying">Buying</option>
                                  <option value="Selling">Selling</option>
                                  <option value="Investing">Investing</option>
                                  <option value="Legal">Legal</option>
                              </select>
                          </div>
                          <div className="md:col-span-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Destination URL</label>
                              <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" value={newResource.url} onChange={e => setNewResource({...newResource, url: e.target.value})} placeholder="https://..." />
                          </div>
                          <button onClick={addResource} className="px-6 py-2 bg-[#0B2240] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 h-10">
                              <Plus className="h-4 w-4" /> Add Node
                          </button>
                      </div>

                      {/* Current Resources List */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formData.resources.map((res) => (
                              <div key={res.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between hover:border-blue-200 transition-all group">
                                  <div className="flex items-center gap-4">
                                      <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:text-blue-500 transition-colors"><FileText className="h-5 w-5" /></div>
                                      <div>
                                          <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">{res.title}</h4>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{res.type}</p>
                                      </div>
                                  </div>
                                  <button onClick={() => removeResource(res.id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="h-5 w-5" /></button>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* CONTACT CMS */}
              {activeTab === 'contact' && (
                  <div className="space-y-8 animate-fade-in">
                      <div className="flex items-center gap-4 mb-6">
                          <div className="p-4 bg-purple-50 text-purple-600 rounded-3xl shadow-inner"><MessageSquare className="h-8 w-8" /></div>
                          <div>
                              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Engagement Strategy</h3>
                              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Call-to-Action text for lead capture pages.</p>
                          </div>
                      </div>
                      <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block ml-2">Lead Intake CTA Paragraph</label>
                          <textarea 
                            className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 text-lg font-medium text-slate-700 leading-relaxed outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner h-40"
                            placeholder="Hook text for the contact form..."
                            value={formData.contactCta}
                            onChange={e => setFormData({...formData, contactCta: e.target.value})}
                          />
                      </div>
                      <div className="bg-slate-100/50 p-8 rounded-[2.5rem] border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                              <ShieldCheck className="h-6 w-6 text-slate-400" />
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">All leads from this portal are routed with 'Real Estate' priority.</p>
                          </div>
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-white px-4 py-2 rounded-full border border-blue-100 shadow-sm">Autonomous Routing Active</span>
                      </div>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
