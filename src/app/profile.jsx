import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { BACKEND_URL } from "../config/config.js";


const SkeletonTile = ({ isLarge }) => (
  <div className={`animate-pulse rounded-xl bg-gray-100 border border-gray-50 ${isLarge ? 'h-32' : 'h-20'}`}>
    <div className="p-4">
      <div className="h-2 w-12 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const DataTile = ({ label, name, value, isEditing, isTextArea, onChange, error }) => (
  <div className={`p-4 rounded-xl border ${error ? 'border-red-200 bg-red-50/10' : 'border-gray-100 bg-white'} shadow-sm transition-all duration-300`}>
    <p className={`text-[9px] font-bold uppercase tracking-wider mb-2 transition-colors ${error ? 'text-red-500' : isEditing ? 'text-orange-600' : 'text-gray-400'}`}>
      {label} {error && <span className="lowercase font-normal">({error.message})</span>}
    </p>
    
    {isEditing ? (
      <div className="relative">
        {isTextArea ? (
          <textarea
            name={name}
            className="w-full bg-orange-50/30 border-2 border-orange-100 rounded-lg p-2.5 font-bold text-gray-900 outline-none resize-none text-sm transition-all focus:border-orange-500 focus:bg-white"
            rows="2"
            value={value || ""}
            onChange={onChange}
          />
        ) : (
          <input
            type="text"
            name={name}
            className="w-full bg-orange-50/30 border-2 border-orange-100 rounded-lg px-3 py-2 font-bold text-gray-900 outline-none text-sm transition-all focus:border-orange-500 focus:bg-white"
            value={value || ""}
            onChange={onChange}
          />
        )}
      </div>
    ) : (
      <p className="font-bold text-gray-800 truncate text-sm px-1 min-h-[1.25rem]">
        {value || <span className="text-gray-300 font-normal italic">Not set</span>}
      </p>
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
    <div className="h-fit bg-[#FBFBFC] p-4 flex items-start justify-center font-sans text-gray-900">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-50/50 p-6 border-r border-gray-100 flex flex-col items-center md:items-start">
          {fetching ? (
            <div className="w-20 h-20 bg-gray-200 rounded-2xl animate-pulse mb-4"></div>
          ) : (
            <div className="w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg shadow-orange-100">
              {formData.name?.charAt(0) || "U"}
            </div>
          )}
          
          {fetching ? (
            <div className="space-y-2 mb-6 w-full flex flex-col items-center md:items-start">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-black text-gray-900 leading-tight">{formData.name || "User"}</h1>
              <p className="text-gray-400 font-semibold text-[10px] mb-6">{formData.email}</p>
            </>
          )}

          <nav className="flex flex-col gap-2 w-full">
            <button 
              onClick={() => setIsEditing(true)}
              className={`w-full text-left px-4 py-2.5 cursor-pointer rounded-lg font-bold text-xs transition-all ${!isEditing && !fetching ? 'bg-orange-600 text-white shadow-md shadow-orange-100' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              disabled={isEditing || fetching}
            >
              Edit Profile
            </button>
            <button onClick={logout} className="w-full text-left cursor-pointer px-4 py-2.5 rounded-lg font-bold text-xs text-red-500 hover:bg-red-50 transition-all">
              Log Out
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <form onSubmit={handleSubmit(onSave)} className="p-6 md:p-8 w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Personal Info</h2>
              <p className="text-gray-400 text-[11px]">Manage your profile details</p>
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <button type="button" onClick={() => { setIsEditing(false); reset(); }} className="px-4 py-2 cursor-pointer bg-white border border-gray-200 rounded-lg font-bold text-[10px] uppercase text-gray-500 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-orange-600 text-white rounded-lg cursor-pointer font-bold text-[10px] uppercase shadow-lg disabled:opacity-50 hover:bg-orange-700 transition-all">
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fetching ? (
              // Display Skeletons while fetching
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
            
            <div className="md:col-span-2">
              {fetching ? <SkeletonTile /> : <DataTile label="Registered Email" name="email" value={formData.email} isEditing={false} />}
            </div>

            <div className="md:col-span-2">
              {fetching ? (
                <SkeletonTile isLarge />
              ) : (
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: "Address is required" }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <DataTile 
                      label="Delivery Address" 
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