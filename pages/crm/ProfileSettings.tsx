




import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { SocialLink, User, UserRole, Carrier, ProductType, Testimonial } from '../../types';
import { Save, Plus, Trash2, Camera, Shield, CheckCircle2, Languages, Briefcase, Award, X, Edit2, Star, AlertTriangle, Globe, MapPin } from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const { user, updateUser, getAdvisorAssignments, testimonials, submitTestimonialEdit } = useData();
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [myCarriers, setMyCarriers] = useState<Record<string, string[]>>({});
  const [languageInput, setLanguageInput] = useState('');
  
  // Testimonial Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialEdits, setTestimonialEdits] = useState({ clientName: '', rating: 0, reviewText: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        bio: user.bio || '',
        avatar: user.avatar,
        socialLinks: user.socialLinks || [],
        title: user.title || '',
        yearsOfExperience: user.yearsOfExperience || 0,
        productsSold: user.productsSold || [],
        languages: user.languages || [],
        micrositeEnabled: user.micrositeEnabled,
        // Migration: If license_state is empty but array exists, join array or use count
        license_state: user.license_state || (user.license_states && user.license_states.length > 0 ? `${user.license_states.length} States` : '')
      });

      // Load Carriers
      const assignments = getAdvisorAssignments(user.id);
      const grouped = assignments.reduce((acc, curr) => {
          if (!acc[curr.category]) acc[curr.category] = [];
          acc[curr.category].push(curr.carrierName);
          return acc;
      }, {} as Record<string, string[]>);
      setMyCarriers(grouped);
    }
  }, [user, getAdvisorAssignments]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && formData) {
      updateUser(user.id, formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSocial = () => {
    const newLink: SocialLink = { platform: 'LinkedIn', url: '' };
    setFormData(prev => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), newLink]
    }));
  };

  const handleRemoveSocial = (index: number) => {
    const updated = [...(formData.socialLinks || [])];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, socialLinks: updated }));
  };

  const handleSocialChange = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...(formData.socialLinks || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, socialLinks: updated }));
  };
  
  const handleProductToggle = (product: ProductType) => {
    const currentProducts = formData.productsSold || [];
    const newProducts = currentProducts.includes(product)
      ? currentProducts.filter(p => p !== product)
      : [...currentProducts, product];
    setFormData(prev => ({ ...prev, productsSold: newProducts }));
  };
  
  const handleAddLanguage = () => {
    if (languageInput.trim() && !(formData.languages || []).includes(languageInput.trim())) {
        setFormData(prev => ({ ...prev, languages: [...(prev.languages || []), languageInput.trim()]}));
        setLanguageInput('');
    }
  };
  
  const handleRemoveLanguage = (lang: string) => {
    setFormData(prev => ({ ...prev, languages: (prev.languages || []).filter(l => l !== lang) }));
  };

  const openEditModal = (testimonial: Testimonial) => {
      setEditingTestimonial(testimonial);
      setTestimonialEdits({
          clientName: testimonial.clientName,
          rating: testimonial.rating,
          reviewText: testimonial.reviewText
      });
      setIsEditModalOpen(true);
  };
  
  const handleTestimonialEditSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingTestimonial) {
          submitTestimonialEdit(editingTestimonial.id, testimonialEdits);
          setIsEditModalOpen(false);
          setEditingTestimonial(null);
      }
  };

  const myTestimonials = user ? testimonials.filter(t => t.advisorId === user.id) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-[#0B2240]">Profile Settings</h1>
            <p className="text-slate-500">Manage your public advisor profile and contact details.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-6">
            <div className="relative group flex-shrink-0">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="h-32 w-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner block relative cursor-pointer"
              >
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#0B2240] flex items-center justify-center text-white text-3xl font-bold">
                    {formData.name?.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8" />
                </div>
              </button>
            </div>


            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email (Read Only)</label>
                  <input
                    type="email"
                    disabled
                    className="w-full bg-white text-slate-500 border border-slate-200 rounded-xl px-4 py-3 text-sm cursor-not-allowed"
                    value={formData.email || ''}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                  placeholder="(555) 555-5555"
                  value={formData.phone || ''}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Professional Title</label>
                  <input
                    type="text"
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                    placeholder="e.g. Licensed Insurance Advisor"
                    value={formData.title || ''}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Years of Experience</label>
                  <input
                    type="number"
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                    placeholder="e.g. 10"
                    value={formData.yearsOfExperience || ''}
                    onChange={e => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                  />
                </div>
            </div>
        </div>
        
        {/* Public Profile Visibility - Admin Only Toggle */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-[#0B2240] mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" /> Public Profile Settings
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                    <p className="font-bold text-slate-700">Advisor Microsite</p>
                    <p className="text-xs text-slate-500">Enable or disable your public-facing profile page.</p>
                </div>
                
                {user?.role === UserRole.ADMIN ? (
                     <button 
                        type="button"
                        onClick={() => setFormData(prev => ({...prev, micrositeEnabled: !prev.micrositeEnabled}))}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.micrositeEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
                     >
                         <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.micrositeEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                     </button>
                ) : (
                     <div className="flex items-center gap-2">
                         {formData.micrositeEnabled ? <CheckCircle2 className="h-4 w-4 text-green-600"/> : <X className="h-4 w-4 text-slate-400"/>}
                         <span className={`text-sm font-bold ${formData.micrositeEnabled ? 'text-green-700' : 'text-slate-500'}`}>
                             {formData.micrositeEnabled ? 'Live' : 'Disabled'}
                         </span>
                         <span className="text-[10px] text-slate-400 bg-white px-2 py-1 rounded border border-slate-200 ml-2">Admin Managed</span>
                     </div>
                )}
            </div>
        </div>

        {/* Products Sold */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Briefcase className="h-6 w-6" /></div>
             <h3 className="text-lg font-bold text-[#0B2240]">My Products</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Object.values(ProductType).map(product => (
              <button 
                key={product}
                type="button"
                onClick={() => handleProductToggle(product)}
                className={`flex items-center gap-2 p-3 text-left text-xs font-bold rounded-xl border-2 transition-all ${
                  (formData.productsSold || []).includes(product)
                    ? 'bg-blue-50 border-blue-500 text-blue-800'
                    : 'bg-slate-50 border-transparent text-slate-600 hover:border-slate-300'
                }`}
              >
                {(formData.productsSold || []).includes(product) ? <CheckCircle2 className="h-4 w-4"/> : <div className="h-4 w-4 border-2 border-slate-300 rounded-sm"></div>}
                {product}
              </button>
            ))}
          </div>
        </div>

        {/* Licensed States */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MapPin className="h-6 w-6" /></div>
             <h3 className="text-lg font-bold text-[#0B2240]">Licensing</h3>
          </div>
          <div className="mb-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Licensed In</label>
              <input 
                type="text"
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                placeholder="e.g. 28 States, or NY, CA, FL"
                value={formData.license_state || ''}
                onChange={e => setFormData({...formData, license_state: e.target.value})}
              />
              <p className="text-[10px] text-slate-400 mt-2 ml-1">
                  Enter the number of states or list them (e.g. "12 States" or "NY, NJ"). This will be displayed on your profile.
              </p>
          </div>
        </div>

        {/* Languages Spoken */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Languages className="h-6 w-6" /></div>
             <h3 className="text-lg font-bold text-[#0B2240]">Languages Spoken</h3>
          </div>
          <div className="flex items-center gap-3 mb-4">
              <input 
                type="text"
                className="flex-1 bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                placeholder="e.g. Spanish"
                value={languageInput}
                onChange={e => setLanguageInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
              />
              <button type="button" onClick={handleAddLanguage} className="px-5 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200">Add</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {(formData.languages || []).map(lang => (
              <div key={lang} className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1 text-sm font-medium text-slate-700">
                {lang}
                <button type="button" onClick={() => handleRemoveLanguage(lang)} className="text-slate-400 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Carrier Assignments Section (Read Only for Advisors) */}
        {user?.role === UserRole.ADVISOR && (
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Shield className="h-6 w-6" />
                     </div>
                     <h3 className="text-lg font-bold text-[#0B2240]">My Approved Carriers</h3>
                </div>
                
                {Object.keys(myCarriers).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Object.entries(myCarriers).map(([category, names]: [string, string[]]) => (
                            <div key={category}>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">{category}</h4>
                                <ul className="space-y-2">
                                    {names.map(name => (
                                        <li key={name} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            {name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-500 text-sm">No carrier assignments found. Please contact your manager.</p>
                    </div>
                )}
            </div>
        )}
        
        {/* Testimonials Management Section */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Award className="h-6 w-6" /></div>
                <h3 className="text-lg font-bold text-[#0B2240]">My Public Testimonials</h3>
            </div>
            <div className="space-y-4">
                {myTestimonials.map(t => (
                    <div key={t.id} className={`p-4 rounded-xl flex items-center justify-between ${t.status === 'approved' ? 'bg-slate-50' : 'bg-yellow-50'}`}>
                        <div>
                            <p className="font-bold text-sm text-slate-800">{t.clientName} - <span className="text-yellow-500 flex items-center inline-flex gap-1">{t.rating} <Star className="h-3 w-3 fill-yellow-500"/></span></p>
                            <p className="text-xs text-slate-500 italic mt-1">"{t.reviewText}"</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase ${
                                t.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                t.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>{t.status.replace('_', ' ')}</span>
                            {t.status === 'approved' && <button onClick={() => openEditModal(t)} className="p-2 hover:bg-slate-200 rounded-full"><Edit2 className="h-4 w-4 text-slate-500" /></button>}
                            {t.status === 'pending_edit' && <div className="p-2 bg-blue-100 rounded-full"><AlertTriangle className="h-4 w-4 text-blue-500"/></div>}
                        </div>
                    </div>
                ))}
                {myTestimonials.length === 0 && <p className="text-slate-400 text-sm italic text-center py-4">You don't have any public testimonials yet.</p>}
            </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-[#0B2240] mb-4">About Me / Bio</h3>
          <textarea
            rows={5}
            className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent resize-none"
            placeholder="Tell clients about your experience and expertise..."
            value={formData.bio || ''}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        {/* Social Links */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#0B2240]">Social Media Links</h3>
            <button 
              type="button" 
              onClick={handleAddSocial}
              className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4" /> Add Link
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.socialLinks?.map((link, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-1/3 md:w-1/4">
                  <select
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                    value={link.platform}
                    onChange={e => handleSocialChange(index, 'platform', e.target.value as any)}
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Instagram">Instagram</option>
                    <option value="X">X (Twitter)</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                    placeholder="Profile URL"
                    value={link.url}
                    onChange={e => handleSocialChange(index, 'url', e.target.value)}
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => handleRemoveSocial(index)}
                  className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            {(!formData.socialLinks || formData.socialLinks.length === 0) && (
              <p className="text-slate-400 text-sm italic text-center py-4">No social links added yet.</p>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-4">
           {isSaved && <span className="text-green-600 font-bold text-sm animate-fade-in">Profile Saved Successfully!</span>}
           <button
             type="submit"
             className="px-8 py-4 bg-[#0A62A7] text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
           >
             <Save className="h-5 w-5" /> Save Changes
           </button>
        </div>
      </form>

      {/* Testimonial Edit Modal */}
      {isEditModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
                <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"><X/></button>
                <h3 className="text-xl font-bold mb-4">Edit Testimonial</h3>
                <p className="text-sm text-slate-500 mb-6">Your edits will be submitted to an administrator for approval before going public.</p>
                <form onSubmit={handleTestimonialEditSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-500">Client Name</label>
                        <input type="text" value={testimonialEdits.clientName} onChange={e => setTestimonialEdits({...testimonialEdits, clientName: e.target.value})} className="w-full mt-1 p-2 border rounded-md" />
                    </div>
                     <div>
                        <label className="text-xs font-bold uppercase text-slate-500">Rating</label>
                         <div className="flex mt-1">
                            {[1,2,3,4,5].map(r => <button type="button" key={r} onClick={() => setTestimonialEdits({...testimonialEdits, rating: r})}><Star className={`h-6 w-6 ${testimonialEdits.rating >= r ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}/></button>)}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-500">Review Text</label>
                        <textarea value={testimonialEdits.reviewText} onChange={e => setTestimonialEdits({...testimonialEdits, reviewText: e.target.value})} rows={4} className="w-full mt-1 p-2 border rounded-md" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">Submit for Approval</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};