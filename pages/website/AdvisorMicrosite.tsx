
import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { ProductType } from '../../types';
import { Mail, Phone, CheckCircle2, ArrowLeft, Star, Send, Share2, X, ShieldCheck, MapPin, Check, User, Copy, Link as LinkIcon, Languages, BadgeCheck, ArrowRight, Smartphone, MessageSquare, PhoneIncoming, FileText } from 'lucide-react';

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "h-5 w-5"}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "h-5 w-5"}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "h-5 w-5"}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "h-5 w-5"}>
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={`fill-current ${className || 'h-5 w-5'}`}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zl-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={`fill-current ${className || 'h-5 w-5'}`}>
       <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.84-2.9 6.24-1.72 1.35-4.03 2.08-6.3 1.83-2.15-.2-4.13-1.28-5.52-3.03-1.23-1.6-1.87-3.62-1.74-5.63.13-2.02.97-3.95 2.38-5.46.22-.23.46-.44.71-.64.08-.05.15-.09.22-.13V6.99c-.19.12-.37.26-.55.4a9.12 9.12 0 0 0-3.32 5.51c-.68 2.37-.2 4.96 1.35 6.94 1.53 1.95 4.02 3.12 6.57 3.07 2.63-.05 5.09-1.34 6.58-3.46 1.32-1.92 1.9-4.32 1.56-6.66V4.73c.01.01.02.01.03.01h.01v-4.72Z"></path>
  </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "h-5 w-5"}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const AdvisorMicrosite: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { allUsers, testimonials, addLead, addTestimonial, addCallback, companySettings } = useData();
  const [formSubmitted, setFormSubmitted] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copyText, setCopyText] = useState('Copy Link');

  // Normalize slug matching
  const advisor = allUsers.find(u => u.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = async () => {
    if (!advisor) return;

    const shareData = {
        title: `${advisor.name} - ${advisor.title || 'Advisor'}`,
        text: `Check out the profile for ${advisor.name}, a ${advisor.title || 'Advisor'} at New Holland Financial Group!`,
        url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
            await navigator.share(shareData);
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                setIsShareModalOpen(true);
            }
        }
    } else {
        setIsShareModalOpen(true);
    }
  };

  const handleCopyLink = () => {
      navigator.clipboard.writeText(window.location.href);
      setCopyText('Copied!');
      setTimeout(() => setCopyText('Copy Link'), 2000);
  };

  const scrollToSection = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!advisor || !advisor.micrositeEnabled) {
    return <Navigate to="/advisors" replace />;
  }

  // Determine Call Routing: Advisor Phone -> Fallback to Company Phone
  const callPhoneNumber = advisor.phone || companySettings.phone;
  const cleanPhone = callPhoneNumber.replace(/\D/g, '');

  const advisorTestimonials = testimonials.filter(t => t.advisorId === advisor.id && t.status === 'approved');
  
  // Form States
  const [quoteForm, setQuoteForm] = useState({ name: '', phone: '', email: '', interest: advisor.productsSold?.[0] || ProductType.LIFE, message: '' });
  const [callbackForm, setCallbackForm] = useState({ name: '', phone: '', email: '', time: 'Anytime' });
  const [testimonialForm, setTestimonialForm] = useState({ name: '', rating: 0, text: '' });

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Rule 2: Quote assigned to specific advisor with source tag
    addLead({
        name: quoteForm.name,
        email: quoteForm.email,
        phone: quoteForm.phone,
        interest: quoteForm.interest,
        message: `Quote Request from microsite. Message: ${quoteForm.message}`,
        source: `advisor:${advisor.id}`
    }, advisor.id);
    
    setFormSubmitted('quote');
    setQuoteForm({ name: '', phone: '', email: '', interest: advisor.productsSold?.[0] || ProductType.LIFE, message: '' });
    setTimeout(() => setFormSubmitted(null), 5000);
  };
  
  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCallback({ name: callbackForm.name, phone: callbackForm.phone, timeRequested: callbackForm.time });
    
    // Rule 2: Callback leads assigned to specific advisor with source tag
    addLead({ 
        name: callbackForm.name, 
        phone: callbackForm.phone, 
        email: callbackForm.email, 
        interest: ProductType.LIFE, 
        message: `Callback requested for ${callbackForm.time}`,
        source: `advisor:${advisor.id}`
    }, advisor.id);

    setFormSubmitted('callback');
    setCallbackForm({ name: '', phone: '', email: '', time: 'Anytime' });
    setTimeout(() => setFormSubmitted(null), 5000);
  };
  
  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTestimonial({
        advisorId: advisor.id,
        clientName: testimonialForm.name,
        rating: testimonialForm.rating,
        reviewText: testimonialForm.text
    });
    setFormSubmitted('testimonial');
    setTestimonialForm({ name: '', rating: 0, text: '' });
    setTimeout(() => setFormSubmitted(null), 5000);
  };

  const getSocialIcon = (platform: string) => {
    const size = "h-5 w-5";
    switch (platform) {
      case 'LinkedIn': return <LinkedInIcon className={size} />;
      case 'Facebook': return <FacebookIcon className={size} />;
      case 'Twitter': return <TwitterIcon className={size} />;
      case 'Instagram': return <InstagramIcon className={size} />;
      case 'X': return <XIcon className={size} />;
      case 'TikTok': return <TikTokIcon className={size} />;
      case 'YouTube': return <YouTubeIcon className={size} />;
      default: return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Back Button */}
      <div className="fixed top-24 left-4 z-40 md:left-8">
          <Link to="/advisors" className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:scale-110 transition-all flex items-center justify-center">
              <ArrowLeft className="h-5 w-5" />
          </Link>
      </div>

      {/* Hero Section */}
      <div className="relative bg-[#0B2240] text-white overflow-hidden pb-20 pt-32 lg:pt-40 rounded-b-[3rem] shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-30"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                  <div className="relative group">
                      <div className="w-48 h-48 md:w-64 md:h-64 rounded-full p-2 bg-gradient-to-br from-blue-400 to-transparent">
                          <img 
                            src={advisor.avatar || `https://ui-avatars.com/api/?name=${advisor.name}&background=random`} 
                            alt={advisor.name} 
                            className="w-full h-full rounded-full object-cover border-4 border-[#0B2240] shadow-2xl"
                          />
                      </div>
                  </div>
                  
                  <div className="text-center md:text-left flex-1">
                      <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-1.5 rounded-full border border-blue-400/30 mb-4 backdrop-blur-sm">
                          <CheckCircle2 className="h-4 w-4 text-blue-300" />
                          <span className="text-xs font-bold text-blue-100 tracking-wide uppercase">Verified Advisor</span>
                      </div>
                      <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">{advisor.name}</h1>
                      <p className="text-xl text-blue-200 font-medium mb-6">{advisor.title || `${advisor.category} Specialist`}</p>
                      
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                          {((advisor.license_states && advisor.license_states.length > 0) || advisor.license_state) && (
                              <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                  <MapPin className="h-4 w-4 text-red-400" />
                                  {advisor.license_state 
                                    ? `Licensed in ${advisor.license_state}`
                                    : `Licensed in ${advisor.license_states?.length} States`
                                  }
                              </div>
                          )}
                          
                          {advisor.yearsOfExperience && (
                              <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                  <ShieldCheck className="h-4 w-4 text-yellow-400" />
                                  {advisor.yearsOfExperience} Years Experience
                              </div>
                          )}
                          {advisor.languages && advisor.languages.length > 0 && (
                              <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                  <Languages className="h-4 w-4 text-purple-400" />
                                  Speaks {advisor.languages.join(', ')}
                              </div>
                          )}
                      </div>

                      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                          <button 
                            onClick={() => scrollToSection('quote-form')} 
                            className="px-8 py-3 bg-[#FBBF24] text-slate-900 rounded-full font-bold shadow-lg shadow-yellow-500/20 hover:bg-yellow-300 transition-all flex items-center gap-2 transform hover:scale-105"
                          >
                              <FileText className="h-4 w-4" /> Get a Free Quote
                          </button>
                          
                          {/* Speak to Agent - Direct Dial */}
                          <a 
                            href={`tel:${cleanPhone}`}
                            className="px-8 py-3 bg-white text-[#0B2240] rounded-full font-bold shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2"
                          >
                              <Phone className="h-4 w-4" /> Speak to Agent
                          </a>

                          <button 
                            onClick={() => scrollToSection('callback-form')} 
                            className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold shadow-lg hover:bg-white/20 transition-all flex items-center gap-2"
                          >
                              <PhoneIncoming className="h-4 w-4" /> Request Call Back
                          </button>

                          <button onClick={handleShare} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white border border-white/10" title="Share Profile">
                              <Share2 className="h-5 w-5" />
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Info & Bio */}
              <div className="lg:col-span-2 space-y-8">
                  {/* About Card */}
                  <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
                      <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <User className="h-6 w-6 text-blue-600" /> About Me
                      </h2>
                      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                          {advisor.bio || "I am dedicated to helping my clients achieve their financial goals through comprehensive planning and tailored insurance solutions."}
                      </div>
                      
                      {/* Social Links */}
                      {advisor.socialLinks && advisor.socialLinks.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-slate-100">
                              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Connect with me</h3>
                              <div className="flex gap-3">
                                  {advisor.socialLinks.map((link, idx) => (
                                      <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                                          {getSocialIcon(link.platform)}
                                      </a>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Expertise */}
                  <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                          <BadgeCheck className="h-6 w-6 text-green-600" /> Areas of Expertise
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {advisor.productsSold?.map(product => (
                              <div key={product} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                  <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                                      <Check className="h-4 w-4" />
                                  </div>
                                  <span className="font-bold text-slate-700">{product}</span>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Testimonials */}
                  <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
                      <div className="flex justify-between items-center mb-8">
                          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" /> Client Reviews
                          </h2>
                          <div className="text-sm font-bold text-slate-500">
                              {advisorTestimonials.length} Reviews
                          </div>
                      </div>

                      <div className="space-y-6 mb-10">
                          {advisorTestimonials.length > 0 ? advisorTestimonials.map(t => (
                              <div key={t.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                  <div className="flex justify-between items-start mb-2">
                                      <div className="font-bold text-slate-900">{t.clientName}</div>
                                      <div className="flex">
                                          {[...Array(5)].map((_, i) => (
                                              <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                                          ))}
                                      </div>
                                  </div>
                                  <p className="text-slate-600 italic">"{t.reviewText}"</p>
                                  <p className="text-xs text-slate-400 mt-2">{new Date(t.date).toLocaleDateString()}</p>
                              </div>
                          )) : (
                              <div className="text-center py-8 text-slate-400 italic">No reviews yet. Be the first!</div>
                          )}
                      </div>

                      {/* Add Review Form */}
                      <div className="bg-[#0B2240]/5 p-6 rounded-2xl border border-blue-100">
                          <h3 className="font-bold text-[#0B2240] mb-4">Leave a Review</h3>
                          {formSubmitted === 'testimonial' ? (
                              <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 p-4 rounded-xl">
                                  <CheckCircle2 className="h-5 w-5" /> Thank you for your feedback!
                              </div>
                          ) : (
                              <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <input 
                                          className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                          placeholder="Your Name"
                                          required
                                          value={testimonialForm.name}
                                          onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})}
                                      />
                                      <div className="flex items-center gap-1 bg-white p-2.5 rounded-xl border border-slate-200 justify-center">
                                          <span className="text-xs font-bold text-slate-400 mr-2">Rating:</span>
                                          {[1,2,3,4,5].map(r => (
                                              <button key={r} type="button" onClick={() => setTestimonialForm({...testimonialForm, rating: r})}>
                                                  <Star className={`h-5 w-5 hover:scale-110 transition-transform ${testimonialForm.rating >= r ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                                              </button>
                                          ))}
                                      </div>
                                  </div>
                                  <textarea 
                                      className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                      rows={3}
                                      placeholder="Share your experience working with me..."
                                      required
                                      value={testimonialForm.text}
                                      onChange={e => setTestimonialForm({...testimonialForm, text: e.target.value})}
                                  ></textarea>
                                  <button type="submit" className="w-full py-3 bg-[#0B2240] text-white rounded-xl font-bold text-sm hover:bg-blue-900 transition-colors shadow-lg">Submit Review</button>
                              </form>
                          )}
                      </div>
                  </div>
              </div>

              {/* Right Column: Contact Forms */}
              <div className="space-y-8" id="contact-section">
                  
                  {/* Quick Quote Form */}
                  <div id="quote-form" className="bg-white rounded-[2rem] p-8 shadow-xl border-t-8 border-blue-600 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><Send className="h-24 w-24 text-blue-600" /></div>
                      <h2 className="text-xl font-bold text-slate-900 mb-2 relative z-10">Get a Free Quote</h2>
                      <p className="text-sm text-slate-500 mb-6 relative z-10">Fill out the form below and I'll get back to you with a personalized plan.</p>
                      
                      {formSubmitted === 'quote' ? (
                          <div className="bg-green-50 p-6 rounded-2xl text-center">
                              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <CheckCircle2 className="h-6 w-6" />
                              </div>
                              <h3 className="font-bold text-slate-900">Request Sent!</h3>
                              <p className="text-xs text-slate-500 mt-1">I will be in touch shortly.</p>
                          </div>
                      ) : (
                          <form onSubmit={handleQuoteSubmit} className="space-y-4 relative z-10">
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Name</label>
                                  <input 
                                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                      placeholder="Full Name"
                                      required
                                      value={quoteForm.name}
                                      onChange={e => setQuoteForm({...quoteForm, name: e.target.value})}
                                  />
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                                  <input 
                                      type="email"
                                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                      placeholder="email@example.com"
                                      required
                                      value={quoteForm.email}
                                      onChange={e => setQuoteForm({...quoteForm, email: e.target.value})}
                                  />
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Interest</label>
                                  <select 
                                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                      value={quoteForm.interest}
                                      onChange={e => setQuoteForm({...quoteForm, interest: e.target.value as ProductType})}
                                  >
                                      {advisor.productsSold?.map(p => <option key={p} value={p}>{p}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Message</label>
                                  <textarea 
                                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                      rows={3}
                                      placeholder="How can I help you?"
                                      value={quoteForm.message}
                                      onChange={e => setQuoteForm({...quoteForm, message: e.target.value})}
                                  ></textarea>
                              </div>
                              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group">
                                  Submit Request <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </button>
                          </form>
                      )}
                  </div>

                  {/* Callback Request */}
                  <div id="callback-form" className="bg-[#0B2240] rounded-[2rem] p-8 shadow-xl text-white relative overflow-hidden">
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-overlay filter blur-[50px] opacity-30"></div>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Smartphone className="h-5 w-5" /> Request a Call</h2>
                      
                      {formSubmitted === 'callback' ? (
                          <div className="bg-white/10 p-6 rounded-2xl text-center backdrop-blur-md border border-white/10">
                              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-400" />
                              <p className="font-bold">Callback Scheduled!</p>
                          </div>
                      ) : (
                          <form onSubmit={handleCallbackSubmit} className="space-y-4 relative z-10">
                              <input 
                                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-blue-200 focus:bg-white/20 outline-none transition-all"
                                  placeholder="Your Name"
                                  required
                                  value={callbackForm.name}
                                  onChange={e => setCallbackForm({...callbackForm, name: e.target.value})}
                              />
                              <input 
                                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-blue-200 focus:bg-white/20 outline-none transition-all"
                                  placeholder="Phone Number"
                                  required
                                  value={callbackForm.phone}
                                  onChange={e => setCallbackForm({...callbackForm, phone: e.target.value})}
                              />
                              <select 
                                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-blue-200 focus:bg-white/20 outline-none transition-all [&>option]:text-slate-900"
                                  value={callbackForm.time}
                                  onChange={e => setCallbackForm({...callbackForm, time: e.target.value})}
                              >
                                  <option value="Anytime">Anytime</option>
                                  <option value="Morning">Morning (8am - 12pm)</option>
                                  <option value="Afternoon">Afternoon (12pm - 5pm)</option>
                                  <option value="Evening">Evening (5pm - 8pm)</option>
                              </select>
                              <button type="submit" className="w-full py-3 bg-white text-[#0B2240] rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
                                  Call Me Back
                              </button>
                          </form>
                      )}
                  </div>
              </div>
          </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative">
                  <button onClick={() => setIsShareModalOpen(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X className="h-4 w-4"/></button>
                  <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Share Profile</h3>
                  
                  <div className="grid grid-cols-4 gap-4 mb-6">
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" className="flex flex-col items-center gap-2 group">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"><FacebookIcon className="h-6 w-6" /></div>
                          <span className="text-xs font-bold text-slate-500">Facebook</span>
                      </a>
                      <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out ${advisor.name}`} target="_blank" className="flex flex-col items-center gap-2 group">
                          <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"><TwitterIcon className="h-6 w-6" /></div>
                          <span className="text-xs font-bold text-slate-500">Twitter</span>
                      </a>
                      <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`} target="_blank" className="flex flex-col items-center gap-2 group">
                          <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"><LinkedInIcon className="h-6 w-6" /></div>
                          <span className="text-xs font-bold text-slate-500">LinkedIn</span>
                      </a>
                      <a href={`mailto:?subject=Check out ${advisor.name}&body=${window.location.href}`} className="flex flex-col items-center gap-2 group">
                          <div className="w-12 h-12 bg-slate-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"><Mail className="h-6 w-6" /></div>
                          <span className="text-xs font-bold text-slate-500">Email</span>
                      </a>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <LinkIcon className="h-4 w-4 text-slate-400" />
                      <input className="flex-1 bg-transparent text-xs text-slate-600 outline-none" value={window.location.href} readOnly />
                      <button onClick={handleCopyLink} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          {copyText === 'Copied!' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copyText}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
