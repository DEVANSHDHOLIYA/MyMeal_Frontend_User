import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, CheckCircle2, ShieldCheck, Clock, MapPin, Receipt, Utensils, Plus, Minus, QrCode, CreditCard } from "lucide-react";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../config/config.js";

const MealCart = () => {
  const { meal_id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [meal, setMeal] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showQR, setShowQR] = useState(false);
  const QR = QRCode.default ? QRCode.default : QRCode;
  
  const user_token = localStorage.getItem("user_token");
  const Authorization_Header = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_token}`,
          },
        };
  useEffect(() => {
    const fetchMealData = async () => {
      try {
        
        const res = await axios.get(
          `${BACKEND_URL}/meals/mealbuydata/${meal_id}`,Authorization_Header
        );
        setMeal(res.data?.data);
      } catch (error) {
        if(error.response?.data?.message=="Session Expired. Please Login Again.")
        {
          navigate("/login");
        }
         if(error.response?.data?.message=="Invaid token.")
        {
          navigate("/login");
        }

        toast.error(error.response?.data?.message || "Failed to load meal data");
      } finally {
        setFetchingData(false);
      }
    };
    fetchMealData();
  }, [meal_id, user_token]);

  if (fetchingData) {
    return (
      <div className="bg-white flex flex-col items-center justify-center p-4 md:p-8 min-h-[70vh] w-full">
         <div className="flex gap-2.5 items-center mb-5">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse delay-150"></div>
        </div>
        <p className="text-slate-900 font-bold tracking-widest text-[11px] uppercase">Loading Meal Details</p>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center w-full">
        <p className="text-sm font-bold text-slate-500">Meal not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-orange-500 hover:text-orange-600 text-sm font-bold">Go Back</button>
      </div>
    );
  }

  const mealItems = Array.isArray(meal.items) ? meal.items : meal.items?.split(",") || [];
  const total = (meal.price || 0) * quantity;

  const upi = meal.upiid || meal.vendor_id?.upiid || "vendor@upi";
  const upiLink = `upi://pay?pa=${upi}&pn=MyMeal&am=${total}&cu=INR`;

  const handleGenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowQR(true);
    }, 600);
  };

 const handleCheckout = async () => {
  setIsLoading(true);
  const toastId = toast.loading("Confirming Payment...");

  try {
    const payload = {
      meal_id: meal_id,
      price: meal.price,
      quantity: quantity,
      total: total,
    };

    const res = await axios.post(`${BACKEND_URL}/order/addorder`,payload,Authorization_Header);
    toast.success(res.data.message, { id: toastId });
    navigate("/dashboard");
  } catch (err) {
    if (
      err.response?.data?.message === "Session Expired. Please Login Again." ||
      err.response?.data?.message === "Invaid token."
    ) {
      navigate("/login");
    }

    toast.error(
      err?.response?.data?.message || "Failed to place order",
      { id: toastId }
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-[85vh] bg-white flex justify-center p-4 md:p-8 font-sans w-full">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-[4px_4px_0_0_rgba(15,23,42,0.05)] border border-slate-200 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Pane: Cart Details */}
        <div className="w-full md:w-3/5 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-200 bg-white flex flex-col">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors text-[10px] font-bold uppercase tracking-widest mb-6 w-fit"
          >
            <ArrowLeft size={16} />
            Back to Vendor
          </button>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-md flex items-center justify-center text-orange-500">
               <ShoppingCart size={20} />
            </div>
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-slate-900">Your Cart</h2>
               <p className="text-xs text-slate-500 font-medium mt-1">Review your meal details before checkout</p>
            </div>
          </div>

          <div className="flex-1">
             <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl border border-slate-200 bg-slate-50 relative group">
                {(() => {
                  const mealItemName = mealItems[0] || "Premium Meal";
                  return (
                    <>
                 <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm shrink-0">
                   <img src={meal.mealphoto?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"} alt={mealItemName} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-between flex-1 py-1">
                   <div>
                      <div className="flex justify-between items-start mb-1">
                         <h3 className="text-lg font-bold text-slate-900 leading-tight">{mealItemName}</h3>
                         <span className="text-lg font-black text-slate-900">₹{meal.price}</span>
                      </div>
                      <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-3">Meal Vendor</p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-3">
                         {mealItems.slice(1).map((item, idx) => (
                            <span key={idx} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                               {item.trim()}
                            </span>
                         ))}
                      </div>
                   </div>
                   
                   <div className="flex items-center justify-between mt-2">
                       <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                           <span className="flex items-center gap-1.5"><Clock size={14} className="text-indigo-500" /> {meal.mealtime}</span>
                           <span className="flex items-center gap-1.5"><MapPin size={14} className="text-emerald-500" /> Delivery</span>
                       </div>

                       <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1 border border-slate-200">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-slate-700 hover:text-orange-500 hover:border-orange-200 transition-colors border border-transparent">
                            <Minus size={14} strokeWidth={3} />
                          </button>
                          <span className="text-xs font-bold text-slate-900 w-4 text-center">{quantity}</span>
                          <button onClick={() => setQuantity(quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-slate-700 hover:text-orange-500 hover:border-orange-200 transition-colors border border-transparent">
                            <Plus size={14} strokeWidth={3} />
                          </button>
                       </div>
                   </div>
                </div>
              </>
             );
           })()}
             </div>
          </div>
          
         
        </div>

        {/* Right Pane: Checkout Ledger */}
        <div className="w-full md:w-2/5 p-6 md:p-8 bg-slate-50 flex flex-col justify-between relative min-h-[450px]">
          {!showQR ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-900 mb-8 border-b border-slate-200 pb-4">
                   <Receipt className="w-5 h-5 text-orange-500" />
                   <h2 className="text-sm font-bold uppercase tracking-widest">Order Summary</h2>
                </div>

                <div className="space-y-4 mb-6">
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500 font-medium">Item Total</span>
                     <span className="font-bold text-slate-900">₹{meal.price * quantity}</span>
                   </div>
                </div>

                <div className="p-4 rounded-lg bg-orange-50/50 border border-orange-100 mb-8">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1.5">To Pay</span>
                      <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                        ₹{total}
                      </span>
                    </div>
                </div>

                <div className="p-4 rounded-md border border-slate-200 bg-white flex items-center justify-between mb-8 group hover:border-slate-300 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 group-hover:text-orange-500 group-hover:border-orange-200 transition-colors shadow-sm">
                      <QrCode size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Dynamic UPI</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        Instant Verification
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="text-emerald-500" size={18} />
                </div>
              </div>

              <div className="w-full mt-4">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-bold text-[11px] tracking-widest uppercase transition-all shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Generate UPI QR"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-300 h-full justify-center">
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors text-[10px] font-bold uppercase tracking-widest"
              >
                <ArrowLeft size={16} /> Back
              </button>

              <div className="text-center mb-4 mt-6">
                <h4 className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-2.5">
                  Scan to Pay
                </h4>
                <div className="inline-flex items-center gap-2 text-[11px] font-bold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-100 px-3 py-1 rounded-sm">
                  ₹{total} INR
                </div>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-[4px_4px_0_0_rgba(15,23,42,0.05)] mb-8">
                <QR
                  value={upiLink}
                  size={160}
                  fgColor="#0F172A"
                  level="H"
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>

              <div className="w-full">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-md font-bold text-[11px] tracking-widest uppercase transition-all shadow-[0_4px_14px_0_rgba(15,23,42,0.39)] flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Verify Transaction
                    </>
                  )}
                </button>
                <p className="mt-4 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2 h-4">
                  {isLoading ? (
                    <span className="flex items-center gap-2 text-orange-500 transition-opacity">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                      Awaiting Bank Validation...
                    </span>
                  ) : "Awaiting your transfer"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealCart;
