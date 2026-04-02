import React from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/config.js";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const submit = async (data) => {
    const toastid = toast.loading("Sending OTP..");
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/user/resetpassword`, data);
      toast.success(res.data.message, { id: toastid });
      navigate("/resetpassword");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", { id: toastid });
    }
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all";
  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2";
  const errorClass = "text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1.5";

  return (
    <div className="h-screen bg-white font-sans flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-md">

        {/* BRAND */}
        <div className="text-center mb-6">
          <img src="/logo.png" alt="MyMeal" className="w-16 h-16 object-contain mx-auto mb-2" />
          <h1 className="text-lg font-bold tracking-tight text-slate-900">My<span className="text-orange-500">Meal</span></h1>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Password recovery</p>
        </div>

        {/* CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">

          <div className="mb-6 pb-5 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Forgot Password?</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Enter your email and we'll send you a reset OTP</p>
          </div>

          <form onSubmit={handleSubmit(submit)} className="space-y-5">
            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" placeholder="john@example.com"
                {...register("email", { required: "Email is required" })}
                className={inputClass} />
              {errors.email && <p className={errorClass}>· {errors.email.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-colors shadow-sm shadow-orange-500/20 disabled:opacity-50">
              {isSubmitting ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-slate-400 text-center mt-4">
          Remember your password?{" "}
          <span onClick={() => navigate("/login")}
            className="text-orange-500 font-bold cursor-pointer hover:text-orange-600 transition-colors">
            Log In
          </span>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;