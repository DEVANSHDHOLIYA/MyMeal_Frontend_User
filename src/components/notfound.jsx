import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden selection:bg-orange-100">
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-200/30 via-orange-50/10 to-transparent -z-10 blur-3xl pointer-events-none rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center group flex flex-col items-center"
      >
        {/* Playful Floating Logo */}
        <div className="mb-6">
            <div 
              className="relative overflow-hidden transition-all duration-500 hover:rotate-12 hover:scale-110 drop-shadow-sm cursor-pointer" 
              onClick={() => navigate("/")}
            >
              <img src="/logo.png" className="w-24 h-20 object-contain" alt="MyMeal Logo" />
            </div>
        </div>

        {/* Dynamic 404 Typography */}
        <h1 className="text-[120px] sm:text-[180px] font-black text-gray-900 tracking-tighter leading-none mb-2 select-none flex items-center justify-center">
          4
          <span className="text-orange-500 inline-block transition-transform duration-700 ease-in-out group-hover:-translate-y-4 group-hover:rotate-6">
            0
          </span>
          4
        </h1>
        
        <h2 className="text-2xl sm:text-4xl font-black text-gray-800 mb-4 tracking-tight">
          Oops! Page Not Found.
        </h2>
        
        <p className="text-gray-500 font-medium text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed px-4">
          Looks like this exact recipe isn't on our menu today. Let's get you back to the dashboard to find something else!
        </p>

        {/* Action Pill */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 px-8 py-4 bg-orange-500 text-white rounded-full font-black text-lg transition-all duration-300 hover:bg-orange-600 hover:px-10 active:scale-95 shadow-xl shadow-orange-500/30"
        >
          <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          Go Back
        </button>
      </motion.div>
     
    </div>
  );
};

export default NotFound;