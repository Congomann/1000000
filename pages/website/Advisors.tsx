
import React, { useEffect } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';
import { Link } from 'react-router-dom';

export const Advisors: React.FC = () => {
  const { allUsers } = useData();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter only Advisors from the user DB
  const advisors = allUsers.filter(u => u.role === UserRole.ADVISOR);
  
  // Custom Brand Icons
  const FacebookIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className || "h-4 w-4"}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  const LinkedInIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className || "h-4 w-4"}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );

  const InstagramIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className || "h-4 w-4"}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );

  const TwitterIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className || "h-4 w-4"}>
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  );

  const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className || "h-4 w-4"} fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zl-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
  );

  const TikTokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className || "h-4 w-4"} fill="currentColor">
         <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.84-2.9 6.24-1.72 1.35-4.03 2.08-6.3 1.83-2.15-.2-4.13-1.28-5.52-3.03-1.23-1.6-1.87-3.62-1.74-5.63.13-2.02.97-3.95 2.38-5.46.22-.23.46-.44.71-.64.08-.05.15-.09.22-.13V6.99c-.19.12-.37.26-.55.4a9.12 9.12 0 0 0-3.32 5.51c-.68 2.37-.2 4.96 1.35 6.94 1.53 1.95 4.02 3.12 6.57 3.07 2.63-.05 5.09-1.34 6.58-3.46 1.32-1.92 1.9-4.32 1.56-6.66V4.73c.01.01.02.01.03.01h.01v-4.72Z"></path>
    </svg>
  );

  const YouTubeIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className || "h-4 w-4"}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
  
  // Helper for dynamic icons on the card
  const getSocialIcon = (platform: string) => {
    const className = "h-4 w-4";
    switch (platform) {
      case 'LinkedIn': return <LinkedInIcon className={className} />;
      case 'Facebook': return <FacebookIcon className={className} />;
      case 'Twitter': return <TwitterIcon className={className} />;
      case 'Instagram': return <InstagramIcon className={className} />;
      case 'X': return <XIcon className={className} />;
      case 'TikTok': return <TikTokIcon className={className} />;
      case 'YouTube': return <YouTubeIcon className={className} />;
      default: return null;
    }
  };
  
  const CardContent = ({ advisor, slug }: { advisor: any, slug: string }) => (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group-hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col relative">
        <div className="h-64 overflow-hidden relative bg-slate-100">
             {advisor.avatar ? (
                 <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={advisor.avatar} alt={advisor.name} />
             ) : (
                 <div className="w-full h-full bg-[#0B2240] flex items-center justify-center text-white text-5xl font-bold">
                     {advisor.name.charAt(0)}
                 </div>
             )}
        </div>
        <div className="p-6 flex-1 flex flex-col">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900">{advisor.name}</h3>
                <p className="text-blue-600 font-medium text-sm">{advisor.title || `${advisor.category} Advisor`}</p>
            </div>
            
            <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-1">{advisor.bio || 'Professional advisor ready to assist with your financial goals.'}</p>
            
            <div className="space-y-4 mt-auto">
                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <div className="p-1.5 bg-blue-50 text-blue-500 rounded-full"><Mail size={14} /></div>
                    <a href={`mailto:${advisor.email}`} className="hover:text-blue-600 truncate">{advisor.email}</a>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex -space-x-2">
                        {advisor.socialLinks?.slice(0, 3).map((l: any, i: number) => (
                            <a href={l.url} key={i} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded-full hover:z-10 hover:border-blue-300 hover:text-blue-600 transition-all">
                                {getSocialIcon(l.platform)}
                            </a>
                        ))}
                    </div>
                    
                    <Link to={`/advisor/${slug}`} className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-md">
                        View Profile <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="bg-white font-sans">
      {/* 1. Advisors Hero Section */}
      <div className="relative bg-[#0B2240] py-24 sm:py-32 overflow-hidden">
         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Find Your Financial Partner</h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto font-medium leading-relaxed">
              Connect with our team of expert advisors dedicated to securing your legacy.
            </p>
         </div>
      </div>

      {/* 2. Team Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-slate-900">Meet Our Team</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
                    The New Holland Financial Group team is comprised of licensed professionals with diverse expertise, ready to handle all your insurance needs.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {advisors.map((advisor) => {
                const advisorSlug = advisor.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                return (
                    <div key={advisor.id} className="group h-full">
                        {advisor.micrositeEnabled ? (
                            <CardContent advisor={advisor} slug={advisorSlug} />
                        ) : (
                            <div className="opacity-70 cursor-not-allowed h-full grayscale">
                                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col p-6">
                                    <div className="h-48 bg-slate-200 rounded-xl mb-4"></div>
                                    <h3 className="text-lg font-bold text-slate-400">{advisor.name}</h3>
                                    <p className="text-xs font-bold text-slate-300 uppercase mt-1">Profile Unavailable</p>
                                </div>
                            </div>
                        )}
                    </div>
                )
              })}
            </div>
        </div>
      </div>
    </div>
  );
};
