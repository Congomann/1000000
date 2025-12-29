
import React, { useEffect } from 'react';
import { Shield, Lock, Eye, FileCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
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
          <h1 className="text-4xl font-black text-[#0B2240] tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-slate-500 font-medium">Last Updated: October 2023</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Shield className="h-6 w-6" /></div>
              <h2 className="text-2xl font-bold text-slate-900 m-0">Introduction</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              New Holland Financial Group ("NHFG", "we", "us", or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy describes how we collect, use, and safeguard the personal data provided through our website and agent portal, particularly concerning our life insurance, real estate, and business insurance services.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Eye className="h-6 w-6" /></div>
              <h2 className="text-2xl font-bold text-slate-900 m-0">Information We Collect</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              Due to the nature of our financial services, we collect highly sensitive information to provide accurate quotes and underwriting services:
            </p>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                <span><strong>Personal Identification:</strong> Name, Social Security Number (SSN), Date of Birth, Driver's License, and Address.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                <span><strong>Health Data (Life Insurance):</strong> Medical history, smoking status, height, weight, and lifestyle details for underwriting.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                <span><strong>Financial Information:</strong> Bank account details, annual income, net worth, and assets under management.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                <span><strong>Property & Business Data:</strong> Real estate property values, business revenues, employee counts, and fleet details.</span>
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Lock className="h-6 w-6" /></div>
              <h2 className="text-2xl font-bold text-slate-900 m-0">How We Protect Your Data</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              NHFG utilizes industry-standard encryption (AES-256) for data at rest and TLS for data in transit. Access to sensitive data within our agent portal is restricted to licensed advisors and authorized compliance staff. We conduct regular security audits and comply with HIPAA and GLBA guidelines where applicable.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileCheck className="h-6 w-6" /></div>
              <h2 className="text-2xl font-bold text-slate-900 m-0">Data Sharing</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              We do not sell your personal information. Your data is shared exclusively with insurance carriers, real estate partners, and regulatory bodies for the sole purpose of fulfilling your request for a quote, policy issuance, or transaction closing.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
