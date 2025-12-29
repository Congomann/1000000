
import React, { useEffect } from 'react';
import { FileText, ArrowLeft, Scale, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsOfUse: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-40 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center text-blue-600 font-bold text-sm mb-8 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl font-black text-[#0B2240] tracking-tight mb-4">Terms of Use</h1>
          <p className="text-slate-500 font-medium">Last Updated: October 2023</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Scale className="h-6 w-6" /></div>
              <h2 className="text-2xl font-bold text-slate-900 m-0">Agreement to Terms</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              By accessing or using the New Holland Financial Group website or agent portal, you agree to be bound by these Terms of Use and our Privacy Policy. These terms apply to all visitors, clients, and agents who access or use our services.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><AlertCircle className="h-6 w-6" /></div>
              <h2 className="text-2xl font-bold text-slate-900 m-0">No Financial Advice</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              The content provided on this website is for informational purposes only and does not constitute professional financial, investment, or legal advice. All insurance products and real estate transactions are subject to specific terms, conditions, and eligibility requirements set forth by our partners and carriers.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText className="h-6 w-6" /></div>
              <h2 className="text-2xl font-bold text-slate-900 m-0">Prohibited Conduct</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              When using our portal or website, you agree not to:
            </p>
            <ul className="space-y-4 text-slate-600">
              <li>Submit false or misleading information regarding health, financials, or property.</li>
              <li>Attempt to gain unauthorized access to our agent terminal or client databases.</li>
              <li>Use any data mining or automated lead extraction tools.</li>
              <li>Violate any local, state, or federal financial regulations.</li>
            </ul>
          </section>

          <section>
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200">
              <h3 className="text-lg font-bold text-[#0B2240] mb-4">Agent Compliance</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Licensed advisors are additionally bound by the Solicitor & Independent Contractor Agreement accepted during onboarding. Misuse of the agent portal or client data will result in immediate termination of terminal access and reporting to relevant licensing authorities.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
