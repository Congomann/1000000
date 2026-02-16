import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { UserRole, SocialLink as SocialLinkType } from '../../types';
import { Copy, Check, Download, Plus, Trash2, RotateCcw, X, Mail, Phone, Globe, MapPin, Facebook, Linkedin, Twitter, Instagram } from 'lucide-react';

type Tab = 'Personal' | 'Contact' | 'Social' | 'Legal' | 'Calendar';

export const EmailSignature: React.FC = () => {
  const { allUsers, companySettings, updateUser, user } = useData();
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('Personal');
  const [copied, setCopied] = useState(false);
  
  const signatureRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastLoadedId = useRef<string | null>(null);

  const [editForm, setEditForm] = useState({
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      phone: '',
      phone2: '',
      website: 'www.newhollandfinancial.com',
      addressLine1: '',
      addressLine2: '',
      calendarUrl: '',
      avatar: '',
      showAvatar: true,
      legalText: "Securities offered through New Holland Financial Group. Investment advisory services offered through NHFG Investment Advisors.",
      socialLinks: [] as SocialLinkType[]
  });

  const eligibleUsers = allUsers.filter(u => 
    u.role === UserRole.ADVISOR || 
    u.role === UserRole.ADMIN || 
    u.role === UserRole.MANAGER || 
    u.role === UserRole.SUB_ADMIN
  );

  useEffect(() => {
    if (eligibleUsers.length > 0 && !selectedAdvisorId) {
      if (user && eligibleUsers.find(u => u.id === user.id)) {
          setSelectedAdvisorId(user.id);
      } else {
          setSelectedAdvisorId(eligibleUsers[0].id);
      }
    }
  }, [eligibleUsers, selectedAdvisorId, user]);

  useEffect(() => {
      const adv = allUsers.find(u => u.id === selectedAdvisorId);
      
      if (adv && selectedAdvisorId !== lastLoadedId.current) {
          const nameParts = adv.name.split(' ');
          setEditForm({
              firstName: nameParts[0] || '',
              lastName: nameParts.slice(1).join(' ') || '',
              title: adv.title || (adv.role === UserRole.ADVISOR ? `${adv.category} Advisor` : adv.role),
              email: adv.email,
              phone: adv.phone || companySettings.phone,
              phone2: '(800) 555-0199',
              addressLine1: companySettings.address,
              addressLine2: `${companySettings.city}, ${companySettings.state} ${companySettings.zip}`,
              calendarUrl: adv.calendarUrl || '',
              avatar: adv.avatar || '',
              website: 'www.newhollandfinancial.com',
              showAvatar: true,
              legalText: "Securities offered through New Holland Financial Group. Investment advisory services offered through NHFG Investment Advisors.",
              socialLinks: adv.socialLinks || []
          });
          lastLoadedId.current = selectedAdvisorId;
      }
  }, [selectedAdvisorId, allUsers, companySettings]);

  const handleReset = () => {
      lastLoadedId.current = null; 
      const adv = allUsers.find(u => u.id === selectedAdvisorId);
      if (adv) {
          const currentId = selectedAdvisorId;
          setSelectedAdvisorId(''); 
          setTimeout(() => setSelectedAdvisorId(currentId), 10);
      }
  };

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
          alert("User profile updated!");
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
      const html = `<!DOCTYPE html><html><body>${signatureRef.current.outerHTML}</body></html>`;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${editForm.firstName}_Signature.html`;
      a.click();
      URL.revokeObjectURL(url);
  };

  const STYLES = {
      fontFamily: "'Inter', sans-serif",
      colors: {
          navy: '#051C33',
          grey: '#64748B',
          lightGrey: '#94A3B8',
          blue: '#2563EB',
          white: '#ffffff'
      }
  };

  const logoBase64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iNSIgeT0iMTUiIHdpZHRoPSI5MCIgaGVpZ2h0PSI2MCIgcng9IjEyIiBmaWxsPSIjRjU5RTBCIiAvPjxyZWN0IHg9IjEwIiB5PSIzNSIgd2lkdGg9IjgwIiBoZWlnaHQ9IjU1IiByeD0iMTIiIGZpbGw9IiNGQ0QzNEQiIC8+PHJlY3QgeD0iNDIiIHk9IjUyIiB3aWR0aD0iMTYiIGhlaWdodD0iMjIiIHJ4PSI0IiBmaWxsPSIjQjQ1MzA5IiBmaWxsLW9wYWNpdHk9IjAuMjUiIC8+PC9zdmc+";

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0B2240] tracking-tight uppercase">Email Signature</h1>
          <p className="text-slate-500 font-medium">Verify corporate identity compliance and export signatures.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
            <span className="pl-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Advisor:</span>
            <select 
                className="bg-slate-50 border-none rounded-full px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#0A62A7] outline-none cursor-pointer"
                value={selectedAdvisorId}
                onChange={(e) => setSelectedAdvisorId(e.target.value)}
            >
                {eligibleUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* EDITOR */}
        <div className="xl:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[750px]">
                <div className="flex overflow-x-auto border-b border-slate-100 p-2 bg-slate-50/50 no-scrollbar">
                    {['Personal', 'Contact', 'Social', 'Legal'].map((tab: any) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-xs font-black uppercase tracking-widest rounded-full whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-8 flex-grow overflow-y-auto no-scrollbar space-y-6">
                    {activeTab === 'Personal' && (
                        <>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">First Name</label>
                                <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none" value={editForm.firstName} onChange={e => handleInputChange('firstName', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Last Name</label>
                                <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none" value={editForm.lastName} onChange={e => handleInputChange('lastName', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Professional Title</label>
                                <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none" value={editForm.title} onChange={e => handleInputChange('title', e.target.value)} />
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">Identity Photo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-md">
                                        {editForm.avatar && <img src={editForm.avatar} className="w-full h-full object-cover" />}
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                                    <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black bg-blue-50 text-blue-600 px-4 py-2 rounded-lg uppercase tracking-widest">Update Photo</button>
                                </div>
                            </div>
                        </>
                    )}
                    {activeTab === 'Contact' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Direct Line</label>
                                    <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium" value={editForm.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Office Line</label>
                                    <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium" value={editForm.phone2} onChange={e => handleInputChange('phone2', e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Email</label>
                                <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium" value={editForm.email} onChange={e => handleInputChange('email', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Website</label>
                                <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium" value={editForm.website} onChange={e => handleInputChange('website', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Street Address</label>
                                <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium" value={editForm.addressLine1} onChange={e => handleInputChange('addressLine1', e.target.value)} />
                            </div>
                        </>
                    )}
                    {activeTab === 'Social' && (
                        <div className="space-y-4">
                            <button onClick={handleAddSocial} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                                <Plus size={14}/> Add Profile Link
                            </button>
                            {editForm.socialLinks.map((link, idx) => (
                                <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                                    <select value={link.platform} onChange={e => handleSocialChange(idx, 'platform', e.target.value as any)} className="bg-white border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-black uppercase text-slate-700">
                                        {['LinkedIn', 'Facebook', 'Twitter', 'Instagram', 'YouTube'].map(k => <option key={k} value={k}>{k}</option>)}
                                    </select>
                                    <input value={link.url} onChange={e => handleSocialChange(idx, 'url', e.target.value)} className="bg-transparent border-none text-xs flex-1 outline-none font-medium text-slate-600" placeholder="URL..." />
                                    <button onClick={() => handleRemoveSocial(idx)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14}/></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-4">
                    <button onClick={handleReset} className="p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-100 shadow-sm" title="Revert Changes"><RotateCcw size={18}/></button>
                    <button onClick={handleSaveChanges} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#0B2240] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-900 transition-colors shadow-lg">
                        Commit Changes
                    </button>
                </div>
            </div>
        </div>

        {/* PREVIEW CONTAINER */}
        <div className="xl:col-span-8 flex flex-col h-full">
            <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-200 flex flex-col items-center justify-center flex-grow">
                
                <div className="w-full max-w-[850px] bg-[#F1F5F9] p-10 rounded-[3.5rem] shadow-inner flex items-center justify-center">
                    {/* THE SIGNATURE CARD - DESIGNED TO MATCH SCREENSHOT */}
                    <div className="bg-white rounded-3xl shadow-2xl border border-white/50 overflow-hidden w-full p-10" style={{ minWidth: '780px' }}>
                        <div ref={signatureRef} style={{ width: '100%', backgroundColor: '#ffffff', textAlign: 'left', fontFamily: 'Inter, Arial, sans-serif' }}>
                            <table cellPadding="0" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tr>
                                    <td style={{ padding: '0 0 20px 0' }}>
                                        <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                                            <tr>
                                                {/* 1. LEFT: AVATAR WITH CIRCULAR ACCENT */}
                                                <td style={{ width: '180px', verticalAlign: 'middle', textAlign: 'center' }}>
                                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                                        {/* Decorative arc simulating the screenshot design */}
                                                        <div style={{ 
                                                            position: 'absolute', 
                                                            top: '-8px', 
                                                            left: '-8px', 
                                                            right: '-8px', 
                                                            bottom: '-8px', 
                                                            border: `2px solid ${STYLES.colors.navy}`, 
                                                            borderRadius: '50%', 
                                                            borderColor: `${STYLES.colors.navy} transparent transparent ${STYLES.colors.navy}`,
                                                            transform: 'rotate(-45deg)',
                                                            opacity: 0.2
                                                        }}></div>
                                                        <div style={{ width: '130px', height: '130px', borderRadius: '50%', border: `4px solid ${STYLES.colors.navy}`, overflow: 'hidden', padding: '0' }}>
                                                            <img 
                                                                src={editForm.avatar || `https://ui-avatars.com/api/?name=${editForm.firstName}+${editForm.lastName}&background=E5E7EB&color=6B7280&size=200`} 
                                                                alt="Advisor" 
                                                                width="130" 
                                                                height="130" 
                                                                style={{ borderRadius: '50%', display: 'block', objectFit: 'cover', width: '100%', height: '100%' }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* 2. VERTICAL SEPARATOR 1 */}
                                                <td style={{ width: '1px', backgroundColor: STYLES.colors.navy, opacity: 0.15, verticalAlign: 'middle' }}></td>

                                                {/* 3. CENTER: NAME, TITLE & CONTACT */}
                                                <td style={{ padding: '0 40px', verticalAlign: 'middle' }}>
                                                    <div style={{ fontSize: '26px', fontWeight: '900', color: STYLES.colors.navy, lineHeight: '1.2', letterSpacing: '-0.01em' }}>
                                                        {editForm.firstName} {editForm.lastName}
                                                    </div>
                                                    <div style={{ fontSize: '15px', fontWeight: '600', color: STYLES.colors.grey, marginBottom: '10px' }}>
                                                        {editForm.title}
                                                    </div>
                                                    {/* Accent line */}
                                                    <div style={{ height: '2px', width: '35px', backgroundColor: STYLES.colors.navy, marginBottom: '18px' }}></div>
                                                    
                                                    <table cellPadding="0" cellSpacing="0" style={{ fontSize: '13px', color: STYLES.colors.grey, lineHeight: '1.6', fontWeight: '500' }}>
                                                        <tr>
                                                            <td style={{ verticalAlign: 'middle', paddingRight: '12px' }}>
                                                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `1.5px solid ${STYLES.colors.navy}`, display: 'flex', alignItems: 'center', justifyItems: 'center', textAlign: 'center', opacity: 0.7 }}>
                                                                    <span style={{ fontSize: '11px', width: '100%', color: STYLES.colors.navy }}>📞</span>
                                                                </div>
                                                            </td>
                                                            <td style={{ color: STYLES.colors.navy, fontWeight: '700' }}>{editForm.phone}<br/><span style={{ opacity: 0.6, fontWeight: '500' }}>{editForm.phone2}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ verticalAlign: 'middle', padding: '10px 12px 10px 0' }}>
                                                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `1.5px solid ${STYLES.colors.navy}`, display: 'flex', alignItems: 'center', justifyItems: 'center', textAlign: 'center', opacity: 0.7 }}>
                                                                    <span style={{ fontSize: '11px', width: '100%', color: STYLES.colors.navy }}>📧</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <a href={`mailto:${editForm.email}`} style={{ textDecoration: 'none', color: STYLES.colors.navy, fontWeight: '700' }}>{editForm.email}</a><br/>
                                                                <a href={`https://${editForm.website}`} style={{ textDecoration: 'none', color: STYLES.colors.navy, opacity: 0.6, fontWeight: '500' }}>{editForm.website}</a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ verticalAlign: 'middle', paddingRight: '12px' }}>
                                                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `1.5px solid ${STYLES.colors.navy}`, display: 'flex', alignItems: 'center', justifyItems: 'center', textAlign: 'center', opacity: 0.7 }}>
                                                                    <span style={{ fontSize: '11px', width: '100%', color: STYLES.colors.navy }}>📍</span>
                                                                </div>
                                                            </td>
                                                            <td>{editForm.addressLine1}<br/>{editForm.addressLine2}</td>
                                                        </tr>
                                                    </table>
                                                </td>

                                                {/* 4. VERTICAL SEPARATOR 2 */}
                                                <td style={{ width: '1px', backgroundColor: STYLES.colors.navy, opacity: 0.15, verticalAlign: 'middle' }}></td>

                                                {/* 5. RIGHT: LOGO & SOCIAL */}
                                                <td style={{ paddingLeft: '40px', verticalAlign: 'middle', width: '180px' }}>
                                                    {/* BRAND LOGO PART */}
                                                    <table cellPadding="0" cellSpacing="0" style={{ marginBottom: '25px' }}>
                                                        <tr>
                                                            <td style={{ verticalAlign: 'middle', paddingRight: '12px' }}>
                                                                <div style={{ backgroundColor: STYLES.colors.navy, padding: '6px', borderRadius: '6px' }}>
                                                                    <img src={logoBase64} width="28" height="28" alt="Logo" style={{ display: 'block' }} />
                                                                </div>
                                                            </td>
                                                            <td style={{ verticalAlign: 'middle' }}>
                                                                <div style={{ fontSize: '15px', fontWeight: '900', color: STYLES.colors.navy, lineHeight: '1.1' }}>New Holland</div>
                                                                <div style={{ fontSize: '7px', fontWeight: '800', color: STYLES.colors.lightGrey, letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '2px' }}>FINANCIAL GROUP</div>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    {/* SOCIAL ICONS BLOCK */}
                                                    <table cellPadding="0" cellSpacing="0">
                                                        <tr>
                                                            <td style={{ paddingRight: '10px' }}>
                                                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/32/733/733547.png" width="20" height="20" style={{ borderRadius: '50%', backgroundColor: STYLES.colors.navy, padding: '6px' }} alt="f" /></a>
                                                            </td>
                                                            <td style={{ paddingRight: '10px' }}>
                                                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/32/733/733579.png" width="20" height="20" style={{ borderRadius: '50%', backgroundColor: STYLES.colors.navy, padding: '6px' }} alt="t" /></a>
                                                            </td>
                                                            <td style={{ paddingRight: '10px' }}>
                                                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/32/733/733561.png" width="20" height="20" style={{ borderRadius: '50%', backgroundColor: STYLES.colors.navy, padding: '6px' }} alt="l" /></a>
                                                            </td>
                                                            <td>
                                                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/32/733/733558.png" width="20" height="20" style={{ borderRadius: '50%', backgroundColor: STYLES.colors.navy, padding: '6px' }} alt="i" /></a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ borderTop: '1px solid #F3F4F6', paddingTop: '15px' }}>
                                        <p style={{ fontSize: '9px', color: STYLES.colors.lightGrey, lineHeight: '1.5', margin: '0' }}>
                                            {editForm.legalText}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-12 w-full max-w-[850px]">
                    <button onClick={handleCopy} className="flex-1 py-5 bg-white text-slate-700 font-black rounded-3xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
                        {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-blue-500" />}
                        {copied ? 'Copied to Clipboard' : 'Copy HTML'}
                    </button>
                    <button onClick={handleDownload} className="flex-1 py-5 bg-[#0B2240] text-white font-black rounded-3xl shadow-2xl hover:bg-blue-900 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
                        <Download className="h-5 w-5" /> Download HTML
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};