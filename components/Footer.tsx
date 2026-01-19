
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const Footer: React.FC = () => {
  const { companySettings } = useData();
  const [showEmail, setShowEmail] = useState(false);

  const SocialLink = ({ href, icon: Icon }: { href: string, icon: any }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-10 h-10 rounded-full bg-blue-600 border border-blue-500 flex items-center justify-center text-white transition-all transform hover:scale-110 hover:bg-blue-500 shadow-md"
      >
          <Icon />
      </a>
  );

  return (
    <footer className="bg-[#0B2240] text-white pt-24 pb-12 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column (Span 4) */}
          <div className="lg:col-span-4">
            <a href="/" className="flex items-center gap-3 group mb-8">
              <div className="relative w-12 h-12 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                  <path d="M50 0L100 40V100H0V40L50 0Z" fill="#FBBF24"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-3xl leading-none text-white tracking-tighter">New Holland</span>
                <span className="text-[0.65rem] font-bold text-slate-400 tracking-[0.3em] uppercase mt-1">Financial Group</span>
              </div>
            </a>
            <p className="text-blue-100/70 leading-relaxed mb-10 max-w-sm text-sm font-medium">
              Providing tailored insurance solutions that secure financial peace of mind for individuals, families, and businesses.
            </p>
            <div className="flex space-x-3">
              <SocialLink href="#" icon={LinkedInIcon} />
              <SocialLink href="#" icon={FacebookIcon} />
              <SocialLink href="#" icon={InstagramIcon} />
              <SocialLink href="#" icon={TwitterIcon} />
              <SocialLink href="https://www.tiktok.com/@newhollandfinancial" icon={TikTokIcon} />
            </div>
          </div>

          {/* Navigation (Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-blue-500 rounded-full"></span> Navigation
            </h3>
            <ul className="space-y-4 text-slate-300 text-sm font-medium">
              <li><Link to="/" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">About Us</Link></li>
              <li><Link to="/products" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">Shop Insurance</Link></li>
              <li><Link to="/advisors" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">Find an Advisor</Link></li>
              <li><Link to="/resources" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">Resources</Link></li>
            </ul>
          </div>

          {/* Company (Span 2) */}
          <div className="lg:col-span-2">
             <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-8 flex items-center gap-3">
               <span className="w-8 h-0.5 bg-blue-500 rounded-full"></span> Company
             </h3>
             <ul className="space-y-4 text-slate-300 text-sm font-medium">
                <li><Link to="/about" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">About Us</Link></li>
                <li><Link to="/join" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">Join Our Team</Link></li>
                <li><Link to="/login" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">Agent Portal</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">Terms of Use</Link></li>
             </ul>
          </div>

          {/* Contact Us (Span 4) */}
          <div className="lg:col-span-4">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-blue-500 rounded-full"></span> Contact Us
            </h3>
            <ul className="space-y-6">
                <li className="flex items-start gap-4 group">
                   <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
                      <Phone size={20} />
                   </div>
                   <div>
                      <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Call Us</span>
                      <a href={`tel:${companySettings.phone}`} className="text-white font-bold text-lg hover:text-blue-400 transition-colors">
                        {companySettings.phone}
                      </a>
                   </div>
                </li>
                
                <li className="flex items-start gap-4 group">
                   <button 
                        onClick={() => setShowEmail(!showEmail)}
                        className={`p-3 rounded-xl transition-all duration-300 shrink-0 border ${
                            showEmail 
                            ? 'bg-blue-600 text-white border-blue-500' 
                            : 'bg-white/5 border-white/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
                        }`}
                        aria-label="Toggle Email Visibility"
                   >
                      <Mail size={20} />
                   </button>
                   
                   {showEmail ? (
                       <div className="flex-1 min-w-0 animate-fade-in">
                          <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Email Us</span>
                          <a href={`mailto:${companySettings.email}`} className="text-white font-bold text-lg hover:text-blue-400 transition-colors break-words">
                            {companySettings.email}
                          </a>
                       </div>
                   ) : (
                       <button 
                            onClick={() => setShowEmail(true)} 
                            className="flex flex-col justify-center h-full pt-2 text-left"
                        >
                           <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Email Us</span>
                           <span className="text-slate-500 text-sm font-medium hover:text-blue-400 transition-colors">Click icon to reveal</span>
                       </button>
                   )}
                </li>

                <li className="flex items-start gap-4 group">
                   <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
                      <MapPin size={20} />
                   </div>
                   <div>
                      <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Visit Us</span>
                      <span className="text-white font-medium block leading-snug">
                        {companySettings.address}<br/>
                        {companySettings.city}, {companySettings.state} {companySettings.zip}
                      </span>
                   </div>
                </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 text-center">
          <p className="text-slate-400 text-sm mb-4 font-medium">
            &copy; 2025 New Holland Financial Group | www.newhollandfinancial.com
          </p>
          <p className="text-slate-500 text-xs max-w-4xl mx-auto leading-relaxed">
            This website is for informational purposes only and does not constitute a complete description of our investment services or performance. This website is in no way a solicitation or offer to sell securities or investment advisory services except, where applicable, in states where we are registered or where an exemption or exclusion from such registration exists.
          </p>
        </div>
      </div>
    </footer>
  );
};
