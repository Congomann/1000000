
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Youtube,
  Globe
} from 'lucide-react';
import { useData } from '../context/DataContext';

// Custom TikTok Icon since it might not be in the current lucide-react version
const TikTokIcon = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const Footer: React.FC = () => {
  const { companySettings } = useData();
  const [showEmail, setShowEmail] = useState(false);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'Facebook': return Facebook;
      case 'LinkedIn': return Linkedin;
      case 'Twitter': return Twitter;
      case 'X': return Twitter;
      case 'Instagram': return Instagram;
      case 'YouTube': return Youtube;
      case 'TikTok': return TikTokIcon;
      default: return Globe;
    }
  };

  const socialLinks = companySettings.socialLinks && companySettings.socialLinks.length > 0 
    ? companySettings.socialLinks 
    : [
        { platform: 'Facebook', url: '#' },
        { platform: 'LinkedIn', url: '#' },
        { platform: 'Twitter', url: '#' },
        { platform: 'Instagram', url: '#' },
        { platform: 'YouTube', url: '#' }
      ];

  return (
    <footer className="bg-[#0B2240] text-white pt-24 pb-12 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-8 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 group">
              {/* Logo SVG matching Navbar */}
              <div className="relative w-12 h-12 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                  <rect x="5" y="15" width="90" height="60" rx="12" fill="#F59E0B" />
                  <rect x="10" y="35" width="80" height="55" rx="12" fill="#FCD34D" />
                  <rect x="42" y="52" width="16" height="22" rx="4" fill="#B45309" fillOpacity="0.25" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl leading-none text-white tracking-tight">New Holland</span>
                <span className="text-[0.65rem] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1.5">Financial Group</span>
              </div>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed font-medium max-w-xs">
              {companySettings.footerDescription || 'Providing tailored insurance solutions that secure financial peace of mind for individuals, families, and businesses.'}
            </p>
            <div className="flex gap-3 pt-2">
               {/* Social Icons */}
               {socialLinks.map((link, i) => {
                 const Icon = getSocialIcon(link.platform);
                 return (
                   <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-blue-600 hover:text-white text-slate-400 transition-all duration-300 border border-white/5 hover:border-blue-500/30">
                     <Icon size={18} />
                   </a>
                 );
               })}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase mb-8 flex items-center gap-3">
              Navigation
            </h3>
            <ul className="space-y-4">
              {['Home', 'Shop Insurance', 'Real Estate', 'Find an Advisor'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : item === 'Shop Insurance' ? '/products' : `/${item.toLowerCase().replace(/ /g, '-')}`} 
                    className="text-slate-300 hover:text-white text-sm font-bold transition-colors hover:translate-x-1 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase mb-8 flex items-center gap-3">
              Company
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Join Our Team', path: '/join' },
                { name: 'Agent Portal', path: '/login' },
                { name: 'Resources', path: '/resources' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-slate-300 hover:text-white text-sm font-bold transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase mb-8 flex items-center gap-3">
              Contact Us
            </h3>
            <div className="space-y-6">
              
              <div className="flex gap-4 group items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-white/5 group-hover:border-blue-500/50 shadow-lg group-hover:shadow-blue-900/20">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Call Us</p>
                  <a href={`tel:${companySettings.phone}`} className="text-white font-bold text-lg hover:text-blue-400 transition-colors">
                    {companySettings.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-4 group items-center">
                <button 
                  onClick={() => setShowEmail(!showEmail)}
                  className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-white/5 group-hover:border-blue-500/50 shadow-lg group-hover:shadow-blue-900/20"
                >
                  <Mail size={20} />
                </button>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Email Us</p>
                  {showEmail ? (
                    <a href={`mailto:${companySettings.email}`} className="text-white font-bold text-sm hover:text-blue-400 transition-colors break-all animate-fade-in block">
                      {companySettings.email}
                    </a>
                  ) : (
                    <button onClick={() => setShowEmail(true)} className="text-slate-300 text-sm font-bold hover:text-white transition-colors text-left italic">
                      Click icon to reveal
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-4 group items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-white/5 group-hover:border-blue-500/50 shadow-lg group-hover:shadow-blue-900/20">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Visit Us</p>
                  <p className="text-white text-sm font-bold leading-tight">
                    {companySettings.address}<br/>
                    {companySettings.city}, {companySettings.state} {companySettings.zip}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-10 text-center">
          <p className="text-slate-400 text-sm mb-4 font-bold">
            &copy; {new Date().getFullYear()} New Holland Financial Group
          </p>
          
          <div className="flex justify-center gap-8 mb-8">
             <Link to="/privacy" className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Privacy Policy</Link>
             <Link to="/terms" className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Terms of Use</Link>
          </div>

          <p className="text-slate-500 text-xs max-w-4xl mx-auto leading-relaxed opacity-60 font-medium">
            This website is for informational purposes only and does not constitute a complete description of our investment services or performance. This website is in no way a solicitation or offer to sell securities or investment advisory services except, where applicable, in states where we are registered or where an exemption or exclusion from such registration exists.
          </p>
        </div>
      </div>
    </footer>
  );
};
