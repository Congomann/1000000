
import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { UserRole, SocialLink as SocialLinkType } from '../../types';
import { Copy, Check, Download, Plus, Trash2, RotateCcw, X, Mail, Phone, Globe, MapPin, Facebook, Linkedin, Twitter, Instagram, Maximize2, Move } from 'lucide-react';

type Tab = 'Personal' | 'Contact' | 'Social' | 'Legal';

interface CropperProps {
    imageUrl: string;
    onSave: (croppedImageUrl: string) => void;
    onCancel: () => void;
}

const ImageCropper: React.FC<CropperProps> = ({ imageUrl, onSave, onCancel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        img.onload = () => {
            imageRef.current = img;
            draw();
        };
    }, [imageUrl]);

    const draw = () => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const size = Math.min(canvas.width, canvas.height);
        const drawWidth = img.width * zoom;
        const drawHeight = img.height * zoom;
        
        // Center the image + offset
        const x = (canvas.width - drawWidth) / 2 + offset.x;
        const y = (canvas.height - drawHeight) / 2 + offset.y;

        ctx.save();
        // Circular clipping mask
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, size / 2 - 10, 0, Math.PI * 2);
        ctx.clip();
        
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        ctx.restore();

        // Draw guide circle
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, size / 2 - 10, 0, Math.PI * 2);
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    useEffect(() => {
        draw();
    }, [zoom, offset]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleSave = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        const img = imageRef.current;
        if (!ctx || !img) return;

        const zoomFactor = 400 / 300; // Modal canvas size is 300
        const drawWidth = img.width * zoom * zoomFactor;
        const drawHeight = img.height * zoom * zoomFactor;
        const x = (400 - drawWidth) / 2 + offset.x * zoomFactor;
        const y = (400 - drawHeight) / 2 + offset.y * zoomFactor;

        ctx.beginPath();
        ctx.arc(200, 200, 200, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        
        onSave(canvas.toDataURL('image/png'));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#0B2240]">Crop & Fit Photo</h3>
                    <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X /></button>
                </div>
                
                <div className="flex flex-col items-center gap-6">
                    <div 
                        className="cursor-move bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-inner"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        <canvas ref={canvasRef} width={300} height={300} className="block" />
                    </div>
                    
                    <div className="w-full space-y-2">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Zoom</span>
                            <span>{Math.round(zoom * 100)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="3" 
                            step="0.01" 
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            value={zoom} 
                            onChange={(e) => setZoom(parseFloat(e.target.value))} 
                        />
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                        <Move size={12} /> Drag to position image within the frame
                    </div>

                    <div className="flex gap-4 w-full pt-4">
                        <button onClick={onCancel} className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                        <button onClick={handleSave} className="flex-1 py-4 bg-[#0B2240] text-white font-bold rounded-2xl hover:bg-blue-900 transition-all shadow-lg">Apply Crop</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const EmailSignature: React.FC = () => {
  const { allUsers, companySettings, updateUser, user } = useData();
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('Personal');
  const [copied, setCopied] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState<string>('');
  
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
              setTempImage(reader.result as string);
              setIsCropping(true);
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
      const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;">${signatureRef.current.outerHTML}</body></html>`;
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

  // Signature White Icons on Blue Circles
  const PHONE_ICON = "https://cdn-icons-png.flaticon.com/32/3059/3059502.png"; 
  const WEB_ICON = "https://cdn-icons-png.flaticon.com/32/2885/2885417.png";   
  const PIN_ICON = "https://cdn-icons-png.flaticon.com/32/3082/3082383.png";   

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      {isCropping && (
          <ImageCropper 
            imageUrl={tempImage} 
            onSave={(cropped) => {
                setEditForm(prev => ({ ...prev, avatar: cropped }));
                setIsCropping(false);
            }} 
            onCancel={() => setIsCropping(false)} 
          />
      )}

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
                            className={`px-6 py-3 text-xs font-black uppercase tracking-widest rounded-full whitespace-nowrap transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
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
                                <div className="flex justify-between items-center mb-3 ml-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Photo</label>
                                    <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">Crop on upload</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-md relative">
                                        {editForm.avatar ? (
                                            <img src={editForm.avatar} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400"><X size={20}/></div>
                                        )}
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-[10px] font-black bg-blue-50 text-blue-600 px-4 py-2 rounded-lg uppercase tracking-widest hover:bg-blue-100 transition-colors">
                                        <Maximize2 size={12}/> Update & Crop
                                    </button>
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
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">City/State/Zip</label>
                                <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium" value={editForm.addressLine2} onChange={e => handleInputChange('addressLine2', e.target.value)} />
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
                
                <div className="w-full max-w-[850px] bg-[#F1F5F9] p-10 rounded-[3.5rem] shadow-inner flex items-center justify-center overflow-hidden">
                    {/* THE SIGNATURE CARD - DESIGNED TO MATCH SCREENSHOT */}
                    <div className="bg-white rounded-3xl shadow-2xl border border-white/50 w-full p-10" style={{ minWidth: '780px' }}>
                        <div ref={signatureRef} style={{ width: '100%', backgroundColor: '#ffffff', textAlign: 'left', fontFamily: 'Inter, Arial, sans-serif' }}>
                            <table cellPadding="0" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tr>
                                    <td style={{ padding: '0 0 25px 0' }}>
                                        <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                                            <tr>
                                                {/* 1. LEFT: AVATAR WITH CIRCULAR ACCENT */}
                                                <td style={{ width: '180px', verticalAlign: 'middle', textAlign: 'center' }}>
                                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                                        {/* Decorative arc as seen in Remmy screenshot */}
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
                                                            opacity: 0.15
                                                        }}></div>
                                                        <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: `4px solid ${STYLES.colors.navy}`, overflow: 'hidden', padding: '0', backgroundColor: '#F8FAFC' }}>
                                                            <img 
                                                                src={editForm.avatar || `https://ui-avatars.com/api/?name=${editForm.firstName}+${editForm.lastName}&background=E5E7EB&color=6B7280&size=200`} 
                                                                alt="Advisor" 
                                                                width="150" 
                                                                height="150" 
                                                                style={{ borderRadius: '50%', display: 'block', objectFit: 'cover', width: '100%', height: '100%' }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* 2. VERTICAL SEPARATOR 1 */}
                                                <td style={{ width: '1px', padding: '0' }}>
                                                    <div style={{ width: '1px', height: '140px', backgroundColor: STYLES.colors.navy, opacity: 0.1 }}></div>
                                                </td>

                                                {/* 3. CENTER: NAME, TITLE & CONTACT */}
                                                <td style={{ padding: '0 40px', verticalAlign: 'middle' }}>
                                                    <div style={{ fontSize: '30px', fontStyle: 'normal', fontWeight: '900', color: STYLES.colors.navy, lineHeight: '1.1', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
                                                        {editForm.firstName} {editForm.lastName}
                                                    </div>
                                                    <div style={{ fontSize: '15px', fontStyle: 'normal', fontWeight: '600', color: STYLES.colors.grey, margin: '0 0 14px 0' }}>
                                                        {editForm.title}
                                                    </div>
                                                    {/* Divider Line */}
                                                    <div style={{ height: '2px', width: '40px', backgroundColor: STYLES.colors.navy, margin: '0 0 25px 0' }}></div>
                                                    
                                                    {/* CONTACT TABLE */}
                                                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                                                        {/* Phone Row */}
                                                        <tr>
                                                            <td style={{ padding: '0 15px 14px 0', verticalAlign: 'top' }}>
                                                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: STYLES.colors.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <img src={PHONE_ICON} width="14" height="14" style={{ display: 'block', margin: '8px auto' }} alt="phone" />
                                                                </div>
                                                            </td>
                                                            <td style={{ padding: '0 0 14px 0', verticalAlign: 'middle', fontSize: '14px', fontWeight: '700', color: STYLES.colors.navy, lineHeight: '1.4' }}>
                                                                {editForm.phone}<br/>
                                                                <span style={{ opacity: 0.5, fontWeight: '500', fontSize: '12px' }}>{editForm.phone2}</span>
                                                            </td>
                                                        </tr>
                                                        {/* Email/Web Row */}
                                                        <tr>
                                                            <td style={{ padding: '0 15px 14px 0', verticalAlign: 'top' }}>
                                                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: STYLES.colors.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <img src={WEB_ICON} width="14" height="14" style={{ display: 'block', margin: '8px auto' }} alt="web" />
                                                                </div>
                                                            </td>
                                                            <td style={{ padding: '0 0 14px 0', verticalAlign: 'middle', fontSize: '14px', fontWeight: '700', color: STYLES.colors.navy, lineHeight: '1.4' }}>
                                                                <a href={`mailto:${editForm.email}`} style={{ textDecoration: 'none', color: STYLES.colors.navy }}>{editForm.email}</a><br/>
                                                                <a href={`https://${editForm.website}`} style={{ textDecoration: 'none', color: STYLES.colors.navy, opacity: 0.5, fontWeight: '500', fontSize: '12px' }}>{editForm.website}</a>
                                                            </td>
                                                        </tr>
                                                        {/* Address Row */}
                                                        <tr>
                                                            <td style={{ padding: '0 15px 0 0', verticalAlign: 'top' }}>
                                                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: STYLES.colors.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <img src={PIN_ICON} width="14" height="14" style={{ display: 'block', margin: '8px auto' }} alt="map" />
                                                                </div>
                                                            </td>
                                                            <td style={{ padding: '0', verticalAlign: 'middle', fontSize: '13px', fontWeight: '600', color: STYLES.colors.navy, lineHeight: '1.4' }}>
                                                                {editForm.addressLine1}<br/>
                                                                <span style={{ opacity: 0.5 }}>{editForm.addressLine2}</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>

                                                {/* 4. VERTICAL SEPARATOR 2 */}
                                                <td style={{ width: '1px', padding: '0' }}>
                                                    <div style={{ width: '1px', height: '140px', backgroundColor: STYLES.colors.navy, opacity: 0.1 }}></div>
                                                </td>

                                                {/* 5. RIGHT: LOGO & SOCIAL */}
                                                <td style={{ paddingLeft: '40px', verticalAlign: 'middle', width: '200px' }}>
                                                    {/* CORPORATE LOGO */}
                                                    <table cellPadding="0" cellSpacing="0" style={{ marginBottom: '25px' }}>
                                                        <tr>
                                                            <td style={{ verticalAlign: 'middle', paddingRight: '12px' }}>
                                                                <div style={{ backgroundColor: STYLES.colors.navy, padding: '8px', borderRadius: '8px' }}>
                                                                    <img src={logoBase64} width="32" height="32" alt="NHFG" style={{ display: 'block' }} />
                                                                </div>
                                                            </td>
                                                            <td style={{ verticalAlign: 'middle' }}>
                                                                <div style={{ fontSize: '16px', fontWeight: '900', color: STYLES.colors.navy, lineHeight: '1.1' }}>New Holland</div>
                                                                <div style={{ fontSize: '8px', fontWeight: '800', color: STYLES.colors.lightGrey, letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '3px' }}>FINANCIAL GROUP</div>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    {/* SOCIAL ICONS */}
                                                    <table cellPadding="0" cellSpacing="0">
                                                        <tr>
                                                            <td style={{ paddingRight: '12px' }}>
                                                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/32/3128/3128304.png" width="24" height="24" style={{ borderRadius: '50%', backgroundColor: STYLES.colors.navy, padding: '6px', opacity: 0.8 }} alt="fb" /></a>
                                                            </td>
                                                            <td style={{ paddingRight: '12px' }}>
                                                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/32/3128/3128310.png" width="24" height="24" style={{ borderRadius: '50%', backgroundColor: STYLES.colors.navy, padding: '6px', opacity: 0.8 }} alt="tw" /></a>
                                                            </td>
                                                            <td style={{ paddingRight: '12px' }}>
                                                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/32/3128/3128311.png" width="24" height="24" style={{ borderRadius: '50%', backgroundColor: STYLES.colors.navy, padding: '6px', opacity: 0.8 }} alt="ln" /></a>
                                                            </td>
                                                            <td>
                                                                <a href="#"><img src="https://cdn-icons-png.flaticon.com/32/3128/3128307.png" width="24" height="24" style={{ borderRadius: '50%', backgroundColor: STYLES.colors.navy, padding: '6px', opacity: 0.8 }} alt="in" /></a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px' }}>
                                        <p style={{ fontSize: '10px', color: STYLES.colors.lightGrey, lineHeight: '1.6', margin: '0', fontStyle: 'normal', opacity: 0.8 }}>
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
