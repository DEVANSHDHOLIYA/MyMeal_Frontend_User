import React, { useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const otpValue = watch("otp", "");

  const onSubmit = async (data) => {
    const toastid = toast.loading("Changing Password...");
    try {
      const res = await axios.post(
        `${BACKEND_URL}/auth/user/changepassword`,
        data,
      );

      toast.success(res.data.message, { id: toastid });
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message, { id: toastid });
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
        <div className="flex flex-col items-center text-center mb-10 space-y-6">
          {/* Logo + Brand */}
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

          {/* Title Section */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Set New Password
            </h1>
            <p className="text-sm text-gray-500">
              Enter the code and your new password
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* New Password Input */}
          <div className="space-y-1">
            <input
              type="password"
              placeholder="New Password"
              {...register("password", {
                required: "Password required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* 6-Box OTP Input Structure */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Verification Code
            </label>
            <div
              className="flex justify-between gap-2 relative cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              {renderBoxes()}
              <input
                {...register("otp", {
                  required: "OTP is required",
                  minLength: { value: 6, message: "Enter 6 digits" },
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
            {errors.otp && (
              <p className="text-red-500 text-xs text-center">
                {errors.otp.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 bg-gradient-to-r from-orange-500 cursor-pointer to-orange-600 text-white font-semibold p-3.5 rounded-xl transition active:scale-95 shadow-md shadow-orange-100"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-8">
          Back to{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-orange-500 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
