import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, User, Phone, MapPin, CheckCircle2 } from "lucide-react";

const STEPS = [
  { id: 1, label: "Account", desc: "Login credentials", icon: User },
  { id: 2, label: "Contact", desc: "How we reach you", icon: Phone },
  { id: 3, label: "Address", desc: "Delivery location", icon: MapPin },
];

function Signup() {
  const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const fieldsByStep = {
    1: ["name", "email", "password"],
    2: ["phoneno", "country"],
    3: ["address", "state", "city", "pincode"],
  };

  const nextStep = async () => {
    const valid = await trigger(fieldsByStep[step]);
    if (valid) setStep((s) => s + 1);
  };

  const signup = async (data) => {
    const toastid = toast.loading("Creating account..");
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/user/register`, data);
      toast.success(res.data.message, { id: toastid });
      navigate("/verify_otp");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", { id: toastid });
    }
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all";
  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2";
  const errorClass = "text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1.5 flex items-center gap-1";

  const currentStep = STEPS[step - 1];

  return (
    <div className="h-screen bg-white font-sans flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-md">

        {/* BRAND HEADER */}
        <div className="text-center mb-5">
          <img src="/logo.png" alt="MyMeal" className="w-16 h-16 object-contain mx-auto mb-2" />
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            My<span className="text-orange-500">Meal</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Create your account to get started</p>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex items-center mb-5">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all duration-200 ${
                    isDone
                      ? 'bg-orange-500 border-orange-500 shadow-sm shadow-orange-500/20'
                      : isActive
                      ? 'bg-orange-500 border-orange-500 shadow-sm shadow-orange-500/20'
                      : 'bg-white border-slate-200'
                  }`}>
                    {isDone
                      ? <CheckCircle2 size={14} className="text-white" />
                      : <Icon size={14} className={isActive ? "text-white" : "text-slate-300"} />
                    }
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${
                    isActive || isDone ? 'text-orange-500' : 'text-slate-300'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 mx-2 mb-4">
                    <div className={`h-0.5 rounded-full transition-all duration-300 ${step > s.id ? 'bg-orange-500' : 'bg-slate-100'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">

          {/* Step title */}
          <div className="mb-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">
                {React.createElement(currentStep.icon, { size: 13, className: "text-orange-500" })}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-none">{currentStep.label}</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">{currentStep.desc}</p>
              </div>
              <span className="ml-auto text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {step} / {STEPS.length}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(signup)}>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input type="text" placeholder="John Doe"
                    {...register("name", { required: "Name is required" })}
                    className={inputClass} />
                  {errors.name && <p className={errorClass}>· {errors.name.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" placeholder="john@example.com"
                    {...register("email", { required: "Email is required" })}
                    className={inputClass} />
                  {errors.email && <p className={errorClass}>· {errors.email.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <input type="password" placeholder="Min. 8 characters"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 8, message: "Minimum 8 characters required" }
                    })}
                    className={inputClass} />
                  {errors.password && <p className={errorClass}>· {errors.password.message}</p>}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input type="tel" placeholder="9876543210"
                    {...register("phoneno", {
                      required: "Phone number is required",
                      pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" }
                    })}
                    className={inputClass} />
                  {errors.phoneno && <p className={errorClass}>· {errors.phoneno.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input type="text" placeholder="India"
                    {...register("country", { required: "Country is required" })}
                    className={inputClass} />
                  {errors.country && <p className={errorClass}>· {errors.country.message}</p>}
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Street / House Address</label>
                  <input type="text" placeholder="123, Sector / Area Name"
                    {...register("address", { required: "Address is required" })}
                    className={inputClass} />
                  {errors.address && <p className={errorClass}>· {errors.address.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>State</label>
                    <input type="text" placeholder="Gujarat"
                      {...register("state", { required: "Required" })}
                      className={inputClass} />
                    {errors.state && <p className={errorClass}>· {errors.state.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input type="text" placeholder="Surat"
                      {...register("city", { required: "Required" })}
                      className={inputClass} />
                    {errors.city && <p className={errorClass}>· {errors.city.message}</p>}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Pin Code</label>
                  <input type="text" placeholder="395001"
                    {...register("pincode", {
                      required: "Pin code is required",
                      pattern: { value: /^[0-9]{6}$/, message: "Enter valid 6-digit pin" }
                    })}
                    className={inputClass} />
                  {errors.pincode && <p className={errorClass}>· {errors.pincode.message}</p>}
                </div>
              </div>
            )}

            {/* NAVIGATION */}
            <div className={`flex mt-5 gap-3 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
              {step > 1 && (
                <button type="button" onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:border-orange-400 hover:text-orange-500 transition-all cursor-pointer">
                  <ArrowLeft size={13} /> Back
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={nextStep}
                  className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-sm shadow-orange-500/20">
                  Continue <ArrowRight size={13} />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer shadow-sm shadow-orange-500/20 disabled:opacity-50">
                  {isSubmitting ? "Creating..." : "Create Account"}
                </button>
              )}
            </div>

          </form>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-slate-400 text-center mt-4">
          Already have an account?{" "}
          <span className="text-orange-500 font-bold cursor-pointer hover:text-orange-600 transition-colors"
            onClick={() => navigate('/login')}>
            Log In
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;