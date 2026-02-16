
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { PropertyListing, ProductType, UserRole } from '../../types';
import { 
  Home as HomeIcon, 
  MapPin, 
  BedDouble, 
  Bath, 
  Square, 
  CheckCircle, 
  ArrowRight, 
  X, 
  Calculator, 
  TrendingUp, 
  Search, 
  Filter, 
  Key, 
  Landmark,
  FileText,
  DollarSign,
  Truck,
  Globe,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  Building2,
  Map,
  School,
  Hammer,
  DoorOpen,
  Video,
  Star,
  Play,
  Briefcase,
  PlayCircle,
  PhoneIncoming,
  Mail,
  Smartphone,
  ChevronDown
} from 'lucide-react';

export const RealEstate: React.FC = () => {
  const { properties, addLead, testimonials, allUsers, companySettings } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const viewMode = (searchParams.get('view') || 'home') as 'home' | 'properties' | 'buyers' | 'sellers' | 'resources' | 'about' | 'contact';
  const typeFilter = searchParams.get('type');

  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Mortgage Calculator State
  const [price, setPrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewMode, typeFilter]);

  const filteredProperties = useMemo(() => {
    let list = properties.filter(p => p.status === 'Active');
    if (typeFilter) {
      list = list.filter(p => p.type.toLowerCase() === typeFilter.toLowerCase());
    }
    return list;
  }, [properties, typeFilter]);

  const monthlyPayment = useMemo(() => {
    const principal = price - downPayment;
    const r = (rate / 100) / 12;
    const n = years * 12;
    if (r === 0 || n === 0) return principal / (n || 1);
    return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  }, [price, downPayment, rate, years]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        interest: ProductType.REAL_ESTATE,
        message: selectedProperty 
          ? `Inquiry for ${selectedProperty.address}: ${contactForm.message}` 
          : `Real Estate Inquiry (${viewMode}): ${contactForm.message}`,
        source: 'Real Estate Portal'
    });
    setFormSubmitted(true);
    setTimeout(() => {
        setFormSubmitted(false);
        setIsContactFormOpen(false);
        setContactForm({ name: '', phone: '', email: '', message: '' });
    }, 3000);
  };

  const reTestimonials = testimonials.filter(t => t.status === 'approved');

  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* Hero Section */}
      <div className="relative bg-[#0B2240] pt-48 pb-24 overflow-hidden rounded-b-[4rem] shadow-2xl">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-amber-500 rounded-full mix-blend-overlay filter blur-[120px] opacity-20"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-fade-in">
            <span className="px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 font-black text-[10px] uppercase tracking-[0.3em] border border-amber-500/30 mb-6 inline-block">
                {viewMode === 'buyers' ? 'Finding Your Future' : 
                 viewMode === 'sellers' ? 'Listing Excellence' : 
                 viewMode === 'resources' ? 'Industry Intel' : 
                 viewMode === 'about' ? 'Our Legacy' : 'Premier Real Estate'}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none uppercase">
                {viewMode === 'buyers' ? 'Home Buying Process' : 
                 viewMode === 'sellers' ? 'Strategic Listing Process' : 
                 viewMode === 'properties' ? 'Exclusive Listings' : 
                 viewMode === 'resources' ? 'Strategic Hub' : 
                 viewMode === 'about' ? 'Our Story' : 'The NHFG Experience'}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto font-medium leading-relaxed opacity-80 uppercase tracking-widest text-[11px]">
                {viewMode === 'buyers' ? 'Strategic roadmap to your next property acquisition.' : 
                 viewMode === 'sellers' ? 'From market analysis to closing, we maximize your ROI.' : 
                 viewMode === 'resources' ? 'Professional tools for the sophisticated market participant.' : 
                 'Unrivaled expertise in surrounding residential markets.'}
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          
          {/* HOME VIEW (OVERVIEW) */}
          {viewMode === 'home' && (
              <div className="space-y-32 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div>
                          <h2 className="text-4xl font-black text-[#0B2240] uppercase tracking-tighter mb-6">Unrivaled Presence</h2>
                          <p className="text-slate-600 text-lg leading-relaxed mb-8">
                             {companySettings.realEstateAbout}
                          </p>
                          <div className="flex gap-4">
                              <Link to="/real-estate?view=buyers" className="px-8 py-4 bg-[#0B2240] text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">Buy a Home</Link>
                              <Link to="/real-estate?view=sellers" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Sell a Home</Link>
                          </div>
                      </div>
                      <div className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[400px]">
                          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Modern Home" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2240]/80 to-transparent"></div>
                          <div className="absolute bottom-10 left-10 text-white">
                              <p className="text-3xl font-black tracking-tighter">Experts with Years of Experience</p>
                          </div>
                      </div>
                  </div>

                  {/* FREE MOVING TRAILER CTA */}
                  <div className="bg-[#0B2240] rounded-[4rem] p-12 lg:p-20 text-white relative overflow-hidden group">
                      <div className="absolute -right-20 -bottom-20 opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12"><Truck size={400}/></div>
                      <div className="max-w-3xl relative z-10">
                          <span className="bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 inline-block border border-amber-500/30">Client Exclusive</span>
                          <h3 className="text-4xl lg:text-6xl font-black mb-8 leading-tight tracking-tighter uppercase">Check out our FREE moving trailer!</h3>
                          <p className="text-blue-100 text-lg mb-10 font-medium leading-relaxed">Available to all our home buyers and sellers. We take care of the transition so you can focus on the destination.</p>
                          <Link to="/real-estate?view=contact" className="bg-white text-[#0B2240] px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:bg-amber-50 transition-all flex items-center gap-3 w-fit">
                              Reserve for your move <ArrowRight size={16}/>
                          </Link>
                      </div>
                  </div>
              </div>
          )}

          {/* BUYERS VIEW */}
          {viewMode === 'buyers' && (
              <div className="space-y-24 animate-fade-in">
                  <div className="text-center max-w-3xl mx-auto space-y-6">
                      <h2 className="text-5xl font-black text-[#0B2240] tracking-tighter uppercase">Where do I start?</h2>
                      <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm">Your Home Buying Process</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                      {[
                        { title: 'Get Pre-Approved', desc: 'Your first step! We connect you with trusted local lenders to understand your buying power and strengthen your offer.', icon: Landmark },
                        { title: 'Property Search', desc: 'We listen to your needs and search the entire MLS and beyond to find the best matches, providing full market context.', icon: Search },
                        { title: 'Showings & Hunting', desc: 'We schedule tours, advise on pros/cons of each property, and educate you throughout the process.', icon: DoorOpen },
                        { title: 'Negotiations', desc: 'We negotiate the best possible terms, detail every aspect of the offer in writing, and ensure all disclosures are completed correctly.', icon: FileText },
                        { title: 'Facilitate Process', desc: 'We guide you every step, creatively resolving any inspection, appraisal, or title issues to get to closing.', icon: CheckCircle2 },
                        { title: 'Get to Closing!', desc: 'We handle all paperwork, finalize figures, and are by your side to celebrate a successful closing.', icon: Key }
                      ].map((step, i) => (
                        <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 text-slate-50 font-black text-6xl opacity-20 pointer-events-none group-hover:text-blue-50 transition-colors">0{i+1}</div>
                            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-10 shadow-inner group-hover:bg-[#0B2240] group-hover:text-white transition-all">
                                <step.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase">{step.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium flex-1">{step.desc}</p>
                        </div>
                      ))}
                  </div>
              </div>
          )}

          {/* SELLERS VIEW */}
          {viewMode === 'sellers' && (
              <div className="space-y-24 animate-fade-in">
                   <div className="text-center max-w-3xl mx-auto space-y-6">
                      <h2 className="text-5xl font-black text-[#0B2240] tracking-tighter uppercase">Where do I start?</h2>
                      <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm">Your Home Selling Process</p>
                  </div>

                  <div className="space-y-8">
                      {[
                        { title: 'Preparing Your Home to Sell', desc: 'We advise on key repairs, improvements, cleaning, decluttering, and staging to maximize appeal and value.', icon: Hammer },
                        { title: 'Pricing to Sell', desc: 'We perform a Competitive Market Analysis (CMA) to recommend a strategic price for a timely sale that meets appraisal value.', icon: DollarSign },
                        { title: 'Paperwork & Listing', desc: 'We manage all required state disclosures and legal paperwork, protecting you from liabilities with our expertise.', icon: FileText },
                        { title: 'Marketing Your Property', desc: 'Multi-channel dominance: Online (MLS, Zillow, 30+ sites), Local (Buyer\'s Guide Magazine, Electronic signs), and Team Power networking.', icon: Globe },
                        { title: 'Negotiations', desc: 'Your agent negotiates the best price and ensures all terms (dates, contingencies, personal property) are agreed upon in writing.', icon: Briefcase },
                        { title: 'Closing', desc: 'We coordinate dates, finalize figures, manage legal paperwork, and celebrate with you at closing.', icon: CheckCircle }
                      ].map((step, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-10 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all items-center">
                            <div className="h-20 w-20 bg-amber-50 text-amber-600 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner">
                                <step.icon size={32} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">{step.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                            </div>
                            <div className="text-7xl font-black text-slate-50 opacity-10 group-hover:opacity-20 transition-opacity">0{i+1}</div>
                        </div>
                      ))}
                  </div>
              </div>
          )}

          {/* RESOURCES VIEW (Dynamic from CMS) */}
          {viewMode === 'resources' && (
              <div className="space-y-12 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {companySettings.realEstateResources?.map(res => (
                          <a 
                            key={res.id} 
                            href={res.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
                          >
                              <div className="flex justify-between items-start mb-6">
                                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                      <FileText size={24}/>
                                  </div>
                                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{res.type}</span>
                              </div>
                              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{res.title}</h3>
                              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">{res.description}</p>
                              <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                                  Access Resource <ArrowRight size={14}/>
                              </div>
                          </a>
                      ))}
                      {(!companySettings.realEstateResources || companySettings.realEstateResources.length === 0) && (
                          <div className="col-span-full py-32 text-center text-slate-300 italic">No specialized resources currently available.</div>
                      )}
                  </div>
              </div>
          )}

          {/* CONTACT VIEW */}
          {viewMode === 'contact' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-fade-in">
                  <div className="space-y-10">
                      <h2 className="text-5xl font-black text-[#0B2240] tracking-tighter uppercase leading-none">Let's Connect</h2>
                      <p className="text-xl text-slate-600 leading-relaxed font-medium">{companySettings.realEstateContactCta}</p>
                      
                      <div className="space-y-6">
                          <div className="flex gap-4 items-center group">
                              <div className="p-4 bg-white shadow-lg rounded-2xl border border-slate-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                  <Smartphone size={24} />
                              </div>
                              <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Primary Line</p>
                                  <p className="text-xl font-black text-[#0B2240]">{companySettings.phone}</p>
                              </div>
                          </div>
                          <div className="flex gap-4 items-center group">
                              <div className="p-4 bg-white shadow-lg rounded-2xl border border-slate-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                  <Mail size={24} />
                              </div>
                              <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">General Inbox</p>
                                  <p className="text-xl font-black text-[#0B2240]">{companySettings.email}</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="bg-white rounded-[3rem] p-10 lg:p-14 shadow-2xl border border-slate-100">
                      {formSubmitted ? (
                          <div className="text-center py-20">
                              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><CheckCircle2 size={40}/></div>
                              <h3 className="text-3xl font-black text-slate-900">Request Sent</h3>
                              <p className="text-slate-500 mt-2 font-medium">An expert advisor will reach out to you shortly.</p>
                          </div>
                      ) : (
                          <form onSubmit={handleContactSubmit} className="space-y-6">
                              <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Name</label>
                                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" placeholder="John Doe" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} />
                              </div>
                              <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Email</label>
                                  <input type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" placeholder="john@example.com" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
                              </div>
                              <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Phone</label>
                                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" placeholder="(555) 555-5555" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} />
                              </div>
                              <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Message</label>
                                  <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none shadow-inner resize-none" placeholder="How can we help you?" value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} />
                              </div>
                              <button type="submit" className="w-full py-5 bg-[#0B2240] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">Submit Strategy Request</button>
                          </form>
                      )}
                  </div>
              </div>
          )}

          {/* PROPERTIES VIEW */}
          {viewMode === 'properties' && (
              <div className="space-y-12 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 border-b border-slate-100 pb-10">
                      <div>
                          <h2 className="text-4xl font-black text-[#0B2240] tracking-tight uppercase">
                            {typeFilter ? `${typeFilter} Inventory` : 'Our Listings'}
                          </h2>
                          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Premier Residential Markets</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {['All', 'Residential', 'Acreage', 'Commercial', 'Land'].map(filter => (
                            <Link 
                                key={filter}
                                to={`/real-estate?view=properties${filter === 'All' ? '' : `&type=${filter}`}`}
                                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === filter || (!typeFilter && filter === 'All') ? 'bg-[#0B2240] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                                {filter}
                            </Link>
                          ))}
                      </div>
                  </div>

                  {filteredProperties.length === 0 ? (
                      <div className="text-center py-40 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
                          <HomeIcon className="h-16 w-16 mx-auto mb-6 text-slate-200" />
                          <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest leading-none">No Current Listings</h3>
                          <p className="text-slate-400 mt-2 font-bold uppercase text-[10px] tracking-widest">Adjust filters or contact an advisor for pocket listings.</p>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                          {filteredProperties.map(prop => (
                              <div 
                                key={prop.id} 
                                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer overflow-hidden transform hover:-translate-y-2 flex flex-col h-full"
                                onClick={() => setSelectedProperty(prop)}
                              >
                                  <div className="h-72 relative overflow-hidden bg-slate-200">
                                      <img src={prop.image} alt={prop.address} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                      <div className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-xl text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                          {prop.type}
                                      </div>
                                      <div className="absolute bottom-6 right-6 bg-white text-[#0B2240] px-6 py-3 rounded-2xl text-2xl font-black shadow-2xl">
                                          ${prop.price.toLocaleString()}
                                      </div>
                                  </div>
                                  <div className="p-8 flex-1 flex flex-col">
                                      <h4 className="text-xl font-black text-slate-900 mb-2 leading-tight uppercase tracking-tighter">{prop.address}</h4>
                                      <p className="text-slate-500 text-xs font-bold flex items-center gap-1.5 mb-8">
                                          <MapPin className="h-4 w-4 text-blue-500" /> {prop.city}, {prop.state}
                                      </p>
                                      
                                      <div className="grid grid-cols-3 gap-3 mb-8">
                                          <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-blue-50 transition-all">
                                              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Beds</span>
                                              <span className="font-black text-slate-800 text-lg">{prop.bedrooms}</span>
                                          </div>
                                          <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-blue-50 transition-all">
                                              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Baths</span>
                                              <span className="font-black text-slate-800 text-lg">{prop.bathrooms}</span>
                                          </div>
                                          <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-blue-50 transition-all">
                                              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Sq Ft</span>
                                              <span className="font-black text-slate-800 text-lg">{prop.sqft?.toLocaleString()}</span>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          )}

          {/* ABOUT VIEW (Dynamic from CMS) */}
          {viewMode === 'about' && (
              <div className="space-y-24 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                      <div className="space-y-8">
                          <h2 className="text-5xl font-black text-[#0B2240] uppercase tracking-tighter leading-none">Our Story</h2>
                          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg font-medium">
                             "{companySettings.realEstateAbout}"
                          </div>
                      </div>
                      <div className="bg-slate-200 rounded-[4rem] h-[500px] overflow-hidden shadow-2xl relative group">
                          <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Team" />
                          <div className="absolute inset-0 bg-[#0B2240]/20"></div>
                      </div>
                  </div>
              </div>
          )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B2240]/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
              <div className="bg-white rounded-[4rem] w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]">
                  <button 
                    onClick={() => { setSelectedProperty(null); setIsContactFormOpen(false); }}
                    className="absolute top-8 right-8 z-20 p-3 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full backdrop-blur-md transition-all"
                  >
                      <X className="h-6 w-6" />
                  </button>

                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="relative h-[500px] w-full bg-slate-900">
                          <img src={selectedProperty.image} alt={selectedProperty.address} className="w-full h-full object-cover opacity-80" />
                          <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/90 to-transparent text-white">
                              <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                                  <div>
                                      <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter uppercase">{selectedProperty.address}</h2>
                                      <p className="text-xl font-bold text-blue-300">{selectedProperty.city}, {selectedProperty.state}</p>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-5xl md:text-6xl font-black tracking-tighter text-white">${selectedProperty.price.toLocaleString()}</p>
                                      <p className="text-xs font-black uppercase tracking-[0.3em] mt-3 opacity-60">Status: {selectedProperty.status}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
