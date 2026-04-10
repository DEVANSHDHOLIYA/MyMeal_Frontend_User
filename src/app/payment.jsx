import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { ArrowLeft, CheckCircle2, ShieldCheck, QrCode, CreditCard, Receipt } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../config/config";

const MyMealGateway = () => {
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [planDetails, setPlanDetails] = useState(null);
  const [upi, setUpi] = useState(null);
  const navigate = useNavigate();
  const QR = QRCode.default ? QRCode.default : QRCode;
  const user_token = localStorage.getItem("user_token");
  
  const Authorization_Header = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    },
  };

  const subscription_id = useParams().subscription_id;

  useEffect(() => {
    getsubscriptionDetails();
  }, []);

  const getsubscriptionDetails = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/subscription/getsubscription/${subscription_id}`,
        Authorization_Header,
      );
      setPlanDetails(res.data.data.subscription);
      setUpi(res.data.data.upiid);
    } catch (err) {
      if(err.response?.data?.message=="Session Expired. Please Login Again.")
        {
          navigate("/login");
        }
         if(err.response?.data?.message=="Invaid token.")
        {
          navigate("/login");
        }
      toast.error(
        err.response?.data?.message || "Failed to fetch subscription details",
      );
    }
  };

  const handlepayment = async () => {
    setIsLoading(true);
    const toastid = toast.loading("Confirming Payment..");
    const payload = {
      subscription_id: subscription_id,
      price: planDetails?.price,
      duration: planDetails?.duration,
    };
    try {
      const res = await axios.post(`${BACKEND_URL}/subscription/buysubscription`, payload, Authorization_Header);
      toast.success(res.data.message, { id: toastid });
      navigate("/subscription");
    } catch (err) {
      if(err.response?.data?.message=="Session Expired. Please Login Again.")
        {
          navigate("/login");
        }
         if(err.response?.data?.message=="Invaid token.")
        {
          navigate("/login");
        }
      toast.error(err.response?.data?.message, { id: toastid });
    } finally {
      setIsLoading(false); 
    }
  };

  const upiLink = `upi://pay?pa=${upi}&pn=MyMeal&am=${planDetails?.price}&cu=INR`;

  const handleGenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowQR(true);
    }, 600);
  };

  if (!planDetails) {
    return (
      <div className="bg-white flex flex-col items-center justify-center p-4 md:p-8 min-h-[70vh] w-full">
         <div className="flex gap-2.5 items-center mb-5">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse delay-150"></div>
        </div>
        <p className="text-slate-900 font-bold tracking-widest text-[11px] uppercase">Initializing secure gateway</p>
      </div>
    );
  }

  return (
    <div className="bg-white flex justify-center p-4 md:p-8 font-sans  w-full">
      
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-[4px_4px_0_0_rgba(15,23,42,0.05)] border border-slate-200 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Pane: Ledger */}
        <div className="w-full md:w-[340px] p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-orange-600 mb-6">
               <Receipt className="w-5 h-5 stroke-[2px]" />
               <h2 className="text-[11px] font-bold uppercase tracking-widest">Order Ledger</h2>
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight mb-2">
              {planDetails?.duration}
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              {planDetails?.description || "Complete your secure transaction to lock in your daily meal deliveries."}
            </p>

            <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500 font-medium tracking-wide">Subtotal</span>
                 <span className="font-bold text-slate-900">₹{planDetails?.price}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500 font-medium tracking-wide">Taxes & Fees</span>
                 <span className="font-bold text-emerald-600">Included</span>
               </div>
            </div>

            <div className="h-px bg-slate-200 w-full my-6" />

            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Net Payable</span>
              <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                ₹{planDetails?.price}
              </span>
            </div>
          </div>
          
          
        </div>

        {/* Right Pane: Interaction Area */}
        <div className="flex-1 p-6 md:p-10 bg-white relative min-h-[400px] flex flex-col justify-center">
          
          {!showQR ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center mb-6">
                 <CreditCard className="w-6 h-6 text-orange-500" />
               </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                Secure Checkout
              </h3>
              <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed max-w-sm">
                Generate a dynamic UPI QR code to instantly verify your subscription payment.
              </p>

              <div className="p-5 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-between mb-8 group hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white border border-slate-200 rounded-md text-slate-700 group-hover:text-orange-500 group-hover:border-orange-200 transition-colors shadow-sm">
                    <QrCode size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Dynamic UPI</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      Instant Verification
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="text-emerald-500" size={20} />
              </div>

              <button
                disabled={isLoading}
                onClick={handleGenerate}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-bold text-[11px] uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:scale-100"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Generate UPI QR"
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-300 h-full justify-center">
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors text-[10px] font-bold uppercase tracking-widest"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <div className="text-center mb-4 mt-2">
                <h4 className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-2.5">
                  Scan to Pay
                </h4>
                <div className="inline-flex items-center gap-2 text-[11px] font-bold text-orange-600 uppercase tracking-widest bg-orange-50 border border-orange-100 px-3 py-1 rounded-sm">
                  ₹{planDetails?.price} INR
                </div>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-[4px_4px_0_0_rgba(15,23,42,0.05)] mb-6">
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
                  onClick={handlepayment}
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

export default MyMealGateway;
