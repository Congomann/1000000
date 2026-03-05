import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useData } from "../context/DataContext";

export const SpeakToAdvisorForm: React.FC<{ productType?: string }> = ({ productType = "General Inquiry" }) => {
  const { addLead } = useData();
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      interest: productType as any,
      message: contactForm.message,
      source: "Website Contact Form",
    });
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: "", phone: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-12">
      <div className="bg-white rounded-[3rem] p-10 lg:p-14 shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Speak to an Advisor
          </h2>
          <p className="text-lg text-slate-600">
            Get personalized guidance from our experts. Fill out the form below and we'll be in touch.
          </p>
        </div>

        {formSubmitted ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-3xl font-black text-slate-900">
              Request Sent
            </h3>
            <p className="text-slate-500 mt-2 font-medium">
              An expert advisor will reach out to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">
                  Name
                </label>
                <input
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
                  placeholder="John Doe"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">
                  Phone
                </label>
                <input
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
                  placeholder="(555) 555-5555"
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
                placeholder="john@example.com"
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none shadow-inner resize-none"
                placeholder="How can we help you?"
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    message: e.target.value,
                  })
                }
              />
            </div>
            <button
              type="submit"
              className="w-full py-5 bg-[#0B2240] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all"
            >
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
