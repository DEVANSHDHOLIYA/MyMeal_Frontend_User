export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 font-sans">
      
      {/* Centered Premium Container */}
      <div className="relative bg-white border border-slate-200 shadow-[8px_8px_0_0_rgba(15,23,42,0.04)] rounded-2xl w-full max-w-sm flex flex-col items-center p-12 text-center">
        
        {/* Top Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500 rounded-t-2xl"></div>

        {/* App Branding Combo */}
        <div className="flex flex-col items-center mb-10 w-full">
           <img
            src="/logo.png"
            alt="MyMeal"
            className="w-24 h-auto object-contain mb-4"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
            My<span className="text-orange-500">Meal</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em] mt-2">
            Accessing Platform
          </p>
        </div>

        {/* Loading Segment */}
        <div className="w-full flex flex-col items-center">

          {/* Premium Orbital Loader */}
          <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
            {/* Subtle Outer Track */}
            <div className="absolute w-full h-full rounded-full border-[3px] border-slate-50"></div>
            
            {/* Primary Spinning Ring */}
            <div className="absolute w-full h-full rounded-full border-[3px] border-transparent border-t-orange-500 border-r-orange-500/50 animate-spin"></div>
            
            {/* Secondary Counter-Spinning Ring */}
            <div 
              className="absolute w-10 h-10 rounded-full border-[3px] border-transparent border-b-orange-400/80 border-l-orange-400/30 animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
            ></div>
            
            {/* Core Themed Pulse */}
            <div className="relative w-3.5 h-3.5 bg-orange-500 rounded-full flex items-center justify-center">
               <div className="absolute w-full h-full bg-orange-500 rounded-full animate-ping opacity-60"></div>
            </div>
          </div>
          
          <h2 className="text-slate-900 font-bold text-lg tracking-tight mb-2">
            Opening Kitchen
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Fetching the freshest options...
          </p>
        </div>

      </div>

    </div>
  );
}