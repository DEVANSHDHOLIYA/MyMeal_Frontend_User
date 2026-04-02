import React from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function Signup() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const signup = async (data) => {
    const toastid= toast.loading("Creating account..");
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/user/register`, data);
      toast.success(res.data.message,{id:toastid});
      navigate("/verify_otp");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong",{id:toastid});
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl w-full max-w-md p-10">

        {/* Logo + Brand */}
        <div className="flex flex-col items-center text-center mb-10 space-y-3">
          <img
            src="/logo.png"
            alt="logo"
            className="w-20 h-20 object-contain"
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              My<span className="text-orange-500">Meal</span>
            </h1>
            <p className="text-sm text-gray-500">
              Your Meal, Your Choice
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(signup)}>

          <div className="space-y-1">
            <input
              type="text"
              placeholder="Full Name"
              {...register("name", { required: "Name is required" })}
              className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="email"
              placeholder="Email Address"
              {...register("email", { required: "Email is required" })}
              className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" }
              })}
              className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 bg-gradient-to-r from-orange-500 cursor-pointer to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold p-3.5 rounded-xl transition active:scale-95"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-gray-500 text-sm text-center mt-8">
          Already have an account?{" "}
          <span
            className="text-orange-500 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Log In
          </span>
        </p>

      </div>
    </div>
  );
}

export default Signup;