import React, { useEffect, useState, useRef } from "react";
import { ProductType, UserRole } from "../../types";
import {
  CheckCircle,
  ArrowLeft,
  Key,
  Home as HomeIcon,
  TrendingUp,
  X,
  Shield,
  Users,
  Heart,
  Coins,
  Umbrella,
  BarChart3,
  Truck,
  Briefcase,
  Building2,
  Gem,
  Map,
  Brain,
  Landmark,
  Percent,
  DollarSign,
  MapPin,
  User,
  ChevronRight,
  Video,
} from "lucide-react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import { useData } from "../../context/DataContext";

import { PropertyDetailModal } from "../../components/PropertyDetailModal";
import { LifeInsuranceRecommenderModal } from "../../components/LifeInsuranceRecommenderModal";
import { MortgageRecommenderModal } from "../../components/MortgageRecommenderModal";
import { BusinessInsuranceRecommenderModal } from "../../components/BusinessInsuranceRecommenderModal";
import { AutoInsuranceRecommenderModal } from "../../components/AutoInsuranceRecommenderModal";
import { SecuritiesRecommenderModal } from "../../components/SecuritiesRecommenderModal";
import { RealEstateRecommenderModal } from "../../components/RealEstateRecommenderModal";

export const Services: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const { addCallback, addLead, companySettings, properties, user } = useData();

  // Modal Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLifeModalOpen, setIsLifeModalOpen] = useState(false);
  const [isMortgageModalOpen, setIsMortgageModalOpen] = useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [isSecuritiesModalOpen, setIsSecuritiesModalOpen] = useState(false);
  const [isRealEstateModalOpen, setIsRealEstateModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    productType: "",
    timeRequested: "",
  });

  // Real Estate Listing View State
  const [viewListing, setViewListing] = useState<string | null>(null);

  // Animation Observer Logic
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryFilter]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
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
        timeRequested: formData.timeRequested || "ASAP",
      });

      const assignToId =
        user?.role === UserRole.ADVISOR || user?.role === UserRole.MANAGER
          ? user.id
          : undefined;

      addLead(
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || "Not Provided",
          interest: (formData.productType as ProductType) || ProductType.LIFE,
          message: `Callback requested for ${formData.timeRequested || "ASAP"} via Company Services Page.`,
          source: "company",
        },
        assignToId,
      );

      setFormSubmitted(true);
      setTimeout(() => {
        setIsFormOpen(false);
        setFormSubmitted(false);
        setFormData({
          name: "",
          phone: "",
          email: "",
          productType: "",
          timeRequested: "",
        });
      }, 3000);
    }
  };

  // Filter Active Properties for Real Estate Page
  const activeProperties = properties.filter((p) => p.status === "Active");
  const selectedProperty = properties.find((p) => p.id === viewListing);

  const products = (companySettings.customProducts || [])
    .map((p) => ({
      title: p.title,
      desc: p.description,
      features: p.features,
      image: p.image,
      id: p.id,
      link: p.link,
      isHidden: p.isHidden,
      order: p.order,
    }))
    .sort((a, b) => a.order - b.order);

  const displayedProducts = (
    categoryFilter
      ? products.filter((p) => {
          const sectionId = p.link.split("category=")[1] || p.id;
          return (
            sectionId.includes(categoryFilter) ||
            categoryFilter.includes(sectionId)
          );
        })
      : products
  ).filter((p) => !p.isHidden);

  const cleanPhone = companySettings.phone.replace(/\D/g, "");

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
              <Link
                to="/products"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> View All Products
              </Link>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                {displayedProducts[0]?.title}
              </h2>
            </div>
          ) : (
            <div className="mb-16 animate-on-scroll">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                Our Products
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Comprehensive Financial Solutions
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                From protecting your family to growing your wealth, we offer a
                full spectrum of insurance and financial services.
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Real Estate Listings Section */}
        {categoryFilter === "real-estate" && activeProperties.length > 0 && (
          <div className="mb-20 animate-on-scroll">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
                <HomeIcon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Featured Listings
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activeProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white rounded-[2rem] border border-slate-100 shadow-lg overflow-hidden group hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="h-64 relative overflow-hidden">
                    <img
                      src={prop.image}
                      alt={prop.address}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-slate-900/80 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                      {prop.type}
                    </div>
                    {prop.source && (
                      <div className="absolute top-4 right-4 bg-blue-600/90 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                        {prop.source}
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 bg-white text-slate-900 px-4 py-2 rounded-xl text-lg font-black shadow-lg">
                      ${prop.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-slate-900 mb-1">
                      {prop.address}
                    </h4>
                    <p className="text-slate-500 text-sm mb-4">
                      {prop.city}, {prop.state} {prop.zip}
                    </p>

                    <div className="flex justify-between items-center py-4 border-t border-slate-100">
                      <div className="text-center">
                        <span className="block text-xs font-bold text-slate-400 uppercase">
                          Beds
                        </span>
                        <span className="font-black text-slate-800">
                          {prop.bedrooms}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-slate-100"></div>
                      <div className="text-center">
                        <span className="block text-xs font-bold text-slate-400 uppercase">
                          Baths
                        </span>
                        <span className="font-black text-slate-800">
                          {prop.bathrooms}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-slate-100"></div>
                      <div className="text-center">
                        <span className="block text-xs font-bold text-slate-400 uppercase">
                          Sq Ft
                        </span>
                        <span className="font-black text-slate-800">
                          {prop.sqft?.toLocaleString()}
                        </span>
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
          {displayedProducts.map((product) => {
            const isLife = product.id === "life";
            const isMortgage = product.id === "mortgage";
            const isBusiness = product.id === "business";
            const isAuto = product.id === "auto";
            const isSecurities = product.id === "securities";
            const isRealEstate = product.id === "real-estate";

            const CardContent = (
              <>
                <div className="flex-shrink-0 h-48 w-full overflow-hidden relative block">
                  <img
                    className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    src={product.image}
                    alt={product.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-6 text-xl font-bold text-white tracking-wide group-hover:text-blue-200 transition-colors">
                    {product.title}
                  </h3>
                </div>
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium text-left">
                      {product.desc}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <CheckCircle
                            className="flex-shrink-0 h-5 w-5 text-blue-500"
                            aria-hidden="true"
                          />
                          <span className="ml-3 text-sm text-slate-700 font-medium text-left">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            );

            return (
              <div
                key={product.id}
                className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden service-card animate-on-scroll h-full relative group"
              >
                {isLife ||
                isMortgage ||
                isBusiness ||
                isAuto ||
                isSecurities ||
                isRealEstate ? (
                  <button
                    onClick={() => {
                      if (isLife) setIsLifeModalOpen(true);
                      else if (isMortgage) setIsMortgageModalOpen(true);
                      else if (isBusiness) setIsBusinessModalOpen(true);
                      else if (isAuto) setIsAutoModalOpen(true);
                      else if (isSecurities) setIsSecuritiesModalOpen(true);
                      else if (isRealEstate) setIsRealEstateModalOpen(true);
                    }}
                    className="flex-1 flex flex-col text-left"
                  >
                    {CardContent}
                  </button>
                ) : (
                  <Link to={product.link} className="flex-1 flex flex-col">
                    {CardContent}
                  </Link>
                )}
                <div className="px-8 pb-8 pt-0 mt-auto">
                  <div className="pt-6 border-t border-slate-100">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsFormOpen(true);
                      }}
                      className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-bold rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      Request Consultation
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <LifeInsuranceRecommenderModal
        isOpen={isLifeModalOpen}
        onClose={() => setIsLifeModalOpen(false)}
      />
      <MortgageRecommenderModal
        isOpen={isMortgageModalOpen}
        onClose={() => setIsMortgageModalOpen(false)}
      />
      <BusinessInsuranceRecommenderModal
        isOpen={isBusinessModalOpen}
        onClose={() => setIsBusinessModalOpen(false)}
      />
      <AutoInsuranceRecommenderModal
        isOpen={isAutoModalOpen}
        onClose={() => setIsAutoModalOpen(false)}
      />
      <SecuritiesRecommenderModal
        isOpen={isSecuritiesModalOpen}
        onClose={() => setIsSecuritiesModalOpen(false)}
      />
      <RealEstateRecommenderModal
        isOpen={isRealEstateModalOpen}
        onClose={() => setIsRealEstateModalOpen(false)}
      />

      {/* Listing Detail Modal */}
      {viewListing && selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setViewListing(null)}
          onContact={() => setIsFormOpen(true)}
        />
      )}

      {/* Contact Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>

            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Request Sent!
                </h3>
                <p className="text-slate-500 mt-2">
                  An advisor will contact you shortly.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Request Info
                </h3>
                <p className="text-slate-500 mb-6 text-sm">
                  Please provide your details below.
                </p>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Name
                    </label>
                    <input
                      required
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Phone
                    </label>
                    <input
                      required
                      type="tel"
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Type of Product
                    </label>
                    <select
                      required
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.productType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productType: e.target.value,
                        })
                      }
                    >
                      <option value="">Select a product</option>
                      {Object.values(ProductType).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Best Time to Call
                    </label>
                    <select
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.timeRequested}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          timeRequested: e.target.value,
                        })
                      }
                    >
                      <option value="">Anytime</option>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
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
