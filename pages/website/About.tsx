import React, { useEffect } from 'react';
import { Shield, Users, Award, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export const About: React.FC = () => {
  const { companySettings } = useData();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ValueCard = ({ title, desc, icon: Icon }: any) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
            <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );

  return (
    <div className="bg-white font-sans">
      {/* 1. About Hero Section */}
      <div className="relative bg-[#0B2240] py-24 sm:py-32 overflow-hidden">
         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">About New Holland Financial Group</h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto font-medium leading-relaxed">
              Your trusted partner in securing a sound financial future through personalized insurance solutions.
            </p>
         </div>
      </div>

      {/* 2. History & Mission Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Our History & Mission</h2>
                    <div className="prose prose-lg text-slate-600 space-y-6">
                        <p>
                            Founded with the goal of bringing clarity and trust to the insurance industry, New Holland Financial Group has grown from a small local agency to a respected firm serving clients across multiple states. Our history is built on a commitment to professional ethics and unwavering customer support.
                        </p>
                        <p>
                            Our mission is simple: to provide tailored insurance solutions that secure financial peace of mind for individuals, families, and businesses. We strive to build long-lasting relationships with our clients, guiding them through every stage of life with expert advice and reliable coverage.
                        </p>
                    </div>
                </div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px]">
                    <img 
                      src={companySettings.aboutImageUrl || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"} 
                      alt="Professional team meeting" 
                      className="w-full h-full object-cover" 
                    />
                </div>
            </div>
        </div>
      </div>

      {/* 3. Vision & Values Section */}
      <div className="py-20 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Vision & Values</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Our vision is to be the most trusted and respected insurance advisory in the communities we serve.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ValueCard title="Integrity" desc="We operate with honesty and transparency in all our interactions." icon={Shield} />
                <ValueCard title="Client-Centric" desc="Your needs are at the heart of everything we do. We listen, we understand, and we deliver." icon={Users} />
                <ValueCard title="Excellence" desc="We are committed to the highest standards of professionalism and product knowledge." icon={Award} />
                <ValueCard title="Community" desc="We believe in giving back and strengthening the communities where we live and work." icon={Heart} />
            </div>
         </div>
      </div>

      {/* CTA to Advisors */}
      <div className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Meet the Experts Behind Our Success</h2>
              <p className="text-lg text-slate-500 mb-10">
                  Our team of licensed professionals is dedicated to helping you build long-term financial security.
              </p>
              <Link to="/advisors" className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                  Find an Advisor <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
          </div>
      </div>
    </div>
  );
};