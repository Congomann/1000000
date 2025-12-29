
import React from 'react';
import { useData } from '../../context/DataContext';
import { ShieldCheck, FileText, Lock, Scale, Download, AlertTriangle } from 'lucide-react';

export const LegalCompliance: React.FC = () => {
  const { companySettings, user } = useData();

  const PolicyCard = ({ title, icon: Icon, content, description }: any) => (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-8 border-b border-slate-50 bg-slate-50/50">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Icon className="h-5 w-5" /></div>
                <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            </div>
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all" title="Download for Records">
                <Download className="h-4 w-4" />
            </button>
        </div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{description}</p>
      </div>
      <div className="p-8 flex-1">
        <div className="max-h-60 overflow-y-auto pr-4 custom-scrollbar">
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                {content}
            </p>
        </div>
      </div>
      <div className="p-4 bg-blue-50 border-t border-blue-100 flex items-center justify-center">
          <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="h-3 w-3" /> Signed & Verified on {new Date().toLocaleDateString()}
          </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-[#0B2240]">Legal & Compliance</h1>
        <p className="text-slate-500">Corporate policies, advisor agreements, and data privacy standards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PolicyCard 
            title="Terms of Use" 
            icon={FileText} 
            content={companySettings.termsOfUse}
            description="Advisor Portal Governance"
        />
        <PolicyCard 
            title="Solicitor Agreement" 
            icon={Scale} 
            content={companySettings.solicitorAgreement}
            description="Contractual Obligations"
        />
      </div>

      <div className="bg-[#0B2240] rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10"><Lock className="h-40 w-40" /></div>
          <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <ShieldCheck className="h-8 w-8 text-blue-400" /> 
                  Data Collection & Usage Standards
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-3">
                      <h4 className="text-xs font-black text-blue-300 uppercase tracking-widest">Life Insurance Leads</h4>
                      <p className="text-sm text-blue-100 leading-relaxed">
                          All health data (height, weight, medical history) and SSNs collected are protected under HIPAA-aligned security protocols. Data is transmitted directly to carriers for underwriting purposes only.
                      </p>
                  </div>
                  <div className="space-y-3">
                      <h4 className="text-xs font-black text-blue-300 uppercase tracking-widest">Business & Real Estate</h4>
                      <p className="text-sm text-blue-100 leading-relaxed">
                          Proprietary business financials and property specific data are used strictly for risk assessment and policy generation. External sharing is prohibited without explicit client consent.
                      </p>
                  </div>
                  <div className="space-y-3">
                      <h4 className="text-xs font-black text-blue-300 uppercase tracking-widest">Advisor Responsibility</h4>
                      <p className="text-sm text-blue-100 leading-relaxed font-bold italic">
                          "Advisors are prohibited from exporting client data to non-approved storage devices or personal email accounts."
                      </p>
                      <div className="flex items-center gap-2 text-xs text-blue-400 font-bold uppercase pt-2">
                          <AlertTriangle className="h-4 w-4" /> Compliance Violation Warning Active
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
