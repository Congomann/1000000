
import React, { useEffect, useState, useRef } from 'react';
import { ProductType } from '../../types';
import { CheckCircle, ArrowLeft, Key, Home as HomeIcon, TrendingUp, X, Shield, Users, Heart, Coins, Umbrella, BarChart3, Truck, Briefcase, Building2, Gem, Map, Brain, Landmark, Percent, DollarSign, MapPin, User, ChevronRight, Video } from 'lucide-react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export const Services: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const { addCallback, addLead, companySettings, properties } = useData();

  // Modal Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    timeRequested: ''
  });

  // Real Estate Listing View State
  const [viewListing, setViewListing] = useState<string | null>(null);

  // Animation Observer Logic
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryFilter]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '50px' });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [categoryFilter]); 

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      addCallback({
        name: formData.name,
        phone: formData.phone,
        timeRequested: formData.timeRequested || 'ASAP'
      });

      addLead({
        name: formData.name,
        phone: formData.phone,
        email: 'Not Provided',
        interest: ProductType.LIFE, 
        message: `Callback requested for ${formData.timeRequested || 'ASAP'} via Company Services Page.`,
        source: 'company'
      }, undefined); 

      setFormSubmitted(true);
      setTimeout(() => {
        setIsFormOpen(false);
        setFormSubmitted(false);
        setFormData({ name: '', phone: '', timeRequested: '' });
      }, 3000);
    }
  };

  // Filter Active Properties for Real Estate Page
  const activeProperties = properties.filter(p => p.status === 'Active');
  const selectedProperty = properties.find(p => p.id === viewListing);

  const products = [
    {
      title: ProductType.LIFE,
      desc: "Ensure your family's financial security with our comprehensive life insurance plans.",
      features: ['Term Life', 'Whole Life', 'Universal Life', 'Final Expense'],
      image: companySettings.productImages?.[ProductType.LIFE] || "https://picsum.photos/600/400?random=1"
    },
    {
      title: "Business & Professional Liability",
      desc: "Protect your business assets, operations, and professional reputation with tailored commercial and E&O packages.",
      features: ['General Liability', 'Worker\'s Comp', 'Professional Liability (E&O)', 'Cyber Liability'],
      image: companySettings.productImages?.[ProductType.BUSINESS] || "https://picsum.photos/600/400?random=2"
    },
    {
      title: ProductType.REAL_ESTATE,
      desc: "Specialized coverage for real estate investors, landlords, and property managers.",
      features: ['Loss of Rent', 'Vacant Property', 'Multi-family Dwelling', 'Renovation Risk'],
      image: companySettings.productImages?.[ProductType.REAL_ESTATE] || "https://picsum.photos/600/400?random=3"
    },
    {
      title: ProductType.MORTGAGE,
      desc: "Transform your mortgage into a strategic financial tool with personalized lending and refinance solutions.",
      features: ['Lower Monthly Payments', 'Cash-Out Refinance', 'Debt Consolidation', 'Strategic Mortgage Planning'],
      image: companySettings.productImages?.[ProductType.MORTGAGE] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
    },
    {
      title: ProductType.AUTO,
      desc: "Comprehensive auto coverage for personal vehicles and commercial fleets to keep you moving.",
      features: ['Personal Auto', 'Commercial Fleet', 'Liability Coverage', 'Collision & Comprehensive'],
      image: companySettings.productImages?.[ProductType.AUTO] || "https://picsum.photos/600/400?random=6"
    },
    {
      title: "Securities & Investment Advisory",
      desc: "Navigating financial securities, series licensing, and providing fiduciary retirement planning strategies.",
      features: ['Series 6, 7, 63 Support', 'Fiduciary Planning', 'Portfolio Management', 'Wealth Management Compliance'],
      image: companySettings.productImages?.[ProductType.SECURITIES] || "https://images.unsplash.com/photo-1611974765270-ca12586343bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
    }
  ];

  const hiddenProducts = companySettings.hiddenProducts || [];
  
  const displayedProducts = (categoryFilter
    ? products.filter(p => {
        const sectionId = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        // Simple fuzzy match for category filters since we changed titles
        return sectionId.includes(categoryFilter) || categoryFilter.includes(sectionId.split('-')[0]);
      })
    : products).filter(p => !hiddenProducts.includes(p.title));

  const cleanPhone = companySettings.phone.replace(/\D/g, '');

  return (
    <div className="bg-white pt-40 pb-16">
      <style>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        .service-card {
           transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .service-card:hover {
           transform: translateY(-8px);
           box-shadow: 0 20px 40px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {categoryFilter && displayedProducts.length > 0 ? (
            <div className="mb-8 animate-on-scroll">
                <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> View All Products
                </Link>
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                    {displayedProducts[0]?.title}
                </h2>
            </div>
          ) : (
            <div className="mb-16 animate-on-scroll">
                <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Products</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    Comprehensive Financial Solutions
                </p>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                    From protecting your family to growing your wealth, we offer a full spectrum of insurance and financial services.
                </p>
            </div>
          )}
        </div>

        {/* Dynamic Real Estate Listings Section */}
        {categoryFilter === 'real-estate' && activeProperties.length > 0 && (
            <div className="mb-20 animate-on-scroll">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
                        <HomeIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Featured Listings</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {activeProperties.map(prop => (
                        <div key={prop.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-lg overflow-hidden group hover:-translate-y-2 transition-all duration-300">
                            <div className="h-64 relative overflow-hidden">
                                <img src={prop.image} alt={prop.address} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-slate-900/80 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                                    {prop.type}
                                </div>
                                <div className="absolute bottom-4 right-4 bg-white text-slate-900 px-4 py-2 rounded-xl text-lg font-black shadow-lg">
                                    ${prop.price.toLocaleString()}
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="text-lg font-bold text-slate-900 mb-1">{prop.address}</h4>
                                <p className="text-slate-500 text-sm mb-4">{prop.city}, {prop.state} {prop.zip}</p>
                                
                                <div className="flex justify-between items-center py-4 border-t border-slate-100">
                                    <div className="text-center">
                                        <span className="block text-xs font-bold text-slate-400 uppercase">Beds</span>
                                        <span className="font-black text-slate-800">{prop.bedrooms}</span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-100"></div>
                                    <div className="text-center">
                                        <span className="block text-xs font-bold text-slate-400 uppercase">Baths</span>
                                        <span className="font-black text-slate-800">{prop.bathrooms}</span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-100"></div>
                                    <div className="text-center">
                                        <span className="block text-xs font-bold text-slate-400 uppercase">Sq Ft</span>
                                        <span className="font-black text-slate-800">{prop.sqft?.toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => setViewListing(prop.id)}
                                    className="w-full py-3 bg-[#0B2240] text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-blue-900/20"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {displayedProducts.map((product) => (
            <div key={product.title} className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden service-card animate-on-scroll h-full">
              <div className="flex-shrink-0 h-48 w-full overflow-hidden relative">
                <img className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-700" src={product.image} alt={product.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-4 left-6 text-xl font-bold text-white tracking-wide">{product.title}</h3>
              </div>
              <div className="flex-1 p-8 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {product.desc}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {product.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                            <CheckCircle className="flex-shrink-0 h-5 w-5 text-blue-500" aria-hidden="true" />
                            <span className="ml-3 text-sm text-slate-700 font-medium">{feature}</span>
                        </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-bold rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                        Request Consultation
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Listing Detail Modal */}
      {viewListing && selectedProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
              <div className="bg-white rounded-[3rem] w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]">
                  {/* Close Button */}
                  <button 
                    onClick={() => setViewListing(null)}
                    className="absolute top-6 right-6 z-20 p-2 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full backdrop-blur-md transition-all"
                  >
                      <X className="h-6 w-6" />
                  </button>

                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {/* Media Header */}
                      <div className="relative h-96 w-full">
                          {selectedProperty.videoUrl ? (
                              <video controls className="w-full h-full object-cover" poster={selectedProperty.image}>
                                  <source src={selectedProperty.videoUrl} type="video/mp4" />
                                  Your browser does not support video tag.
                              </video>
                          ) : (
                              <img src={selectedProperty.image} alt={selectedProperty.address} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/80 to-transparent text-white">
                              <div className="flex justify-between items-end">
                                  <div>
                                      <h2 className="text-4xl font-black mb-2">{selectedProperty.address}</h2>
                                      <p className="text-xl font-medium opacity-90">{selectedProperty.city}, {selectedProperty.state} {selectedProperty.zip}</p>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-5xl font-black tracking-tighter">${selectedProperty.price.toLocaleString()}</p>
                                      <p className="text-sm font-bold uppercase tracking-widest mt-2 bg-white/20 inline-block px-3 py-1 rounded-lg backdrop-blur-sm">{selectedProperty.type} • {selectedProperty.status}</p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3">
                          {/* Details Sidebar */}
                          <div className="bg-slate-50 p-10 lg:min-h-[500px]">
                              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Property Specs</h3>
                              
                              <div className="space-y-6">
                                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                                      <span className="text-sm font-bold text-slate-600">Bedrooms</span>
                                      <span className="text-base font-black text-slate-900">{selectedProperty.bedrooms}</span>
                                  </div>
                                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                                      <span className="text-sm font-bold text-slate-600">Bathrooms</span>
                                      <span className="text-base font-black text-slate-900">{selectedProperty.bathrooms}</span>
                                  </div>
                                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                                      <span className="text-sm font-bold text-slate-600">Square Feet</span>
                                      <span className="text-base font-black text-slate-900">{selectedProperty.sqft?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                                      <span className="text-sm font-bold text-slate-600">County</span>
                                      <span className="text-base font-black text-slate-900">{selectedProperty.county || 'N/A'}</span>
                                  </div>
                                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                                      <span className="text-sm font-bold text-slate-600">Zoning</span>
                                      <span className="text-base font-black text-slate-900">{selectedProperty.zoning || 'Residential'}</span>
                                  </div>
                                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                                      <span className="text-sm font-bold text-slate-600">Annual Tax</span>
                                      <span className="text-base font-black text-slate-900">${selectedProperty.taxAmount?.toLocaleString() || '0'}</span>
                                  </div>
                                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-4">
                                      <div className="flex justify-between items-center mb-1">
                                          <span className="text-xs font-bold text-slate-500 uppercase">HOA Status</span>
                                          <span className={`text-xs font-black uppercase ${selectedProperty.hoa ? 'text-orange-600' : 'text-green-600'}`}>
                                              {selectedProperty.hoa ? 'Active' : 'None'}
                                          </span>
                                      </div>
                                      {selectedProperty.hoa && (
                                          <div className="flex justify-between items-center">
                                              <span className="text-xs font-bold text-slate-500 uppercase">Monthly Fee</span>
                                              <span className="text-sm font-black text-slate-800">${selectedProperty.hoaFee}</span>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>

                          {/* Main Info */}
                          <div className="lg:col-span-2 p-10">
                              <h3 className="text-2xl font-bold text-[#0B2240] mb-6">About this Property</h3>
                              <p className="text-slate-600 leading-relaxed text-lg font-medium mb-10 whitespace-pre-wrap">
                                  {selectedProperty.description || "No description provided for this listing."}
                              </p>

                              {selectedProperty.restrictions && (
                                  <div className="mb-10 bg-amber-50 p-6 rounded-2xl border border-amber-100">
                                      <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                                          <Shield className="h-4 w-4" /> Restrictions & Covenants
                                      </h4>
                                      <p className="text-sm text-amber-900 font-medium">{selectedProperty.restrictions}</p>
                                  </div>
                              )}

                              <div className="flex gap-4">
                                  <button onClick={() => setIsFormOpen(true)} className="flex-1 py-4 bg-[#0B2240] text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all text-sm uppercase tracking-widest">
                                      Schedule Tour
                                  </button>
                                  <button onClick={() => setIsFormOpen(true)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm uppercase tracking-widest">
                                      Contact Agent
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Contact Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
            <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
            
            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Request Sent!</h3>
                <p className="text-slate-500 mt-2">An advisor will contact you shortly.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Info</h3>
                <p className="text-slate-500 mb-6 text-sm">Please provide your details below.</p>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                    <input 
                      required 
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                    <input 
                      required 
                      type="tel"
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Best Time to Call</label>
                    <select 
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.timeRequested}
                      onChange={e => setFormData({...formData, timeRequested: e.target.value})}
                    >
                      <option value="">Anytime</option>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Submit Request
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
