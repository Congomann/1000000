
import React, { useState } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useData();

  const isCRM = location.pathname.startsWith('/crm');
  if (isCRM) return null; // Don't show public nav in CRM

  const handleAuthAction = () => {
    if (user) {
      if (user.role === UserRole.CLIENT) {
        navigate('/client-portal');
      } else {
        navigate('/crm/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-4 md:px-8 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-full px-6 md:px-8 py-4 shadow-2xl flex items-center justify-between transition-all duration-300">
          
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-3 group cursor-pointer"
              title="Home"
            >
              <div className="relative w-10 h-10 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  {/* Back Card */}
                  <rect x="5" y="15" width="90" height="60" rx="12" fill="#F59E0B" />
                  {/* Front Card */}
                  <rect x="10" y="35" width="80" height="55" rx="12" fill="#FCD34D" />
                  {/* Chip */}
                  <rect x="42" y="52" width="16" height="22" rx="4" fill="#B45309" fillOpacity="0.25" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl leading-none text-white tracking-tight group-hover:text-blue-400 transition-colors duration-300">New Holland</span>
                <span className="text-[0.6rem] font-medium text-slate-300 tracking-[0.2em] uppercase mt-0.5 group-hover:text-white transition-colors duration-300">Financial Group</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              <Link to="/" className="text-slate-300 hover:text-white hover:bg-white/10 px-5 py-2.5 rounded-full text-sm font-medium transition-all">Home</Link>
              <Link to="/products" className="text-slate-300 hover:text-white hover:bg-white/10 px-5 py-2.5 rounded-full text-sm font-medium transition-all">Products</Link>
              <Link to="/real-estate" className="text-slate-300 hover:text-white hover:bg-white/10 px-5 py-2.5 rounded-full text-sm font-medium transition-all">Real Estate</Link>
              <Link to="/advisors" className="text-slate-300 hover:text-white hover:bg-white/10 px-5 py-2.5 rounded-full text-sm font-medium transition-all">Advisors</Link>
              <Link to="/resources" className="text-slate-300 hover:text-white hover:bg-white/10 px-5 py-2.5 rounded-full text-sm font-medium transition-all">Resources</Link>
              <Link to="/about" className="text-slate-300 hover:text-white hover:bg-white/10 px-5 py-2.5 rounded-full text-sm font-medium transition-all">About Us</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 pl-6 border-l border-white/10 ml-6">
                <button 
                  onClick={handleAuthAction}
                  className="bg-white text-slate-900 hover:bg-blue-50 px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-xl shadow-black/10"
                >
                  <User size={16} /> 
                  {user ? (user.role === UserRole.CLIENT ? 'My Portal' : 'Dashboard') : 'Sign In'}
                </button>
                {user && (
                  <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 p-2 hover:bg-white/5 rounded-full transition-colors" title="Logout">
                    <LogOut size={20} />
                  </button>
                )}
          </div>
          
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden mt-3 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 shadow-2xl animate-slide-up pointer-events-auto">
            <div className="space-y-1">
              <Link to="/" onClick={() => setIsOpen(false)} className="block hover:bg-white/10 px-4 py-3 rounded-xl text-base font-medium text-slate-200">Home</Link>
              <Link to="/products" onClick={() => setIsOpen(false)} className="block hover:bg-white/10 px-4 py-3 rounded-xl text-base font-medium text-slate-200">Products</Link>
              <Link to="/real-estate" onClick={() => setIsOpen(false)} className="block hover:bg-white/10 px-4 py-3 rounded-xl text-base font-medium text-slate-200">Real Estate</Link>
              <Link to="/advisors" onClick={() => setIsOpen(false)} className="block hover:bg-white/10 px-4 py-3 rounded-xl text-base font-medium text-slate-200">Advisors</Link>
              <Link to="/resources" onClick={() => setIsOpen(false)} className="block hover:bg-white/10 px-4 py-3 rounded-xl text-base font-medium text-slate-200">Resources</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="block hover:bg-white/10 px-4 py-3 rounded-xl text-base font-medium text-slate-200">About Us</Link>
              
              <div className="h-px bg-white/10 my-2"></div>
              
              <button onClick={() => { handleAuthAction(); setIsOpen(false); }} className="w-full text-left block bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-xl text-base font-bold text-white shadow-lg">
                 {user ? (user.role === UserRole.CLIENT ? 'My Portal' : 'Agent Dashboard') : 'Sign In'}
              </button>
              {user && (
                 <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left block hover:bg-red-500/20 px-4 py-3 rounded-xl text-base font-medium text-red-300 mt-2">
                   Sign Out
                 </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
