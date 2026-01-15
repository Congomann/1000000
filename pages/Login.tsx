
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const { login, allUsers } = useData();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const executeLogin = (targetEmail: string) => {
    const targetUser = allUsers.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
    
    if (targetUser) {
      login(targetUser.email);
      // Strict routing based on the matched user's role
      if (targetUser.role === UserRole.CLIENT) {
        navigate('/client-portal');
      } else if (targetUser.role === UserRole.ADMIN || targetUser.role === UserRole.SUB_ADMIN || targetUser.role === UserRole.ADVISOR || targetUser.role === UserRole.MANAGER) {
        navigate('/crm/dashboard');
      } else {
        // Fallback for generic CRM access
        navigate('/crm/dashboard');
      }
    } else {
      // If user isn't in DB yet, attempt a generic login and default to dashboard
      login(targetEmail);
      navigate('/crm/dashboard');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    executeLogin(email);
  };

  const handleQuickLogin = (email: string) => {
      setEmail(email);
      executeLogin(email);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#F9FAFB]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
         <div className="w-20 h-20 mx-auto mb-6 drop-shadow-md">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M50 0L100 40V100H0V40L50 0Z" fill="#FBBF24"/>
            </svg>
          </div>
        <h2 className="text-3xl font-bold text-[#0B2240] tracking-tight">
          Advisor Login
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-sm rounded-[2rem] border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#0B2240] ml-1 mb-1">
                Email Address
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-11 px-4 py-4 bg-white border border-slate-300 rounded-2xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent transition-all text-base text-slate-900"
                  placeholder="advisor@newholland.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#0B2240] ml-1 mb-1">
                Password
              </label>
              <div className="relative rounded-2xl shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required={false}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-11 px-4 py-4 bg-white border border-slate-300 rounded-2xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent transition-all text-base text-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#0A62A7] focus:ring-[#0A62A7] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-500">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#0A62A7] hover:text-blue-50">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-md text-base font-bold text-white bg-[#0A62A7] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A62A7] transition-all"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-400 font-medium">Demo Quick Login</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
               <button type="button" onClick={() => handleQuickLogin('newbie@nhfg.com')} className="bg-blue-50 text-blue-700 py-2 px-3 rounded-xl text-xs font-black hover:bg-blue-100 transition-colors border border-blue-200 shadow-sm animate-pulse">✨ New Approved Advisor</button>
               <button type="button" onClick={() => handleQuickLogin('insurance@nhfg.com')} className="bg-slate-50 text-slate-600 py-2 px-3 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors border border-slate-200">Insurance Advisor</button>
               <button type="button" onClick={() => handleQuickLogin('realestate@nhfg.com')} className="bg-amber-50 text-amber-700 py-2 px-3 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-colors border border-amber-200">Real Estate Advisor</button>
               <button type="button" onClick={() => handleQuickLogin('mortgage@nhfg.com')} className="bg-cyan-50 text-cyan-700 py-2 px-3 rounded-xl text-xs font-bold hover:bg-cyan-100 transition-colors border border-cyan-200">Mortgage Advisor</button>
               <button type="button" onClick={() => handleQuickLogin('securities@nhfg.com')} className="bg-green-50 text-green-700 py-2 px-3 rounded-xl text-xs font-semibold hover:bg-green-100 transition-colors border border-green-200">Securities Advisor</button>
               
               <button type="button" onClick={() => handleQuickLogin('manager@nhfg.com')} className="bg-purple-50 text-purple-700 py-2 px-3 rounded-xl text-xs font-semibold hover:bg-purple-100 transition-colors border border-purple-200">Manager</button>
               <button type="button" onClick={() => handleQuickLogin('subadmin@nhfg.com')} className="bg-indigo-50 text-indigo-700 py-2 px-3 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors border border-indigo-200">Sub-Admin</button>
               
               <button type="button" onClick={() => handleQuickLogin('admin@nhfg.com')} className="bg-red-50 text-red-700 py-2 px-3 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors border border-red-200">System Admin</button>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs font-medium text-slate-400 uppercase tracking-widest">
           Powered by New Holland Financial CRM
        </p>
        <div className="mt-4 flex justify-center">
            <button
                onClick={() => navigate('/')}
                className="text-sm text-[#0A62A7] hover:text-blue-600 flex items-center font-medium"
              >
               Return to Home <ArrowRight className="h-4 w-4 ml-1" />
            </button>
        </div>
      </div>
    </div>
  );
};
