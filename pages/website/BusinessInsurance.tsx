import React, { useEffect, useState } from "react";
import {
  Briefcase,
  ShieldAlert,
  Shield,
  Laptop,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TestimonialsSection } from "../../components/TestimonialsSection";
import { SpeakToAdvisorForm } from "../../components/SpeakToAdvisorForm";
import { ProductType } from "../../types";

export const BusinessInsurance: React.FC = () => {
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
      id: "general",
      label:
        "I need basic protection for property damage or injuries at my business",
      suggestion: "general-liability",
      suggestionName: "General Liability Insurance",
    },
    {
      id: "employees",
      label: "I have employees and need to cover workplace injuries",
      suggestion: "workers-comp",
      suggestionName: "Worker's Compensation",
    },
    {
      id: "professional",
      label:
        "I provide professional advice or services and need protection from lawsuits",
      suggestion: "professional-liability",
      suggestionName: "Professional Liability (E&O)",
    },
    {
      id: "cyber",
      label: "I store customer data or rely heavily on computer systems",
      suggestion: "cyber-liability",
      suggestionName: "Cyber Liability Insurance",
    },
  ];

  const insuranceTypes = [
    {
      id: "general-liability",
      title: "General Liability",
      icon: Shield,
      colorClasses: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        shadow: "hover:shadow-blue-900/5",
        iconText: "text-blue-500",
      },
      description:
        "Protects your business from financial loss should you be liable for property damage or personal and advertising injury caused by your services, business operations or your employees.",
      suitableFor:
        "Almost all businesses, especially those that interact with the public, rent commercial space, or work on client properties.",
      budget:
        "Most Affordable. Typically the foundation of any business insurance plan, offering broad coverage at a relatively low cost.",
      benefits: [
        "Covers bodily injury and property damage claims",
        "Includes personal and advertising injury coverage",
        "Helps cover legal defense costs and settlements",
        "Often required by landlords or clients before signing contracts",
      ],
    },
    {
      id: "workers-comp",
      title: "Worker's Compensation",
      icon: Briefcase,
      colorClasses: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        shadow: "hover:shadow-emerald-900/5",
        iconText: "text-emerald-500",
      },
      description:
        "Provides wage replacement and medical benefits to employees injured in the course of employment in exchange for mandatory relinquishment of the employee's right to sue their employer for the tort of negligence.",
      suitableFor:
        "Any business with employees. It is legally required in most states for businesses with one or more employees.",
      budget:
        "Variable. Cost depends heavily on the industry, number of employees, and payroll. Riskier jobs have higher premiums.",
      benefits: [
        "Covers medical expenses for work-related injuries or illnesses",
        "Provides partial wage replacement during recovery",
        "Protects employers from lawsuits related to workplace injuries",
        "Helps cover rehabilitation costs",
      ],
    },
    {
      id: "professional-liability",
      title: "Professional Liability (E&O)",
      icon: ShieldAlert,
      colorClasses: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        shadow: "hover:shadow-amber-900/5",
        iconText: "text-amber-500",
      },
      description:
        "Also known as Errors and Omissions (E&O) insurance, it protects professionals and their companies from bearing the full cost of defending against a negligence claim made by a client, and damages awarded in such a civil lawsuit.",
      suitableFor:
        "Consultants, advisors, brokers, agents, and any business that provides professional services or advice to clients.",
      budget:
        "Moderate. Premiums vary based on the profession and the level of risk associated with the advice or services provided.",
      benefits: [
        "Protects against claims of negligence, errors, or omissions",
        "Covers legal defense costs, even for groundless claims",
        "Helps pay for settlements or judgments awarded to clients",
        "Essential for businesses providing specialized advice or services",
      ],
    },
    {
      id: "cyber-liability",
      title: "Cyber Liability",
      icon: Laptop,
      colorClasses: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        shadow: "hover:shadow-purple-900/5",
        iconText: "text-purple-500",
      },
      description:
        "Protects businesses from internet-based risks, and more generally from risks relating to information technology infrastructure and activities.",
      suitableFor:
        "Any business that stores sensitive customer data (like credit card numbers or personal health information) or relies heavily on computer systems.",
      budget:
        "Variable. Costs are rising due to increased cyber threats, but it is essential for businesses handling sensitive data.",
      benefits: [
        "Covers costs associated with data breaches and cyberattacks",
        "Helps pay for customer notification and credit monitoring services",
        "Covers legal fees and regulatory fines related to data breaches",
        "Provides resources for public relations and crisis management",
      ],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Business & Professional Liability
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Protect your business assets, operations, and professional
            reputation with tailored commercial and E&O packages. Explore our
            solutions to safeguard your enterprise.
          </p>
        </div>
      </div>

      {/* Insurance Types Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {insuranceTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <div
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

      <SpeakToAdvisorForm productType={ProductType.BUSINESS} />

      <TestimonialsSection />
    </div>
  );
};
