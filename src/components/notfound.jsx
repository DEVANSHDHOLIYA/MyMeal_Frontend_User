import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[90vh] bg-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center">
        
        {/* MyMeal Logo Branding */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-20 h-20  rounded-xl flex items-center justify-center  ">
            <img src='/public/logo.png'/>
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            My<span className="text-orange-500">Meal</span>
          </span>
        </div>

        {/* 404 Content */}
        <h1 className="text-9xl font-black text-slate-900 tracking-tighter leading-none mb-4">
          4<span className="text-orange-500">0</span>4
        </h1>
        
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Something went wrong!
        </h2>
        
        <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed px-4">
          The requested URL doesn't exist on our menu. 
          Let’s return to your previous page.
        </p>

        {/* Single Go Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 px-12 py-4 bg-orange-500 text-white rounded-2xl font-bold text-sm transition-all hover:bg-orange-600 active:scale-95 shadow-xl shadow-orange-200"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default NotFound;