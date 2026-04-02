import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Star,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Utensils,
  Calendar,
  ShoppingCart,
  User,
  MessageSquare,
} from "lucide-react";
import { BACKEND_URL } from "../config/config.js";
import toast from "react-hot-toast";

const VendorDetails = () => {
  const { vendor_id } = useParams();
  const navigate = useNavigate();
  const user_token = localStorage.getItem("user_token");
  
  const Authorization_Header = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    },
  };
  
  const [vendor, setVendor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [todayMeal, setTodayMeal] = useState({
    lunch: {
      title: "Executive Protein Lunch",
      items: ["4 Roti", "Paneer Sabzi", "Dal Fry", "Rice", "Papad"],
      time: "12:30 PM - 2:00 PM",
      img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80",
    },
    dinner: {
      title: "Light Wellness Dinner",
      items: ["2 Missi Roti", "Mix Veg Sabzi", "Moong Dal", "Fresh Salad"],
      time: "7:30 PM - 9:00 PM",
      img: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=400&q=80",
    },
  });
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([
    {
      _id: "1",
      duration: "1 Month",
      price: "2800",
      label: "2 meals per day",
      description: "Standard Veg/Non-Veg Home-style Meals.",
    },
    {
      _id: "2",
      duration: "6 Months",
      price: "4200",
      label: "2 meals per day",
      description: "Premium Selection with Custom Macros and Dedicated Support.",
      featured: true,
    },
    {
      _id: "3",
      duration: "1 Year",
      price: "7000",
      label: "2 meals per day",
      description: "Full Registry Access, VIP Support & Priority Delivery Routing.",
    },
  ]);

  const fetchVendorData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/user/getvendorsubscription/${vendor_id}`,
        Authorization_Header
      );

      if (res.data?.data) {
        setVendor(res.data.data.vendordata[0]);
        setPlans(res.data.data.subscription);
      }
    } catch (err) {
      console.error("Error fetching vendor data:", err);
      setVendor({});
    } finally {
      setLoading(false);
    }
  }, [vendor_id]);

  const getratings = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/rating/getratings/${vendor_id}`,
        Authorization_Header
      );
      setReviews(res.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchVendorData();
    getratings();
  }, [fetchVendorData]);

  if (loading || !vendor) {
    return (
      <div className="min-h-screen bg-white font-sans px-6 md:px-12 py-10 animate-pulse">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="flex gap-6 pb-8 border-b border-slate-200">
             <div className="w-32 h-32 bg-slate-100 rounded-xl" />
             <div className="flex-1 space-y-4 py-2">
                <div className="w-48 h-8 bg-slate-100 rounded" />
                <div className="w-96 h-4 bg-slate-50 rounded" />
                <div className="flex gap-3 pt-4">
                  <div className="w-20 h-6 bg-slate-100 rounded" />
                  <div className="w-20 h-6 bg-slate-100 rounded" />
                </div>
             </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
             <div className="h-48 bg-slate-50 border border-slate-100 rounded-xl" />
             <div className="h-48 bg-slate-50 border border-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20 px-6 md:px-12 pt-8">
      <div className="max-w-5xl mx-auto">
        
        <button
          onClick={() => navigate("/showvendors")}
          className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6 w-fit pl-1"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </button>

        {/* HEADER SECTION - PROFESSIONAL DATA ROW */}
        <header className="flex flex-col md:flex-row gap-6 md:gap-8 items-start pb-8 border-b border-slate-200 mb-12">
           <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-slate-50">
             <img
               src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80"
               alt="Kitchen"
               className="w-full h-full object-cover grayscale-[15%]"
             />
           </div>
           <div className="flex-1 w-full">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{vendor.companyname}</h1>
              <p className="text-slate-600 mt-2 max-w-2xl text-sm leading-relaxed">{vendor.about}</p>
              
              <div className="flex flex-wrap gap-3 mt-6">
                 <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                    <Star size={14} className="text-orange-500" fill="currentColor"/> {vendor.rating || "0.0"}
                 </span>
                 <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                    <MapPin size={14} className="text-slate-400" /> {vendor.city}
                 </span>
                 <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                    <Phone size={14} className="text-slate-400" /> {vendor.phoneno}
                 </span>
              </div>
           </div>
        </header>

        {/* TODAY'S MENU - HORIZONTAL CARDS */}
        <section className="mb-20">
          <h2 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Today's Menu</h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Lunch Card */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col sm:flex-row hover:border-slate-300 transition-colors">
               <div className="sm:w-2/5 h-48 sm:h-auto bg-slate-100 border-b sm:border-b-0 sm:border-r border-slate-200">
                  <img src={todayMeal.lunch.img} className="w-full h-full object-cover" alt="Lunch" />
               </div>
               <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Lunch Protocol</span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1"><Clock size={12}/> {todayMeal.lunch.time}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-3">{todayMeal.lunch.title}</h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                       {todayMeal.lunch.items.join(" • ")}
                    </p>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg transition-colors w-fit flex items-center gap-2 shadow-sm cursor-pointer">
                     <ShoppingCart size={14} /> Order Direct
                  </button>
               </div>
            </div>

            {/* Dinner Card */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col sm:flex-row hover:border-slate-300 transition-colors">
               <div className="sm:w-2/5 h-48 sm:h-auto bg-slate-100 border-b sm:border-b-0 sm:border-r border-slate-200">
                  <img src={todayMeal.dinner.img} className="w-full h-full object-cover" alt="Dinner" />
               </div>
               <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Dinner Protocol</span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1"><Clock size={12}/> {todayMeal.dinner.time}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-3">{todayMeal.dinner.title}</h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                       {todayMeal.dinner.items.join(" • ")}
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium px-4 py-2.5 rounded-lg w-fit flex items-center gap-2">
                     <CheckCircle2 size={14} /> Subscription Bound
                  </div>
               </div>
            </div>

          </div>
        </section>

        {/* SUBSCRIPTION PLANS — agent.md bento cards */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Calendar size={18} className="text-orange-500" />
            <h2 className="text-lg font-bold tracking-tight text-slate-900 uppercase">Subscription Tiers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={`relative bg-white border rounded-xl p-6 flex flex-col shadow-[4px_4px_0_rgba(15,23,42,0.03)] transition-colors ${
                  plan.featured
                    ? 'border-orange-500'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-6 -translate-y-1/2">
                    <span className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Best Value
                    </span>
                  </div>
                )}

                <div className={`mb-6 ${plan.featured ? 'mt-3' : ''}`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{plan.duration} Plan</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight text-slate-900">₹{plan.price}</span>
                    <span className="text-xs text-slate-400 font-medium">/ cycle</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5 mb-6 flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 size={15} className="text-orange-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">2 meals per day, scheduled</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="text-orange-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">{plan.description}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/showvendors/payment/${plan._id}`)}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <ShoppingCart size={14} /> Select Plan
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* REVIEWS — agent.md card grid */}
        <section className="mb-10">
          <div className="flex items-center justify-between pb-5 border-b border-slate-200 mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare size={18} className="text-orange-500" />
              <h2 className="text-lg font-bold tracking-tight text-slate-900 uppercase">Customer Reviews</h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-50">
              <Star size={12} className="text-orange-500" fill="currentColor" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-700">{vendor.rating || "0.0"} avg</span>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-[4px_4px_0_rgba(15,23,42,0.03)] flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{rev.user_id?.name || "Verified User"}</p>
                        <p className="text-[10px] font-medium text-slate-500">Verified Participant</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-100 rounded-full">
                      <Star size={11} className="text-orange-500" fill="currentColor" />
                      <span className="text-[11px] font-bold text-orange-700">{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed border-t border-slate-100 pt-4 italic">
                    "{rev.review || "No comment provided."}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-14 flex flex-col items-center text-center border border-slate-200 rounded-xl bg-slate-50/50 shadow-[4px_4px_0_rgba(15,23,42,0.03)]">
              <MessageSquare size={28} className="text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No reviews yet</p>
              <p className="text-xs text-slate-400 mt-1">Be the first to leave feedback.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default VendorDetails;