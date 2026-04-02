import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";


const navLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Meal Planner", to: "/meals" },  
  { label: "Subscription", to: "/subscription" },
  { label: "Vendors", to: "/showvendors" },      
  { label: "Favorites", to: "/favorites" },  // added
];

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  return (
    <div className="min-h-screen ">
      <nav className="sticky top-0 z-50 backdrop-blur-xl ">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          
          {/* Logo Section */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="relative overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105">
              <img src="/logo.png" className="w-20 h-16 object-contain" alt="logo" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              My<span className="text-orange-500">Meal</span>
            </h1>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative py-2 text-sm font-medium transition-colors duration-200 ${
                    active ? "text-orange-600" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-orange-500 rounded-full shadow-[0_2px_8px_rgba(249,115,22,0.4)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Profile & Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/profile")}
              className={`p-2.5 rounded-full border transition-all cursor-pointer duration-300 ${
                isActive("/profile")
                  ? "bg-orange-50 border-orange-200 text-orange-600 ring-4 ring-orange-50"
                  : "bg-white border-gray-200 text-gray-500 hover:border-orange-200 hover:text-orange-600 hover:shadow-sm"
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Page Container */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Nav;