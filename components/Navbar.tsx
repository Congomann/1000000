
import React, { useState, useRef } from 'react';
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';

interface NavDropdownProps {
  label: string;
  items: { label: string; path: string }[];
}

const NavDropdown: React.FC<NavDropdownProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<any>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div 
      className="relative group h-full flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="text-slate-200 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all flex items-center gap-1 uppercase tracking-tight">
        {label}
        <ChevronDown size={10} className={`transition-transform duration-300 opacity-50 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[60] w-52 animate-fade-in">
          <div className="bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] p-3 shadow-2xl overflow-hidden">
            {items.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="block px-4 py-2.5 text-[11px] font-black text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all uppercase tracking-[0.1em]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useData();

  const isCRM = location.pathname.startsWith('/crm');
  const isRealEstate = location.pathname === '/real-estate';

  if (isCRM) return null;

  const handleAuthAction = () => {
    if (user) {
      navigate(user.role === UserRole.CLIENT ? '/client-portal' : '/crm/dashboard');
    } else {
      navigate('/login');
    }
  };

  // MAIN SITE LINKS
  const standardLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Real Estate', path: '/real-estate' },
    { label: 'Advisors', path: '/advisors' },
    { label: 'Resources', path: '/resources' },
    { label: 'About Us', path: '/about' },
  ];

  // REAL ESTATE VERTICAL NAVIGATION
  const reLinks = [
    { label: 'Home', path: '/real-estate' },
    { label: 'Buyers', path: '/real-estate?view=buyers' },
    { label: 'Sellers', path: '/real-estate?view=sellers' },
    { label: 'Properties', path: '/real-estate?view=properties' },
    { label: 'Resources', path: '/real-estate?view=resources' },
    { label: 'About Us', path: '/real-estate?view=about' },
    { label: 'Contact Us', path: '/real-estate?view=contact' },
  ];

  return (
    <nav className="fixed top-8 left-0 right-0 z-50 px-4 md:px-12 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <div className="bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-full px-6 md:px-8 py-3.5 shadow-2xl flex items-center justify-between transition-all duration-300 ring-1 ring-black/5">
          
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group transition-transform active:scale-95">
              <div className="relative w-9 h-9 flex-shrink-0">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                  <rect x="5" y="15" width="90" height="60" rx="12" fill="#F59E0B" />
                  <rect x="10" y="35" width="80" height="55" rx="12" fill="#FCD34D" />
                  <rect x="42" y="52" width="16" height="22" rx="4" fill="#B45309" fillOpacity="0.25" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-lg text-white tracking-tight">New Holland</span>
                <span className="text-[0.55rem] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5">Financial Group</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center gap-0.5">
            {!isRealEstate ? (
              standardLinks.map(link => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`text-[12px] font-bold px-4 py-2 rounded-full transition-all uppercase tracking-tight ${location.pathname === link.path ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                >
                  {link.label}
                </Link>
              ))
            ) : (
              <div className="flex items-center">
                {reLinks.map(link => (
                   <Link 
                      key={link.path}
                      to={link.path} 
                      className={`text-[12px] font-bold px-4 py-2 rounded-full transition-all uppercase tracking-tight ${location.search === link.path.split('?')[1] || (link.path === '/real-estate' && !location.search) ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                    >
                      {link.label}
                    </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
              <button 
                onClick={handleAuthAction}
                className="bg-white text-slate-900 hover:bg-blue-50 px-6 py-2.5 rounded-full text-[12px] font-black flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10 uppercase tracking-widest"
              >
                <User size={14} className="opacity-70" /> 
                {user ? (user.role === UserRole.CLIENT ? 'Portal' : 'Console') : 'Sign In'}
              </button>
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-full text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden mt-3 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-slide-up pointer-events-auto overflow-y-auto max-h-[80vh] no-scrollbar">
            <div className="space-y-8">
              <Link to="/" onClick={() => setIsOpen(false)} className="block text-xl font-black text-white uppercase tracking-tighter">Home</Link>
              {!isRealEstate ? (
                <div className="space-y-4">
                   {standardLinks.slice(1).map(link => (
                     <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="block text-slate-400 font-bold hover:text-white transition-colors">{link.label}</Link>
                   ))}
                </div>
              ) : (
                <div className="space-y-4">
                   {reLinks.map(link => (
                     <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="block text-slate-400 font-bold hover:text-white transition-colors">{link.label}</Link>
                   ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
