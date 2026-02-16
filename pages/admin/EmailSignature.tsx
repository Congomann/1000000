import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { UserRole, SocialLink as SocialLinkType } from '../../types';
import { Copy, Check, Download, Plus, Trash2, RotateCcw, X, Mail, Phone, Globe, MapPin, Facebook, Linkedin, Twitter, Instagram, Maximize2, Move, Ghost, ChevronDown, Database, Link as LinkIcon, ExternalLink, Image as ImageIcon, CheckCircle2, FileImage, Loader2, ShieldCheck } from 'lucide-react';
import { toPng } from 'html-to-image';

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
    // FIX: Added missing 'const' declaration for imageRef
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        img.onload = () => {
            // FIX: Using the declared imageRef
            imageRef.current = img;
            draw();
        };
    }, [imageUrl]);

    const draw = () => {
        const canvas = canvasRef.current;
        // FIX: Using the declared imageRef
        const img = imageRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const size = Math.min(canvas.width, canvas.height);
        const drawWidth = img.width * zoom;
        const drawHeight = img.height * zoom;
        
        const x = (canvas.width - drawWidth) / 2 + offset.x;
        const y = (canvas.height - drawHeight) / 2 + offset.y;

        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, size / 2 - 10, 0, Math.PI * 2);
        ctx.clip();
        
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        ctx.restore();

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
        // FIX: Using the declared imageRef
        const img = imageRef.current;
        if (!ctx || !img) return;

        const zoomFactor = 400 / 300; 
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
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);

  const signatureRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastLoadedId = useRef<string | null>(null);

  const DEFAULT_LEGAL = "CONFIDENTIALITY & COMPLIANCE NOTICE: This communication, including any attachments, may contain confidential and proprietary information related to financial or insurance products and services. It is intended solely for the use of the designated recipient(s). Unauthorized review, use, disclosure, or distribution is prohibited. If you received this message in error, please notify the sender immediately and permanently delete it.";

  const [editForm, setEditForm] = useState({
      firstName: '',
      lastName: '',
      title: '',
      tagline: 'Leading the way in personalized financial solutions.',
      email: '',
      phone: '',
      phone2: '',
      website: 'www.newhollandfinancial.com',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zip: '',
      avatar: '',
      socialLinks: [] as SocialLinkType[],
      confidentialityNotice: DEFAULT_LEGAL
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
              tagline: adv.bio?.substring(0, 80) || 'Leading the way in personalized financial solutions.',
              email: adv.email,
              phone: adv.phone || companySettings.phone,
              phone2: '(800) 555-0199',
              addressLine1: companySettings.address,
              addressLine2: `${companySettings.city}, ${companySettings.state} ${companySettings.zip}`,
              city: companySettings.city,
              state: companySettings.state,
              zip: companySettings.zip,
              avatar: adv.avatar || '',
              website: 'www.newhollandfinancial.com',
              socialLinks: adv.socialLinks || [],
              confidentialityNotice: DEFAULT_LEGAL
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
              avatar: editForm.avatar,
              socialLinks: editForm.socialLinks
          });
          alert("User profile updated!");
      }
  };

  const handleCopyHtmlCode = () => {
    if (exportRef.current) {
      // Get the outerHTML to include the styling and container
      const outerHtml = exportRef.current.outerHTML;
      // We wrap it in a basic font container for common email clients
      const fullHtml = `
        <div style="font-family: 'Inter', Arial, sans-serif; -webkit-font-smoothing: antialiased; max-width: 700px; margin: 0 auto;">
          ${outerHtml}
        </div>
      `;
      navigator.clipboard.writeText(fullHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadImage = useCallback(async () => {
    if (exportRef.current === null) return;
    
    setIsDownloadingImage(true);
    try {
        const dataUrl = await toPng(exportRef.current, { 
            cacheBust: true, 
            pixelRatio: 2,
            style: {
                fontFamily: 'Inter, sans-serif'
            }
        });
        const link = document.createElement('a');
        link.download = `${editForm.firstName}_Signature.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Error generating image signature', err);
        alert("Image generation failed. Check your internet and try again.");
    } finally {
        setIsDownloadingImage(false);
    }
  }, [editForm.firstName]);

  const STYLES = {
      fontFamily: "'Inter', sans-serif",
      colors: {
          navy: '#0B2240',
          grey: '#64748B',
          lightGrey: '#94A3B8',
          blue: '#3B82F6',
          white: '#ffffff',
          btnGray: '#B7BDC5',
          logoBar: '#0B2240' // Returned to navy as requested
      }
  };

  // Official full-color logo version (amber/yellow)
  const logoFullColorBase64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iNSIgeT0iMTUiIHdpZHRoPSI5MCIgaGVpZ2h0PSI2MCIgcng9IjEyIiBmaWxsPSIjRjU5RTBCIiAvPjxyZWN0IHg9IjEwIiB5PSIzNSIgd2lkdGg9IjgwIiBoZWlnaHQ9IjU1IiByeD0iMTIiIGZpbGw9IiNGQ0QzNEQiIC8+PHJlY3QgeD0iNDIiIHk9IjUyIiB3aWR0aD0iMTYiIGhlaWdodD0iMjIiIHJ4PSI0IiBmaWxsPSIjQjQ1MzA5IiBmaWxsLW9wYWNpdHk9IjAuMjUiIC8+PC9zdmc+";

  const getSocialIconUrl = (platform: string) => {
    switch (platform) {
        case 'LinkedIn': return "https://cdn-icons-png.flaticon.com/32/3128/3128311.png";
        case 'Facebook': return "https://cdn-icons-png.flaticon.com/32/3128/3128304.png";
        case 'Twitter': case 'X': return "https://cdn-icons-png.flaticon.com/32/3128/3128310.png";
        case 'Instagram': return "https://cdn-icons-png.flaticon.com/32/3128/3128307.png";
        case 'YouTube': return "https://cdn-icons-png.flaticon.com/32/3128/3128315.png";
        default: return "https://cdn-icons-png.flaticon.com/32/3128/3128311.png";
    }
  };

  const ICON_PHONE = "https://cdn-icons-png.flaticon.com/32/3059/3059502.png"; 
  const ICON_WEB = "https://cdn-icons-png.flaticon.com/32/2885/2885417.png";   
  const ICON_MAP = "https://cdn-icons-png.flaticon.com/32/3082/3082383.png";   

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
        <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-[#0B2240] tracking-tight uppercase leading-none">Terminal Console</h1>
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
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[750px]">
                <div className="flex overflow-x-auto border-b border-slate-100 p-2 bg-slate-50/50 no-scrollbar">
                    {['Personal', 'Contact', 'Social', 'Legal'].map((tab: any) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 text-xs font-black uppercase tracking-widest rounded-[1.5rem] whitespace-nowrap transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
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
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Microsite Tagline</label>
                                <textarea className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none h-24 resize-none" value={editForm.tagline} onChange={e => handleInputChange('tagline', e.target.value)} />
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
                                    <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none" value={editForm.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Office Line</label>
                                    <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none" value={editForm.phone2} onChange={e => handleInputChange('phone2', e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Email</label>
                                <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none" value={editForm.email} onChange={e => handleInputChange('email', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Website</label>
                                <input className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none" value={editForm.website} onChange={e => handleInputChange('website', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Location View</label>
                                <input className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 outline-none cursor-not-allowed" value={`${editForm.city}, ${editForm.state}`} readOnly />
                            </div>
                        </>
                    )}
                    {activeTab === 'Social' && (
                        <div className="space-y-4">
                            <button onClick={handleAddSocial} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                                <Plus size={14}/> Add Profile Link
                            </button>
                            <div className="space-y-3">
                                {editForm.socialLinks.map((link, idx) => (
                                    <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                                        <select value={link.platform} onChange={e => handleSocialChange(idx, 'platform', e.target.value as any)} className="bg-white border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-black uppercase text-slate-700">
                                            {['LinkedIn', 'Facebook', 'Twitter', 'Instagram', 'TikTok', 'YouTube', 'Snapchat', 'X'].map(k => <option key={k} value={k}>{k}</option>)}
                                        </select>
                                        <input value={link.url} onChange={e => handleSocialChange(idx, 'url', e.target.value)} className="bg-transparent border-none text-xs flex-1 outline-none font-medium text-slate-600" placeholder="URL..." />
                                        <button onClick={() => handleRemoveSocial(idx)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'Legal' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                                <h3 className="text-xs font-black text-blue-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <ShieldCheck size={14}/> Compliance Standards
                                </h3>
                                <p className="text-[10px] text-blue-600 font-medium leading-relaxed">
                                    All advisor communications must include the mandatory confidentiality notice to comply with regional financial regulations and HIPAA privacy standards.
                                </p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Confidentiality Notice</label>
                                <textarea 
                                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-4 text-xs font-medium text-slate-600 outline-none h-48 resize-none shadow-inner" 
                                    value={editForm.confidentialityNotice} 
                                    onChange={e => handleInputChange('confidentialityNotice', e.target.value)} 
                                />
                            </div>
                            <button 
                                onClick={() => handleInputChange('confidentialityNotice', DEFAULT_LEGAL)}
                                className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-700 transition-colors"
                            >
                                Revert to Group Standard
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-4">
                    <button onClick={handleReset} className="p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-100 shadow-sm" title="Revert Changes"><RotateCcw size={18}/></button>
                    <button onClick={handleSaveChanges} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#0B2240] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-900 transition-colors shadow-lg">
                        COMMIT UPDATES
                    </button>
                </div>
            </div>
        </div>

        {/* PREVIEW CONTAINER - MICHEL SMITH STYLE */}
        <div className="xl:col-span-8 flex flex-col h-full space-y-12">
            {/* MAIN BANNER PREVIEW */}
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-200 flex flex-col items-center justify-center flex-grow overflow-hidden">
                
                <div className="w-full max-w-[850px] bg-[#F1F5F9] p-12 rounded-[4rem] shadow-inner flex flex-col items-center justify-center overflow-hidden">
                    {/* THE SIGNATURE CARD - EXPORT TARGET */}
                    <div ref={exportRef} className="bg-white shadow-2xl relative overflow-hidden" style={{ width: '700px', height: '250px', display: 'flex', flexDirection: 'column' }}>
                        
                        {/* 1. TOP SECTION: WHITE CONTENT */}
                        <div style={{ flex: 1, position: 'relative', display: 'flex', padding: '25px 35px 0 35px' }}>
                            <div style={{ position: 'absolute', top: '-40px', right: '40px', width: '120px', height: '120px', backgroundColor: '#F8FAFC', borderRadius: '50%', opacity: 0.8 }}></div>
                            
                            <div style={{ flex: 1, paddingTop: '10px' }}>
                                <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0B2240', margin: 0, letterSpacing: '-0.5px' }}>
                                    {editForm.firstName} {editForm.lastName}
                                </h1>
                                <p style={{ fontSize: '13px', fontWeight: '700', color: '#3B82F6', margin: '2px 0 0 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {editForm.title}
                                </p>
                                <div style={{ height: '2px', width: '35px', backgroundColor: '#0B2240', margin: '15px 0' }}></div>
                                {/* FIX: Corrected font-weight to fontWeight */}
                                <p style={{ fontSize: '11px', fontWeight: '500', color: '#64748B', maxWidth: '200px', lineHeight: '1.6', margin: 0 }}>
                                    {editForm.tagline}
                                </p>
                            </div>

                            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '15px', zIndex: 10 }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', inset: '-6px', border: '2px solid #3B82F6', borderRadius: '50%' }}></div>
                                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid white', backgroundColor: '#f1f5f9', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                                        <img 
                                            src={editForm.avatar || `https://ui-avatars.com/api/?name=${editForm.firstName}+${editForm.lastName}&background=F1F5F9&color=64748B&size=200`} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0B2240', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ width: '15px', height: '15px', borderRadius: '50%', border: '1.5px solid white' }}></div>
                                    </div>
                                    <div style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)' }}>
                                        <div style={{ height: '3px', width: '10px', backgroundColor: '#0B2240', borderRadius: '2px', marginBottom: '3px' }}></div>
                                        <div style={{ height: '3px', width: '10px', backgroundColor: '#0B2240', borderRadius: '2px' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingTop: '10px' }}>
                                <div style={{ display: 'flex', items: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '10px', fontWeight: '800', color: '#0B2240', margin: 0 }}>{editForm.phone}</p>
                                        <p style={{ fontSize: '10px', fontWeight: '800', color: '#0B2240', margin: 0 }}>{editForm.phone2}</p>
                                    </div>
                                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#0B2240', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={ICON_PHONE} style={{ width: '10px', height: '10px', filter: 'brightness(0) invert(1)' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '10px', fontWeight: '800', color: '#0B2240', margin: 0 }}>{editForm.email}</p>
                                        <p style={{ fontSize: '10px', fontWeight: '800', color: '#0B2240', margin: 0 }}>{editForm.website}</p>
                                    </div>
                                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#0B2240', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={ICON_WEB} style={{ width: '10px', height: '10px', filter: 'brightness(0) invert(1)' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '10px', fontWeight: '800', color: '#0B2240', margin: 0 }}>{editForm.addressLine1}</p>
                                        <p style={{ fontSize: '10px', fontWeight: '800', color: '#0B2240', margin: 0 }}>{editForm.city}, {editForm.state}</p>
                                    </div>
                                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#0B2240', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={ICON_MAP} style={{ width: '10px', height: '10px', filter: 'brightness(0) invert(1)' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. MIDDLE SECTION: LOGO BAR */}
                        <div style={{ height: '55px', backgroundColor: '#0B2240', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 35px', position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={logoFullColorBase64} style={{ width: '24px', height: '24px' }} alt="Logo" />
                                <div style={{ color: 'white' }}>
                                    <p style={{ fontSize: '12px', fontWeight: '900', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>NEW HOLLAND</p>
                                    <p style={{ fontSize: '7px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>FINANCIAL GROUP</p>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', right: '160px', bottom: '15px', display: 'grid', gridTemplateColumns: 'repeat(5, 4px)', gap: '4px', opacity: 0.4 }}>
                                {[...Array(15)].map((_, i) => <div key={i} style={{ width: '2.5px', height: '2.5px', borderRadius: '50%', backgroundColor: 'white' }}></div>)}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {['Facebook', 'LinkedIn', 'Twitter', 'Instagram', 'YouTube'].map(platform => (
                                    <div key={platform} style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={getSocialIconUrl(platform)} style={{ width: '10px', height: '10px', filter: 'brightness(0) invert(0)' }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. BOTTOM SECTION: LEGAL DISCLOSURE */}
                        <div style={{ padding: '12px 35px', borderTop: '1px solid #f1f5f9', flex: 1, display: 'flex', alignItems: 'center' }}>
                            <p style={{ fontSize: '8px', color: '#64748B', lineHeight: '1.4', margin: 0, fontWeight: '500' }}>
                                {editForm.confidentialityNotice}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-12 w-full max-w-[850px] items-center justify-center">
                    <button 
                        onClick={handleDownloadImage} 
                        disabled={isDownloadingImage}
                        className="px-14 py-5 bg-[#B7BDC5] text-white font-black rounded-full shadow-lg transition-all flex items-center justify-center gap-3 uppercase text-[11px] tracking-widest active:scale-95 disabled:opacity-70"
                    >
                        {isDownloadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileImage className="h-4 w-4" />}
                        {isDownloadingImage ? 'Generating...' : 'DOWNLOAD AS IMAGE (PNG)'}
                    </button>
                    <button 
                        onClick={handleCopyHtmlCode}
                        className="px-14 py-5 bg-white text-[#64748B] font-black rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 uppercase text-[11px] tracking-widest"
                    >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'COPIED' : 'COPY HTML CODE'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
