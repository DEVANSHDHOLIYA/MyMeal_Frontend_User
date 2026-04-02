
import axios from "axios";
import { BACKEND_URL } from "../config/config.js";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const { register, handleSubmit, formState:{errors,isSubmitting} } = useForm();
  const navigate = useNavigate();

  const submit = async (data) => {
    const toastid= toast.loading("Sending OTP..");
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/user/resetpassword`, data);
      toast.success(res.data.message,{id:toastid});
      navigate("/resetpassword");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong",{id:toastid});
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">

      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="logo" className="w-16 h-16 object-contain"/>
          <h1 className="text-xl font-bold text-gray-800 mt-2">My<span className="text-orange-500">Meal</span></h1>
          <p className="text-xs text-gray-500">Reset your password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submit)} className="space-y-4">

          <div>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email",{required:"Email is required"})}
              className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r  from-orange-500 to-orange-600 cursor-pointer text-white font-semibold p-2.5 rounded-lg text-sm"
          >
            {isSubmitting ? "Sending..." : "Send OTP"}
          </button>

        </form>

        {/* Footer */}
        <p className="text-gray-500 text-xs text-center mt-6">
          Remember password?{" "}
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
}

export default ForgotPassword;