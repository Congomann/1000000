import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { ProductType, UserRole } from '../../types';
import { Mail, Phone, User, MessageSquare, Briefcase, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Contact: React.FC = () => {
  const { addLead, user } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: ProductType.LIFE,
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assignToId = (user?.role === UserRole.ADVISOR || user?.role === UserRole.MANAGER) ? user.id : undefined;

    // Turning inquiry into a lead in the DB
    addLead({
        ...formData,
        source: 'Website Contact Form',
        qualification: 'Warm'
    }, assignToId);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-slate-100 animate-fade-in">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6 shadow-inner">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Inquiry Received</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">Your request has been added to our terminal. A licensed New Holland advisor will review your needs and reach out shortly.</p>
          <button 
            onClick={() => setSubmitted(false)} 
            className="w-full py-4 bg-[#0A62A7] text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20"
          >
            Send Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-40 pb-20 font-sans selection:bg-blue-100">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-black text-[#0B2240] tracking-tight mb-4">Contact Us</h1>
          <p className="text-xl text-slate-500 font-medium">Let us know how we can help you secure your future.</p>
        </div>

        <div className="bg-white rounded-[3.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-14 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Full Name</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Jane Doe"
                  className="w-full pl-16 pr-8 py-5 bg-slate-50/50 border border-slate-200 rounded-[2rem] text-base font-medium focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 shadow-inner"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            
            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="email" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Email Address</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                      <Mail size={20} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="jane@example.com"
                      className="w-full pl-16 pr-8 py-5 bg-slate-50/50 border border-slate-200 rounded-[2rem] text-base font-medium focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 shadow-inner"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                      <Phone size={20} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      placeholder="(555) 000-0000"
                      className="w-full pl-16 pr-8 py-5 bg-slate-50/50 border border-slate-200 rounded-[2rem] text-base font-medium focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 shadow-inner"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
            </div>

            {/* Interested In */}
            <div>
              <label htmlFor="interest" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Interested In</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                  <Briefcase size={20} />
                </div>
                <select
                  id="interest"
                  name="interest"
                  className="w-full pl-16 pr-12 py-5 bg-slate-50/50 border border-slate-200 rounded-[2rem] text-base font-bold text-slate-700 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer shadow-inner"
                  value={formData.interest}
                  onChange={e => setFormData({...formData, interest: e.target.value as ProductType})}
                >
                  {Object.values(ProductType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                    <ChevronDown size={20} />
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Message / Details</label>
              <div className="relative group">
                <div className="absolute left-6 top-6 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  <MessageSquare size={20} />
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="How can our advisors assist you today?"
                  className="w-full pl-16 pr-8 py-5 bg-slate-50/50 border border-slate-200 rounded-[2.5rem] text-base font-medium focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 resize-none shadow-inner"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-6 bg-blue-600 text-white font-black text-lg rounded-[2rem] shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all transform uppercase tracking-widest"
              >
                Submit Inquiry
              </button>
              <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.25em] mt-6">Secure Transaction • New Holland Enterprise Terminal</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ChevronDown = ({ size, className }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);