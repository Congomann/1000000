import React, { useEffect, useState } from "react";
import {
  Home,
  DollarSign,
  Percent,
  TrendingDown,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export const Mortgage: React.FC = () => {
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
      id: "strong-credit",
      label: "I have strong credit and a good down payment",
      suggestion: "conventional",
      suggestionName: "Conventional Loan",
    },
    {
      id: "first-time",
      label:
        "I am a first-time buyer or have a lower credit score/down payment",
      suggestion: "fha",
      suggestionName: "FHA Loan",
    },
    {
      id: "cash-out",
      label: "I want to tap into my home equity for cash",
      suggestion: "cash-out-refinance",
      suggestionName: "Cash-Out Refinance",
    },
    {
      id: "lower-rate",
      label: "I want to lower my interest rate or change my loan term",
      suggestion: "rate-term-refinance",
      suggestionName: "Rate-and-Term Refinance",
    },
  ];

  const mortgageTypes = [
    {
      id: "conventional",
      title: "Conventional Loans",
      icon: Home,
      colorClasses: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        shadow: "hover:shadow-blue-900/5",
        iconText: "text-blue-500",
      },
      description:
        "Traditional mortgage loans not backed by a government agency. They typically offer competitive interest rates and flexible terms.",
      suitableFor:
        "Borrowers with strong credit scores, stable income, and the ability to make a down payment (often 3% to 20%).",
      budget:
        "Standard Cost. Requires good credit for the best rates. Down payments can be as low as 3%, but putting down 20% avoids Private Mortgage Insurance (PMI).",
      benefits: [
        "Competitive interest rates for well-qualified buyers",
        "Flexible terms (e.g., 15, 20, or 30 years)",
        "Can be used for primary residences, second homes, or investment properties",
        "Private Mortgage Insurance (PMI) can be canceled once 20% equity is reached",
      ],
    },
    {
      id: "fha",
      title: "FHA Loans",
      icon: Percent,
      colorClasses: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        shadow: "hover:shadow-emerald-900/5",
        iconText: "text-emerald-500",
      },
      description:
        "Mortgages backed by the Federal Housing Administration, designed to help low-to-moderate-income borrowers purchase a home.",
      suitableFor:
        "First-time homebuyers, individuals with lower credit scores, or those with limited funds for a down payment.",
      budget:
        "More Accessible. Lower minimum down payment (3.5%) and more lenient credit requirements, but requires upfront and annual mortgage insurance premiums (MIP).",
      benefits: [
        "Lower minimum down payment requirement (as low as 3.5%)",
        "More lenient credit score requirements",
        "Can be used for 1-4 unit properties (if one unit is owner-occupied)",
        "Assumable loans (can be transferred to a new buyer)",
      ],
    },
    {
      id: "cash-out-refinance",
      title: "Cash-Out Refinance",
      icon: DollarSign,
      colorClasses: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        shadow: "hover:shadow-amber-900/5",
        iconText: "text-amber-500",
      },
      description:
        "A refinancing option that replaces your current mortgage with a new, larger loan, allowing you to access the difference in cash.",
      suitableFor:
        "Homeowners with significant equity who need funds for home improvements, debt consolidation, or other major expenses.",
      budget:
        "Variable. Taps into existing equity. Rates are typically slightly higher than rate-and-term refinances, and closing costs apply.",
      benefits: [
        "Access to a lump sum of cash based on your home's equity",
        "Interest rates are typically lower than personal loans or credit cards",
        "Can be used for any purpose (renovations, education, debt payoff)",
        "Potential tax deductions on interest (if used for home improvements)",
      ],
    },
    {
      id: "rate-term-refinance",
      title: "Rate-and-Term Refinance",
      icon: TrendingDown,
      colorClasses: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        shadow: "hover:shadow-purple-900/5",
        iconText: "text-purple-500",
      },
      description:
        "Refinancing to change the interest rate, the loan term, or both, without advancing any new money.",
      suitableFor:
        "Homeowners looking to lower their monthly payments, pay off their loan faster, or switch from an adjustable-rate to a fixed-rate mortgage.",
      budget:
        "Cost-Saving Focus. Involves closing costs upfront, but the goal is long-term savings through a lower interest rate or shorter loan term.",
      benefits: [
        "Lower monthly payments by securing a lower interest rate",
        "Pay off your mortgage sooner by switching to a shorter term (e.g., 30-year to 15-year)",
        "Switch from an Adjustable-Rate Mortgage (ARM) to a stable Fixed-Rate Mortgage",
        "Build equity faster with a shorter loan term",
      ],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Mortgage Lending & Refinance
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Transform your mortgage into a strategic financial tool with
            personalized lending and refinance solutions. Explore our options to
            find the perfect fit for your homeownership goals.
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

      {/* Mortgage Types Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mortgageTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <div
                id={type.id}
                key={type.id}
                className={`bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl ${type.colorClasses.shadow} transition-all duration-300 ${index === mortgageTypes.length - 1 && mortgageTypes.length % 2 !== 0 ? "lg:col-span-2 lg:max-w-3xl lg:mx-auto" : ""}`}
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
    </div>
  );
};
