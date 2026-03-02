import React from "react";
import { X, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SecuritiesRecommenderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecuritiesRecommenderModal: React.FC<
  SecuritiesRecommenderModalProps
> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const customerNeeds = [
    {
      id: "licensing",
      label: "I need help getting or maintaining my securities licenses",
      suggestion: "series-support",
    },
    {
      id: "fiduciary",
      label: "I want unbiased, objective financial advice for my retirement",
      suggestion: "fiduciary-planning",
    },
    {
      id: "portfolio",
      label: "I want a professional to manage my investment portfolio",
      suggestion: "portfolio-management",
    },
    {
      id: "compliance",
      label: "I need to ensure my wealth management practices are compliant",
      suggestion: "wealth-management",
    },
  ];

  const handleSelect = (suggestion: string) => {
    onClose();
    navigate(`/securities#${suggestion}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Find Your Perfect Match
              </h2>
              <p className="text-slate-500 mt-1">
                Select your primary goal to see our recommendation.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {customerNeeds.map((need) => (
              <button
                key={need.id}
                onClick={() => handleSelect(need.suggestion)}
                className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 group flex items-center justify-between"
              >
                <span className="font-medium text-slate-700 group-hover:text-blue-900 pr-4">
                  {need.label}
                </span>
                <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-blue-500 flex-shrink-0 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
