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
  const [reviews, setReviews] = useState([]); // State for fetched ratings
  const [todayMeal, setTodayMeal] = useState({
    lunch: {
      title: "Executive Protein Lunch",
      items: ["4 Roti", "Paneer Sabzi", "Dal Fry", "Rice"],
      time: "12:30 PM - 2:00 PM",
      img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80",
    },
    dinner: {
      title: "Light Wellness Dinner",
      items: ["2 Missi Roti", "Mix Veg Sabzi", "Moong Dal", "Salad"],
      time: "7:30 PM - 9:00 PM",
      img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80",
    },
  });
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([
    {
      _id: "1",
      duration: "1 Month",
      price: "2800",
      label: "2 meals per day",
      description: "Standard Veg/Non-Veg Home-style Meals",
    },
    {
      _id: "2",
      duration: "6 Months",
      price: "4200",
      label: "2 meals per day",
      description: "Premium Selection with Custom Macros",
    },
    {
      _id: "3",
      duration: "1 Year",
      price: "7000",
      label: "2 meals per day",
      description: "Full Registry Access & Priority Delivery",
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
      <div className="min-h-screen bg-white px-6 md:px-12 py-10 animate-pulse">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 md:w-48 md:h-40 bg-gray-200 rounded-2xl" />
            <div className="flex-1 space-y-4 w-full">
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="flex gap-4">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* Meal Cards Skeleton */}
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className=" rounded-[2rem] overflow-hidden">
                <div className="h-40 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-6 w-2/3 bg-gray-200 rounded" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded" />
                  </div>
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-10 w-32 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Plans Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 rounded-2xl space-y-4">
                <div className="h-6 w-1/2 bg-gray-200 rounded" />
                <div className="h-8 w-1/3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/showvendors")}
          className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Vendors
        </button>
        <header className="py-10 border-b border-slate-100 flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="w-32 h-32 md:w-48 md:h-40 rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80"
              alt="Kitchen"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow space-y-3 text-center md:text-left">
            <h1 className="text-4xl font-black  uppercase tracking-tighter text-slate-900 leading-none">
              {vendor.companyname}
            </h1>
            <h1 className="text-xl ">{vendor.about}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <span className="flex items-center gap-1 text-orange-500">
                <Star size={14} fill="currentColor" /> {vendor.rating}
              </span>
              <span className="flex items-center gap-1 text-orange-500">
                <MapPin size={14} /> {vendor.city}
              </span>
              <span className="flex items-center gap-1 text-orange-500">
                <Phone size={14} /> {vendor.phoneno}
              </span>
            </div>
          </div>
        </header>

        {/* TODAY'S MEAL */}
        <section className="mb-20">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-2 mb-10">
            <Utensils size={16} className="text-orange-500" /> Today's Menu
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Lunch Session Card */}
            <div className="flex flex-col border border-slate-100 rounded-[2.5rem] bg-slate-50/30 overflow-hidden group">
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={todayMeal?.lunch?.img}
                  alt="Lunch"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-8">
                <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-2">
                  Session: Lunch
                </p>
                <h4 className="text-xl font-bold text-slate-800 mb-6">
                  {todayMeal?.lunch?.title}
                </h4>

                <ul className="space-y-3 border-t border-slate-100 pt-6">
                  {todayMeal?.lunch?.items?.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm font-medium text-slate-600 italic leading-relaxed"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center gap-2 text-slate-400">
                  <Clock size={12} />
                  <p className="text-[10px] font-bold uppercase tracking-tighter italic">
                    {todayMeal?.lunch?.time}
                  </p>
                </div>
                <button className="mt-6 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full font-bold text-[10px] uppercase tracking-[0.15em] transition-all active:scale-95 shadow-sm">
                  <ShoppingCart size={12} strokeWidth={2.5} />
                  Order Now
                </button>
              </div>
            </div>

            {/* Dinner Session Card */}
            <div className="flex flex-col border border-slate-100 rounded-[2.5rem] bg-white shadow-sm overflow-hidden group">
              <div className="h-40 w-full overflow-hidden text-center md:text-left">
                <img
                  src={todayMeal?.dinner?.img}
                  alt="Dinner"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-8">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Session: Dinner
                </p>
                <h4 className="text-xl font-bold text-slate-800 mb-6">
                  {todayMeal?.dinner?.title}
                </h4>

                <ul className="space-y-3 border-t border-slate-100 pt-6">
                  {todayMeal?.dinner?.items?.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm font-medium text-slate-600 italic leading-relaxed"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center gap-2 text-slate-400">
                  <Clock size={12} />
                  <p className="text-[10px] font-bold uppercase tracking-tighter italic">
                    {todayMeal?.dinner?.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUBSCRIPTION PLANS */}
        <div className="max-w-7xl mx-auto space-y-12 mb-20">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-2 mb-10">
            <Calendar size={16} className="text-orange-500" /> Subscription
            Plans
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="flex flex-col bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:border-orange-100 transition-colors duration-300"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                    <Calendar size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-50 px-3 py-1 rounded-full">
                    Subscription Tier
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                    {plan.duration}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-gray-900 tracking-tight">
                      ₹{plan.price}
                    </span>
                    <span className="text-gray-400 text-xs font-medium lowercase">
                      /plan
                    </span>
                  </div>
                </div>

                <div className="flex-grow mb-8">
                  <div className="h-px w-full bg-gray-100 mb-6" />
                  <div className="flex gap-3 items-start">
                    <CheckCircle2
                      size={16}
                      className="text-orange-500 mt-0.5 shrink-0"
                    />
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {plan.description ||
                        "Standard meal subscription with scheduled delivery."}
                    </p>
                  </div>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg shadow-orange-100"
                  onClick={() => {
                    navigate(`/showvendors/payment/${plan._id}`);
                  }}
                >
                  <ShoppingCart size={14} strokeWidth={2.5} />
                  Buy Plan
                </button>
              </div>
            ))}
          </div>
        </div>

      
        <section className="pt-10 border-t border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
              <MessageSquare size={16} className="text-orange-500" /> Customer
              Reviews
            </h3>
            <div className="bg-orange-50 px-4 py-2 rounded-full flex items-center gap-2">
              <Star size={14} className="text-orange-500" fill="currentColor" />
              <span className="text-sm font-black text-orange-600">
                {vendor.rating || "0.0"} Avg Rating
              </span>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev, index) => (
                <div
                  key={index}
                  className="p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                        <User size={20} />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">
                          {rev.user_id?.name || "Verified Customer"}
                        </h5>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-100 rounded-full">
                      <span className="text-xs font-black text-slate-800">
                        {rev.rating}
                      </span>
                      <Star
                        size={10}
                        className="text-orange-500"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                    "{rev.review || "No comment provided."}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
              <MessageSquare
                size={32}
                className="mx-auto text-slate-200 mb-3"
              />
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
                No reviews yet for this kitchen
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default VendorDetails;