import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  PauseCircle, 
  PlayCircle, 
  AlertCircle, 
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config/config";
import axios from "axios";

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
    try{
        const res=await axios.get(`${BACKEND_URL}/user/getsubscription`, Authorization_Header);
        setMySubscription(res.data.data);
    }
    catch(err){
      toast.error(err.response?.data?.message || "Failed to fetch subscription details");
    }
    finally{
      setLoading(false);
    }
  }
 
  useEffect(() => {
    const timer = setTimeout(() => {
      getsubscriptioninfo();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);


  const pausesubscription = async (id) => {
      const toastid= mySubscription.ispaused ? toast.loading("Resuming Subscription..") : toast.loading("Pausing Subscription..");
      setLoading(true);
      try{
        const res= await axios.post(`${BACKEND_URL}/user/pausesubscription`,{subscription_id:id},Authorization_Header);
        toast.success(res.data.message,{id:toastid});
      }
      catch(err)
      {
         toast.error(err.response?.data?.message,{id:toastid});
      }
      finally{
        setLoading(false);
      }
  }

  const SubscriptionSkeleton = () => (
    <div className="min-h-screen bg-white p-6 md:p-12 font-sans text-slate-900 animate-pulse">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 space-y-3">
          <div className="h-10 w-64 bg-gray-200 rounded-xl" />
          <div className="h-4 w-96 bg-gray-100 rounded-lg" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Main Card Skeleton */}
            <div className="h-72 bg-gray-200 rounded-[3rem]" />
            
            {/* Details Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-40 bg-gray-100 rounded-[2.5rem]" />
              <div className="h-40 bg-gray-100 rounded-[2.5rem]" />
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <div className="h-[400px] bg-gray-50 rounded-[2.5rem]" />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <SubscriptionSkeleton />;

  
  if (!mySubscription || typeof mySubscription !== 'object') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <AlertCircle size={48} className="mx-auto text-slate-200" />
          <p className="text-slate-400 font-bold uppercase tracking-widest">No Active Subscription Found</p>
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
        
        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Subscription Hub</h1>
          <p className="text-slate-400 font-medium mt-1">Review your active meal plan and control your delivery status.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Plan Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-orange-500 rounded-[3rem] p-10 text-white relative shadow-2xl shadow-orange-100 overflow-hidden">
              <ShieldCheck className="absolute -bottom-10 -right-10 text-white/10" size={250} />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full w-fit mb-6">
                      <div className={`h-2 w-2 rounded-full ${mySubscription.ispaused ? 'bg-white animate-pulse' : 'bg-emerald-400'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {mySubscription.ispaused ? "Paused" : "Live & Delivering"}
                      </span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter">
                      {mySubscription.ispaused ? "HOLD" : `${daysLeft} Days`}
                    </h2>
                    <p className="text-orange-100 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                       {mySubscription.ispaused ? "Service currently on pause" : "Remaining on your plan"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-200 text-[10px] font-black uppercase tracking-widest">Plan Cost</p>
                    <p className="text-2xl font-black">₹{mySubscription.subscription_id?.price}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-white/10">
                  <div>
                    <p className="text-orange-200 text-[10px] font-black uppercase tracking-widest mb-1">Started On</p>
                    <p className="font-bold">{start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short',year:'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-orange-200 text-[10px] font-black uppercase tracking-widest mb-1">Ends On</p>
                    <p className="font-bold">{end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Specifics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Plan Details</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-orange-500" />
                    <span className="text-sm font-bold text-slate-700">{mySubscription.duration} Access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-orange-500" />
                    <span className="text-sm font-bold text-slate-700">{mySubscription.description}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">User Info</h4>
                <p className="text-sm font-bold text-slate-800">{mySubscription.user_id?.name}</p>
                <p className="text-xs font-medium text-slate-400 mt-1">{mySubscription.user_id?.email}</p>
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-8 text-center">Manage Subscription</h3>
              
              <div className="space-y-4">
                <button 
                  onClick={()=>{pausesubscription(mySubscription.subscription_id._id)}}
                  className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all font-black text-xs uppercase tracking-widest ${
                    mySubscription.ispaused 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                    : 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {mySubscription.ispaused ? <PlayCircle size={20} /> : <PauseCircle size={20} />}
                    {mySubscription.ispaused ? "Resume Plan" : "Pause Plan"}
                  </div>
                  <ArrowRight size={16} />
                </button>

                <button className="w-full flex items-center justify-between p-5 bg-slate-50 text-slate-600 rounded-3xl hover:bg-slate-100 transition-all font-black text-xs uppercase tracking-widest">
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} />
                    Billing Info
                  </div>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="mt-10 p-6 bg-orange-50 rounded-2xl">
                <p className="text-[10px] text-orange-600 font-bold leading-relaxed italic">
                  * Note: Pausing service stops daily deliveries and Does not extends your plan duration.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Subscription;