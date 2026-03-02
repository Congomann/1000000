import React, { useEffect, useState } from "react";
import {
  Shield,
  Heart,
  Coins,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export const LifeInsurance: React.FC = () => {
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
      id: "temporary",
      label: "Cover temporary debts (e.g., mortgage, kids' education)",
      suggestion: "term-life",
      suggestionName: "Term Life Insurance",
    },
    {
      id: "lifelong-fixed",
      label: "Lifelong protection with predictable, fixed premiums",
      suggestion: "whole-life",
      suggestionName: "Whole Life Insurance",
    },
    {
      id: "flexible",
      label: "Flexible lifelong coverage that adapts to my changing income",
      suggestion: "universal-life",
      suggestionName: "Universal Life Insurance",
    },
    {
      id: "final-expense",
      label:
        "Cover only death expenses (funeral, medical bills) so my family isn't burdened",
      suggestion: "final-expense",
      suggestionName: "Final Expense Insurance",
    },
    {
      id: "growth",
      label:
        "Lifelong protection with the potential for market-linked cash value growth",
      suggestion: "indexed-universal-life",
      suggestionName: "Indexed Universal Life (IUL)",
    },
  ];

  const insuranceTypes = [
    {
      id: "term-life",
      title: "Term Life",
      icon: Shield,
      colorClasses: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        shadow: "hover:shadow-blue-900/5",
        iconText: "text-blue-500",
      },
      description:
        "Affordable, straightforward protection for a specific period (e.g., 10, 20, or 30 years). Ideal for covering temporary needs like a mortgage or children's education.",
      suitableFor:
        "Young families, individuals with temporary large debts (like a mortgage), or those needing maximum coverage for the lowest cost during their working years.",
      budget:
        "Most Affordable (Cheap) - Provides the highest death benefit for the lowest premium. Great for tight budgets.",
      benefits: [
        "Lower initial premiums compared to permanent life insurance",
        "Guaranteed death benefit if you pass away during the term",
        "Premiums typically remain level for the duration of the term",
        "Can often be converted to a permanent policy later",
      ],
    },
    {
      id: "whole-life",
      title: "Whole Life",
      icon: Heart,
      colorClasses: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        shadow: "hover:shadow-emerald-900/5",
        iconText: "text-emerald-500",
      },
      description:
        "Permanent coverage that lasts your entire life, as long as premiums are paid. It builds cash value over time that you can borrow against.",
      suitableFor:
        "Individuals seeking lifelong guarantees, predictable fixed premiums, and a guaranteed cash value component, or those wanting to leave a guaranteed legacy.",
      budget:
        "Higher Cost - Premiums are significantly higher than term life, but they never increase, and the policy builds guaranteed cash value.",
      benefits: [
        "Lifelong protection with a guaranteed death benefit",
        "Fixed premiums that never increase",
        "Guaranteed cash value accumulation over time",
        "Potential to earn dividends (with participating policies)",
      ],
    },
    {
      id: "universal-life",
      title: "Universal Life",
      icon: Coins,
      colorClasses: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        shadow: "hover:shadow-amber-900/5",
        iconText: "text-amber-500",
      },
      description:
        "Flexible permanent life insurance that allows you to adjust your premium payments and death benefit as your needs change over time.",
      suitableFor:
        "People who want lifelong coverage but need flexibility in their premium payments and death benefit as their financial situation changes over time.",
      budget:
        "Moderate to High Cost - Generally more affordable than whole life, but more expensive than term. Offers flexibility to adjust premiums if your budget changes.",
      benefits: [
        "Flexible premiums and adjustable death benefit",
        "Cash value grows based on current interest rates",
        "Ability to use cash value to pay premiums",
        "Permanent coverage with more flexibility than whole life",
      ],
    },
    {
      id: "final-expense",
      title: "Final Expense",
      icon: CheckCircle,
      colorClasses: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        shadow: "hover:shadow-purple-900/5",
        iconText: "text-purple-500",
      },
      description:
        "A smaller permanent life insurance policy designed specifically to cover end-of-life expenses, such as funeral costs and medical bills.",
      suitableFor:
        "Seniors or those whose primary concern is ensuring their funeral, burial, and immediate end-of-life medical expenses are covered without burdening their family.",
      budget:
        "Very Affordable - Because the coverage amount is small (typically $5,000 - $25,000), the monthly premiums are very low and fit easily into fixed incomes.",
      benefits: [
        "Easy to qualify for, often with no medical exam required",
        "Affordable premiums for older adults",
        "Provides peace of mind for your loved ones",
        "Guaranteed death benefit to cover specific final costs",
      ],
    },
    {
      id: "indexed-universal-life",
      title: "Indexed Universal Life (IUL)",
      icon: TrendingUp,
      colorClasses: {
        bg: "bg-cyan-50",
        text: "text-cyan-600",
        shadow: "hover:shadow-cyan-900/5",
        iconText: "text-cyan-500",
      },
      description:
        "A type of universal life insurance that allows you to allocate cash value amounts to either a fixed account or an equity index account.",
      suitableFor:
        "Individuals looking for permanent life insurance with the potential for higher cash value growth linked to market indexes, while protecting against market downturns.",
      budget:
        "Higher Cost - Designed for those with disposable income who want to use life insurance as a supplemental tax-advantaged wealth-building tool.",
      benefits: [
        "Upside potential linked to a market index (like the S&P 500)",
        "Downside protection (0% floor) protects against market losses",
        "Tax-advantaged cash value growth",
        "Flexible premiums and death benefit",
      ],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Life Insurance Solutions
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Protect your family's future and build wealth with our comprehensive
            range of life insurance products. Explore the options below to find
            the right fit for your needs.
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

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-[#0B2240] rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              Not sure which policy is right for you?
            </h2>
            <p className="text-blue-200 text-lg mb-10 max-w-2xl mx-auto">
              Our expert advisors can help you navigate these options and design
              a plan tailored to your family's unique financial goals.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-[#0B2240] bg-white hover:bg-blue-50 transition-colors shadow-lg"
            >
              Speak with an Advisor <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
