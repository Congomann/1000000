import React, { useState } from 'react';
import { PropertyListing } from '../types';
import { useData } from '../context/DataContext';
import { 
  X, MapPin, Bed, Bath, Square, Home, Calendar, Thermometer, Wind, 
  Car, Shield, DollarSign, ChevronDown, ChevronUp, CheckCircle, 
  Map, User, Phone, Mail, Share, Heart
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: PropertyListing;
  onClose: () => void;
  onContact: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, onClose, onContact }) => {
  const { properties } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSection, setExpandedSection] = useState<string | null>('interior');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = property.images?.length ? property.images : [property.image];

  const similarHomes = properties
    .filter(p => p.id !== property.id && p.status === 'Active' && p.type === property.type)
    .slice(0, 3);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B2240]/90 backdrop-blur-md p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-[2rem] sm:rounded-[3rem] w-full max-w-6xl shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh]">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 bg-white/50 hover:bg-white text-slate-900 rounded-full backdrop-blur-md transition-all shadow-lg"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* 1. Hero Section */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full bg-slate-900 group">
            <img 
              src={images[currentImageIndex]} 
              alt={property.address} 
              className="w-full h-full object-cover opacity-90 transition-opacity duration-500" 
            />
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                  <ChevronDown className="h-6 w-6 rotate-90" />
                </button>
                <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                  <ChevronDown className="h-6 w-6 -rotate-90" />
                </button>
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-widest">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 bg-gradient-to-t from-black via-black/60 to-transparent text-white">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${property.status === 'Active' ? 'bg-green-500 text-white' : 'bg-white/20 text-white backdrop-blur-md'}`}>
                      {property.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-white/20 text-white backdrop-blur-md">
                      {property.type}
                    </span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2 tracking-tighter uppercase leading-none">{property.address}</h2>
                  <p className="text-xl sm:text-2xl font-medium text-slate-300 flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> {property.city}, {property.state} {property.zip}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 mt-6 text-sm sm:text-base font-bold tracking-wider">
                    {property.bedrooms !== undefined && <span className="flex items-center gap-2"><Bed className="h-5 w-5 text-blue-400" /> {property.bedrooms} Beds</span>}
                    {property.bathrooms !== undefined && <span className="flex items-center gap-2"><Bath className="h-5 w-5 text-blue-400" /> {property.bathrooms} Baths</span>}
                    {property.sqft !== undefined && <span className="flex items-center gap-2"><Square className="h-5 w-5 text-blue-400" /> {property.sqft.toLocaleString()} Sq Ft</span>}
                    {property.lotSize && <span className="flex items-center gap-2"><Map className="h-5 w-5 text-blue-400" /> {property.lotSize}</span>}
                  </div>
                </div>
                
                <div className="text-left lg:text-right w-full lg:w-auto">
                  <p className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-6">${property.price.toLocaleString()}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={onContact} className="flex-1 lg:flex-none px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-blue-900/20">
                      Schedule Tour
                    </button>
                    <div className="flex gap-3">
                      <button onClick={onContact} className="flex-1 lg:flex-none px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-sm backdrop-blur-md transition-all">
                        Request Info
                      </button>
                      <button className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md transition-all">
                        <Heart className="h-5 w-5" />
                      </button>
                      <button className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md transition-all">
                        <Share className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Key Facts Bar */}
          <div className="bg-slate-50 border-b border-slate-100 px-8 py-6 overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-8 min-w-max">
              {property.yearBuilt && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400"><Calendar className="h-5 w-5" /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Built</p>
                    <p className="text-sm font-bold text-slate-900">{property.yearBuilt}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400"><Home className="h-5 w-5" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</p>
                  <p className="text-sm font-bold text-slate-900">{property.type}</p>
                </div>
              </div>
              {property.heating && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400"><Thermometer className="h-5 w-5" /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Heating</p>
                    <p className="text-sm font-bold text-slate-900">{property.heating}</p>
                  </div>
                </div>
              )}
              {property.cooling && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400"><Wind className="h-5 w-5" /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cooling</p>
                    <p className="text-sm font-bold text-slate-900">{property.cooling}</p>
                  </div>
                </div>
              )}
              {property.parking && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400"><Car className="h-5 w-5" /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parking</p>
                    <p className="text-sm font-bold text-slate-900">{property.parking}</p>
                  </div>
                </div>
              )}
              {property.hoa !== undefined && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400"><Shield className="h-5 w-5" /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HOA</p>
                    <p className="text-sm font-bold text-slate-900">{property.hoa ? `$${property.hoaFee}/mo` : 'None'}</p>
                  </div>
                </div>
              )}
              {property.sqft && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400"><DollarSign className="h-5 w-5" /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price/Sqft</p>
                    <p className="text-sm font-bold text-slate-900">${Math.round(property.price / property.sqft)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* 3. Overview Section */}
              <section>
                {property.headline && (
                  <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight">{property.headline}</h3>
                )}
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {property.description || "No description provided for this listing."}
                </div>
                
                {property.highlights && property.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-6">
                    {property.highlights.map((highlight, idx) => (
                      <span key={idx} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" /> {highlight}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {/* 4. Facts & Features (Accordion) */}
              <section>
                <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Facts & Features</h3>
                <div className="space-y-4">
                  
                  {/* Interior */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button 
                      onClick={() => toggleSection('interior')}
                      className="w-full px-6 py-4 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors"
                    >
                      <span className="font-bold text-slate-900 uppercase tracking-widest text-sm">Interior Details</span>
                      <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedSection === 'interior' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedSection === 'interior' && (
                      <div className="p-6 bg-white grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        {property.bedrooms !== undefined && <div className="flex justify-between"><span className="text-slate-500 text-sm">Bedrooms</span><span className="font-bold text-slate-900">{property.bedrooms}</span></div>}
                        {property.bathrooms !== undefined && <div className="flex justify-between"><span className="text-slate-500 text-sm">Bathrooms</span><span className="font-bold text-slate-900">{property.bathrooms}</span></div>}
                        {property.flooring && <div className="flex justify-between"><span className="text-slate-500 text-sm">Flooring</span><span className="font-bold text-slate-900 text-right">{property.flooring}</span></div>}
                        {property.basement && <div className="flex justify-between"><span className="text-slate-500 text-sm">Basement</span><span className="font-bold text-slate-900 text-right">{property.basement}</span></div>}
                        {property.appliances && <div className="flex justify-between"><span className="text-slate-500 text-sm">Appliances</span><span className="font-bold text-slate-900 text-right">{property.appliances}</span></div>}
                        {property.laundry && <div className="flex justify-between"><span className="text-slate-500 text-sm">Laundry</span><span className="font-bold text-slate-900 text-right">{property.laundry}</span></div>}
                        {property.interiorFeatures && <div className="col-span-full mt-2 pt-4 border-t border-slate-100"><span className="block text-slate-500 text-sm mb-1">Other Interior Features</span><span className="font-bold text-slate-900">{property.interiorFeatures}</span></div>}
                      </div>
                    )}
                  </div>

                  {/* Property & Exterior */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button 
                      onClick={() => toggleSection('exterior')}
                      className="w-full px-6 py-4 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors"
                    >
                      <span className="font-bold text-slate-900 uppercase tracking-widest text-sm">Property & Exterior</span>
                      <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedSection === 'exterior' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedSection === 'exterior' && (
                      <div className="p-6 bg-white grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        {property.levels && <div className="flex justify-between"><span className="text-slate-500 text-sm">Levels</span><span className="font-bold text-slate-900 text-right">{property.levels}</span></div>}
                        {property.stories !== undefined && <div className="flex justify-between"><span className="text-slate-500 text-sm">Stories</span><span className="font-bold text-slate-900">{property.stories}</span></div>}
                        {property.fencing && <div className="flex justify-between"><span className="text-slate-500 text-sm">Fencing</span><span className="font-bold text-slate-900 text-right">{property.fencing}</span></div>}
                        {property.patioPorch && <div className="flex justify-between"><span className="text-slate-500 text-sm">Patio/Porch</span><span className="font-bold text-slate-900 text-right">{property.patioPorch}</span></div>}
                        {property.poolSpa && <div className="flex justify-between"><span className="text-slate-500 text-sm">Pool/Spa</span><span className="font-bold text-slate-900 text-right">{property.poolSpa}</span></div>}
                        {property.exteriorFeatures && <div className="col-span-full mt-2 pt-4 border-t border-slate-100"><span className="block text-slate-500 text-sm mb-1">Other Exterior Features</span><span className="font-bold text-slate-900">{property.exteriorFeatures}</span></div>}
                      </div>
                    )}
                  </div>

                  {/* Lot & Construction */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button 
                      onClick={() => toggleSection('lot')}
                      className="w-full px-6 py-4 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors"
                    >
                      <span className="font-bold text-slate-900 uppercase tracking-widest text-sm">Lot & Construction</span>
                      <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedSection === 'lot' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedSection === 'lot' && (
                      <div className="p-6 bg-white grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        {property.lotSize && <div className="flex justify-between"><span className="text-slate-500 text-sm">Lot Size</span><span className="font-bold text-slate-900 text-right">{property.lotSize}</span></div>}
                        {property.lotDimensions && <div className="flex justify-between"><span className="text-slate-500 text-sm">Lot Dimensions</span><span className="font-bold text-slate-900 text-right">{property.lotDimensions}</span></div>}
                        {property.roadSurface && <div className="flex justify-between"><span className="text-slate-500 text-sm">Road Surface</span><span className="font-bold text-slate-900 text-right">{property.roadSurface}</span></div>}
                        {property.architecturalStyle && <div className="flex justify-between"><span className="text-slate-500 text-sm">Style</span><span className="font-bold text-slate-900 text-right">{property.architecturalStyle}</span></div>}
                        {property.foundation && <div className="flex justify-between"><span className="text-slate-500 text-sm">Foundation</span><span className="font-bold text-slate-900 text-right">{property.foundation}</span></div>}
                        {property.roof && <div className="flex justify-between"><span className="text-slate-500 text-sm">Roof</span><span className="font-bold text-slate-900 text-right">{property.roof}</span></div>}
                        {property.materials && <div className="flex justify-between"><span className="text-slate-500 text-sm">Materials</span><span className="font-bold text-slate-900 text-right">{property.materials}</span></div>}
                        {property.condition && <div className="flex justify-between"><span className="text-slate-500 text-sm">Condition</span><span className="font-bold text-slate-900 text-right">{property.condition}</span></div>}
                      </div>
                    )}
                  </div>

                  {/* Utilities & Community */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button 
                      onClick={() => toggleSection('utilities')}
                      className="w-full px-6 py-4 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors"
                    >
                      <span className="font-bold text-slate-900 uppercase tracking-widest text-sm">Utilities & Community</span>
                      <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedSection === 'utilities' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedSection === 'utilities' && (
                      <div className="p-6 bg-white grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        {property.water && <div className="flex justify-between"><span className="text-slate-500 text-sm">Water</span><span className="font-bold text-slate-900 text-right">{property.water}</span></div>}
                        {property.sewer && <div className="flex justify-between"><span className="text-slate-500 text-sm">Sewer</span><span className="font-bold text-slate-900 text-right">{property.sewer}</span></div>}
                        {property.electric && <div className="flex justify-between"><span className="text-slate-500 text-sm">Electric</span><span className="font-bold text-slate-900 text-right">{property.electric}</span></div>}
                        {property.gas && <div className="flex justify-between"><span className="text-slate-500 text-sm">Gas</span><span className="font-bold text-slate-900 text-right">{property.gas}</span></div>}
                        {property.subdivision && <div className="flex justify-between"><span className="text-slate-500 text-sm">Subdivision</span><span className="font-bold text-slate-900 text-right">{property.subdivision}</span></div>}
                        {property.schoolDistrict && <div className="flex justify-between"><span className="text-slate-500 text-sm">School District</span><span className="font-bold text-slate-900 text-right">{property.schoolDistrict}</span></div>}
                        {property.associationName && <div className="flex justify-between"><span className="text-slate-500 text-sm">HOA Name</span><span className="font-bold text-slate-900 text-right">{property.associationName}</span></div>}
                        {property.hoaIncludes && <div className="col-span-full mt-2 pt-4 border-t border-slate-100"><span className="block text-slate-500 text-sm mb-1">HOA Includes</span><span className="font-bold text-slate-900">{property.hoaIncludes}</span></div>}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* 5. Price & Tax History */}
              <section>
                <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Price & Tax History</h3>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest bg-slate-50 w-1/2">List Price</th>
                        <td className="px-6 py-4 font-black text-slate-900">${property.price.toLocaleString()}</td>
                      </tr>
                      {property.sqft && (
                        <tr>
                          <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest bg-slate-50">Price / Sqft</th>
                          <td className="px-6 py-4 font-black text-slate-900">${Math.round(property.price / property.sqft)}</td>
                        </tr>
                      )}
                      {property.taxAssessedValue && (
                        <tr>
                          <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest bg-slate-50">Tax Assessed Value</th>
                          <td className="px-6 py-4 font-black text-slate-900">${property.taxAssessedValue.toLocaleString()}</td>
                        </tr>
                      )}
                      {property.taxAmount && (
                        <tr>
                          <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest bg-slate-50">Annual Taxes</th>
                          <td className="px-6 py-4 font-black text-slate-900">${property.taxAmount.toLocaleString()}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {property.priceHistory && property.priceHistory.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Price History</h4>
                    <div className="border-l-2 border-blue-100 ml-3 space-y-6">
                      {property.priceHistory.map((history, idx) => (
                        <div key={idx} className="relative pl-6">
                          <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-blue-500 border-4 border-white"></div>
                          <p className="text-sm font-bold text-slate-500">{history.date}</p>
                          <p className="text-lg font-black text-slate-900">${history.price.toLocaleString()}</p>
                          <p className="text-sm text-slate-600 font-medium">{history.event}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* 6. Neighborhood */}
              {(property.walkScore !== undefined || property.neighborhoodDescription || property.nearbySchools) && (
                <section>
                  <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Neighborhood</h3>
                  {property.neighborhoodDescription && (
                    <p className="text-slate-600 leading-relaxed font-medium mb-6">{property.neighborhoodDescription}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {property.walkScore !== undefined && (
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Walk Score</p>
                        <p className="text-3xl font-black text-slate-900">{property.walkScore}<span className="text-lg text-slate-400">/100</span></p>
                      </div>
                    )}
                    {property.nearbySchools && property.nearbySchools.length > 0 && (
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 sm:col-span-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Nearby Schools</p>
                        <ul className="space-y-2">
                          {property.nearbySchools.map((school, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" /> {school}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* 7. Similar Homes */}
              {similarHomes.length > 0 && (
                <section>
                  <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Similar Homes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarHomes.map(home => (
                      <div key={home.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer">
                        <div className="h-40 relative overflow-hidden">
                          <img src={home.image} alt={home.address} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-md">
                            ${home.price.toLocaleString()}
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm font-bold text-slate-900 truncate">{home.address}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs font-bold text-slate-500">
                            {home.bedrooms !== undefined && <span>{home.bedrooms} bd</span>}
                            {home.bathrooms !== undefined && <span>{home.bathrooms} ba</span>}
                            {home.sqft !== undefined && <span>{home.sqft.toLocaleString()} sqft</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* 8. Contact / Tour Section */}
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 sticky top-8">
                <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Contact Agent</h3>
                
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-200">
                  <div className="h-16 w-16 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" alt="Agent" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{property.sellerName || 'New Holland Agent'}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Listing Agent</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <button onClick={onContact} className="w-full py-4 bg-[#0B2240] text-white font-black rounded-xl text-sm uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg shadow-blue-900/20">
                    Schedule Tour
                  </button>
                  <button onClick={onContact} className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-black rounded-xl text-sm uppercase tracking-widest hover:bg-slate-50 transition-colors">
                    Ask a Question
                  </button>
                </div>

                <div className="space-y-3">
                  <a href="tel:8005550199" className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                    <Phone className="h-4 w-4" /> (800) 555-0199
                  </a>
                  <a href="mailto:contact@newholland.com" className="flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                    <Mail className="h-4 w-4" /> contact@newholland.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 9. Footer Property Metadata */}
          <div className="bg-slate-900 px-8 py-12 sm:px-12 border-t border-slate-800">
            <div className="flex flex-wrap gap-x-12 gap-y-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              {property.mlsId && <p>MLS ID: <span className="text-slate-300">{property.mlsId}</span></p>}
              {property.parcelNumber && <p>Parcel #: <span className="text-slate-300">{property.parcelNumber}</span></p>}
              {property.zoning && <p>Zoning: <span className="text-slate-300">{property.zoning}</span></p>}
              {property.daysOnMarket !== undefined && <p>Days on Market: <span className="text-slate-300">{property.daysOnMarket}</span></p>}
              {property.source && <p>Source: <span className="text-slate-300">{property.source}</span></p>}
            </div>
            {property.listingTerms && (
              <p className="mt-6 text-xs text-slate-600 leading-relaxed max-w-4xl">
                Listing Terms: {property.listingTerms}
              </p>
            )}
            <p className="mt-6 text-[10px] text-slate-600 leading-relaxed max-w-4xl">
              The data relating to real estate for sale on this website comes in part from the Broker Reciprocity program. Real estate listings held by brokerage firms other than New Holland Financial Group are marked with the Broker Reciprocity logo and detailed information about them includes the name of the listing brokers. Information deemed reliable but not guaranteed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
