import React, { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { ArrowLeft, CheckCircle2, Info, QrCode } from "lucide-react";
import { useParams,useNavigate } from "react-router-dom";
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
      toast.error(
        err.response?.data?.message || "Failed to fetch subscription details",
      );
    }
  };
  const handlepayment = async () => {
    setIsLoading(true);
    const toastid= toast.loading("Confirming Payment..");
    const payload = {
      subscription_id: subscription_id,
      price: planDetails?.price,
      duration: planDetails?.duration,
      
    };
    try {
      const res=await axios.post(`${BACKEND_URL}/subscription/buysubscription`, payload, Authorization_Header);
      toast.success(res.data.message,{id:toastid});
      navigate("/subscription");
      
    } catch (err) {
      toast.error(err.response?.data?.message,{id:toastid});
      
    } finally {      setIsLoading(false); 
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
    <div className="flex items-center justify-center p-4 animate-pulse">
      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row overflow-hidden">

        {/* Sidebar Skeleton */}
        <div className="w-full md:w-[320px] p-8 md:p-10 bg-orange-50/30 space-y-4">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-px bg-gray-200 my-4" />
          <div className="flex justify-between items-center">
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-8 w-20 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Main Skeleton */}
        <div className="flex-1 p-8 md:p-12 space-y-6">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-200 rounded" />

          <div className="p-6 border-2 border-gray-200 rounded-3xl flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="w-6 h-6 bg-gray-200 rounded-full" />
          </div>

          <div className="h-12 w-full bg-gray-200 rounded-2xl" />
        </div>

      </div>
    </div>
  );
}
  return (
    // Fixed: Removed min-h-screen to eliminate excessive top space
    <div className="flex items-center justify-center p-4 text-slate-800 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_30px_80px_-20px_rgba(249,115,22,0.15)] flex flex-col md:flex-row overflow-hidden border border-gray-100">
        {/* Sidebar: Order Summary */}
        <div className="w-full md:w-[320px] p-8 md:p-10 border-r border-orange-100 bg-orange-50/30 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mb-3">
              Your Selection
            </p>
            <h2 className="text-xl font-bold text-slate-800 leading-tight mb-2">
              {planDetails?.duration}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {planDetails?.description}
            </p>

            <div className="h-px bg-orange-200/50 my-6" />

            <div className="flex justify-between items-end">
              <span className="text-slate-500 font-bold">Total</span>
              <span className="text-4xl font-black text-orange-600 tracking-tighter leading-none">
                ₹{planDetails?.price}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content: QR Generation */}
        <div className="flex-1 p-8 md:p-12 bg-white relative min-h-[400px] flex flex-col justify-center">
          {!showQR ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Final Step
              </h3>
              <p className="text-slate-500 text-sm mb-10 font-medium">
                Generate your secure payment QR to activate your meals.
              </p>

              <div className="p-6 rounded-3xl border-2 border-orange-500 bg-orange-50/30 flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500 rounded-xl shadow-md text-white">
                    <QrCode size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Dynamic UPI QR</h4>
                    <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">
                      Fast & Secure
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="text-orange-500" size={24} />
              </div>

              <button
                disabled={isLoading}
                onClick={handleGenerate}
                className="w-full py-5 bg-orange-500 cursor-pointer hover:bg-orange-600 text-white rounded-3xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Confirm & Show QR"
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
              <button
                onClick={() => setShowQR(false)}
                className="flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors mb-8 self-start text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <ArrowLeft size={18} />
                Back to Order
              </button>

              <div className="text-center mb-8">
                <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  Scan to Pay
                </h4>
                <p className="text-sm text-slate-400 mt-2 font-medium italic">
                  Amount: ₹{planDetails?.price}
                </p>
              </div>

              <div className="relative p-8 bg-orange-50 rounded-[3.5rem] border-2 border-dashed border-orange-200 shadow-inner group overflow-hidden">
                <div className="bg-white p-5 rounded-3xl shadow-2xl border border-white">
                  <QR
                    value={upiLink}
                    size={200}
                    fgColor="#f97316"
                    level="H"
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
              </div>

             <div className="mt-10 w-full px-4">
    <button
      onClick={handlepayment}
      disabled={isLoading} // Disable while loading
      className="w-full py-4 bg-orange-500 cursor-pointer hover:bg-orange-600 text-white rounded-2xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <CheckCircle2
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          I've Completed Payment
        </>
      )}
    </button>

    <p className="mt-4 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
      {isLoading ? "Verifying your transaction..." : "Secure verification process"}
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
