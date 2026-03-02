import React, { useEffect, useState } from "react";
import {
  Truck,
  Car,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

export const AutoInsurance: React.FC = () => {
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
      id: "personal",
      label: "I need coverage for my personal vehicle",
      suggestion: "personal-auto",
      suggestionName: "Personal Auto Insurance",
    },
    {
      id: "business",
      label: "I need to insure vehicles used for my business",
      suggestion: "commercial-fleet",
      suggestionName: "Commercial Fleet Insurance",
    },
    {
      id: "liability",
      label: "I just need the minimum legal coverage to drive",
      suggestion: "liability-coverage",
      suggestionName: "Liability Coverage",
    },
    {
      id: "full-coverage",
      label: "I want my own car protected from accidents, theft, and weather",
      suggestion: "collision-comprehensive",
      suggestionName: "Collision & Comprehensive",
    },
  ];

  const insuranceTypes = [
    {
      id: "personal-auto",
      title: "Personal Auto",
      icon: Car,
      colorClasses: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        shadow: "hover:shadow-blue-900/5",
        iconText: "text-blue-500",
      },
      description:
        "Provides property, liability, and medical coverage for personal vehicles. It protects you against financial loss if you have an accident.",
      suitableFor:
        "Individuals and families who own or lease vehicles for personal use, commuting, or running errands.",
      budget:
        "Variable. Depends on the driver's age, driving history, vehicle type, and chosen coverage limits.",
      benefits: [
        "Covers damage to your vehicle from accidents, theft, or natural disasters",
        "Pays for bodily injury and property damage you cause to others",
        "Helps cover medical expenses for you and your passengers",
        "Often required by law in most states",
      ],
    },
    {
      id: "commercial-fleet",
      title: "Commercial Fleet",
      icon: Truck,
      colorClasses: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        shadow: "hover:shadow-emerald-900/5",
        iconText: "text-emerald-500",
      },
      description:
        "Designed to cover a group of vehicles owned or leased by a business. It provides liability and physical damage protection for vehicles used for business purposes.",
      suitableFor:
        "Businesses that rely on multiple vehicles for operations, such as delivery services, contractors, or sales teams.",
      budget:
        "Higher Cost. Commercial policies are generally more expensive due to higher liability limits and increased driving time.",
      benefits: [
        "Streamlined management of multiple vehicles under one policy",
        "Higher liability limits to protect business assets",
        "Coverage for specialized vehicles or equipment",
        "Protects against claims arising from employee accidents while driving for work",
      ],
    },
    {
      id: "liability-coverage",
      title: "Liability Coverage",
      icon: ShieldAlert,
      colorClasses: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        shadow: "hover:shadow-amber-900/5",
        iconText: "text-amber-500",
      },
      description:
        "The foundation of any auto insurance policy. It covers the costs associated with injuries or property damage you cause to others in an at-fault accident.",
      suitableFor:
        "Every driver. It is the minimum legal requirement in almost all states to operate a vehicle on public roads.",
      budget:
        "Most Affordable. This is the cheapest option as it only covers damage to others, not your own vehicle.",
      benefits: [
        "Fulfills state legal requirements for driving",
        "Protects your personal assets from lawsuits following an accident",
        "Covers the other party's medical bills and vehicle repair costs",
        "Provides legal defense if you are sued over an accident",
      ],
    },
    {
      id: "collision-comprehensive",
      title: "Collision & Comprehensive",
      icon: ShieldCheck,
      colorClasses: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        shadow: "hover:shadow-purple-900/5",
        iconText: "text-purple-500",
      },
      description:
        "Physical damage coverage for your own vehicle. Collision covers damage from hitting another vehicle or object. Comprehensive covers damage from non-collision events like theft, vandalism, or weather.",
      suitableFor:
        "Drivers with newer or more valuable vehicles, or those who have a loan or lease on their car (as lenders typically require it).",
      budget:
        "Moderate to High. Adds significant cost to a liability-only policy, but provides essential protection for your asset.",
      benefits: [
        "Pays to repair or replace your vehicle regardless of fault (Collision)",
        "Protects against unpredictable events like hail, fire, or animal strikes (Comprehensive)",
        "Provides peace of mind knowing your asset is protected",
        "Essential for vehicles that are financed or leased",
      ],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Auto Insurance Solutions
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Comprehensive auto coverage for personal vehicles and commercial
            fleets to keep you moving safely and securely.
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

      {/* Insurance Types Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {insuranceTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <div
                id={type.id}
                key={type.id}
                className={`bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl ${type.colorClasses.shadow} transition-all duration-300 ${index === insuranceTypes.length - 1 && insuranceTypes.length % 2 !== 0 ? "lg:col-span-2 lg:max-w-3xl lg:mx-auto" : ""}`}
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
