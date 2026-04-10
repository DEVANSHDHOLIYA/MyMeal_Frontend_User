import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Pause, 
  Play, 
  AlertCircle, 
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config/config";
import axios from "axios";

// Custom Themed Orange Pulse Skeleton as per agent.md
const SubscriptionSkeleton = () => (
  <div className="min-h-screen bg-white p-6 md:p-12 font-sans text-slate-900">
    <div className="max-w-5xl mx-auto flex flex-col gap-10">
      <div className="flex flex-col gap-3 mb-2">
        <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-md" />
        <div className="h-4 w-96 bg-slate-100 animate-pulse rounded-sm" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-48 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-[4px_4px_0_rgba(15,23,42,0.03)] relative overflow-hidden">
             <div className="absolute inset-0 bg-orange-500/5 animate-pulse" />
             <div className="w-16 h-16 rounded-full bg-orange-500/20 animate-pulse relative z-10" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="h-36 bg-white border border-slate-200 rounded-xl animate-pulse" />
            <div className="h-36 bg-white border border-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="h-[320px] bg-white border border-slate-200 rounded-xl shadow-[4px_4px_0_rgba(15,23,42,0.03)] flex flex-col p-6">
             <div className="h-4 w-32 bg-slate-200 animate-pulse rounded mb-8" />
             <div className="flex flex-col gap-4">
                <div className="h-12 w-full bg-slate-100 animate-pulse rounded-lg" />
                <div className="h-12 w-full bg-slate-100 animate-pulse rounded-lg" />
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Subscription = () => {
  const [mySubscription, setMySubscription] = useState("");
  const [loading, setLoading] = useState(true);
  const user_token = localStorage.getItem("user_token");
  
  const Authorization_Header = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    },
  };
  
  const getsubscriptioninfo = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/user/getsubscription`, Authorization_Header);
      setMySubscription(res.data.data);
    } catch(err) {
      if(err.response?.data?.message=="Session Expired. Please Login Again.")
        {
          navigate("/login");
        }
         if(err.response?.data?.message=="Invaid token.")
        {
          navigate("/login");
        }
      toast.error(err.response?.data?.message || "Failed to fetch subscription details");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    const timer = setTimeout(() => {
      getsubscriptioninfo();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const pausesubscription = async (id) => {
      const toastid = mySubscription.ispaused ? toast.loading("Resuming Subscription..") : toast.loading("Pausing Subscription..");
      setLoading(true);
      try {
        const res = await axios.post(`${BACKEND_URL}/user/pausesubscription`, { subscription_id: id }, Authorization_Header);
        toast.success(res.data.message, { id: toastid });
        await getsubscriptioninfo(); // Refresh state immediately
      } catch(err) {
        if(err.response?.data?.message=="Session Expired. Please Login Again.")
        {
          navigate("/login");
        }
         if(err.response?.data?.message=="Invaid token.")
        {
          navigate("/login");
        }
         toast.error(err.response?.data?.message, { id: toastid });
         setLoading(false); // Stop loading on failure
      }
  };

  if (loading && !mySubscription) return <SubscriptionSkeleton />;

  if (!mySubscription || typeof mySubscription !== 'object' || Object.keys(mySubscription).length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center font-sans">
        <div className="space-y-4 max-w-sm w-full p-8 border border-slate-200 rounded-xl shadow-[4px_4px_0_rgba(15,23,42,0.03)] bg-slate-50/50">
          <AlertCircle size={48} className="mx-auto text-orange-500 mb-6" />
          <h2 className="text-xl font-bold tracking-tight text-slate-900">No Target Found</h2>
          <p className="text-slate-500 font-medium text-sm">We couldn't locate an active plan linked to this identity.</p>
        </div>
      </div>
    );
  }

  const end = new Date(mySubscription.enddate);
  const start = new Date(mySubscription.startdate);
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">Subscription Hub</h1>
          <p className="text-slate-700 font-medium mt-1">Review your active meal plan and manage constraints.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
             
             {/* Primary Status Card */}
             <div className="bg-white border border-slate-200 rounded-xl p-8 relative overflow-hidden flex flex-col md:flex-row md:items-end justify-between shadow-[4px_4px_0_rgba(15,23,42,0.03)] gap-6">
                
                {/* Decorative Accent */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-bl-[100%] pointer-events-none" />
                <ShieldCheck className="absolute top-4 right-4 text-orange-500/10" size={140} />

                <div className="relative z-10 w-full md:w-auto">
                   {/* Status Pill */}
                   <div className={`inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border ${mySubscription.ispaused ? 'border-amber-500/30 bg-amber-50' : 'border-emerald-500/30 bg-emerald-50'}`}>
                     <div className={`h-2 w-2 rounded-full ${mySubscription.ispaused ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                     <span className={`text-[10px] font-bold tracking-widest uppercase ${mySubscription.ispaused ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {mySubscription.ispaused ? "Service Paused" : "Live Delivery"}
                     </span>
                   </div>
                   
                   <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">Time Remaining</p>
                   <h2 className="text-5xl font-bold tracking-tighter text-slate-900 uppercase">
                     {mySubscription.ispaused ? "ON HOLD" : `${daysLeft} DAYS`}
                   </h2>
                </div>

                <div className="relative z-10 md:text-right border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-6 md:min-w-[160px]">
                   <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">Plan Value</p>
                   <p className="text-2xl font-bold text-slate-900 tracking-tight">₹{mySubscription.subscription_id?.price}</p>
                   <p className="text-slate-500 text-[13px] mt-1 font-medium break-words leading-snug">
                     {mySubscription.duration} Access.
                   </p>
                </div>
             </div>

             {/* Details Tiles */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[2px_2px_0_rgba(15,23,42,0.02)]">
                   <div className="flex items-center gap-3 mb-6">
                      <Calendar className="text-orange-500 shrink-0" size={18} />
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 leading-none">Timeline Phase</h3>
                   </div>
                   <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                         <span className="text-sm font-medium text-slate-600">Initiated</span>
                         <span className="text-sm font-bold text-slate-900">{start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-sm font-medium text-slate-600">Expiring</span>
                         <span className="text-sm font-bold text-slate-900">{end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                   </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[2px_2px_0_rgba(15,23,42,0.02)] flex flex-col">
                   <div className="flex items-center gap-3 mb-5">
                      <CheckCircle2 className="text-orange-500 shrink-0" size={18} />
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 leading-none">Allocations</h3>
                   </div>
                   <p className="text-[13px] font-bold text-slate-900 mb-auto leading-relaxed">{mySubscription.description}</p>
                   <div className="border-t border-slate-100 pt-3 mt-4">
                     <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                       Linked to <span className="font-bold text-slate-700">{mySubscription.user_id?.name}</span> ({mySubscription.user_id?.email}).
                     </p>
                   </div>
                </div>

             </div>
          </div>

          {/* Action Sidebar (Right) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
             <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[4px_4px_0_rgba(15,23,42,0.03)] h-full flex flex-col relative z-10">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-6 border-b border-slate-200 pb-4">Plan Directives</h3>
                
                <div className="flex flex-col gap-4 flex-1">
                  
                  {/* agent.md: Primary = Orange-500, all buttons cursor-pointer */}
                  <button 
                    onClick={() => pausesubscription(mySubscription.subscription_id._id)}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                    disabled={loading}
                  >
                    {mySubscription.ispaused 
                      ? <><Play size={16} className="shrink-0" /> Resume Operations</>
                      : <><Pause size={16} className="shrink-0" /> Pause Delivery</>
                    }
                  </button>

                  <button className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-lg hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer shadow-[2px_2px_0_rgba(15,23,42,0.04)]">
                    <CreditCard size={16} className="shrink-0" /> Billing Logs
                  </button>

                </div>

                <div className="mt-8 p-4 bg-orange-50/70 border border-orange-100 rounded-lg">
                  <div className="flex items-start gap-3">
                     <AlertCircle className="text-orange-500 mt-0.5 shrink-0" size={16} />
                     <p className="text-[11px] text-orange-900 font-medium leading-relaxed">
                       Pausing limits daily drop-offs to prevent food waste. Please note that pauses <span className="font-bold underline underline-offset-2">do not</span> inherently strictly extend cycle durations.
                     </p>
                  </div>
                </div>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Subscription;