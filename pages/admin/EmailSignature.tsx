
import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { UserRole, SocialLink as SocialLinkType } from '../../types';
import { Copy, Check, Save, Download, Plus, Trash2, RotateCcw, UserCircle } from 'lucide-react';

type Tab = 'Personal' | 'Contact' | 'Social' | 'Legal' | 'Calendar';

export const EmailSignature: React.FC = () => {
  const { allUsers, companySettings, updateUser, user } = useData();
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('Personal');
  const [copied, setCopied] = useState(false);
  
  // Refs
  const signatureRef = useRef<HTMLTableElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastLoadedId = useRef<string | null>(null);

  // Form State
  const [editForm, setEditForm] = useState({
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      phone: '',
      website: 'www.newhollandfinancial.com',
      address: '',
      calendarUrl: '',
      avatar: '',
      showAvatar: true,
      legalText: "Securities offered through New Holland Financial Group. Investment advisory services offered through NHFG Investment Advisors.",
      confidentialNotice: "Confidentiality Notice: This communication and any attachments are confidential and proprietary to New Holland Financial Group and its affiliates.",
      socialLinks: [] as SocialLinkType[]
  });

  // Filter users eligible for signatures (Advisors + Admins + Managers)
  const eligibleUsers = allUsers.filter(u => 
    u.role === UserRole.ADVISOR || 
    u.role === UserRole.ADMIN || 
    u.role === UserRole.MANAGER || 
    u.role === UserRole.SUB_ADMIN
  );

  // Auto-select: Priority to current user, else first available
  useEffect(() => {
    if (eligibleUsers.length > 0 && !selectedAdvisorId) {
      if (user && eligibleUsers.find(u => u.id === user.id)) {
          setSelectedAdvisorId(user.id);
      } else {
          setSelectedAdvisorId(eligibleUsers[0].id);
      }
    }
  }, [eligibleUsers, selectedAdvisorId, user]);

  // Robust Data Loading Logic
  useEffect(() => {
      const adv = allUsers.find(u => u.id === selectedAdvisorId);
      
      // CRITICAL FIX: Only load if we have an advisor AND the ID has changed.
      // This prevents the form from resetting if 'allUsers' updates in the background.
      if (adv && selectedAdvisorId !== lastLoadedId.current) {
          const nameParts = adv.name.split(' ');
          setEditForm({
              firstName: nameParts[0] || '',
              lastName: nameParts.slice(1).join(' ') || '',
              title: adv.title || (adv.role === UserRole.ADVISOR ? `${adv.category} Advisor` : adv.role),
              email: adv.email,
              phone: adv.phone || companySettings.phone,
              address: `${companySettings.address}, ${companySettings.city}, ${companySettings.state} ${companySettings.zip}`,
              calendarUrl: adv.calendarUrl || '',
              avatar: adv.avatar || '',
              website: 'www.newhollandfinancial.com',
              showAvatar: true,
              legalText: "Securities offered through New Holland Financial Group. Investment advisory services offered through NHFG Investment Advisors.",
              confidentialNotice: "Confidentiality Notice: This communication and any attachments are confidential and proprietary to New Holland Financial Group and its affiliates and are intended solely for the named recipient.",
              socialLinks: adv.socialLinks || []
          });
          lastLoadedId.current = selectedAdvisorId;
      }
  }, [selectedAdvisorId, allUsers, companySettings]);

  const handleReset = () => {
      lastLoadedId.current = null; // Break lock
      const adv = allUsers.find(u => u.id === selectedAdvisorId);
      if (adv) {
          // Force reload by briefly clearing ID
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
          alert("User profile updated in database!");
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

  // --- STYLES FOR EMAIL CLIENT COMPATIBILITY ---
  const STYLES = {
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      colors: {
          blue: '#2563EB',
          darkBlue: '#0B2240',
          textGray: '#6b7280',
          lightGray: '#f3f4f6',
          white: '#ffffff',
          gold: '#FBBF24'
      }
  };

  if (eligibleUsers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <UserCircle size={64} className="mb-4 opacity-20" />
            <h2 className="text-xl font-bold text-slate-600">No Eligible Users Found</h2>
            <p>Add users to the terminal to generate signatures.</p>
        </div>
      );
  }

  if (!selectedAdvisorId) return null;

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0B2240] tracking-tight">Email Signature Generator</h1>
          <p className="text-slate-500 font-medium">Official company branding signature with updated visuals.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
            <span className="pl-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User:</span>
            <select 
                className="bg-slate-50 border-none rounded-full px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                value={selectedAdvisorId}
                onChange={(e) => setSelectedAdvisorId(e.target.value)}
            >
                {eligibleUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT: EDITOR */}
        <div className="xl:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[750px]">
                <div className="flex overflow-x-auto border-b border-slate-100 p-2 bg-slate-50/50 no-scrollbar">
                    {['Personal', 'Contact', 'Social', 'Legal', 'Calendar'].map((tab: any) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-xs font-bold rounded-full whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-8 flex-grow overflow-y-auto no-scrollbar space-y-6">
                    {activeTab === 'Personal' && (
                        <>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">First Name</label>
                                <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" value={editForm.firstName} onChange={e => handleInputChange('firstName', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Last Name</label>
                                <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" value={editForm.lastName} onChange={e => handleInputChange('lastName', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Job Title</label>
                                <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" value={editForm.title} onChange={e => handleInputChange('title', e.target.value)} />
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Profile Photo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-md">
                                        {editForm.avatar && <img src={editForm.avatar} className="w-full h-full object-cover" />}
                                    </div>
                                    <div>
                                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                                        <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100">Upload New</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {activeTab === 'Contact' && (
                        <>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Email Address</label>
                                <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium text-slate-700" value={editForm.email} onChange={e => handleInputChange('email', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Phone Number</label>
                                <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium text-slate-700" value={editForm.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Website URL</label>
                                <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium text-slate-700" value={editForm.website} onChange={e => handleInputChange('website', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Office Address</label>
                                <textarea rows={2} className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 resize-none" value={editForm.address} onChange={e => handleInputChange('address', e.target.value)} />
                            </div>
                        </>
                    )}
                    {activeTab === 'Social' && (
                        <div className="space-y-4">
                            <button onClick={handleAddSocial} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-xs hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                                <Plus size={14}/> Add Social Link
                            </button>
                            {editForm.socialLinks.map((link, idx) => (
                                <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                                    <select value={link.platform} onChange={e => handleSocialChange(idx, 'platform', e.target.value as any)} className="bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs font-bold text-slate-700">
                                        {['LinkedIn', 'Facebook', 'Twitter', 'Instagram', 'YouTube'].map(k => <option key={k} value={k}>{k}</option>)}
                                    </select>
                                    <input value={link.url} onChange={e => handleSocialChange(idx, 'url', e.target.value)} className="bg-transparent border-none text-xs flex-1 outline-none font-medium text-slate-600" placeholder="URL..." />
                                    <button onClick={() => handleRemoveSocial(idx)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14}/></button>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'Legal' && (
                        <>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Disclosure Text</label>
                                <textarea className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-xs text-slate-600 resize-none leading-relaxed" rows={6} value={editForm.legalText} onChange={e => handleInputChange('legalText', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Confidentiality Notice</label>
                                <textarea className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-xs text-slate-600 resize-none leading-relaxed" rows={6} value={editForm.confidentialNotice} onChange={e => handleInputChange('confidentialNotice', e.target.value)} />
                            </div>
                        </>
                    )}
                    {activeTab === 'Calendar' && (
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Booking / Calendar URL</label>
                            <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium text-slate-700" value={editForm.calendarUrl} onChange={e => handleInputChange('calendarUrl', e.target.value)} placeholder="https://calendly.com/..." />
                            <p className="text-[10px] text-slate-400 mt-2">Used for the 'Schedule' button in your signature.</p>
                        </div>
                    )}
                </div>
                
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-4">
                    <button onClick={handleReset} className="p-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-100 shadow-sm" title="Reset Changes"><RotateCcw size={18}/></button>
                    <button onClick={handleSaveChanges} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#0B2240] text-white rounded-xl font-bold text-sm hover:bg-blue-900 transition-colors shadow-lg">
                        <Save className="h-4 w-4" /> Save Profile
                    </button>
                </div>
            </div>
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="xl:col-span-8 flex flex-col h-full min-h-[700px]">
            <div className="bg-slate-50/50 p-10 rounded-[3rem] border border-slate-200 shadow-inner flex flex-col items-center justify-center flex-grow overflow-y-auto no-scrollbar">
                
                {/* SIGNATURE CARD CONTAINER */}
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden w-full max-w-[620px] transform transition-all hover:scale-[1.01]">
                    
                    {/* VISUAL PREVIEW & COPY TARGET */}
                    <div ref={signatureRef} style={{ fontFamily: STYLES.fontFamily, color: STYLES.colors.textGray, fontSize: '14px', lineHeight: '1.5' }}>
                        {/* HEADER BLOCK */}
                        <table cellPadding="0" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: STYLES.colors.white }}>
                            <tr>
                                <td style={{ backgroundColor: STYLES.colors.darkBlue, height: '100px', verticalAlign: 'bottom', paddingLeft: '30px' }}>
                                    {/* Empty blue bar space, used for overlapping effect visually in web but structurally stacked in table */}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '0 30px 30px 30px' }}>
                                    <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                                        <tr>
                                            {/* LEFT COLUMN: AVATAR */}
                                            <td style={{ width: '140px', verticalAlign: 'top', paddingRight: '25px' }}>
                                                <div style={{ marginTop: '-50px' }}>
                                                    <img 
                                                        src={editForm.avatar || `https://ui-avatars.com/api/?name=${editForm.firstName}+${editForm.lastName}&background=E5E7EB&color=6B7280&size=200`} 
                                                        alt="Profile" 
                                                        width="120" 
                                                        height="120" 
                                                        style={{ borderRadius: '50%', border: '4px solid #ffffff', display: 'block' }}
                                                    />
                                                </div>
                                                {/* Logo Below Avatar */}
                                                <div style={{ marginTop: '30px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <img 
                                                            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iNSIgeT0iMTUiIHdpZHRoPSI5MCIgaGVpZ2h0PSI2MCIgcng9IjEyIiBmaWxsPSIjRjU5RTBCIiAvPjxyZWN0IHg9IjEwIiB5PSIzNSIgd2lkdGg9IjgwIiBoZWlnaHQ9IjU1IiByeD0iMTIiIGZpbGw9IiNGQ0QzNEQiIC8+PHJlY3QgeD0iNDIiIHk9IjUyIiB3aWR0aD0iMTYiIGhlaWdodD0iMjIiIHJ4PSI0IiBmaWxsPSIjQjQ1MzA5IiBmaWxsLW9wYWNpdHk9IjAuMjUiIC8+PC9zdmc+" 
                                                            alt="NHFG Logo" 
                                                            width="32" 
                                                            height="32" 
                                                            style={{ display: 'block' }}
                                                        />
                                                        <span style={{ fontSize: '14px', fontWeight: '900', color: STYLES.colors.darkBlue, lineHeight: '1' }}>New Holland</span>
                                                    </div>
                                                    <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#9CA3AF', letterSpacing: '1px', marginTop: '4px', paddingLeft: '40px' }}>FINANCIAL GROUP</div>
                                                </div>
                                            </td>

                                            {/* RIGHT COLUMN: DETAILS */}
                                            <td style={{ verticalAlign: 'top', paddingTop: '20px' }}>
                                                <div style={{ fontSize: '24px', fontWeight: '900', color: STYLES.colors.darkBlue, marginBottom: '2px' }}>
                                                    {editForm.firstName} {editForm.lastName}
                                                </div>
                                                <div style={{ fontSize: '14px', color: STYLES.colors.blue, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.5px' }}>
                                                    {editForm.title}
                                                </div>

                                                <table cellPadding="0" cellSpacing="0" style={{ fontSize: '13px', color: '#4B5563' }}>
                                                    <tr>
                                                        <td style={{ paddingBottom: '6px', paddingRight: '10px' }}>📧</td>
                                                        <td style={{ paddingBottom: '6px' }}><a href={`mailto:${editForm.email}`} style={{ textDecoration: 'none', color: '#4B5563' }}>{editForm.email}</a></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ paddingBottom: '6px', paddingRight: '10px' }}>📞</td>
                                                        <td style={{ paddingBottom: '6px' }}><a href={`tel:${editForm.phone}`} style={{ textDecoration: 'none', color: '#4B5563' }}>{editForm.phone}</a></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ paddingBottom: '6px', paddingRight: '10px' }}>🌐</td>
                                                        <td style={{ paddingBottom: '6px' }}><a href={`https://${editForm.website}`} style={{ textDecoration: 'none', color: '#4B5563' }}>{editForm.website}</a></td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ paddingBottom: '6px', paddingRight: '10px' }}>📍</td>
                                                        <td style={{ paddingBottom: '6px' }}>{editForm.address}</td>
                                                    </tr>
                                                </table>

                                                {/* Buttons */}
                                                <div style={{ marginTop: '25px' }}>
                                                    {editForm.calendarUrl && (
                                                        <a href={editForm.calendarUrl} style={{ display: 'inline-block', backgroundColor: STYLES.colors.blue, color: '#ffffff', fontWeight: 'bold', textDecoration: 'none', padding: '10px 24px', borderRadius: '50px', fontSize: '12px', marginRight: '10px' }}>
                                                            📅 Schedule
                                                        </a>
                                                    )}
                                                    <a href={`https://${editForm.website}/services`} style={{ display: 'inline-block', backgroundColor: '#ffffff', color: STYLES.colors.blue, border: `1px solid ${STYLES.colors.blue}`, fontWeight: 'bold', textDecoration: 'none', padding: '10px 24px', borderRadius: '50px', fontSize: '12px' }}>
                                                        🌐 Services
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>

                                    {/* DISCLAIMER FOOTER */}
                                    <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '30px', paddingTop: '15px' }}>
                                        <p style={{ fontSize: '10px', color: '#9CA3AF', lineHeight: '1.4', margin: '0 0 10px 0' }}>
                                            {editForm.legalText}
                                        </p>
                                        <p style={{ fontSize: '9px', color: '#D1D5DB', lineHeight: '1.4', margin: '0' }}>
                                            {editForm.confidentialNotice}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-12 w-full max-w-[620px]">
                    <button onClick={handleCopy} className="flex-1 py-4 bg-white text-slate-700 font-black rounded-2xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                        {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                        {copied ? 'Copied to Clipboard' : 'Copy HTML'}
                    </button>
                    <button onClick={handleDownload} className="flex-1 py-4 bg-[#0B2240] text-white font-black rounded-2xl shadow-xl hover:bg-blue-900 transition-all flex items-center justify-center gap-3">
                        <Download className="h-5 w-5" /> Download
                    </button>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};
