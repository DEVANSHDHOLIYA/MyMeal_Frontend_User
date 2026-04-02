import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import {
  Utensils, Calendar, ShoppingBag, ArrowRight,
  Clock, CheckCircle2, AlertCircle, User,
  TrendingUp, MapPin, ChevronRight, Zap,
} from "lucide-react";

const StatSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[4px_4px_0_rgba(15,23,42,0.03)] animate-pulse flex flex-col gap-4">
    <div className="w-8 h-8 rounded-lg bg-slate-100" />
    <div className="space-y-1.5">
      <div className="h-2 w-16 bg-slate-100 rounded" />
      <div className="h-6 w-12 bg-slate-200 rounded" />
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const user_token = localStorage.getItem("user_token");
  const headers = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${user_token}` } };

  useEffect(() => {
    const cached = localStorage.getItem("user_profile");
    if (cached) setProfile(JSON.parse(cached));

    const fetchData = async () => {
      try {
        const [profileRes, subRes] = await Promise.allSettled([
          axios.post(`${BACKEND_URL}/profile/get_profile`, {}, headers),
          axios.get(`${BACKEND_URL}/user/getsubscription`, headers),
        ]);
        if (profileRes.status === "fulfilled" && profileRes.value.data?.data) {
          setProfile(profileRes.value.data.data);
          localStorage.setItem("user_profile", JSON.stringify(profileRes.value.data.data));
        }
        if (subRes.status === "fulfilled" && subRes.value.data?.data) {
          setSubscription(subRes.value.data.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const end = subscription?.enddate ? new Date(subscription.enddate) : null;
  const start = subscription?.startdate ? new Date(subscription.startdate) : null;
  const today = new Date();
  const daysLeft = end ? Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24))) : null;
  const totalDays = (start && end) ? Math.ceil((end - start) / (1000 * 60 * 60 * 24)) : null;
  const progress = (totalDays && daysLeft !== null) ? Math.round(((totalDays - daysLeft) / totalDays) * 100) : 0;
  const isLow = daysLeft !== null && daysLeft <= 5;

  const stats = [
    { label: "Plan", value: subscription?.duration || "—", icon: Calendar, color: "orange" },
    { label: "Days Left", value: daysLeft !== null ? (subscription?.ispaused ? "Paused" : `${daysLeft}`) : "—", icon: Clock, color: isLow ? "rose" : "emerald" },
    { label: "Plan Value", value: subscription?.subscription_id?.price ? `₹${subscription.subscription_id.price}` : "—", icon: TrendingUp, color: "slate" },
    { label: "Account", value: profile?.name?.split(" ")[0] || "User", icon: User, color: "orange" },
  ];

  const colorMap = {
    orange: { bg: "bg-orange-50", border: "border-orange-100", icon: "text-orange-500" },
    emerald: { bg: "bg-emerald-50", border: "border-emerald-100", icon: "text-emerald-500" },
    rose: { bg: "bg-rose-50", border: "border-rose-100", icon: "text-rose-500" },
    slate: { bg: "bg-slate-50", border: "border-slate-200", icon: "text-slate-500" },
  };

  const upcomingMeals = [
    { day: "Mon", name: "Dal + Rice", time: "12:30 PM", done: true },
    { day: "Tue", name: "Roti + Sabji", time: "12:30 PM", done: false },
    { day: "Wed", name: "Paneer Curry", time: "12:30 PM", done: false },
  ];

  const greetingHour = today.getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-6">

      {/* ── HEADER ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-1">
            {today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {greeting}{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Here's your meal activity for today.</p>
        </div>
        <button onClick={() => navigate("/showvendors")}
          className="self-start sm:self-auto flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm shadow-orange-500/20">
          <ShoppingBag size={13} /> Browse Vendors
        </button>
      </div>

      {/* ── STAT CARDS ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && !profile
          ? [1,2,3,4].map(n => <StatSkeleton key={n} />)
          : stats.map((s, i) => {
              const Icon = s.icon;
              const c = colorMap[s.color];
              return (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-[4px_4px_0_rgba(15,23,42,0.03)] flex flex-col gap-4 hover:border-slate-300 transition-colors">
                  <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                    <Icon size={16} className={c.icon} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
                    <p className="text-xl font-bold text-slate-900 tracking-tight mt-1 truncate">{s.value}</p>
                  </div>
                </div>
              );
            })
        }
      </div>

      {/* ── TODAY'S MEAL ───────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[4px_4px_0_rgba(15,23,42,0.03)]">
        {/* Card header */}
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
          <Utensils size={15} className="text-orange-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Today's Meal</span>
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse block" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-700">Live Delivery</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="sm:w-52 h-40 sm:h-auto bg-slate-100 border-b sm:border-b-0 sm:border-r border-slate-200 shrink-0 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80"
              alt="Meal" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>

          <div className="flex-1 p-6 flex flex-col sm:flex-row sm:items-start gap-6 justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md">Dinner</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md">7:30 PM</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Paneer Butter Masala</h3>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {["3 Roti", "Paneer Masala", "Dal Tadka", "Rice", "Papad"].map((item, i) => (
                  <span key={i} className="text-[11px] font-medium bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg">
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                <MapPin size={11} className="text-orange-500" />
                by HomeKitchen
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 shrink-0 sm:pt-1">
              <button className="flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm shadow-orange-500/20 w-full sm:w-auto">
                Change
              </button>
              <button className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-all w-full sm:w-auto">
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM GRID ────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* UPCOMING */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-[4px_4px_0_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
            <Calendar size={15} className="text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Upcoming Meals</span>
            <span className="ml-auto text-[9px] font-bold text-slate-400 uppercase tracking-widest">This Week</span>
          </div>
          <div className="divide-y divide-slate-50">
            {upcomingMeals.map((meal, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  meal.done ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'
                }`}>
                  <span className={`text-[10px] font-black uppercase ${meal.done ? 'text-emerald-500' : 'text-orange-500'}`}>
                    {meal.day}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{meal.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{meal.time}</p>
                </div>
                {meal.done
                  ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  : <ChevronRight size={14} className="text-slate-300 shrink-0" />
                }
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
            <button className="text-[10px] font-bold text-orange-500 hover:text-orange-600 uppercase tracking-widest cursor-pointer flex items-center gap-1">
              View Full Schedule <ArrowRight size={10} />
            </button>
          </div>
        </div>

        {/* SUBSCRIPTION */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-[4px_4px_0_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
            <ShoppingBag size={15} className="text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Subscription</span>
            {subscription?.ispaused
              ? <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full">Paused</span>
              : subscription
              ? <span className="ml-auto flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" /> Active
                </span>
              : null
            }
          </div>

          <div className="p-6 flex flex-col gap-5">
            {loading && !subscription ? (
              <div className="animate-pulse space-y-3">
                {[1,2,3].map(n => <div key={n} className="h-3 bg-slate-100 rounded w-full" />)}
              </div>
            ) : subscription ? (
              <>
                <div className="space-y-3">
                  {[
                    ["Plan", subscription.duration || "—"],
                    ["Days Remaining", daysLeft !== null ? `${daysLeft} days` : "—"],
                    ["Expiry", end ? end.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                      <span className="text-xs font-medium text-slate-500">{k}</span>
                      <span className={`text-xs font-bold ${k === "Days Remaining" && isLow ? "text-rose-500" : "text-slate-900"}`}>{v}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Cycle Usage</span>
                    <span className="text-orange-500">{progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${isLow ? 'bg-rose-500' : 'bg-orange-500'}`}
                      style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button onClick={() => navigate("/subscription")}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold uppercase tracking-widest py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm shadow-orange-500/20">
                    Manage <ArrowRight size={12} />
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-widest py-2.5 rounded-xl cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-all">
                    {subscription.ispaused ? "Resume" : "Pause"}
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-3">
                  <AlertCircle size={20} className="text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-500">No Active Subscription</p>
                <p className="text-xs text-slate-400 mt-1">Choose a vendor to get started</p>
                <button onClick={() => navigate("/showvendors")}
                  className="mt-4 flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm">
                  Browse Vendors <ArrowRight size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ──────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[4px_4px_0_rgba(15,23,42,0.03)]">
        <div className="flex items-center gap-2 mb-5">
          <Zap size={15} className="text-orange-500" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900">Quick Actions</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm shadow-orange-500/20">
            <Utensils size={13} /> Change Today's Meal
          </button>
          <button onClick={() => navigate("/showvendors")}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-all">
            <ShoppingBag size={13} /> Browse Vendors
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-all">
            <AlertCircle size={13} /> Skip Tomorrow
          </button>
          <button onClick={() => navigate("/profile")}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl cursor-pointer hover:border-orange-400 hover:text-orange-500 transition-all">
            <User size={13} /> Edit Profile
          </button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;