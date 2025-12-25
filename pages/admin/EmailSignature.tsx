import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { UserRole, SocialLink as SocialLinkType } from '../../types';
import { Copy, Check, Save, Upload, Download, Mail, Phone, Globe, MapPin, X, PenTool, Calendar, ExternalLink, Plus, Trash2 } from 'lucide-react';

type Tab = 'Personal' | 'Contact' | 'Social' | 'Legal' | 'Calendar' | 'Assets' | 'Layout';

export const EmailSignature: React.FC = () => {
  const { allUsers, companySettings, updateUser } = useData();
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('Personal');
  const [copied, setCopied] = useState(false);
  const signatureRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable fields state
  const [editForm, setEditForm] = useState<{
      firstName: string;
      lastName: string;
      title: string;
      companyName: string;
      email: string;
      phone: string;
      website: string;
      address: string;
      calendarUrl: string;
      avatar: string;
      showAvatar: boolean;
      showLogo: boolean;
      legalText: string;
      confidentialNotice: string;
      socialLinks: SocialLinkType[];
  }>({
      firstName: '',
      lastName: '',
      title: '',
      companyName: 'New Holland Financial Group',
      email: '',
      phone: '',
      website: 'www.newhollandfinancial.com',
      address: '',
      calendarUrl: '',
      avatar: '',
      showAvatar: true,
      showLogo: true,
      legalText: "Securities offered through New Holland Financial Group. Investment advisory services offered through NHFG Investment Advisors.",
      confidentialNotice: "Confidential Notice: This communication and any attachments are confidential and proprietary to New Holland Financial Group and its affiliates and are intended solely for the named recipient. If you are not the intended recipient, please delete this message immediately and notify the sender.",
      socialLinks: []
  });

  // Filter for advisors
  const advisors = allUsers.filter(u => u.role === UserRole.ADVISOR);

  // Default selected advisor
  useEffect(() => {
    if (advisors.length > 0 && !selectedAdvisorId) {
      setSelectedAdvisorId(advisors[0].id);
    }
  }, [advisors, selectedAdvisorId]);

  // Update form when advisor changes
  useEffect(() => {
      const adv = allUsers.find(u => u.id === selectedAdvisorId);
      if (adv) {
          const nameParts = adv.name.split(' ');
          const first = nameParts[0];
          const last = nameParts.slice(1).join(' ');

          setEditForm(prev => ({
              ...prev,
              firstName: first || '',
              lastName: last || '',
              title: adv.title || `${adv.category} Advisor`,
              email: adv.email,
              phone: adv.phone || companySettings.phone,
              address: `${companySettings.address}, ${companySettings.city}, ${companySettings.state} ${companySettings.zip}`,
              calendarUrl: adv.calendarUrl || '',
              avatar: adv.avatar || '',
              companyName: 'New Holland Financial Group',
              socialLinks: adv.socialLinks || []
          }));
      }
  }, [selectedAdvisorId, allUsers, companySettings]);

  const handleInputChange = (field: string, value: any) => {
      setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (index: number, field: keyof SocialLinkType, value: string) => {
    const updated = [...editForm.socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setEditForm(prev => ({ ...prev, socialLinks: updated }));
  };

  const handleAddSocial = () => {
    setEditForm(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: 'LinkedIn', url: '' }]
    }));
  };

  const handleRemoveSocial = (index: number) => {
    const updated = [...editForm.socialLinks];
    updated.splice(index, 1);
    setEditForm(prev => ({ ...prev, socialLinks: updated }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setEditForm(prev => ({ ...prev, avatar: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSaveChanges = () => {
      if (selectedAdvisorId) {
          updateUser(selectedAdvisorId, {
              name: `${editForm.firstName} ${editForm.lastName}`,
              title: editForm.title,
              email: editForm.email,
              phone: editForm.phone,
              calendarUrl: editForm.calendarUrl,
              avatar: editForm.avatar,
              socialLinks: editForm.socialLinks
          });
          alert("Advisor profile updated successfully!");
      }
  };

  const handleCopy = () => {
    if (signatureRef.current) {
      const range = document.createRange();
      range.selectNode(signatureRef.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');
      window.getSelection()?.removeAllRanges();
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
      if (!signatureRef.current) return;
      const html = signatureRef.current.innerHTML;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${editForm.firstName}_${editForm.lastName}_Signature.html`;
      a.click();
      URL.revokeObjectURL(url);
  };

  if (!selectedAdvisorId) return null;

  const cleanPhone = editForm.phone.replace(/\D/g, '');
  
  // Helper to ensure links are absolute
  const formatLink = (url: string) => {
    if (!url || url.trim() === '' || url === '#') return '#';
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    const linkWithoutPrefix = trimmed.replace(/^(instagram|facebook|twitter|linkedin|tiktok|youtube|x):/i, '');
    if (/^https?:\/\//i.test(linkWithoutPrefix)) return linkWithoutPrefix;
    return `https://${linkWithoutPrefix.replace(/^\/+/, '')}`;
  };

  const tabs: Tab[] = ['Personal', 'Contact', 'Social', 'Legal', 'Calendar', 'Assets', 'Layout'];
  
  const STYLES = {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      colors: {
          blue: '#2563EB',
          textDark: '#0B2240',
          textGray: '#4b5563',
          border: '#e5e7eb',
          bgWhite: '#ffffff',
          gold: '#FBBF24',
          brandDark: '#001d4a', // Dark blue from logo image
          lightGray: '#94a3b8'
      }
  };

  const getSocialIconSvg = (platform: string) => {
    const style = { width: '18px', height: '18px', display: 'block' };
    switch (platform) {
      case 'LinkedIn': return <LinkedInIcon style={style} />;
      case 'Facebook': return <FacebookIcon style={style} />;
      case 'Twitter': 
      case 'X': return <TwitterIcon style={style} />;
      case 'Instagram': return <InstagramIcon style={style} />;
      case 'YouTube': return <YouTubeIcon style={style} />;
      case 'TikTok': return <TikTokIcon style={style} />;
      default: return '🔗';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2240]">Email Signature Generator</h1>
          <p className="text-slate-500">Official company branding signature with updated visuals.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
            <span className="pl-4 text-xs font-bold text-slate-400 uppercase">Advisor:</span>
            <select 
                className="bg-slate-50 border-none rounded-full px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                value={selectedAdvisorId}
                onChange={(e) => setSelectedAdvisorId(e.target.value)}
            >
                {advisors.map(adv => (
                    <option key={adv.id} value={adv.id}>{adv.name}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        <div className="xl:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
                <div className="flex overflow-x-auto border-b border-slate-100 p-2 bg-slate-50/50 no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-6 flex-grow overflow-y-auto max-h-[600px] no-scrollbar">
                    {activeTab === 'Personal' && (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Name</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" value={editForm.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Name</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" value={editForm.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" value={editForm.title} onChange={(e) => handleInputChange('title', e.target.value)} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Contact' && (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" value={editForm.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" value={editForm.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Website</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" value={editForm.website} onChange={(e) => handleInputChange('website', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address</label>
                                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={2} value={editForm.address} onChange={(e) => handleInputChange('address', e.target.value)} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Social' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Social Profiles</h3>
                                <button onClick={handleAddSocial} className="flex items-center gap-1 text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase">
                                    <Plus size={14} /> Add Link
                                </button>
                            </div>
                            <div className="space-y-4">
                                {editForm.socialLinks.map((link, idx) => (
                                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <select 
                                                className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-600 focus:ring-1 focus:ring-blue-500 outline-none"
                                                value={link.platform}
                                                onChange={(e) => handleSocialChange(idx, 'platform', e.target.value as any)}
                                            >
                                                <option value="LinkedIn">LinkedIn</option>
                                                <option value="Facebook">Facebook</option>
                                                <option value="Twitter">Twitter / X</option>
                                                <option value="Instagram">Instagram</option>
                                                <option value="YouTube">YouTube</option>
                                                <option value="TikTok">TikTok</option>
                                            </select>
                                            <button onClick={() => handleRemoveSocial(idx)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <input 
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" 
                                            placeholder="Profile URL..." 
                                            value={link.url}
                                            onChange={(e) => handleSocialChange(idx, 'url', e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Legal' && (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Legal Disclaimer</label>
                                <textarea 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                                    rows={4} 
                                    value={editForm.legalText} 
                                    onChange={(e) => handleInputChange('legalText', e.target.value)} 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confidential Notice</label>
                                <textarea 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                                    rows={6} 
                                    value={editForm.confidentialNotice} 
                                    onChange={(e) => handleInputChange('confidentialNotice', e.target.value)} 
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Calendar' && (
                        <div className="space-y-4 animate-fade-in">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Booking/Calendar URL</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" value={editForm.calendarUrl} onChange={(e) => handleInputChange('calendarUrl', e.target.value)} placeholder="https://calendly.com/..." />
                        </div>
                    )}

                    {activeTab === 'Assets' && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 rounded-full bg-slate-100 overflow-hidden border border-slate-200 relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    {editForm.avatar ? <img src={editForm.avatar} className="w-full h-full object-cover" alt="avatar" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">{editForm.firstName[0]}</div>}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Upload className="h-5 w-5 text-white" /></div>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-full hover:bg-blue-100">Change Photo</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Layout' && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                <span className="text-sm font-bold text-slate-700">Show Avatar</span>
                                <input type="checkbox" checked={editForm.showAvatar} onChange={(e) => handleInputChange('showAvatar', e.target.checked)} className="accent-blue-600 h-4 w-4" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                <span className="text-sm font-bold text-slate-700">Show Logo</span>
                                <input type="checkbox" checked={editForm.showLogo} onChange={(e) => handleInputChange('showLogo', e.target.checked)} className="accent-blue-600 h-4 w-4" />
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="p-6 bg-slate-50 border-t border-slate-200">
                    <button onClick={handleSaveChanges} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0B2240] text-white rounded-2xl font-bold text-sm hover:bg-blue-900 transition-colors shadow-lg">
                        <Save className="h-4 w-4" /> Update Profile
                    </button>
                </div>
            </div>
        </div>

        <div className="xl:col-span-8 flex flex-col h-full min-h-[700px]">
            <div className="bg-white/40 backdrop-blur-md p-8 md:p-16 rounded-[3rem] border border-slate-200 shadow-inner flex flex-col items-center justify-start flex-grow overflow-hidden relative overflow-y-auto no-scrollbar">
                
                <div className="w-full flex-grow flex items-start justify-center pb-20">
                    <div 
                        ref={signatureRef}
                        className="mx-auto"
                        style={{ width: '100%', maxWidth: '620px' }}
                    >
                        <table role="presentation" cellPadding="0" cellSpacing="0" width="100%" style={{ maxWidth: '620px', width: '100%', background: STYLES.colors.bgWhite, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', fontFamily: STYLES.fontFamily, margin: '0 auto' }}>
                          
                          {/* 1. Brand Header (Replaced gradient with dark blue brand color) */}
                          <tr>
                            <td style={{ height: '80px', background: STYLES.colors.brandDark }}></td>
                          </tr>

                          {/* 2. Main Content Area */}
                          <tr>
                            <td style={{ padding: '24px' }}>
                              <table role="presentation" cellPadding="0" cellSpacing="0" width="100%">
                                <tr>
                                  {/* Avatar Cell - BIGGER SIZE AS REQUESTED */}
                                  {editForm.showAvatar && (
                                    <td width="145" valign="top">
                                        <img 
                                            src={editForm.avatar || `https://ui-avatars.com/api/?name=${editForm.firstName}+${editForm.lastName}&background=f3f4f6&color=6b7280`}
                                            width="130" height="130"
                                            style={{ borderRadius: '50%', display: 'block', border: '5px solid #ffffff', marginTop: '-75px', objectFit: 'cover', boxShadow: '0 8px 16px rgba(0,0,0,0.12)' }}
                                            alt="Profile Photo"
                                        />
                                    </td>
                                  )}

                                  {/* Text Info Cell */}
                                  <td valign="top" style={{ paddingLeft: editForm.showAvatar ? '20px' : '0' }}>
                                    <div style={{ fontSize: '26px', fontWeight: '800', color: STYLES.colors.brandDark, margin: '0', letterSpacing: '-0.5px' }}>
                                      {editForm.firstName} {editForm.lastName}
                                    </div>
                                    <div style={{ fontSize: '15px', color: STYLES.colors.blue, fontWeight: '700', marginTop: '2px' }}>
                                      {editForm.title}
                                    </div>

                                    {/* Contact List */}
                                    <div style={{ marginTop: '16px', fontSize: '13px', color: STYLES.colors.textGray, lineHeight: '1.6', fontWeight: '500' }}>
                                      <div style={{ marginBottom: '6px' }}>📧 <a href={`mailto:${editForm.email}`} style={{ color: STYLES.colors.textGray, textDecoration: 'none' }}>{editForm.email}</a></div>
                                      <div style={{ marginBottom: '6px' }}>📞 <a href={`tel:${cleanPhone}`} style={{ color: STYLES.colors.textGray, textDecoration: 'none' }}>{editForm.phone}</a></div>
                                      <div style={{ marginBottom: '6px' }}>🌐 <a href={formatLink(editForm.website)} target="_blank" style={{ color: STYLES.colors.textGray, textDecoration: 'none' }}>{editForm.website}</a></div>
                                      <div>📍 <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(editForm.address)}`} target="_blank" style={{ color: STYLES.colors.textGray, textDecoration: 'none' }}>{editForm.address}</a></div>
                                    </div>

                                    {/* Social Icons */}
                                    {editForm.socialLinks.length > 0 && (
                                        <div style={{ marginTop: '18px' }}>
                                            <table role="presentation" cellPadding="0" cellSpacing="0" border={0}>
                                                <tr>
                                                    {editForm.socialLinks.map((link, idx) => (
                                                        <td key={idx} style={{ paddingRight: '12px' }}>
                                                            <a 
                                                                href={formatLink(link.url)} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                style={{ display: 'block', width: '34px', height: '34px', borderRadius: '50%', backgroundColor: STYLES.colors.blue, textAlign: 'center', textDecoration: 'none' }}
                                                            >
                                                                <table role="presentation" cellPadding="0" cellSpacing="0" width="100%" height="100%">
                                                                    <tr>
                                                                        <td align="center" valign="middle" style={{ lineHeight: '34px', color: '#ffffff' }}>
                                                                            {getSocialIconSvg(link.platform)}
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </a>
                                                        </td>
                                                    ))}
                                                </tr>
                                            </table>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div style={{ marginTop: '24px' }}>
                                      <a href={formatLink(editForm.calendarUrl)} target="_blank" style={{ display: 'inline-block', padding: '12px 28px', background: STYLES.colors.blue, color: '#ffffff', borderRadius: '999px', fontSize: '13px', fontWeight: '800', textDecoration: 'none', marginRight: '10px', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>
                                        📅 Schedule
                                      </a>
                                      <a href={formatLink(`${editForm.website}/#/products`)} target="_blank" style={{ display: 'inline-block', padding: '12px 28px', border: `1px solid ${STYLES.colors.blue}`, color: STYLES.colors.blue, borderRadius: '999px', fontSize: '13px', fontWeight: '800', textDecoration: 'none' }}>
                                        🌐 Services
                                      </a>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>

                          {/* Divider */}
                          <tr>
                            <td style={{ height: '1px', background: STYLES.colors.border }}></td>
                          </tr>

                          {/* 3. Footer / Branding Section - REVERTED TO SOLID LOGO */}
                          <tr>
                            <td style={{ padding: '24px 32px' }}>
                              <table role="presentation" cellPadding="0" cellSpacing="0" width="100%">
                                <tr>
                                  {editForm.showLogo && (
                                    <td width="48" valign="middle">
                                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="44" height="44" style={{ display: 'block' }}>
                                            {/* Reverted house shape without circle */}
                                            <path d="M50 0L100 40V100H0V40L50 0Z" fill={STYLES.colors.gold}/>
                                        </svg>
                                    </td>
                                  )}
                                  <td style={{ paddingLeft: editForm.showLogo ? '16px' : '0' }} valign="middle">
                                    <div style={{ fontSize: '24px', fontWeight: '900', color: STYLES.colors.brandDark, lineHeight: '1.1', letterSpacing: '-0.8px' }}>
                                      New Holland
                                    </div>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: STYLES.colors.lightGray, textTransform: 'uppercase', letterSpacing: '4.5px', marginTop: '4px', lineHeight: '1' }}>
                                      FINANCIAL GROUP
                                    </div>
                                  </td>
                                </tr>
                              </table>

                              {/* Legal & Compliance */}
                              <div style={{ marginTop: '24px', fontSize: '11px', color: '#9ca3af', lineHeight: '1.5', maxWidth: '560px' }}>
                                {editForm.legalText}
                              </div>

                              <div style={{ marginTop: '10px', fontSize: '10px', color: '#cbd5e1', lineHeight: '1.5', maxWidth: '560px' }}>
                                <strong style={{ color: '#94a3b8' }}>Confidentiality Notice:</strong> {editForm.confidentialNotice.replace('Confidential Notice: ', '').replace('Confidentiality Notice: ', '')}
                              </div>
                            </td>
                          </tr>
                        </table>
                    </div>
                </div>

                <div className="w-full bg-white/50 backdrop-blur-md border-t border-slate-200 py-10 flex gap-4 justify-center sticky bottom-0">
                    <button onClick={handleCopy} className="flex-1 max-w-[220px] flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl font-black shadow-lg hover:bg-slate-50 transition-all active:scale-95">
                        {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />} 
                        <span className="text-sm">{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                    </button>
                    <button onClick={handleDownload} className="flex-1 max-w-[220px] flex items-center justify-center gap-3 px-6 py-4 bg-[#0A62A7] text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all active:scale-95">
                        <Download className="h-5 w-5" /> 
                        <span className="text-sm">Download HTML</span>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Social Icon Components for table embedding
const LinkedInIcon = (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);
const FacebookIcon = (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);
const InstagramIcon = (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
);
const TwitterIcon = (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
);
const YouTubeIcon = (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);
const TikTokIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
       <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.84-2.9 6.24-1.72 1.35-4.03 2.08-6.3 1.83-2.15-.2-4.13-1.28-5.52-3.03-1.23-1.6-1.87-3.62-1.74-5.63.13-2.02.97-3.95 2.38-5.46.22-.23.46-.44.71-.64.08-.05.15-.09.22-.13V6.99c-.19.12-.37.26-.55.4a9.12 9.12 0 0 0-3.32 5.51c-.68 2.37-.2 4.96 1.35 6.94 1.53 1.95 4.02 3.12 6.57 3.07 2.63-.05 5.09-1.34 6.58-3.46 1.32-1.92 1.9-4.32 1.56-6.66V4.73c.01.01.02.01.03.01h.01v-4.72Z"></path>
  </svg>
);