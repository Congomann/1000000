import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Shield,
  TrendingUp,
  Briefcase,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { TestimonialsSection } from "../../components/TestimonialsSection";
import { SpeakToAdvisorForm } from "../../components/SpeakToAdvisorForm";
import { ProductType } from "../../types";

export const Securities: React.FC = () => {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);

  const customerNeeds = [
    {
      id: "licensing",
      label: "I need help getting or maintaining my securities licenses",
      suggestion: "series-support",
      suggestionName: "Series 6, 7, 63 Support",
    },
    {
      id: "fiduciary",
      label: "I want unbiased, objective financial advice for my retirement",
      suggestion: "fiduciary-planning",
      suggestionName: "Fiduciary Planning",
    },
    {
      id: "portfolio",
      label: "I want a professional to manage my investment portfolio",
      suggestion: "portfolio-management",
      suggestionName: "Portfolio Management",
    },
    {
      id: "compliance",
      label: "I need to ensure my wealth management practices are compliant",
      suggestion: "wealth-management",
      suggestionName: "Wealth Management Compliance",
    },
  ];

  const serviceTypes = [
    {
      id: "series-support",
      title: "Series 6, 7, 63 Support",
      icon: Briefcase,
      colorClasses: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        shadow: "hover:shadow-blue-900/5",
        iconText: "text-blue-500",
      },
      description:
        "Comprehensive support and guidance for professionals seeking or maintaining their Series 6, 7, and 63 securities licenses.",
      suitableFor:
        "Financial advisors, brokers, and professionals looking to expand their qualifications and legally sell securities products.",
      budget:
        "Variable. Costs depend on the level of support needed, study materials, and exam fees.",
      benefits: [
        "Guidance on exam preparation and study materials",
        "Assistance with registration and compliance requirements",
        "Ongoing support for maintaining active licenses",
        "Access to a network of experienced professionals",
      ],
    },
    {
      id: "fiduciary-planning",
      title: "Fiduciary Planning",
      icon: Shield,
      colorClasses: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        shadow: "hover:shadow-emerald-900/5",
        iconText: "text-emerald-500",
      },
      description:
        "Retirement and financial planning strategies designed with a fiduciary standard, meaning we are legally obligated to act in your best interest.",
      suitableFor:
        "Individuals and families seeking unbiased, objective financial advice for long-term goals, especially retirement.",
      budget:
        "Fee-Based. Typically charged as a flat fee, hourly rate, or a percentage of assets under management (AUM).",
      benefits: [
        "Advice that prioritizes your financial well-being over commissions",
        "Transparent fee structures and conflict-of-interest disclosures",
        "Holistic financial planning tailored to your specific needs",
        "Peace of mind knowing your advisor is legally bound to serve you",
      ],
    },
    {
      id: "portfolio-management",
      title: "Portfolio Management",
      icon: TrendingUp,
      colorClasses: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        shadow: "hover:shadow-amber-900/5",
        iconText: "text-amber-500",
      },
      description:
        "Professional management of your investment portfolio, including asset allocation, security selection, and ongoing monitoring to align with your risk tolerance and goals.",
      suitableFor:
        "Investors who want professional oversight of their assets, lack the time or expertise to manage their own investments, or seek diversified strategies.",
      budget:
        "AUM Fee. Usually charged as a percentage of the total assets being managed (e.g., 1% annually).",
      benefits: [
        "Customized investment strategies based on your risk profile",
        "Active monitoring and rebalancing of your portfolio",
        "Access to institutional-quality investment options",
        "Regular performance reporting and strategy reviews",
      ],
    },
    {
      id: "wealth-management",
      title: "Wealth Management Compliance",
      icon: BarChart3,
      colorClasses: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        shadow: "hover:shadow-purple-900/5",
        iconText: "text-purple-500",
      },
      description:
        "Ensuring that all wealth management activities adhere to the complex web of financial regulations and industry standards.",
      suitableFor:
        "High-net-worth individuals, family offices, and institutions that require rigorous oversight and adherence to regulatory frameworks.",
      budget:
        "Custom Pricing. Depends on the complexity of the portfolio and the specific regulatory requirements involved.",
      benefits: [
        "Protection against regulatory fines and legal issues",
        "Implementation of robust compliance programs and policies",
        "Regular audits and reviews of investment practices",
        "Confidence that your wealth is managed ethically and legally",
      ],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Securities & Investment Advisory
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Navigating financial securities, series licensing, and providing
            fiduciary retirement planning strategies to secure your financial
            future.
          </p>
        </div>
      </div>

      {/* Interactive Recommender */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Find Your Perfect Match
              </h2>
              <p className="text-slate-500">
                Select your primary goal to see our recommendation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customerNeeds.map((need) => (
              <button
                key={need.id}
                onClick={() => setSelectedNeed(need.id)}
                className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                  selectedNeed === need.id
                    ? "border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10"
                    : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-medium ${selectedNeed === need.id ? "text-blue-900" : "text-slate-700"}`}
                  >
                    {need.label}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ml-4 flex items-center justify-center ${
                      selectedNeed === need.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-slate-300"
                    }`}
                  >
                    {selectedNeed === need.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selectedNeed && (
            <div className="mt-8 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">
                Our Recommendation
              </p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-xl font-black text-emerald-900">
                  Based on your needs, we suggest{" "}
                  <span className="text-emerald-600">
                    {
                      customerNeeds.find((n) => n.id === selectedNeed)
                        ?.suggestionName
                    }
                  </span>
                  .
                </p>
                <button
                  onClick={() => {
                    const suggestionId = customerNeeds.find(
                      (n) => n.id === selectedNeed,
                    )?.suggestion;
                    document
                      .getElementById(suggestionId || "")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Services Types Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {serviceTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <div
                id={type.id}
                key={type.id}
                className={`bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl ${type.colorClasses.shadow} transition-all duration-300 ${index === serviceTypes.length - 1 && serviceTypes.length % 2 !== 0 ? "lg:col-span-2 lg:max-w-3xl lg:mx-auto" : ""}`}
              >
                <div className="flex items-start gap-6">
                  <div
                    className={`w-16 h-16 rounded-2xl ${type.colorClasses.bg} ${type.colorClasses.text} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                      {type.title}
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      {type.description}
                    </p>
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-700 font-medium mb-3">
                        <span className="font-bold text-slate-900 uppercase tracking-wider text-xs mr-2 block mb-1">
                          Best Suited For:
                        </span>
                        {type.suitableFor}
                      </p>
                      <p className="text-sm text-slate-700 font-medium">
                        <span className="font-bold text-slate-900 uppercase tracking-wider text-xs mr-2 block mb-1">
                          Budget & Cost:
                        </span>
                        {type.budget}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-100 p-6">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                        Key Benefits
                      </h3>
                      <ul className="space-y-3">
                        {type.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle
                              className={`w-5 h-5 ${type.colorClasses.iconText} flex-shrink-0 mt-0.5`}
                            />
                            <span className="text-slate-700 text-sm font-medium leading-relaxed">
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SpeakToAdvisorForm productType={ProductType.SECURITIES} />

      <TestimonialsSection />
    </div>
  );
};
