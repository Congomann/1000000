
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';
import { Check, ChevronRight, FileText, ShieldCheck, Settings, Briefcase, Key, CheckCircle2, User, Landmark, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 'welcome', label: 'Welcome', sub: "Let's get started!", icon: User },
  { id: 'terms', label: 'Terms Of Use', sub: 'Knock out the formalities', icon: FileText },
  { id: 'agreement', label: 'Agreement', sub: 'Finalize your acceptance', icon: ShieldCheck },
  { id: 'config', label: 'Platform Configuration', sub: 'Embrace the evolution of your business', icon: Settings },
  { id: 'contracting', label: 'Carrier Contracting', sub: 'Get ready to write your first case', icon: Briefcase },
  { id: 'portal', label: 'Portal Access', sub: 'Enter the NHFG Workspace', icon: Key },
];

export const AdvisorOnboardingFlow: React.FC = () => {
  const { user, completeOnboarding, companySettings } = useData();
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(1); // Start at Terms of Use as per typical workflow
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [agreementAgreed, setAgreementAgreed] = useState(false);

  const handleNext = () => {
    if (currentStepIndex === STEPS.length - 1) {
      completeOnboarding();
      navigate('/crm/dashboard');
      return;
    }
    setCurrentStepIndex(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  };

  const currentStep = STEPS[currentStepIndex];

  // Logic to determine if "Next" should be disabled
  const isNextDisabled = () => {
    if (currentStepIndex === 1 && !termsAgreed) return true;
    if (currentStepIndex === 2 && !agreementAgreed) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden">
      {/* 1. TOP HEADER */}
      <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                {/* Back Card */}
                <rect x="5" y="15" width="90" height="60" rx="12" fill="#F59E0B" />
                {/* Front Card */}
                <rect x="10" y="35" width="80" height="55" rx="12" fill="#FCD34D" />
                {/* Chip */}
                <rect x="42" y="52" width="16" height="22" rx="4" fill="#B45309" fillOpacity="0.25" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl text-[#0B2240] tracking-tight leading-none">NEW HOLLAND</span>
            <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">FINANCIAL GROUP</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-800 leading-none uppercase tracking-wider">New Approved Advisor</p>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">{user?.name}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-200 overflow-hidden flex items-center justify-center font-black text-blue-600 shadow-sm">
            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name.charAt(0)}
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT STEPPER */}
        <aside className="w-80 bg-white border-r border-slate-200 py-12 px-10 flex flex-col gap-10 overflow-y-auto no-scrollbar shrink-0">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;
            return (
              <div key={step.id} className="flex gap-5 relative group">
                {/* Vertical Line Connector */}
                {idx !== STEPS.length - 1 && (
                    <div className={`absolute left-[15px] top-[30px] bottom-[-40px] w-0.5 transition-colors ${isCompleted ? 'bg-blue-600' : 'bg-slate-100 group-hover:bg-slate-200'}`}></div>
                )}
                
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  isCompleted ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' :
                  isActive ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50' :
                  'bg-white border-slate-200 text-slate-300'
                }`}>
                  {isCompleted ? <Check className="h-4 w-4" /> : <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-600' : 'bg-slate-200'}`} />}
                </div>

                <div className="flex flex-col">
                  <span className={`text-sm font-black transition-colors ${isActive ? 'text-[#0B2240]' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 leading-tight mt-1">
                    {step.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 flex flex-col items-center justify-start p-6 lg:p-12 xl:p-20 overflow-y-auto no-scrollbar bg-slate-50">
          
          <div className="w-full max-w-4xl flex flex-col h-full">
            
            {/* CONTENT CARD */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-200 flex flex-col overflow-hidden min-h-[600px] transition-all">
              
              {/* CONTENT HEADER */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{currentStep.label}</h2>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Step {currentStepIndex + 1} of {STEPS.length}</span>
              </div>

              {/* DYNAMIC CONTENT BODY */}
              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                
                {/* STEP 0: Welcome */}
                {currentStepIndex === 0 && (
                    <div className="text-center animate-fade-in flex flex-col items-center justify-center h-full py-20">
                        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
                            <User className="h-10 w-10" />
                        </div>
                        <h1 className="text-4xl font-black text-[#0B2240] tracking-tight mb-4">Welcome to the Team!</h1>
                        <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                            We are thrilled to have you onboard New Holland Financial Group. Before you access your advisor terminal, please complete these mandatory onboarding steps.
                        </p>
                    </div>
                )}

                {/* STEP 1: Terms of Use */}
                {currentStepIndex === 1 && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 shadow-sm"><FileText className="h-6 w-6"/></div>
                        <div>
                            <h1 className="text-xl font-black text-[#0B2240] uppercase tracking-widest">NHFG Terms of Use</h1>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Legal Requirement</p>
                        </div>
                    </div>
                    <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed font-medium space-y-6 whitespace-pre-wrap">
                      {companySettings.termsOfUse}
                    </div>
                  </div>
                )}

                {/* STEP 2: Agreement */}
                {currentStepIndex === 2 && (
                    <div className="animate-fade-in">
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
                            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shadow-sm"><ShieldAlert className="h-6 w-6"/></div>
                            <div>
                                <h1 className="text-xl font-black text-[#0B2240] uppercase tracking-widest">Solicitor Agreement</h1>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Independent Contractor Provisions</p>
                            </div>
                        </div>
                        <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed font-medium space-y-6 whitespace-pre-wrap">
                            {companySettings.solicitorAgreement}
                        </div>
                    </div>
                )}
                
                {/* STEP 3: Platform Config */}
                {currentStepIndex === 3 && (
                    <div className="animate-fade-in space-y-10">
                        <div className="flex items-start gap-5">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-sm"><Settings className="h-8 w-8" /></div>
                            <div>
                                <h3 className="text-2xl font-black text-[#0B2240] tracking-tight">Your NHFG Experience</h3>
                                <p className="text-slate-500 font-medium mt-1">Configuring your personal workspace and advisor profile.</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-200 shadow-inner space-y-8">
                             <div className="flex items-center gap-5">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm border border-green-200">
                                    <Check className="h-4 w-4" />
                                </div>
                                <span className="font-bold text-slate-700 text-lg">Internal CRM Access Provisioned</span>
                             </div>
                             <div className="flex items-center gap-5">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm border border-green-200">
                                    <Check className="h-4 w-4" />
                                </div>
                                <span className="font-bold text-slate-700 text-lg">NHFG Email Alias Created</span>
                             </div>
                             <div className="flex items-center gap-5">
                                <div className="h-8 w-8 rounded-full border-2 border-blue-600 flex items-center justify-center shadow-sm">
                                    <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                                </div>
                                <span className="font-bold text-blue-600 text-lg">Setting up Public Microsite...</span>
                             </div>
                        </div>
                    </div>
                )}

                {/* Final Steps */}
                {currentStepIndex > 3 && (
                    <div className="text-center animate-fade-in py-20">
                        <div className="relative inline-block mb-10">
                            <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse"></div>
                            <CheckCircle2 className="h-24 w-24 text-green-500 relative" />
                        </div>
                        <h2 className="text-4xl font-black text-[#0B2240] tracking-tight">All Systems Green</h2>
                        <p className="text-lg text-slate-500 mt-4 max-w-sm mx-auto font-medium">Your advisor profile is prepared and all carrier contracts are queued for your first deployment.</p>
                    </div>
                )}
              </div>

              {/* CHECKBOX Acknowledge Footers */}
              {currentStepIndex === 1 && (
                <div className="p-8 bg-slate-50 border-t border-slate-200">
                  <label className="flex items-center gap-5 cursor-pointer group">
                    <div 
                        onClick={() => setTermsAgreed(!termsAgreed)}
                        className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${termsAgreed ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-100' : 'bg-white border-slate-300 group-hover:border-blue-400 group-hover:bg-slate-50 shadow-inner'}`}
                    >
                      {termsAgreed && <Check className="h-5 w-5 text-white" />}
                    </div>
                    <span className="text-sm font-black text-slate-700 select-none uppercase tracking-wide">
                      I have read and agree to the Terms of Use and acknowledge I am bound by the same.
                    </span>
                  </label>
                </div>
              )}

              {currentStepIndex === 2 && (
                <div className="p-8 bg-slate-50 border-t border-slate-200">
                  <label className="flex items-center gap-5 cursor-pointer group">
                    <div 
                        onClick={() => setAgreementAgreed(!agreementAgreed)}
                        className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${agreementAgreed ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-100' : 'bg-white border-slate-300 group-hover:border-blue-400 group-hover:bg-slate-50 shadow-inner'}`}
                    >
                      {agreementAgreed && <Check className="h-5 w-5 text-white" />}
                    </div>
                    <span className="text-sm font-black text-slate-700 select-none uppercase tracking-wide">
                      I accept the terms of the Solicitor & Independent Contractor Agreement.
                    </span>
                  </label>
                </div>
              )}

              {/* NAVIGATION FOOTER */}
              <div className="p-8 border-t border-slate-100 flex justify-between items-center bg-white">
                <button 
                  onClick={handleBack}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-2 px-8 py-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" /> Previous
                </button>
                
                <button 
                  onClick={handleNext}
                  disabled={isNextDisabled()}
                  className={`flex items-center gap-2 px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all ${
                    isNextDisabled() 
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200' 
                    : 'bg-[#0B2240] text-white shadow-2xl shadow-blue-900/20 hover:bg-blue-900 hover:scale-105 active:scale-95 transform'
                  }`}
                >
                  {currentStepIndex === STEPS.length - 1 ? 'Go to Portal' : 'Next Step'} <ChevronRight className="h-4 w-4" />
                </button>
              </div>

            </div>

          </div>

        </main>
      </div>

      <style>{`
        .bg-stripes-slate {
          background-image: linear-gradient(45deg, #f8fafc 25%, transparent 25%, transparent 50%, #f8fafc 50%, #f8fafc 75%, transparent 75%, transparent);
          background-size: 20px 20px;
        }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
