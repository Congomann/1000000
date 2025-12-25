


import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Shield, Users, Upload, CheckCircle2, Send, X, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const JoinTeam: React.FC = () => {
  const { submitJobApplication } = useData();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    experience: ''
  });
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate backend submission logic
    setTimeout(() => {
      submitJobApplication({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          licenseNumber: formData.licenseNumber,
          experience: formData.experience,
          resumeName: resume?.name
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        licenseNumber: '',
        experience: ''
      });
      setResume(null);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Hero Section */}
      <div className="relative bg-[#0B2240] py-20 sm:py-32 overflow-hidden">
         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-overlay filter blur-[120px] opacity-20 animate-pulse"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Join Our Team</h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto font-medium leading-relaxed">
              Build a rewarding career helping individuals, families, and businesses achieve financial security.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
        
        {/* Why Join Us Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                    <TrendingUp className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Uncapped Earning Potential</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                    Our competitive commission structure rewards your hard work and dedication. Sky's the limit for your growth.
                </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                    <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Access to Top Carriers</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                    Offer your clients the best products from a wide range of A-rated insurance carriers and financial institutions.
                </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                    <Users className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Continuous Training</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                    We invest in your growth with ongoing professional development, mentorship, and advanced tools.
                </p>
            </div>
        </div>

        {/* Application Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Left Content */}
            <div className="lg:w-1/3">
                <h2 className="text-3xl font-black text-[#0B2240] mb-6">Why New Holland Financial Group?</h2>
                <div className="prose prose-slate text-slate-600 mb-8">
                    <p>
                        We are more than just an insurance agency; we are a team of dedicated professionals committed to excellence, integrity, and community. We believe in empowering our agents with the tools, training, and support they need to succeed.
                    </p>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-2">Ready to apply?</h4>
                    <p className="text-sm text-blue-700 mb-4">Complete the form to start your journey with us. A hiring manager will review your application and contact you shortly.</p>
                </div>
            </div>

            {/* Application Form */}
            <div className="lg:w-2/3 w-full">
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100 relative overflow-hidden">
                    {isSuccess ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm animate-bounce-subtle">
                                <CheckCircle2 className="h-12 w-12" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4">Application Received!</h3>
                            <p className="text-slate-500 text-lg max-w-md mx-auto mb-8">
                                Thank you for your interest in joining New Holland Financial Group. We will be in touch soon.
                            </p>
                            <button 
                                onClick={() => setIsSuccess(false)}
                                className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-colors"
                            >
                                Submit Another Application
                            </button>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Apply Now</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Full Name <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text"
                                            name="fullName"
                                            required
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Email <span className="text-red-500">*</span></label>
                                        <input 
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Phone <span className="text-red-500">*</span></label>
                                        <input 
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent outline-none transition-all"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">License Number</label>
                                        <input 
                                            type="text"
                                            name="licenseNumber"
                                            value={formData.licenseNumber}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent outline-none transition-all"
                                            placeholder="NPN or State License #"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Home Address <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent outline-none transition-all"
                                        placeholder="123 Main St, City, State, Zip"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Tell us about your experience <span className="text-red-500">*</span></label>
                                    <textarea 
                                        name="experience"
                                        required
                                        rows={4}
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Briefly describe your background in sales, finance, or insurance..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Upload Resume (Optional)</label>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400 rounded-xl p-6 cursor-pointer transition-all flex flex-col items-center justify-center text-center group"
                                    >
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                        />
                                        {resume ? (
                                            <div className="flex items-center gap-3 text-blue-600 font-bold">
                                                <FileText className="h-6 w-6" />
                                                {resume.name}
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setResume(null); }}
                                                    className="p-1 hover:bg-blue-100 rounded-full text-slate-400 hover:text-red-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                                                <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                                                <p className="text-xs text-slate-400 mt-1">PDF, DOCX up to 5MB</p>
                                            </>
                                        )}
                                    </div>
                                    {!resume && <p className="text-xs text-slate-400 mt-2 ml-1 italic">No file chosen</p>}
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-[#0A62A7] text-white font-bold rounded-full shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? 'Submitting...' : <><Send className="h-5 w-5" /> Submit Application</>}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};