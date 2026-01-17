
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Home as HomeIcon, Briefcase, Truck, Volume2, VolumeX, TrendingUp, Landmark } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ProductType } from '../../types';

const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const Home: React.FC = () => {
  const { companySettings } = useData();
  const [isMuted, setIsMuted] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const youtubeId = getYoutubeId(companySettings.heroBackgroundUrl);
  const hiddenProducts = companySettings.hiddenProducts || [];
  const partners = companySettings.partners || {};

  // Playlist Logic
  const playlist = companySettings.heroVideoPlaylist && companySettings.heroVideoPlaylist.length > 0 
      ? companySettings.heroVideoPlaylist 
      : [companySettings.heroBackgroundUrl];
  
  const currentVideoSrc = playlist[currentVideoIndex % playlist.length];

  const handleVideoEnded = () => {
      if (playlist.length > 1) {
          setCurrentVideoIndex((prev) => (prev + 1) % playlist.length);
      }
  };

  return (
    <div className="bg-white flex-1 font-sans">
      <div className="relative min-h-[90vh] flex items-center overflow-hidden">
        {companySettings.heroBackgroundType === 'video' ? (
             <>
                 <video 
                    key={currentVideoSrc}
                    autoPlay 
                    muted={isMuted} 
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    onEnded={handleVideoEnded}
                    // Loop single video if only one exists
                    loop={playlist.length <= 1} 
                 >
                    <source src={currentVideoSrc} type="video/mp4" />
                 </video>
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
                 <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
             </>
        ) : (
             <div className="absolute inset-0 bg-slate-900">
                 {companySettings.heroBackgroundUrl && <img src={companySettings.heroBackgroundUrl} className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" alt="Hero" />}
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700 via-slate-900 to-black opacity-80"></div>
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent"></div>
             </div>
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center h-full pt-32">
           <div className="max-w-5xl animate-slide-up">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] text-white drop-shadow-2xl">
                {companySettings.heroTitle || 'Securing Your Future, Protecting Your Legacy.'}
              </h1>
              <p className="text-xl md:text-3xl text-blue-100/95 mb-12 leading-relaxed max-w-3xl font-medium tracking-wide drop-shadow-lg">
                {companySettings.heroSubtitle || 'New Holland Financial Group provides comprehensive insurance and financial solutions.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                  <Link to="/products" className="px-10 py-5 bg-white text-slate-900 font-bold rounded-full text-lg hover:scale-105 transition-all shadow-xl flex items-center justify-center">
                      Explore Products <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link to="/advisors" className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full text-lg hover:bg-white/20 hover:scale-105 transition-all flex items-center justify-center">
                      Find an Advisor
                  </Link>
              </div>
           </div>
        </div>

        {(companySettings.heroBackgroundType === 'video' || companySettings.heroBackgroundType === 'youtube') && (
            <button 
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-10 right-10 p-4 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-lg border border-white/10 transition-all z-20 pointer-events-auto"
            >
                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>
        )}
      </div>

      <div className="py-24 bg-slate-50 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-20">
                  <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-widest border border-blue-200">Our Expertise</span>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-6 tracking-tight">Full Spectrum Financial Services</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {!hiddenProducts.includes(ProductType.LIFE) && (
                      <Link to="/products?category=life-insurance" className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-1">
                          <div>
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                                  <ShieldCheck className="h-7 w-7" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Life & Annuities</h3>
                              <p className="text-slate-500 leading-relaxed text-sm">Wealth building and protection through Term, IUL, and Annuities.</p>
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
                              <p className="text-slate-500 leading-relaxed text-sm">Commercial portfolios, residential listings, and property management.</p>
                          </div>
                          <div className="mt-8">
                              <span className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 group-hover:bg-amber-50 group-hover:text-white group-hover:border-amber-500 transition-all">
                                  <ArrowRight className="h-5 w-5" />
                              </span>
                          </div>
                      </Link>
                  )}

                  {!hiddenProducts.includes(ProductType.MORTGAGE) && (
                      <Link to="/products?category=mortgage-lending-refinance" className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-cyan-900/5 transition-all duration-300 hover:-translate-y-1">
                          <div>
                              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
                                  <Landmark className="h-7 w-7" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-cyan-600 transition-colors">Mortgage & Lending</h3>
                              <p className="text-slate-500 leading-relaxed text-sm">Strategic refinancing, HELOCs, and purchase loans.</p>
                          </div>
                          <div className="mt-8">
                              <span className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 group-hover:bg-cyan-50 group-hover:text-white group-hover:border-cyan-500 transition-all">
                                  <ArrowRight className="h-5 w-5" />
                              </span>
                          </div>
                      </Link>
                  )}

                  {!hiddenProducts.includes(ProductType.BUSINESS) && (
                      <Link to="/products?category=business-insurance" className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-300 hover:-translate-y-1">
                          <div>
                              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                                  <Briefcase className="h-7 w-7" />
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">Business & Commercial</h3>
                              <p className="text-slate-500 leading-relaxed text-sm">Risk management, liability, and worker's comp solutions.</p>
                          </div>
                          <div className="mt-8">
                              <span className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 group-hover:bg-purple-50 group-hover:text-white group-hover:border-purple-500 transition-all">
                                  <ArrowRight className="h-5 w-5" />
                              </span>
                          </div>
                      </Link>
                  )}
              </div>
          </div>
      </div>

      {/* Partners Section */}
      {Object.keys(partners).length > 0 && (
          <div className="py-16 bg-white border-t border-slate-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <p className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-12">OUR PARTNERS</p>
                  <div className="flex flex-wrap justify-center items-center gap-12 transition-all duration-500">
                      {Object.entries(partners).map(([name, url]) => (
                          <div key={name} className="h-16">
                              <img 
                                src={(url as string).startsWith('http') || (url as string).startsWith('data:') ? url : `https://logo.clearbit.com/${url}`} 
                                alt={name} 
                                className="h-full object-contain max-w-[200px]"
                                title={name}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                              />
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
