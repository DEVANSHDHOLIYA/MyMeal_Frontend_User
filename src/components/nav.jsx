import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Meal Planner", to: "/meals" },  
  { label: "Subscription", to: "/subscription" },
  { label: "Vendors", to: "/showvendors" },      
  { label: "Favorites", to: "/favorites" },
];

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  const handleMobileNavClick = (to) => {
    setIsMobileMenuOpen(false);
    if(to) navigate(to);
  };

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-orange-100">
      <nav className="sticky top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          
          {/* Logo Section */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate("/dashboard");
            }}
          >
            <div className="relative overflow-hidden transition-transform duration-300 group-hover:rotate-6 drop-shadow-sm">
              <img src="/public/logo.png" className="w-16 h-12 object-contain" alt="logo" />
            </div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">
              My<span className="text-orange-500">Meal</span>
            </h1>
          </div>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative py-2 text-sm font-bold transition-all duration-300 ${
                    active ? "text-orange-500" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-1 h-[3px] bg-orange-500 rounded-full shadow-[0_2px_8px_rgba(249,115,22,0.4)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Profile & Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/profile")}
              className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-sm active:scale-95 duration-300 ${
                isActive("/profile")
                  ? "bg-orange-50 border-orange-200 text-orange-500 ring-4 ring-orange-50"
                  : "bg-white border-gray-200 text-gray-500 hover:border-orange-200 hover:text-orange-500 hover:bg-orange-50"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-600 hover:text-orange-500 focus:outline-none transition-colors"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[80vw] max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { setIsMobileMenuOpen(false); navigate("/dashboard"); }}>
            <div className="relative overflow-hidden transition-transform duration-300 drop-shadow-sm group-hover:rotate-6">
              <img src="/public/logo.png" className="w-12 h-10 object-contain" alt="logo" />
            </div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight">
              My<span className="text-orange-500">Meal</span>
            </h2>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3.5 px-4 rounded-xl text-base font-bold transition-colors ${
                  active ? "bg-orange-50 text-orange-500" : "text-gray-600 hover:bg-gray-50 hover:text-orange-500"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
           <button
              onClick={() => handleMobileNavClick("/profile")}
              className={`w-full text-left py-4 px-4 rounded-xl text-base font-bold transition-all flex items-center gap-4 shadow-sm active:scale-95 ${
                isActive("/profile") ? "bg-orange-500 text-white shadow-orange-500/20" : "bg-white border border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              My Profile
            </button>
        </div>
      </div>

      {/* Main Page Container */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 relative">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Nav;