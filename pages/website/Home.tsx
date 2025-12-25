
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Home as HomeIcon, Briefcase, Truck, Volume2, VolumeX, TrendingUp, Landmark } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ProductType } from '../../types';

// Helper function to extract YouTube ID from various URL formats
const getYoutubeId = (url: string) => {
    if (!url) return null;
    // Regex to handle standard, short, embed, and query params
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const Home: React.FC = () => {
  const { companySettings } = useData();
  const [isMuted, setIsMuted] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Alphabetize Partners for Display
  const sortedPartners = Object.entries(companySettings.partners || {} as Record<string, string>).sort(([a], [b]) => a.localeCompare(b));
  
  const youtubeId = getYoutubeId(companySettings.heroBackgroundUrl);

  const playlist = companySettings.heroVideoPlaylist || [];
  const currentVideoSrc = (companySettings.heroBackgroundType === 'video' && playlist.length > 0)
    ? playlist[currentVideoIndex]
    : companySettings.heroBackgroundUrl;

  const handleVideoEnded = () => {
      if (companySettings.heroBackgroundType === 'video' && playlist.length > 1) {
          setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % playlist.length);
      }
  };

  const hiddenProducts = companySettings.hiddenProducts || [];

  return (
    <div className="bg-white flex-1 font-sans">
      {/* Hero Section - MacOS Style Gradient Mesh */}
      <div className="relative min-h-[90vh] flex items-center overflow-hidden">
        {companySettings.heroBackgroundType === 'video' ? (
             <>
                 <video 
                    key={currentVideoSrc} // Force re-render on src change for rotation
                    autoPlay 
                    muted={isMuted} 
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    onEnded={handleVideoEnded}
                    // Fallback loop if single video
                    loop={playlist.length <= 1} 
                 >
                    <source src={currentVideoSrc} type="video/mp4" />
                 </video>
                 {/* Dark Overlay for Readability */}
                 <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
             </>
        ) : companySettings.heroBackgroundType === 'youtube' && youtubeId ? (
             <>
                 <div className="absolute inset-0 overflow-hidden pointer-events-none">
                     <iframe 
                        className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? '1' : '0'}&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1`} 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        title="Background Video"
                     ></iframe>
                 </div>
                 {/* Dark Overlay for Readability */}
                 <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
             </>
        ) : (
             /* Gradient Fallback / Image */
             <div className="absolute inset-0 bg-slate-900">
                 {companySettings.heroBackgroundUrl && <img src={companySettings.heroBackgroundUrl} className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" alt="Hero" />}
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700 via-slate-900 to-black opacity-80"></div>
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent"></div>
             </div>
        )}
        
        {/* Glass Overlay for Text Readability - REMOVED GRAY FILTER */}
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center h-full pt-32">
           <div className="max-w-5xl animate-slide-up">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/70 drop-shadow-lg filter">
                {companySettings.heroTitle || 'Securing Your Future, Protecting Your Legacy.'}
              </h1>
              <p className="text-xl md:text-3xl text-blue-100/95 mb-12 leading-relaxed max-w-3xl font-medium tracking-wide drop-shadow-md">
                {companySettings.heroSubtitle || 'New Holland Financial Group provides comprehensive insurance and financial solutions. From Life and E&O to Commercial Real Estate, we are your partners in growth.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                  <Link to="/products" className="px-10 py-5 bg-white text-slate-900 font-bold rounded-full text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] flex items-center justify-center">
                      Explore Products <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link to="/advisors" className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full text-lg hover:bg-white/20 hover:scale-105 transition-all flex items-center justify-center">
                      Find an Advisor
                  </Link>
              </div>
           </div>
        </div>

        {/* Mute Toggle */}
        {(companySettings.heroBackgroundType === 'video' || companySettings.heroBackgroundType === 'youtube') && (
            <button 
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-10 right-10 p-4 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-lg border border-white/10 transition-all z-20 pointer-events-auto"
            >
                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>
        )}
      </div>

      {/* Services Section - Rectangular Cards */}
      <div className="py-24 bg-slate-50 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-20">
                  <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-widest border border-blue-200">Our Expertise</span>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-6 tracking-tight">Comprehensive Financial Solutions</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Row 1: Life & Real Estate */}
                  {!hiddenProducts.includes(ProductType.LIFE) && (
                      <Link to="/products?category=life-insurance" className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-1">
                          <div>
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                                  <ShieldCheck className="h-7 w-7" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Life & Annuities</h3>
                              <p className="text-slate-500 leading-relaxed text-sm">Protect your family's future with Term, Whole, and Universal Life policies.</p>
                          </div>
                          <div className="mt-8">
                              <span className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                                  <ArrowRight className="h-5 w-5" />
                              </span>
                          </div>
                      </Link>
                  )}

                  {!hiddenProducts.includes(ProductType.REAL_ESTATE) && (
                      <Link to="/products?category=real-estate" className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 hover:-translate-y-1">
                          <div>
                              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                                  <HomeIcon className="h-7 w-7" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">Real Estate</h3>
                              <p className="text-slate-500 leading-relaxed text-sm">Specialized coverage for residential and commercial portfolios.</p>
                          </div>
                          <div className="mt-8">
                              <span className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-all">
                                  <ArrowRight className="h-5 w-5" />
                              </span>
                          </div>
                      </Link>
                  )}

                  {/* Row 2: Mortgage & Business */}
                  {!hiddenProducts.includes(ProductType.MORTGAGE) && (
                      <Link to="/products?category=mortgage-lending-refinance" className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-cyan-900/5 transition-all duration-300 hover:-translate-y-1">
                          <div>
                              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
                                  <Landmark className="h-7 w-7" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-cyan-600 transition-colors">Mortgage Lending & Refinance</h3>
                              <p className="text-slate-500 leading-relaxed text-sm">Smart refinancing for long-term wealth. Lower payments, stronger financial outcomes.</p>
                          </div>
                          <div className="mt-8">
                              <span className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-600 transition-all">
                                  <ArrowRight className="h-5 w-5" />
                              </span>
                          </div>
                      </Link>
                  )}

                  {!hiddenProducts.includes(ProductType.BUSINESS) && (
                      <Link to="/products?category=business-insurance" className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-300 hover:-translate-y-1">
                          <div>
                              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                                  <Briefcase className="h-7 w-7" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">Business</h3>
                              <p className="text-slate-500 leading-relaxed text-sm">Comprehensive risk management including General Liability and Workers Comp.</p>
                          </div>
                          <div className="mt-8">
                              <span className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all">
                                  <ArrowRight className="h-5 w-5" />
                              </span>
                          </div>
                      </Link>
                  )}

                  {/* Row 3: Auto & Investment */}
                  {!hiddenProducts.includes(ProductType.AUTO) && (
                      <Link to="/products?category=auto-insurance" className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-red-900/5 transition-all duration-300 hover:-translate-y-1">
                          <div>
                              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-red-500/20 group-hover:scale-110 transition-transform duration-500">
                                  <Truck className="h-7 w-7" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">Auto & Fleet</h3>
                              <p className="text-slate-500 leading-relaxed text-sm">Reliable coverage for personal vehicles and commercial fleets.</p>
                          </div>
                          <div className="mt-8">
                              <span className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500 transition-all">
                                  <ArrowRight className="h-5 w-5" />
                              </span>
                          </div>
                      </Link>
                  )}

                  {!hiddenProducts.includes(ProductType.INVESTMENT) && (
                      <Link to="/products?category=investment-retirement-advisory" className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 hover:-translate-y-1">
                          <div>
                              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                                  <TrendingUp className="h-7 w-7" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">Investment & Retirement Advisory</h3>
                              <p className="text-slate-500 leading-relaxed text-sm">Specialized guidance for clients seeking fiduciary retirement planning and wealth strategies.</p>
                          </div>
                          <div className="mt-8">
                              <span className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                                  <ArrowRight className="h-5 w-5" />
                              </span>
                          </div>
                      </Link>
                  )}
              </div>
          </div>
      </div>

      {/* Partners Section - WHITE BG, FULL COLOR, NO GRAY FILTER */}
      <div className="py-24 bg-white border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-16">
                 <h2 className="text-3xl font-black text-slate-900">Our Trusted Partners</h2>
                 <p className="text-slate-500 mt-2">Working with the best to secure your future.</p>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center">
                 {sortedPartners.map(([name, domain]) => {
                     // Check if domain is a URL (http/https) OR a Data URI (data:)
                     const domainStr = domain as string;
                     const isUrl = domainStr.startsWith('http') || domainStr.startsWith('data:');
                     const logoSrc = isUrl ? domainStr : `https://logo.clearbit.com/${domainStr}`;
                     
                     return (
                     <div key={name} className="flex flex-col items-center justify-center w-full p-6 transition-all duration-300 hover:scale-105 hover:bg-slate-50 rounded-2xl group cursor-pointer border border-transparent hover:border-slate-100">
                        <div className="h-20 w-full flex items-center justify-center mb-4">
                            <img 
                               src={logoSrc} 
                               alt={name}
                               className="max-h-full max-w-full object-contain"
                               onError={(e) => {
                                   const parent = e.currentTarget.parentElement;
                                   if (parent) {
                                       // Fallback to text only if image fails
                                       e.currentTarget.style.display = 'none';
                                   }
                               }}
                            />
                        </div>
                        <span className="text-sm font-bold text-slate-800 text-center group-hover:text-blue-700 transition-colors">{name}</span>
                     </div>
                 )})}
             </div>
         </div>
      </div>

      {/* CTA Section - Floating Glass Card */}
      <div className="py-20 px-4">
          <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-900/30">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
              
              <div className="relative z-10">
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Ready to Secure Your Future?</h2>
                  <p className="text-blue-200 text-xl max-w-2xl mx-auto mb-12 font-medium">
                      Contact us today for a free consultation. Our expert advisors are ready to help you navigate your needs.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <Link to="/contact" className="px-10 py-5 bg-[#FBBF24] text-slate-900 font-bold rounded-full text-lg hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-500/20 hover:scale-105">
                          Get a Free Quote
                      </Link>
                      <Link to="/advisors" className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full text-lg hover:bg-white/20 transition-all hover:scale-105">
                          Speak with an Advisor
                      </Link>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
