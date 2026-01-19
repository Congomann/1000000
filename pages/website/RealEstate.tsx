
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { PropertyListing, ProductType } from '../../types';
import { Home as HomeIcon, MapPin, BedDouble, Bath, Square, Video, Shield, Info, CheckCircle, ArrowRight, X } from 'lucide-react';

export const RealEstate: React.FC = () => {
  const { properties, addLead } = useData();
  const [activeProperties, setActiveProperties] = useState<PropertyListing[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Filter only Active properties for public view
    setActiveProperties(properties.filter(p => p.status === 'Active'));
  }, [properties]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProperty) {
        addLead({
            name: contactForm.name,
            email: contactForm.email,
            phone: contactForm.phone,
            interest: ProductType.REAL_ESTATE,
            message: `Inquiry for ${selectedProperty.address}: ${contactForm.message}`,
            source: 'Real Estate Page'
        });
        setFormSubmitted(true);
        setTimeout(() => {
            setFormSubmitted(false);
            setIsContactFormOpen(false);
            setContactForm({ name: '', phone: '', email: '', message: '' });
        }, 3000);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* Hero Section */}
      <div className="relative bg-[#0B2240] pt-40 pb-24 overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Premium Real Estate Listings</h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto font-medium leading-relaxed">
              Explore our curated portfolio of residential and commercial properties.
            </p>
         </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {activeProperties.length === 0 ? (
              <div className="text-center py-20">
                  <div className="bg-white p-8 rounded-full inline-block mb-6 shadow-sm">
                      <HomeIcon className="h-12 w-12 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No Listings Available</h3>
                  <p className="text-slate-500 mt-2">Please check back later for new properties.</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {activeProperties.map(prop => (
                      <div 
                        key={prop.id} 
                        className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer overflow-hidden transform hover:-translate-y-1 flex flex-col"
                        onClick={() => setSelectedProperty(prop)}
                      >
                          <div className="h-64 relative overflow-hidden bg-slate-200">
                              <img src={prop.image} alt={prop.address} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute top-4 left-4 bg-slate-900/80 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                                  {prop.type}
                              </div>
                              <div className="absolute bottom-4 right-4 bg-white text-slate-900 px-4 py-2 rounded-xl text-lg font-black shadow-lg">
                                  ${prop.price.toLocaleString()}
                              </div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col">
                              <h4 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{prop.address}</h4>
                              <p className="text-slate-500 text-sm mb-6 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {prop.city}, {prop.state} {prop.zip}
                              </p>
                              
                              <div className="flex justify-between items-center py-4 border-t border-slate-100 mt-auto">
                                  <div className="text-center">
                                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Beds</span>
                                      <span className="font-black text-slate-800 flex items-center gap-1 justify-center"><BedDouble className="h-3 w-3"/> {prop.bedrooms}</span>
                                  </div>
                                  <div className="w-px h-8 bg-slate-100"></div>
                                  <div className="text-center">
                                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Baths</span>
                                      <span className="font-black text-slate-800 flex items-center gap-1 justify-center"><Bath className="h-3 w-3"/> {prop.bathrooms}</span>
                                  </div>
                                  <div className="w-px h-8 bg-slate-100"></div>
                                  <div className="text-center">
                                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Sq Ft</span>
                                      <span className="font-black text-slate-800 flex items-center gap-1 justify-center"><Square className="h-3 w-3"/> {prop.sqft?.toLocaleString()}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2240]/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
              <div className="bg-white rounded-[3rem] w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]">
                  <button 
                    onClick={() => { setSelectedProperty(null); setIsContactFormOpen(false); }}
                    className="absolute top-6 right-6 z-20 p-2 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full backdrop-blur-md transition-all"
                  >
                      <X className="h-6 w-6" />
                  </button>

                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {/* Media Header */}
                      <div className="relative h-96 w-full bg-black">
                          {selectedProperty.videoUrl ? (
                              <video controls className="w-full h-full object-contain" poster={selectedProperty.image}>
                                  <source src={selectedProperty.videoUrl} type="video/mp4" />
                                  Your browser does not support video tag.
                              </video>
                          ) : (
                              <img src={selectedProperty.image} alt={selectedProperty.address} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/90 to-transparent text-white">
                              <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                                  <div>
                                      <div className="flex items-center gap-3 mb-2">
                                          <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">{selectedProperty.type}</span>
                                          {selectedProperty.videoUrl && <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest backdrop-blur-md"><Video className="h-3 w-3"/> Video Tour</span>}
                                      </div>
                                      <h2 className="text-3xl md:text-4xl font-black mb-1">{selectedProperty.address}</h2>
                                      <p className="text-xl font-medium opacity-90">{selectedProperty.city}, {selectedProperty.state} {selectedProperty.zip}</p>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-4xl md:text-5xl font-black tracking-tighter">${selectedProperty.price.toLocaleString()}</p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3">
                          {/* Left Sidebar: Specs */}
                          <div className="bg-slate-50 p-8 lg:p-10 border-r border-slate-100">
                              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Property Specifications</h3>
                              
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
                                  
                                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mt-6">
                                      <div className="flex justify-between items-center mb-2">
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

                          {/* Main Content: Description & Contact */}
                          <div className="lg:col-span-2 p-8 lg:p-10">
                              <div className="mb-10">
                                  <h3 className="text-2xl font-bold text-[#0B2240] mb-6">About this Property</h3>
                                  <p className="text-slate-600 leading-relaxed text-lg font-medium mb-8 whitespace-pre-wrap">
                                      {selectedProperty.description || "No description provided for this listing."}
                                  </p>

                                  {selectedProperty.restrictions && (
                                      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
                                          <Shield className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                                          <div>
                                              <h4 className="text-sm font-bold text-amber-900 uppercase tracking-wide mb-1">Restrictions & Covenants</h4>
                                              <p className="text-sm text-amber-800 font-medium">{selectedProperty.restrictions}</p>
                                          </div>
                                      </div>
                                  )}
                              </div>

                              <div className="border-t border-slate-100 pt-8">
                                  {!isContactFormOpen ? (
                                      <div className="flex flex-col sm:flex-row gap-4">
                                          <button 
                                            onClick={() => setIsContactFormOpen(true)} 
                                            className="flex-1 py-4 bg-[#0B2240] text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                                          >
                                              Schedule Tour <ArrowRight className="h-4 w-4"/>
                                          </button>
                                          <button 
                                            onClick={() => setIsContactFormOpen(true)} 
                                            className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm uppercase tracking-widest"
                                          >
                                              Request Info
                                          </button>
                                      </div>
                                  ) : (
                                      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 animate-fade-in">
                                          {formSubmitted ? (
                                              <div className="text-center py-8">
                                                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                                      <CheckCircle className="h-8 w-8" />
                                                  </div>
                                                  <h3 className="text-xl font-bold text-slate-900">Request Sent!</h3>
                                                  <p className="text-slate-500 mt-2 font-medium">An advisor will contact you shortly.</p>
                                              </div>
                                          ) : (
                                              <form onSubmit={handleContactSubmit} className="space-y-4">
                                                  <div className="flex justify-between items-center mb-4">
                                                      <h3 className="font-bold text-slate-900">Contact Agent</h3>
                                                      <button type="button" onClick={() => setIsContactFormOpen(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase">Cancel</button>
                                                  </div>
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                      <input 
                                                          required 
                                                          className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
                                                          placeholder="Name"
                                                          value={contactForm.name}
                                                          onChange={e => setContactForm({...contactForm, name: e.target.value})}
                                                      />
                                                      <input 
                                                          required 
                                                          type="email"
                                                          className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
                                                          placeholder="Email"
                                                          value={contactForm.email}
                                                          onChange={e => setContactForm({...contactForm, email: e.target.value})}
                                                      />
                                                  </div>
                                                  <input 
                                                      required 
                                                      type="tel"
                                                      className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
                                                      placeholder="Phone"
                                                      value={contactForm.phone}
                                                      onChange={e => setContactForm({...contactForm, phone: e.target.value})}
                                                  />
                                                  <textarea 
                                                      className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm resize-none"
                                                      rows={3}
                                                      placeholder="I'm interested in this property..."
                                                      value={contactForm.message}
                                                      onChange={e => setContactForm({...contactForm, message: e.target.value})}
                                                  ></textarea>
                                                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors uppercase tracking-widest text-xs">
                                                      Submit Request
                                                  </button>
                                              </form>
                                          )}
                                      </div>
                                  )}
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
