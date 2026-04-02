import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { BACKEND_URL } from "../config/config.js";

const SkeletonTile = () => (
  <div className="animate-pulse flex flex-col gap-2">
    <div className="h-3 w-20 bg-slate-200 rounded"></div>
    <div className="h-11 w-full bg-white border border-slate-200 rounded-lg"></div>
  </div>
);

const DataTile = ({ label, name, value, isEditing, isTextArea, onChange, error }) => (
  <div className="flex flex-col relative transition-all">
    <label className="text-[13px] font-semibold text-slate-700 mb-1.5">{label}</label>
    
    {isEditing ? (
      <div className="relative">
        {isTextArea ? (
          <textarea
            name={name}
            className={`w-full bg-white border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-100'} p-3 font-medium text-[15px] text-slate-900 outline-none resize-none rounded-lg focus:ring-2 transition-shadow shadow-sm`}
            rows="3"
            value={value || ""}
            onChange={onChange}
          />
        ) : (
          <input
            type="text"
            name={name}
            className={`w-full bg-white border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-100'} px-3 py-2.5 font-medium text-[15px] text-slate-900 outline-none rounded-lg focus:ring-2 transition-shadow shadow-sm`}
            value={value || ""}
            onChange={onChange}
          />
        )}
        {error && <span className="absolute -bottom-5 left-0 text-[11px] text-red-500 font-medium">{error.message}</span>}
      </div>
    ) : (
      <div className="bg-white border border-slate-200 py-2.5 px-3.5 rounded-lg shadow-sm">
        <p className={`font-medium text-[15px] ${value ? 'text-slate-900' : 'text-slate-400 italic'}`}>
          {value || "Not provided"}
        </p>
      </div>
    )}
  </div>
);

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fetching, setFetching] = useState(true); 
  const navigate = useNavigate();
  const user_token = localStorage.getItem("user_token");

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: "", email: "", phoneno: "", address: "", city: "", state: "", country: "", pincode: ""
    }
  });

  const formData = watch();

  const Authorization_Header = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${user_token}`
    },
  };

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/profile/get_profile`, {}, Authorization_Header);
      if (res.data?.data) {
        reset(res.data.data);
        localStorage.setItem("user_profile", JSON.stringify(res.data.data));
      }
    } catch (err) {
      if (err.response?.status !== 401) toast.error("Could not sync profile");
    } finally {
      setFetching(false); 
    }
  }, [reset]);

  useEffect(() => {
    const cached = localStorage.getItem("user_profile");
    if (cached) {
        reset(JSON.parse(cached));
        setFetching(false); 
    }
    fetchProfile();
  }, [fetchProfile]);

  const onSave = async (data) => {
    setIsSaving(true);
    const toastid=toast.loading("Updating Profile..");
    try {
      const res = await axios.post(`${BACKEND_URL}/profile/update_profile`, data, {
        headers: { Authorization: `Bearer ${user_token}` }
      });
      toast.success(res.data.message,{id:toastid});
      setIsEditing(false);
      localStorage.setItem("user_profile", JSON.stringify(data));
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed",{id:toastid});
    } finally {
      setIsSaving(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
    toast.success("Logged out Successfully");
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-slate-200 mb-10">
           <div className="flex items-center gap-5 mb-6 md:mb-0">
             <div className="w-20 h-20 bg-white border border-orange-100 rounded-2xl flex items-center justify-center text-orange-500 text-3xl font-bold shadow-sm">
               {fetching ? <div className="w-full h-full bg-slate-200 animate-pulse rounded-2xl"></div> : formData.name?.charAt(0) || "U"}
             </div>
             <div>
               <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
                 {fetching ? <div className="w-32 h-6 bg-slate-200 animate-pulse rounded"></div> : formData.name || "Your Profile"}
               </h1>
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                 <p className="text-[15px] font-medium text-slate-500 leading-none">
                   {fetching ? "..." : formData.email || "No email linked"}
                 </p>
               </div>
             </div>
           </div>

           <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
             {!isEditing && (
                <button type="button" onClick={logout} className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-[13px] uppercase tracking-wide font-bold hover:bg-slate-50 hover:text-red-600 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed">
                  Log Out
                </button>
             )}
           </div>
        </div>

        {/* Profile Form Content */}
        <form onSubmit={handleSubmit(onSave)} className="w-full">

           {/* Section Top Actions */}
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                 <h2 className="text-xl font-bold text-slate-900 tracking-tight">Personal Information</h2>
                 <p className="text-[14px] text-slate-500 mt-1">Review and manage your contact parameters.</p>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                 {isEditing ? (
                   <>
                     <button type="button" onClick={() => { setIsEditing(false); reset(); }} className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-colors uppercase tracking-wide cursor-pointer disabled:cursor-not-allowed">
                       Cancel
                     </button>
                     <button type="submit" disabled={isSaving} className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-sm shadow-orange-500/20 disabled:opacity-50 transition-all uppercase tracking-wide cursor-pointer disabled:cursor-not-allowed">
                       {isSaving ? "Saving..." : "Save Edits"}
                     </button>
                   </>
                 ) : (
                   <button type="button" onClick={() => setIsEditing(true)} disabled={fetching} className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-sm disabled:opacity-50 transition-all uppercase tracking-wide cursor-pointer disabled:cursor-not-allowed">
                      Edit Profile
                   </button>
                 )}
              </div>
           </div>

           {/* Standard Form Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {fetching ? (
                 Array(6).fill(0).map((_, i) => <SkeletonTile key={i} />)
              ) : (
                [
                  { label: "Full Name", name: "name", rules: { required: "Required" } },
                  { label: "Phone Number", name: "phoneno", rules: { required: "Required", pattern: { value: /^\d{10}$/, message: "Must be 10 digits" } } },
                  { label: "City", name: "city", rules: { required: "Required" } },
                  { label: "State", name: "state", rules: { required: "Required" } },
                  { label: "Country", name: "country", rules: { required: "Required" } },
                  { label: "Postal Pincode", name: "pincode", rules: { required: "Required", pattern: { value: /^\d{6}$/, message: "Must be 6 digits" } } },
                ].map((field) => (
                  <Controller
                    key={field.name}
                    name={field.name}
                    control={control}
                    rules={field.rules}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <DataTile 
                        label={field.label} 
                        name={field.name} 
                        value={value} 
                        isEditing={isEditing} 
                        onChange={onChange} 
                        error={error} 
                      />
                    )}
                  />
                ))
              )}

              <div className="md:col-span-2 mt-4 pt-8 border-t border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Delivery Address</h2>
                {fetching ? (
                  <SkeletonTile />
                ) : (
                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: "Address is required" }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <DataTile 
                        label="Full Street Address" 
                        name="address" 
                        value={value} 
                        isEditing={isEditing} 
                        isTextArea 
                        onChange={onChange} 
                        error={error} 
                      />
                    )}
                  />
                )}
              </div>
           </div>

        </form>
      </div>
    </div>
  );
};

export default Profile;