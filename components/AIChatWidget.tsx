
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, User, Bot, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { getChatResponse, ChatHistoryItem } from '../services/geminiService';
import { ProductType } from '../types';

export const AIChatWidget: React.FC = () => {
  const { companySettings, addLead } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatHistoryItem[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isLoading]);

  const companyContext = `
    Company Name: New Holland Financial Group
    Contact Email: ${companySettings.email}
    Contact Phone: ${companySettings.phone}
    Address: ${companySettings.address}, ${companySettings.city}, ${companySettings.state}
    
    Mission: Securing Your Future, Protecting Your Legacy.
    
    PRODUCTS & SERVICES:
    1. Life Insurance: Term Life (affordable, set period), Whole Life (permanent, cash value), Universal Life, Final Expense.
    2. Business Insurance: General Liability, Workers Compensation, Business Owner's Policy (BOP), Cyber Liability.
    3. Real Estate Insurance: Coverage for residential portfolios, commercial complexes, loss of rent, vacant property.
    4. Securities & Series: Support for Series 6, 7, 63, Investment Advisory, Wealth Management Compliance.
    5. E&O Insurance: Professional liability protection.
    6. Auto & Fleet: Commercial and personal vehicle coverage.
    7. Annuities: Guaranteed income for retirement.
    
    Advisors are available for: Insurance, Real Estate, Securities.
  `;

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setIsLoading(true);

    const currentHistory = [...messages];
    
    setMessages(prev => [
      ...prev,
      { role: 'user', parts: [{ text: userMsg }] }
    ]);

    try {
      const response = await getChatResponse(currentHistory, userMsg, companyContext);
      
      // Handle Lead Data if returned by the Tool
      if (response.leadData) {
        const d = response.leadData;
        addLead({
          name: d.name,
          email: d.email || 'Not Provided',
          phone: d.phone,
          interest: (d.interest as ProductType) || ProductType.LIFE,
          message: d.summary || 'Lead captured via AI Assistant',
          customDetails: {
            city: d.city,
            state: d.state,
            source: 'AI Chat Widget'
          }
        });
        setLeadCaptured(true);
        setTimeout(() => setLeadCaptured(false), 5000);
      }

      setMessages(prev => [
        ...prev, 
        { role: 'model', parts: [{ text: response.text }] }
      ]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev, 
        { role: 'model', parts: [{ text: "Sorry, I encountered an error. Please try again later." }] }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
       {/* Button */}
       {!isOpen && (
         <button 
           onClick={() => setIsOpen(true)}
           className="fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center text-white z-50 animate-bounce-subtle group"
           title="Chat with AI Assistant"
         >
           <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
           <MessageSquare className="h-7 w-7 group-hover:rotate-12 transition-transform" />
         </button>
       )}

       {/* Window */}
       {isOpen && (
         <div className="fixed bottom-6 right-6 w-[90vw] md:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-slate-200 animate-slide-up font-sans">
            {/* Header */}
            <div className="bg-[#0B2240] p-4 flex justify-between items-center text-white shadow-md relative overflow-hidden">
                <div className="flex items-center gap-3 relative z-10">
                    <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                        <Sparkles className="h-5 w-5 text-yellow-300" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm leading-tight">NHFG Assistant</h3>
                        <p className="text-[10px] text-blue-200 font-medium tracking-wide">English • Swahili • Spanish</p>
                    </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/20 text-slate-300 hover:text-white transition-all relative z-10"
                >
                    <X className="h-5 w-5" />
                </button>
                
                {/* Success Indicator Overlay */}
                {leadCaptured && (
                    <div className="absolute inset-0 bg-green-600 flex items-center justify-center animate-fade-in z-20">
                        <div className="flex items-center gap-2 text-white font-bold">
                            <CheckCircle className="h-5 w-5" />
                            <span>Info Sent to Advisor!</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="text-center py-8 px-4">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Bot className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-base font-bold text-slate-800">Hello! Jambo! Hola!</p>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                            I am the New Holland AI. I can answer questions about our insurance products and company in your preferred language.
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                           <button onClick={() => { setInput("Tell me about Life Insurance"); }} className="text-[10px] bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors text-slate-600">Life Insurance</button>
                           <button onClick={() => { setInput("Habari, unauza bima gani?"); }} className="text-[10px] bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors text-slate-600">Swahili Inquiry</button>
                           <button onClick={() => { setInput("Quiero comprar una casa"); }} className="text-[10px] bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors text-slate-600">Real Estate (Español)</button>
                        </div>
                    </div>
                )}
                
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {msg.role === 'model' && (
                                <div className="h-6 w-6 rounded-full bg-[#0B2240] flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="h-3 w-3 text-yellow-400" />
                                </div>
                            )}
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                            }`}>
                                {msg.parts[0].text}
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="flex items-end gap-2">
                            <div className="h-6 w-6 rounded-full bg-[#0B2240] flex items-center justify-center flex-shrink-0">
                                <Sparkles className="h-3 w-3 text-yellow-400" />
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                <span className="text-xs text-slate-400">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
                <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none text-slate-800 placeholder-slate-400"
                />
                <button 
                    type="submit" 
                    disabled={!input.trim() || isLoading}
                    className="h-11 w-11 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                >
                    <Send className="h-5 w-5 ml-0.5" />
                </button>
            </form>
         </div>
       )}
    </>
  );
};
