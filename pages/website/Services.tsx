
import React, { useEffect, useState, useRef } from 'react';
import { ProductType } from '../../types';
import { CheckCircle, ArrowLeft, Key, Home as HomeIcon, TrendingUp, X, Shield, Users, Heart, Coins, Umbrella, BarChart3, Truck, Briefcase, Building2, Gem, Map, Brain, Landmark, Percent, DollarSign } from 'lucide-react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export const Services: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const { addCallback, addLead, companySettings } = useData();

  // Modal Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    timeRequested: ''
  });

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
  }, [categoryFilter]); // Re-run when filter changes

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      // 1. Add Callback Request
      addCallback({
        name: formData.name,
        phone: formData.phone,
        timeRequested: formData.timeRequested || 'ASAP'
      });

      // 2. Create Lead (Source: Company) - No specific advisor assigned
      addLead({
        name: formData.name,
        phone: formData.phone,
        email: 'Not Provided',
        interest: ProductType.LIFE, // Default for generic inquiry
        message: `Callback requested for ${formData.timeRequested || 'ASAP'} via Company Services Page.`,
        source: 'company'
      }, undefined); // undefined assigns to unassigned pool

      setFormSubmitted(true);
      setTimeout(() => {
        setIsFormOpen(false);
        setFormSubmitted(false);
        setFormData({ name: '', phone: '', timeRequested: '' });
      }, 3000);
    }
  };

  const products = [
    {
      title: ProductType.LIFE,
      desc: "Ensure your family's financial security with our comprehensive life insurance plans.",
      features: ['Term Life', 'Whole Life', 'Universal Life', 'Final Expense'],
      image: companySettings.productImages?.[ProductType.LIFE] || "https://picsum.photos/600/400?random=1"
    },
    {
      title: ProductType.BUSINESS,
      desc: "Protect your business assets and liabilities with tailored commercial packages.",
      features: ['General Liability', 'Worker\'s Comp', 'Business Owner\'s Policy (BOP)', 'Cyber Liability'],
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
      title: ProductType.EO,
      desc: "Professional liability insurance to protect against claims of negligence.",
      features: ['Legal Defense Costs', 'Settlements', 'Copyright Infringement', 'Personal Injury'],
      image: companySettings.productImages?.[ProductType.EO] || "https://picsum.photos/600/400?random=4"
    },
    {
      title: ProductType.SECURITIES,
      desc: "Navigating the complexities of financial securities and series licensing.",
      features: ['Series 6, 7, 63 Support', 'Investment Advisory', 'Wealth Management Compliance'],
      image: companySettings.productImages?.[ProductType.SECURITIES] || "https://picsum.photos/600/400?random=5"
    },
    {
      title: ProductType.INVESTMENT,
      desc: "Specialized guidance for clients seeking fiduciary retirement planning, investment management, and hybrid wealth strategies.",
      features: ['Fiduciary Planning', 'Portfolio Management', 'Retirement Strategies', 'Hybrid Wealth Models'],
      image: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
    }
  ];

  // Filter out hidden products based on company settings
  const hiddenProducts = companySettings.hiddenProducts || [];
  
  const displayedProducts = (categoryFilter
    ? products.filter(p => {
        const sectionId = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return sectionId === categoryFilter;
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
        
        /* Stagger delays */
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }

        .service-card {
           transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .service-card:hover {
           transform: translateY(-8px);
           box-shadow: 0 20px 40px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
        .zoom-image {
          transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .service-card:hover .zoom-image {
          transform: scale(1.05);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {categoryFilter ? (
            <div className="mb-8 animate-on-scroll">
                <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> View All Products
                </Link>
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                    {displayedProducts[0]?.title || 'Product Not Found'}
                </h2>
            </div>
          ) : (
            <div className="mb-16 animate-on-scroll">
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Our Financial Products</h2>
                <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
                    From personal protection to corporate risk management, we cover it all.
                </p>
            </div>
          )}
        </div>

        <div className={categoryFilter ? "space-y-16" : "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10"}>
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product, index) => {
              const sectionId = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const isRealEstate = product.title === ProductType.REAL_ESTATE;
              const isLife = product.title === ProductType.LIFE;
              const isAuto = product.title === ProductType.AUTO;
              const isBusiness = product.title === ProductType.BUSINESS;
              const isInvestment = product.title === ProductType.INVESTMENT;
              const isSecurities = product.title === ProductType.SECURITIES;
              const isMortgage = product.title === ProductType.MORTGAGE;

              // Specialized Render for Life Insurance (Only when filtered)
              if (isLife && categoryFilter) {
                const lifeProducts = [
                    {
                        title: "Term Life Insurance",
                        desc: "Affordable coverage for a set period (10-30 years). Ideal for income replacement during critical earning years.",
                        icon: Shield,
                        color: "text-blue-500",
                        bg: "bg-blue-50",
                        features: ["Low monthly premiums", "High coverage amounts", "Convertible to permanent"]
                    },
                    {
                        title: "Whole Life Insurance",
                        desc: "Permanent protection with fixed premiums and guaranteed cash value accumulation that acts as a safe asset class.",
                        icon: Heart,
                        color: "text-red-500",
                        bg: "bg-red-50",
                        features: ["Guaranteed death benefit", "Consistent cash value growth", "Fixed premiums for life"]
                    },
                    {
                        title: "Indexed Universal Life (IUL)",
                        desc: "A powerful retirement tool combining life insurance with cash value tied to market indices like the S&P 500.",
                        icon: BarChart3,
                        color: "text-purple-500",
                        bg: "bg-purple-50",
                        features: ["Market-linked growth potential", "0% Floor (Downside Protection)", "Tax-free retirement income streams"]
                    },
                    {
                        title: "Annuities",
                        desc: "Secure your retirement with guaranteed income. Choose 'Immediate' for right-now income or 'Deferred' for later.",
                        icon: Coins,
                        color: "text-amber-500",
                        bg: "bg-amber-50",
                        features: ["Immediate & Deferred options", "Guaranteed lifetime income", "Principal protection"]
                    },
                    {
                        title: "Group Benefits",
                        desc: "Comprehensive insurance packages for businesses to attract and retain top talent.",
                        icon: Users,
                        color: "text-indigo-500",
                        bg: "bg-indigo-50",
                        features: ["Health, Life & Disability", "Employee retention strategy", "Cost-effective group rates"]
                    },
                    {
                        title: "Final Expense",
                        desc: "Simple policies designed to cover burial and end-of-life costs.",
                        icon: Umbrella,
                        color: "text-teal-500",
                        bg: "bg-teal-50",
                        features: ["No medical exam", "Quick approval", "Peace of mind"]
                    }
                ];

                return (
                    <div key={product.title} className="animate-on-scroll">
                        <p className="text-xl text-slate-500 max-w-3xl mx-auto text-center mb-16">{product.desc}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {lifeProducts.map((lp, idx) => (
                                <div key={idx} className={`animate-on-scroll delay-${(idx % 3) * 100} bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col group`}>
                                    <div className={`w-14 h-14 ${lp.bg} ${lp.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <lp.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{lp.title}</h3>
                                    <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-1">{lp.desc}</p>
                                    <ul className="space-y-3 mt-auto">
                                        {lp.features.map((f, i) => (
                                            <li key={i} className="flex items-start text-sm text-slate-500">
                                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button 
                                      onClick={() => setIsFormOpen(true)}
                                      className="mt-8 w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-blue-600 hover:border-transparent hover:text-white transition-all shadow-sm hover:shadow-md"
                                    >
                                        Request Quote
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
              }

              // Specialized Render for Real Estate (Only when filtered)
              if (isRealEstate && categoryFilter) {
                  const realEstateProducts = [
                      {
                          title: "Residential Real Estate",
                          desc: "Professional buying and selling services for homes, townhouses, and condominiums.",
                          icon: HomeIcon,
                          color: "text-blue-600",
                          bg: "bg-blue-50",
                          features: ["Market analysis & pricing strategy", "Professional listing & staging", "Negotiation & contract management"]
                      },
                      {
                          title: "Commercial Real Estate",
                          desc: "Expert services for office buildings, retail spaces, and mixed-use properties.",
                          icon: Building2,
                          color: "text-slate-700",
                          bg: "bg-slate-100",
                          features: ["Lease negotiation support", "Investment property analysis", "Zoning and due diligence"]
                      },
                      {
                          title: "Real Estate Investing",
                          desc: "Strategic investment guidance for rental properties, flips, and wealth growth.",
                          icon: TrendingUp,
                          color: "text-emerald-600",
                          bg: "bg-emerald-50",
                          features: ["ROI and cash flow projections", "Portfolio expansion planning", "Risk management strategies"]
                      },
                      {
                          title: "Property Management",
                          desc: "Full-service rental property management for residential and commercial assets.",
                          icon: Key,
                          color: "text-orange-600",
                          bg: "bg-orange-50",
                          features: ["Tenant screening & placement", "Rent collection & lease enforcement", "Maintenance coordination"]
                      },
                      {
                          title: "Luxury Properties",
                          desc: "Exclusive representation for high-value homes and premium property clients.",
                          icon: Gem,
                          color: "text-purple-600",
                          bg: "bg-purple-50",
                          features: ["Private client handling", "Global marketing reach", "Confidential showings"]
                      },
                      {
                          title: "Land & Development",
                          desc: "Professional guidance for land acquisition and development projects.",
                          icon: Map,
                          color: "text-amber-600",
                          bg: "bg-amber-50",
                          features: ["Zoning and land use research", "Feasibility and planning studies", "Builder and contractor coordination"]
                      }
                  ];

                  return (
                      <div key={product.title} className="animate-on-scroll">
                        <p className="text-xl text-slate-500 max-w-3xl mx-auto text-center mb-16">{product.desc}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {realEstateProducts.map((rep, idx) => (
                                <div key={idx} className={`animate-on-scroll delay-${(idx % 3) * 100} bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col group`}>
                                    <div className={`w-14 h-14 ${rep.bg} ${rep.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <rep.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{rep.title}</h3>
                                    <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-1">{rep.desc}</p>
                                    <ul className="space-y-3 mt-auto">
                                        {rep.features.map((f, i) => (
                                            <li key={i} className="flex items-start text-sm text-slate-500">
                                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button 
                                      onClick={() => setIsFormOpen(true)}
                                      className="mt-8 w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-blue-600 hover:border-transparent hover:text-white transition-all shadow-sm hover:shadow-md"
                                    >
                                        Learn More
                                    </button>
                                </div>
                            ))}
                        </div>
                      </div>
                  );
              }

              // Specialized Render for Mortgage (Only when filtered)
              if (isMortgage && categoryFilter) {
                  const mortgageFeatures = [
                      {
                          title: "Lower Monthly Payments",
                          desc: "Lower monthly payments through improved rates and optimized loan terms.",
                          icon: Percent
                      },
                      {
                          title: "Unlock Home Equity",
                          desc: "Unlock home equity for renovations, real estate investment, or debt consolidation.",
                          icon: HomeIcon
                      },
                      {
                          title: "Build Strategic Wealth",
                          desc: "Build a strategic, future-focused mortgage plan that strengthens your wealth over time.",
                          icon: TrendingUp
                      }
                  ];

                  return (
                      <div key={product.title} className="animate-on-scroll">
                          <p className="text-xl text-slate-500 max-w-4xl mx-auto text-center mb-8 leading-relaxed">
                              {product.desc}
                          </p>
                          <p className="text-lg text-slate-600 max-w-4xl mx-auto text-center mb-16 leading-relaxed">
                              Our comprehensive mortgage analysis evaluates your current loan, property equity, financial goals, and available lending programs to identify the most cost-effective path toward financial stability and growth.
                          </p>
                          
                          <div className="max-w-5xl mx-auto space-y-6">
                              {mortgageFeatures.map((feat, idx) => (
                                  <div key={idx} className={`animate-on-scroll delay-${(idx) * 100} bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row items-center gap-8`}>
                                      <div className="w-20 h-20 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                          <feat.icon className="h-10 w-10" />
                                      </div>
                                      <div className="flex-1 text-center md:text-left">
                                          <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
                                          <p className="text-slate-600 text-lg">{feat.desc}</p>
                                      </div>
                                      <div className="hidden md:block">
                                          <CheckCircle className="h-6 w-6 text-green-500" />
                                      </div>
                                  </div>
                              ))}
                          </div>

                          <div className="mt-16 text-center">
                              <button 
                                  onClick={() => setIsFormOpen(true)}
                                  className="px-12 py-5 bg-cyan-600 text-white text-lg font-bold rounded-full shadow-xl shadow-cyan-600/30 hover:bg-cyan-700 hover:scale-105 transition-all"
                              >
                                  Analyze My Mortgage Options
                              </button>
                          </div>
                      </div>
                  );
              }

              // Specialized Render for Investment Advisory (Only when filtered)
              if (isInvestment && categoryFilter) {
                  const investmentProducts = [
                      {
                          title: "Fiduciary Advisory (Series 65)",
                          desc: "Professional financial planning that prioritizes your best interests with transparent, fee-based portfolio management.",
                          icon: Brain,
                          color: "text-emerald-600",
                          bg: "bg-emerald-50",
                          features: ["Personalized retirement income planning", "Portfolio building & long-term investment strategy", "Independent, client-first advisory support"]
                      },
                      {
                          title: "Hybrid Advisory & Brokerage (Series 66)",
                          desc: "Comprehensive wealth management combining brokerage access with fiduciary advisory services for flexible planning.",
                          icon: TrendingUp,
                          color: "text-blue-600",
                          bg: "bg-blue-50",
                          features: ["Access to investment products & securities", "Fee-based advisory + commission options", "Full-service retirement & wealth strategies"]
                      }
                  ];

                  return (
                      <div key={product.title} className="animate-on-scroll">
                        <p className="text-xl text-slate-500 max-w-3xl mx-auto text-center mb-16">{product.desc}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {investmentProducts.map((inv, idx) => (
                                <div key={idx} className={`animate-on-scroll delay-${(idx % 2) * 100} bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col group`}>
                                    <div className={`w-14 h-14 ${inv.bg} ${inv.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <inv.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">{inv.title}</h3>
                                    <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-1">{inv.desc}</p>
                                    <ul className="space-y-3 mt-auto">
                                        {inv.features.map((f, i) => (
                                            <li key={i} className="flex items-start text-sm text-slate-500">
                                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button 
                                      onClick={() => setIsFormOpen(true)}
                                      className="mt-8 w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-emerald-600 hover:border-transparent hover:text-white transition-all shadow-sm hover:shadow-md"
                                    >
                                        Learn More
                                    </button>
                                </div>
                            ))}
                        </div>
                      </div>
                  );
              }

              // DEFAULT GRID RENDER (Used when no filter is active)
              return (
                <div key={product.title} id={sectionId} className={`animate-on-scroll group service-card bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row h-full`}>
                  <div className="relative h-48 sm:h-auto sm:w-1/3 rounded-xl overflow-hidden mb-6 sm:mb-0 sm:mr-6 flex-shrink-0 bg-slate-50">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={product.image}
                      alt={product.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                  </div>
                  
                  <div className="flex flex-col flex-1 py-2">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                            {isRealEstate ? <HomeIcon className="h-5 w-5" /> : 
                             isLife ? <Shield className="h-5 w-5" /> :
                             isAuto ? <Truck className="h-5 w-5" /> :
                             isBusiness ? <Briefcase className="h-5 w-5" /> :
                             isInvestment ? <TrendingUp className="h-5 w-5" /> :
                             isMortgage ? <Landmark className="h-5 w-5" /> :
                             <Key className="h-5 w-5" />}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">{product.title}</h3>
                    </div>
                    
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                        {product.desc}
                    </p>

                    <ul className="space-y-2 mb-8 hidden md:block">
                        {product.features.slice(0, 2).map((feature, i) => (
                        <li key={i} className="flex items-center text-slate-700 text-xs font-medium">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                        </li>
                        ))}
                    </ul>

                    <div className="flex gap-3 mt-auto">
                        {!isInvestment && !isSecurities && (
                            <button 
                                onClick={() => setIsFormOpen(true)}
                                className="flex-1 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                            >
                                {isMortgage ? 'Analyze' : 'Get Quote'}
                            </button>
                        )}
                        <a 
                            href={`tel:${cleanPhone}`}
                            className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            Speak to Agent
                        </a>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20">
               <h3 className="text-xl font-bold text-slate-900">No products found.</h3>
               <Link to="/products" className="text-blue-600 mt-4 inline-block hover:underline">View all products</Link>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 relative scale-100 animate-in fade-in zoom-in duration-300">
                <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full">
                    <X className="h-6 w-6" />
                </button>
                
                {formSubmitted ? (
                    <div className="text-center py-10">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <CheckCircle className="h-10 w-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Sent!</h3>
                        <p className="text-slate-500">An advisor will contact you shortly.</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-[#0B2240] mb-2">Request Information</h3>
                            <p className="text-slate-500">Fill out the form below and we'll get back to you.</p>
                        </div>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Your full name"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                                <input 
                                    type="tel" 
                                    required
                                    className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="(555) 123-4567"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Best Time to Call</label>
                                <select 
                                    className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    value={formData.timeRequested}
                                    onChange={e => setFormData({...formData, timeRequested: e.target.value})}
                                >
                                    <option value="">Anytime</option>
                                    <option value="Morning">Morning (8am - 12pm)</option>
                                    <option value="Afternoon">Afternoon (12pm - 5pm)</option>
                                    <option value="Evening">Evening (5pm - 8pm)</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl transition-all mt-2 transform active:scale-95 duration-200">
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
