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
  Calendar,
  ShoppingCart,
  User,
  MessageSquare,
  Lock,
  Globe,
  MoreHorizontal,
} from "lucide-react";
import { BACKEND_URL } from "../config/config.js";
import toast from "react-hot-toast";
import { a } from "framer-motion/m";

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

  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [meals, setMeals] = useState([]);

  
  const MealCard = ({ meal }) => (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[4px_4px_0_rgba(15,23,42,0.03)] hover:border-slate-300 transition-all hover:-translate-y-1 group">
      {/* IMAGE */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={
            meal.mealphoto?.url ||
            "https://images.unsplash.com/photo-1495195129352-aec325a55b65?auto=format&fit=crop&q=80&w=400"
          }
          alt="Meal"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* TAGS */}
        <div className="absolute top-3 left-3 flex gap-2">
          {!(Array.isArray(meal.subscription_id) && meal.subscription_id.length > 0) ? (
            <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
              <Lock size={8} /> Subscription
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
              <Globe size={8} /> Normal Meal
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
              meal.mealtime === "lunch"
                ? "bg-orange-500 text-white"
                : "bg-slate-800 text-white"
            }`}
          >
            {meal.mealtime}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-4 flex flex-col h-[calc(100%-12rem)]">
        {/* TITLE + ITEMS */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            {Array.isArray(meal.items)
              ? meal.items[0]
              : meal.items?.split(",")[0] || "Meal Package"}
          </h3>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {Array.isArray(meal.items)
              ? meal.items.map((item, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100"
                  >
                    {item}
                  </span>
                ))
              : meal.items
                  ?.split(",")
                  .filter((item) => item.trim() !== "")
                  .map((item, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100"
                    >
                      {item.trim()}
                    </span>
                  ))}
          </div>
        </div>

        {/* PRICE + STATUS */}
        <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
              Price
            </p>
            <p className="text-base font-bold text-slate-900">₹{meal.price}</p>
          </div>

          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
              Status
            </p>
            <p
              className={`text-[10px] font-black uppercase tracking-tight ${
                meal.isavilable ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {meal.isavilable ? "Available" : "Sold Out"}
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-orange-500" />
            <span className="text-xs font-bold text-slate-500">
              {meal.meal_date
                ? new Date(meal.meal_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                : "N/A"}
            </span>
          </div>

         
          {!(Array.isArray(meal.subscription_id) && meal.subscription_id.length > 0) ? (
           <span className="text-[10px] font-bold text-indigo-500 uppercase">
              Subscription Only
            </span>
          ) : (
            
             <button
               onClick={() => navigate(`/showvendors/meal/payment/${meal._id}`)}
              disabled={!meal.isavilable}
              className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
                meal.isavilable
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const fetchVendorData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/user/getvendorsubscription/${vendor_id}`,
        Authorization_Header,
      );
      const result = await axios.get(
        `${BACKEND_URL}/meals/getmeals/${vendor_id}`,
        Authorization_Header,
      );
      setMeals(result.data?.data);
      
      if (res.data?.data) {
        setVendor(res.data.data.vendordata[0]);
        setPlans(res.data.data.subscription);
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
      setVendor({});
    } finally {
      setLoading(false);
    }
  }, [vendor_id]);
 
  const getratings = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/rating/getratings/${vendor_id}`,
        Authorization_Header,
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
    <div className="min-h-screen  font-sans text-slate-900 pb-20 px-6 md:px-12 pt-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/showvendors")}
          className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6 w-fit pl-1"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </button>

        {/* HEADER SECTION - PROFESSIONAL DATA ROW */}
        <header className="flex flex-col gap-6 pb-8 border-b border-slate-200 mb-12">
          {/* Full-width Landscape Vendor Image */}
          <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-slate-50">
            <img
              src={
                vendor.avatar?.url ||
                "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80"
              }
              alt="Vendor"
              className="w-full h-full object-cover grayscale-[15%]"
            />
          </div>

          {/* Vendor Info */}
          <div className="w-full">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              {vendor.companyname}
            </h1>
            <p className="text-slate-600 mt-3 max-w-3xl text-sm md:text-base leading-relaxed">
              {vendor.about}
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <span className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                <Star
                  size={16}
                  className="text-orange-500"
                  fill="currentColor"
                />{" "}
                {vendor.rating || "0.0"}
              </span>
              <span className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                <MapPin size={16} className="text-slate-400" /> {vendor.city}
              </span>
              <span className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                <Phone size={16} className="text-slate-400" /> {vendor.phoneno}
              </span>
            </div>
          </div>
        </header>
        {/* MEALS SECTION */}
        <section className="mb-20">
          <h2 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">
            Available Meals
          </h2>

          {Array.isArray(meals) && meals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals.map((meal) => (
                <MealCard key={meal._id} meal={meal} />
              ))}
            </div>
          ) : (
            // 🔥 EMPTY STATE UI
            <div className="py-16 flex flex-col items-center justify-center text-center border border-slate-200 rounded-xl bg-slate-50/50 shadow-[4px_4px_0_rgba(15,23,42,0.03)]">
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm mb-4">
                <Calendar size={24} className="text-slate-300" />
              </div>

              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest">
                No Meals Found
              </h3>

              <p className="text-xs text-slate-400 mt-2 max-w-xs">
                This vendor hasn’t added any meals for today. Please check back
                later.
              </p>
            </div>
          )}
        </section>

        {/* SUBSCRIPTION PLANS — agent.md bento cards */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Calendar size={18} className="text-orange-500" />
            <h2 className="text-lg font-bold tracking-tight text-slate-900 uppercase">
              Subscription Tiers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={`relative bg-white border rounded-xl p-6 flex flex-col shadow-[4px_4px_0_rgba(15,23,42,0.03)] transition-colors ${
                  plan.featured
                    ? "border-orange-500"
                    : "border-slate-200 hover:border-slate-300"
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

                <div className={`mb-6 ${plan.featured ? "mt-3" : ""}`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    {plan.duration} Plan
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight text-slate-900">
                      ₹{plan.price}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      / cycle
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5 mb-6 flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2
                      size={15}
                      className="text-orange-500 mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      2 meals per day, scheduled
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={15}
                      className="text-orange-500 mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-slate-700 font-medium leading-relaxed">
                      {plan.description}
                    </span>
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
              <h2 className="text-lg font-bold tracking-tight text-slate-900 uppercase">
                Customer Reviews
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-50">
              <Star size={12} className="text-orange-500" fill="currentColor" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-700">
                {vendor.rating || "0.0"} avg
              </span>
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
                        <p className="text-sm font-bold text-slate-900">
                          {rev.user_id?.name || "Verified User"}
                        </p>
                        <p className="text-[10px] font-medium text-slate-500">
                          Verified Participant
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-100 rounded-full">
                      <Star
                        size={11}
                        className="text-orange-500"
                        fill="currentColor"
                      />
                      <span className="text-[11px] font-bold text-orange-700">
                        {rev.rating}
                      </span>
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
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                No reviews yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Be the first to leave feedback.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default VendorDetails;
