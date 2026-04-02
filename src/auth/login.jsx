import React from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/config";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const onLogin = async (data) => {
    const toastid= toast.loading("Logging in..");
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/user/login`, data); 
      toast.success(res.data.message,{id:toastid});

      if (res.data.token) {
        localStorage.setItem("user_token", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      if(err?.response?.data?.message ==="Verify your account first. mail has been sent to your email"){
        navigate("/verify_otp");
      }
      toast.error(err?.response?.data?.message || "Login failed",{id:toastid});
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
        <form onSubmit={handleSubmit(onLogin)} className="flex flex-col gap-5">

          {/* Email */}
          <div className="space-y-1">
            <input
              type="email"
              placeholder="Email Address"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end -mt-2">
            <span
              onClick={() => navigate("/forgetpassword")}
              className="text-sm text-orange-500 cursor-pointer hover:underline"
            >
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 bg-gradient-to-r cursor-pointer from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold p-3.5 rounded-xl transition active:scale-95"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-gray-500 text-sm text-center mt-8">
          New to MyMeal?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-orange-500 cursor-pointer font-medium hover:underline"
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;