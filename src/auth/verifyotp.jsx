import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function VerifyOTP() {
  const { register, handleSubmit, setValue, watch, getValues, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const otpValue = watch("otp", ""); 
  const inputRef = useRef(null);

  // Timer State
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const verify = async (data) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/user/verify_otp`, data);
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    const toastid= toast.loading("Verifying OTP..");
    if (!canResend) return;

    const email = getValues("email");
    if (!email) {
      toast.error("Please enter your email address first",{id:toastid});
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/auth/user/resend_otp`, { email });
      toast.success(res.data.message || "OTP resent successfully",{id:toastid});
      // Reset timer
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP",{id:toastid});
    }
  };

  const renderBoxes = () => {
    return [0, 1, 2, 3, 4, 5].map((index) => (
      <div
        key={index}
        className={`w-12 h-14 flex items-center justify-center border-2 rounded-xl text-xl font-bold transition-all
          ${otpValue[index] ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 bg-gray-50 text-gray-400"}
          ${otpValue.length === index ? "ring-2 ring-orange-400 border-orange-400" : ""}`}
      >
        {otpValue[index] || ""}
      </div>
    ));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl w-full max-w-md p-10">
        
        <div className="flex flex-col items-center text-center mb-10 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="logo"
              className="w-14 h-14 object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              My<span className="text-orange-500">Meal</span>
            </h1>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Verify Email</h1>
            <p className="text-sm text-gray-500">Enter the 6-digit code</p>
          </div>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(verify)}>
          <div className="space-y-1">
            <input
              type="email"
              placeholder="Email Address"
              {...register("email", { required: "Email is required" })}
              className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div 
              className="flex justify-between gap-2 relative cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              {renderBoxes()}
              <input
                {...register("otp", {
                  required: "OTP is required",
                  minLength: { value: 6, message: "Enter all 6 digits" },
                })}
                ref={(e) => {
                  register("otp").ref(e);
                  inputRef.current = e;
                }}
                type="text"
                maxLength={6}
                className="absolute inset-0 opacity-0 cursor-default"
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setValue("otp", val);
                }}
              />
            </div>
            {errors.otp && <p className="text-red-500 text-xs text-center">{errors.otp.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 bg-gradient-to-r from-orange-500 cursor-pointer to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold p-3.5 rounded-xl transition active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? "Verifying..." : "Verify Account"}
          </button>

          <div className="text-gray-500 text-sm text-center mt-4">
            {canResend ? (
              <p>
                Didn't receive code?{" "}
                <span
                  className="text-orange-500 font-semibold cursor-pointer hover:underline"
                  onClick={handleResend}
                >
                  Resend
                </span>
              </p>
            ) : (
              <p className="text-gray-400">
                Resend code in <span className="font-mono font-bold text-gray-600">{timer}s</span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyOTP;