
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { CompanySettings, Resource, ProductType, SocialLink } from '../../types';
import { Save, Plus, Trash2, Globe, MapPin, Phone, Mail, Link as LinkIcon, AlertCircle, Image as ImageIcon, Video as VideoIcon, Youtube, Upload, PlayCircle, BookOpen, Camera, Handshake, CheckCircle2, Loader2, Eye, EyeOff, Layout, ShieldCheck, Share2 } from 'lucide-react';

export const WebsiteSettings: React.FC = () => {
  const { companySettings, updateCompanySettings, resources, addResource, deleteResource } = useData();
  
  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<CompanySettings>(companySettings);
  const [isSaved, setIsSaved] = useState(false);
  const [partnersSaved, setPartnersSaved] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  
  // Partner Management State
  const [newPartner, setNewPartner] = useState({ name: '', value: '' });

  // Resource Form State
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newResource, setNewResource] = useState<Partial<Resource>>({
      title: '',
      type: 'PDF',
      url: '',
      description: '',
      content: '', // For Blog
      thumbnail: '' // For Videos/Blogs
  });

  useEffect(() => {
    setSettingsForm(companySettings);
  }, [companySettings]);

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanySettings(settingsForm);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePartnersSave = () => {
      updateCompanySettings(settingsForm);
      setPartnersSaved(true);
      setTimeout(() => setPartnersSaved(false), 3000);
  };

  const toggleHiddenProduct = (productType: string) => {
      setSettingsForm(prev => {
          const currentHidden = prev.hiddenProducts || [];
          const isHidden = currentHidden.includes(productType);
          return {
              ...prev,
              hiddenProducts: isHidden 
                  ? currentHidden.filter(p => p !== productType) 
                  : [...currentHidden, productType]
          };
      });
  };

  const handleResourceSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (isUploading) return;

      if (!newResource.title) {
          alert("Please enter a title for the resource.");
          return;
      }
      if (!newResource.url && !newResource.content) {
          alert("Please provide a URL, upload a file, or enter content.");
          return;
      }
      
      addResource(newResource as any);
      setIsResourceModalOpen(false);
      setNewResource({ title: '', type: 'PDF', url: '', description: '', content: '', thumbnail: '' });
  };

  const handleDeleteResource = (id: string) => {
      if(window.confirm('Are you sure you want to delete this resource?')) {
          deleteResource(id);
      }
  };

  // Helper to read file and update state
  const readFile = (file: File, isVideo: boolean) => {
      const reader = new FileReader();
      reader.onloadend = () => {
          const result = reader.result as string;
          if (settingsForm.heroBackgroundType === 'video' && isVideo) {
              const currentPlaylist = settingsForm.heroVideoPlaylist || [];
              if (currentPlaylist.length >= 3) {
                  setUploadError('Maximum of 3 videos allowed in rotation.');
                  return;
              }
              setSettingsForm(prev => ({
                  ...prev,
                  heroVideoPlaylist: [...(prev.heroVideoPlaylist || []), result]
              }));
          } else {
              setSettingsForm(prev => ({
                  ...prev,
                  heroBackgroundUrl: result,
                  heroBackgroundType: isVideo ? 'video' : 'image'
              }));
          }
      };
      reader.readAsDataURL(file);
  };

  // Handle File Upload via FileReader with Duration Check
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (file) {
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (!isVideo && !isImage) {
            setUploadError('Please upload a valid image or video file.');
            return;
        }

        if (file.size > 250 * 1024 * 1024) { // 250MB Limit
            setUploadError('File size too large (>250MB).');
            return;
        }

        if (isVideo) {
             const video = document.createElement('video');
             video.preload = 'metadata';
             video.onloadedmetadata = function() {
                window.URL.revokeObjectURL(video.src);
                if (video.duration > 300) { // 300 seconds = 5 minutes
                    setUploadError('Video duration exceeds 5 minutes limit.');
                    return;
                }
                readFile(file, true);
             }
             video.onerror = function() {
                 setUploadError('Invalid video file.');
             }
             video.src = URL.createObjectURL(file);
        } else {
            readFile(file, false);
        }
    }
  };

  const handleResourceThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setNewResource(prev => ({ ...prev, thumbnail: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleResourceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 1024 * 1024 * 1024) {
              alert("File is too large (>1GB).");
              return;
          }
          
          setIsUploading(true);
          // Optimization for large files
          if (file.size > 2 * 1024 * 1024) {
              const objectUrl = URL.createObjectURL(file);
              setNewResource(prev => ({ ...prev, url: objectUrl }));
              setIsUploading(false);
              return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
              setNewResource(prev => ({ ...prev, url: reader.result as string }));
              setIsUploading(false);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleAboutImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setSettingsForm(prev => ({ ...prev, aboutImageUrl: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>, productType: string) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setSettingsForm(prev => ({ 
                  ...prev, 
                  productImages: {
                      ...(prev.productImages || {}),
                      [productType]: reader.result as string
                  }
              }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handlePartnerLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setNewPartner(prev => ({ ...prev, value: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleUrlChange = (value: string) => {
      setUploadError('');
      let cleanValue = value;
      if (value.includes('<iframe') || value.includes('src=')) {
          const srcMatch = value.match(/src=["']([^"']*)["']/);
          if (srcMatch && srcMatch[1]) {
              cleanValue = srcMatch[1];
          }
      }

      let type: 'image' | 'video' | 'youtube' = settingsForm.heroBackgroundType;
      const ytRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      if (cleanValue.match(ytRegex)) {
          type = 'youtube';
      } else if (cleanValue.match(/\.(mp4|webm|ogg)$/i)) {
          type = 'video';
      } else if (cleanValue.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          type = 'image';
      }

      setSettingsForm({
          ...settingsForm,
          heroBackgroundUrl: cleanValue,
          heroBackgroundType: type
      });
  };

  const addVideoToPlaylist = () => {
      if (!newVideoUrl) return;
      const currentPlaylist = settingsForm.heroVideoPlaylist || [];
      if (currentPlaylist.length >= 3) {
          setUploadError('Maximum of 3 videos allowed in rotation.');
          return;
      }
      setSettingsForm(prev => ({
          ...prev,
          heroVideoPlaylist: [...(prev.heroVideoPlaylist || []), newVideoUrl]
      }));
      setNewVideoUrl('');
  };

  const removeVideoFromPlaylist = (index: number) => {
      const newPlaylist = [...(settingsForm.heroVideoPlaylist || [])];
      newPlaylist.splice(index, 1);
      setSettingsForm(prev => ({ ...prev, heroVideoPlaylist: newPlaylist }));
  };

  const addPartner = () => {
      if (newPartner.name && newPartner.value) {
          const updatedSettings = {
              ...settingsForm,
              partners: {
                  ...(settingsForm.partners || {}),
                  [newPartner.name]: newPartner.value
              }
          };
          setSettingsForm(updatedSettings);
          // Auto-save to context to ensure visibility on home page immediately
          updateCompanySettings(updatedSettings);
          setNewPartner({ name: '', value: '' });
          setPartnersSaved(true);
          setTimeout(() => setPartnersSaved(false), 3000);
      }
  };

  const removePartner = (name: string) => {
      const updatedPartners = { ...(settingsForm.partners || {}) };
      delete updatedPartners[name];
      const updatedSettings = { ...settingsForm, partners: updatedPartners };
      setSettingsForm(updatedSettings);
      updateCompanySettings(updatedSettings); // Auto-save
  };

  const handleAddSocial = () => {
    const newLink: SocialLink = { platform: 'LinkedIn', url: '' };
    setSettingsForm(prev => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), newLink]
    }));
  };

  const handleRemoveSocial = (index: number) => {
    const updated = [...(settingsForm.socialLinks || [])];
    updated.splice(index, 1);
    setSettingsForm(prev => ({ ...prev, socialLinks: updated }));
  };

  const handleSocialChange = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...(settingsForm.socialLinks || [])];
    updated[index] = { ...updated[index], [field]: value };
    setSettingsForm(prev => ({ ...prev, socialLinks: updated }));
  };

  const mainCategories = [
      ProductType.LIFE,
      ProductType.REAL_ESTATE,
      ProductType.MORTGAGE,
      ProductType.BUSINESS,
      ProductType.AUTO,
      ProductType.EO,
      ProductType.SECURITIES,
      ProductType.INVESTMENT
  ];

  return (
    <div className="space-y-8 pb-10">
        <div>
            <h1 className="text-2xl font-bold text-[#0B2240]">Website Settings</h1>
            <p className="text-slate-500">Manage global company information and public resources.</p>
        </div>

        {/* Legal Onboarding Content Section */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-[#0B2240] mb-6 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                Advisor Onboarding Legal Documents
            </h2>
            <div className="space-y-8">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-2 tracking-wider">Terms of Use (Step 2)</label>
                    <textarea 
                        className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent transition-all focus:bg-white outline-none h-64"
                        value={settingsForm.termsOfUse || ''}
                        onChange={e => setSettingsForm({...settingsForm, termsOfUse: e.target.value})}
                        placeholder="Enter the full Terms of Use text..."
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-2 tracking-wider">Solicitor & Independent Contractor Agreement (Step 3)</label>
                    <textarea 
                        className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent transition-all focus:bg-white outline-none h-64"
                        value={settingsForm.solicitorAgreement || ''}
                        onChange={e => setSettingsForm({...settingsForm, solicitorAgreement: e.target.value})}
                        placeholder="Enter the Solicitor Agreement text..."
                    />
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button 
                        onClick={handleSettingsSave}
                        className="bg-[#0A62A7] text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" /> Save Legal Content
                    </button>
                </div>
            </div>
        </div>

        {/* Company Information Section */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-[#0B2240] mb-6 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Company Contact Information
            </h2>
            <form onSubmit={handleSettingsSave} className="space-y-6">
                
                {/* Home & Services Page Product Visibility */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                    <h3 className="text-sm font-bold text-[#0B2240] mb-4 uppercase tracking-wide flex items-center gap-2">
                        <Layout className="h-4 w-4" /> Public Product Visibility
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">Toggle visibility of product cards on the Home page and Services page.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mainCategories.map(cat => {
                            const isHidden = (settingsForm.hiddenProducts || []).includes(cat);
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => toggleHiddenProduct(cat)}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isHidden ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-blue-200 text-slate-800 shadow-sm'}`}
                                >
                                    <span className="font-bold text-xs truncate mr-2">{cat}</span>
                                    {isHidden ? <EyeOff className="h-4 w-4 flex-shrink-0" /> : <Eye className="h-4 w-4 text-blue-600 flex-shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Description & Social Links */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                    <h3 className="text-sm font-bold text-[#0B2240] mb-4 uppercase tracking-wide flex items-center gap-2">
                        <Share2 className="h-4 w-4" /> Footer & Social Media
                    </h3>
                    
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Footer Description</label>
                        <textarea 
                            className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent resize-none"
                            rows={3}
                            value={settingsForm.footerDescription || ''}
                            onChange={e => setSettingsForm({...settingsForm, footerDescription: e.target.value})}
                            placeholder="Brief company description for the footer..."
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase">Social Media Links</label>
                            <button type="button" onClick={handleAddSocial} className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"><Plus className="h-3 w-3"/> Add Link</button>
                        </div>
                        {settingsForm.socialLinks?.map((link, index) => (
                            <div key={index} className="flex gap-3">
                                <div className="w-1/3 md:w-1/4">
                                <select
                                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
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
                                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                                    placeholder="Profile URL"
                                    value={link.url}
                                    onChange={e => handleSocialChange(index, 'url', e.target.value)}
                                />
                                </div>
                                <button 
                                type="button" 
                                onClick={() => handleRemoveSocial(index)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hero Background Settings */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                    <h3 className="text-sm font-bold text-[#0B2240] mb-4 uppercase tracking-wide flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" /> Homepage Visuals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Background Type</label>
                             <select 
                                className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                                value={settingsForm.heroBackgroundType}
                                onChange={e => setSettingsForm({...settingsForm, heroBackgroundType: e.target.value as any})}
                             >
                                <option value="image">Image</option>
                                <option value="video">Direct Video (MP4)</option>
                                <option value="youtube">YouTube Embed</option>
                             </select>
                        </div>
                        <div className="md:col-span-2">
                             
                             {settingsForm.heroBackgroundType !== 'video' ? (
                                <div className="flex flex-col gap-3">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Media Source</label>
                                    <div className="relative">
                                        {settingsForm.heroBackgroundType === 'youtube' ?
                                            <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" /> :
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        }
                                        <input 
                                            type="text" 
                                            className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                                            placeholder={
                                                settingsForm.heroBackgroundType === 'youtube' ? "Paste YouTube URL or Embed Code" :
                                                "e.g. https://picsum.photos/1600/900"
                                            }
                                            value={settingsForm.heroBackgroundUrl}
                                            onChange={e => handleUrlChange(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-slate-400 uppercase">OR</span>
                                        <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 bg-white border border-dashed border-slate-300 rounded-xl py-2.5 hover:bg-slate-50 hover:border-blue-300 transition-all group relative">
                                            <Upload className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                                            <span className="text-sm text-slate-600 group-hover:text-blue-600 font-medium">Upload File</span>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                            />
                                        </label>
                                    </div>
                                </div>
                             ) : (
                                <div className="flex flex-col gap-3">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Video Playlist (Max 3, Max 5 min each)</label>
                                    
                                    <div className="space-y-2 mb-2">
                                        {(settingsForm.heroVideoPlaylist || []).map((vid, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                                                <PlayCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                <span className="text-xs text-slate-600 truncate flex-1">{vid.substring(0, 50)}...</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeVideoFromPlaylist(idx)} 
                                                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                        {(settingsForm.heroVideoPlaylist || []).length === 0 && (
                                            <p className="text-xs text-slate-400 italic">No videos in playlist.</p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <VideoIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input 
                                                type="text" 
                                                className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                                                placeholder="Paste .mp4 URL"
                                                value={newVideoUrl}
                                                onChange={e => setNewVideoUrl(e.target.value)}
                                            />
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={addVideoToPlaylist}
                                            disabled={(settingsForm.heroVideoPlaylist || []).length >= 3 || !newVideoUrl}
                                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-slate-400 uppercase">OR</span>
                                        <label className={`flex-1 cursor-pointer flex items-center justify-center gap-2 bg-white border border-dashed border-slate-300 rounded-xl py-2.5 hover:bg-slate-50 hover:border-blue-300 transition-all group relative ${(settingsForm.heroVideoPlaylist || []).length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            <Upload className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                                            <span className="text-sm text-slate-600 group-hover:text-blue-600 font-medium">Upload Video File</span>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="video/mp4,video/webm"
                                                onChange={handleFileUpload}
                                                disabled={(settingsForm.heroVideoPlaylist || []).length >= 3}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Max size 250MB (Demo). Max duration 5 mins.</p>
                                </div>
                             )}

                             {uploadError && (
                                <div className="flex items-center gap-2 text-red-600 text-xs font-bold animate-fade-in mt-2">
                                    <AlertCircle className="h-3 w-3" />
                                    {uploadError}
                                </div>
                             )}
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Hero Title</label>
                            <input 
                                type="text" 
                                className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                                value={settingsForm.heroTitle || ''}
                                onChange={e => setSettingsForm({...settingsForm, heroTitle: e.target.value})}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Hero Subtitle</label>
                            <textarea 
                                className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                                rows={2}
                                value={settingsForm.heroSubtitle || ''}
                                onChange={e => setSettingsForm({...settingsForm, heroSubtitle: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* About Us Page Image Setting */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                    <h3 className="text-sm font-bold text-[#0B2240] mb-4 uppercase tracking-wide flex items-center gap-2">
                        <Camera className="h-4 w-4" /> About Us Page Image
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-full md:w-1/3 h-40 bg-slate-200 rounded-xl overflow-hidden relative">
                            <img 
                                src={settingsForm.aboutImageUrl || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7"} 
                                className="w-full h-full object-cover" 
                                alt="About Page" 
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Image URL</label>
                            <div className="flex gap-3">
                                <input 
                                    type="text" 
                                    className="flex-1 bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                                    value={settingsForm.aboutImageUrl || ''}
                                    onChange={e => setSettingsForm({...settingsForm, aboutImageUrl: e.target.value})}
                                    placeholder="https://..."
                                />
                                <label className="cursor-pointer bg-white px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center justify-center">
                                    <Upload className="h-4 w-4 text-slate-600" />
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleAboutImageUpload}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Page Images Setting */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                    <h3 className="text-sm font-bold text-[#0B2240] mb-4 uppercase tracking-wide flex items-center gap-2">
                        <BookOpen className="h-4 w-4" /> Product Page Images
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.values(ProductType).map(productType => {
                            if ([ProductType.LIFE, ProductType.BUSINESS, ProductType.REAL_ESTATE, ProductType.AUTO, ProductType.EO, ProductType.SECURITIES, ProductType.MORTGAGE].includes(productType)) {
                                return (
                                    <div key={productType} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                        <p className="text-xs font-bold text-slate-500 uppercase mb-2 truncate" title={productType}>{productType}</p>
                                        <div className="w-full h-32 bg-slate-100 rounded-lg overflow-hidden mb-3 border border-slate-200 relative group">
                                            {settingsForm.productImages?.[productType] ? (
                                                <img src={settingsForm.productImages[productType]} className="w-full h-full object-cover" alt={productType} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Default</div>
                                            )}
                                            <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <span className="text-white text-xs font-bold flex items-center gap-1"><Upload className="h-3 w-3"/> Change</span>
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*" 
                                                    onChange={(e) => handleProductImageUpload(e, productType)}
                                                />
                                            </label>
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="Image URL..." 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
                                            value={settingsForm.productImages?.[productType] || ''}
                                            onChange={(e) => setSettingsForm(prev => ({
                                                ...prev,
                                                productImages: { ...(prev.productImages || {}), [productType]: e.target.value }
                                            }))}
                                        />
                                    </div>
                                )
                            }
                            return null;
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input 
                                type="text" 
                                className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                                value={settingsForm.phone}
                                onChange={e => setSettingsForm({...settingsForm, phone: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input 
                                type="email" 
                                className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                                value={settingsForm.email}
                                onChange={e => setSettingsForm({...settingsForm, email: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* Address Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Street Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input 
                                type="text" 
                                className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                                value={settingsForm.address}
                                onChange={e => setSettingsForm({...settingsForm, address: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">City</label>
                        <input 
                            type="text" 
                            className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                            value={settingsForm.city}
                            onChange={e => setSettingsForm({...settingsForm, city: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">State</label>
                            <input 
                                type="text" 
                                className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                                value={settingsForm.state}
                                onChange={e => setSettingsForm({...settingsForm, state: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Zip</label>
                            <input 
                                type="text" 
                                className="w-full bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent"
                                value={settingsForm.zip}
                                onChange={e => setSettingsForm({...settingsForm, zip: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                     <p className="text-xs text-slate-400 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Updates reflect immediately on public site.
                     </p>
                     <div className="flex items-center gap-4">
                        {isSaved && <span className="text-green-600 text-sm font-bold animate-fade-in">Saved!</span>}
                        <button type="submit" className="bg-[#0A62A7] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <Save className="h-4 w-4" /> Save Settings
                        </button>
                     </div>
                </div>
            </form>
        </div>

        {/* Partner Management Section */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#0B2240] flex items-center gap-2">
                    <Handshake className="h-5 w-5 text-blue-600" />
                    Partner Logos
                </h2>
                <div className="flex gap-2">
                    {partnersSaved && <span className="text-green-600 text-sm font-bold animate-fade-in flex items-center"><CheckCircle2 className="h-4 w-4 mr-1"/> Saved</span>}
                    <button onClick={handlePartnersSave} className="text-xs font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100">Save Changes</button>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                {Object.entries(settingsForm.partners || {}).map(([name, url]) => (
                    <div key={name} className="relative group bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-200">
                        <img 
                            src={(url as string).startsWith('http') || (url as string).startsWith('data:') ? url : `https://logo.clearbit.com/${url}`} 
                            alt={name} 
                            className="h-8 object-contain mb-2"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                        />
                        <span className="text-xs font-bold text-slate-500">{name}</span>
                        <button 
                            onClick={() => removePartner(name)}
                            className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="h-3 w-3" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <input 
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#0A62A7] outline-none"
                    placeholder="Partner Name"
                    value={newPartner.name}
                    onChange={e => setNewPartner({...newPartner, name: e.target.value})}
                />
                <div className="flex-1 relative">
                    <input 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#0A62A7] outline-none pr-10"
                        placeholder="Domain (e.g. google.com) or Upload"
                        value={newPartner.value}
                        onChange={e => setNewPartner({...newPartner, value: e.target.value})}
                    />
                    <label className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer text-slate-400 hover:text-blue-600 transition-colors" title="Upload Logo">
                        <Upload className="h-4 w-4" />
                        <input type="file" className="hidden" accept="image/*" onChange={handlePartnerLogoUpload} />
                    </label>
                </div>
                <button 
                    onClick={addPartner}
                    className="bg-[#0B2240] text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                >
                    Add
                </button>
            </div>
        </div>

        {/* Resource Management Section */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#0B2240] flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Resource Library
                </h2>
                <button 
                    onClick={() => setIsResourceModalOpen(true)}
                    className="bg-[#0A62A7] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" /> Add Resource
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                        <tr>
                            <th className="px-6 py-4 rounded-tl-xl">Title</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Likes</th>
                            <th className="px-6 py-4">Date Added</th>
                            <th className="px-6 py-4 rounded-tr-xl text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {resources.map(res => (
                            <tr key={res.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-bold text-slate-800">{res.title}</td>
                                <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{res.type}</span></td>
                                <td className="px-6 py-4">{res.likes}</td>
                                <td className="px-6 py-4 text-xs">{new Date(res.dateAdded).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDeleteResource(res.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {resources.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-slate-400 italic">No resources uploaded.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Add Resource Modal */}
        {isResourceModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 animate-fade-in max-h-[90vh] overflow-y-auto">
                    <h2 className="text-xl font-bold text-[#0B2240] mb-6">Add New Resource</h2>
                    <form onSubmit={handleResourceSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                            <input 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] outline-none"
                                value={newResource.title}
                                onChange={e => setNewResource({...newResource, title: e.target.value})}
                                placeholder="e.g. Life Insurance Guide"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                            <select 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] outline-none"
                                value={newResource.type}
                                onChange={e => setNewResource({...newResource, type: e.target.value as any})}
                            >
                                <option value="PDF">PDF Document</option>
                                <option value="Video">Direct Video (MP4)</option>
                                <option value="YouTube">YouTube Video</option>
                                <option value="Link">External Link</option>
                                <option value="Article">Article</option>
                                <option value="Blog">Blog Post</option>
                                <option value="Image">Image</option>
                            </select>
                        </div>
                        
                        {(['PDF', 'Image', 'Video'].includes(newResource.type || '')) && (
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Upload File</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept={newResource.type === 'PDF' ? '.pdf' : newResource.type === 'Image' ? 'image/*' : 'video/*'}
                                        onChange={handleResourceFileUpload}
                                    />
                                    {isUploading ? (
                                        <div className="flex items-center justify-center gap-2 text-blue-600 font-bold">
                                            <Loader2 className="h-5 w-5 animate-spin" /> Uploading...
                                        </div>
                                    ) : newResource.url && newResource.url.startsWith('data:') ? (
                                        <div className="text-green-600 font-bold flex items-center justify-center gap-2">
                                            <CheckCircle2 className="h-5 w-5" /> File Ready
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                                            <p className="text-xs text-slate-400 mt-1">Max 250MB (Demo)</p>
                                        </>
                                    )}
                                </div>
                             </div>
                        )}

                        {(['Video', 'Blog', 'YouTube'].includes(newResource.type || '')) && (
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cover Image / Thumbnail</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={handleResourceThumbnailUpload}
                                    />
                                    {newResource.thumbnail ? (
                                        <img src={newResource.thumbnail} alt="Thumbnail" className="h-20 mx-auto object-cover rounded-lg" />
                                    ) : (
                                        <span className="text-xs text-slate-500 font-bold flex items-center justify-center gap-2"><ImageIcon className="h-4 w-4"/> Upload Cover Image</span>
                                    )}
                                </div>
                             </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                {newResource.type === 'YouTube' ? 'YouTube URL' : 
                                 newResource.type === 'Blog' ? 'External Blog URL (Optional)' : 'Resource URL'}
                            </label>
                            <input 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] outline-none"
                                value={newResource.url}
                                onChange={e => setNewResource({...newResource, url: e.target.value})}
                                placeholder={newResource.type === 'YouTube' ? 'https://youtube.com/watch?v=...' : 'https://...'}
                                disabled={isUploading} 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                            <textarea 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] outline-none resize-none"
                                rows={3}
                                value={newResource.description}
                                onChange={e => setNewResource({...newResource, description: e.target.value})}
                            />
                        </div>

                        {newResource.type === 'Blog' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Blog Content</label>
                                <textarea 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent outline-none resize-none h-40"
                                    placeholder="Write your article here..."
                                    value={newResource.content}
                                    onChange={e => setNewResource({...newResource, content: e.target.value})}
                                />
                            </div>
                        )}

                        <div className="pt-4 flex gap-3">
                            <button type="button" onClick={() => setIsResourceModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
                            <button type="submit" disabled={isUploading} className="flex-1 py-3 rounded-xl font-bold bg-[#0A62A7] text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50">
                                {isUploading ? 'Uploading...' : 'Add Resource'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};
