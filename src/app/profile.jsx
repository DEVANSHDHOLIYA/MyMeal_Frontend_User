import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { BACKEND_URL } from "../config/config.js";
import {
  User,
  Phone,
  MapPin,
  Mail,
  LogOut,
  Edit3,
  X,
  CheckCircle2,
  Home,
  Camera,
} from "lucide-react";

// ── Skeleton tile ──────────────────────────────────────────────
const SkeletonTile = ({ wide }) => (
  <div
    className={`animate-pulse bg-white border border-slate-100 rounded-xl p-4 shadow-[4px_4px_0_rgba(15,23,42,0.03)] ${
      wide ? "md:col-span-2" : ""
    }`}
  >
    <div className="h-2 w-16 bg-slate-100 rounded mb-3" />
    <div className="h-5 w-3/4 bg-slate-100 rounded" />
  </div>
);

// ── Field tile (view / edit) ──────────────────────────────────
const DataTile = ({
  label,
  icon: Icon,
  name,
  value,
  isEditing,
  isTextArea,
  onChange,
  error,
  placeholder,
  wide,
}) => (
  <div
    className={`bg-white border rounded-xl p-4 shadow-[4px_4px_0_rgba(15,23,42,0.03)] transition-all ${
      wide ? "md:col-span-2" : ""
    } ${
      error
        ? "border-red-300"
        : isEditing
        ? "border-orange-300"
        : "border-slate-200"
    }`}
  >
    <div className="flex items-center gap-1.5 mb-2">
      {Icon && (
        <Icon
          size={11}
          className={
            error
              ? "text-red-400"
              : isEditing
              ? "text-orange-500"
              : "text-slate-400"
          }
        />
      )}
      <p
        className={`text-[9px] font-bold uppercase tracking-widest ${
          error
            ? "text-red-500"
            : isEditing
            ? "text-orange-500"
            : "text-slate-400"
        }`}
      >
        {label}
        {error && (
          <span className="ml-1 font-normal normal-case tracking-normal text-red-400">
            ({error.message})
          </span>
        )}
      </p>
    </div>

    {isEditing ? (
      isTextArea ? (
        <textarea
          name={name}
          rows="2"
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition-all"
        />
      ) : (
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
        />
      )
    ) : (
      <p className="text-sm font-bold text-slate-900 px-0.5 min-h-[1.25rem] truncate">
        {value || (
          <span className="text-slate-300 font-normal italic">Not set</span>
        )}
      </p>
    )}
  </div>
);

// ── Main component ─────────────────────────────────────────────
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const user_token = localStorage.getItem("user_token");

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phoneno: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      
    },
  });

  const formData = watch();

  const Authorization_Header = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    },
  };
  const profile_Authorization_Header = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${user_token}`,
    },
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/profile/get_profile`,
        {},
        Authorization_Header
      );
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
    const toastid = toast.loading("Updating Profile..");
  
    try {
      const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phoneno", data.phoneno);
    formData.append("state", data.state);
    formData.append("city", data.city);
    formData.append("country", data.country);
    formData.append("address", data.address);
    formData.append("photo",file);
    formData.append("pincode", data.pincode);
      const res = await axios.post(
        `${BACKEND_URL}/profile/update_profile`,
        formData,
        profile_Authorization_Header
      );
      toast.success(res.data.message || "Profile Updated", { id: toastid });
      setIsEditing(false);
      localStorage.setItem("user_profile", JSON.stringify(data));
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed", {
        id: toastid,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
    toast.success("Logged out Successfully");
  };

  const fields = [
    {
      label: "Full Name",
      name: "name",
      icon: User,
      placeholder: "Your full name",
      rules: { required: "Required" },
    },
    {
      label: "Phone Number",
      name: "phoneno",
      icon: Phone,
      placeholder: "10-digit mobile number",
      rules: {
        required: "Required",
        pattern: { value: /^\d{10}$/, message: "10 digits only" },
      },
    },
    {
      label: "City",
      name: "city",
      icon: MapPin,
      placeholder: "Your city",
      rules: { required: "Required" },
    },
    {
      label: "State",
      name: "state",
      icon: MapPin,
      placeholder: "Your state",
      rules: { required: "Required" },
    },
    {
      label: "Country",
      name: "country",
      icon: MapPin,
      placeholder: "Your country",
      rules: { required: "Required" },
    },
    {
      label: "Postal Pincode",
      name: "pincode",
      icon: MapPin,
      placeholder: "6-digit pincode",
      rules: {
        required: "Required",
        pattern: { value: /^\d{6}$/, message: "6 digits only" },
      },
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 px-6 md:px-12 py-10 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* ── Page header ──────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              {fetching ? (
                <span className="inline-block w-44 h-8 bg-slate-100 rounded animate-pulse" />
              ) : (
                formData.name || "My Profile"
              )}
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Manage your personal information and delivery address.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    reset();
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <X size={13} /> Cancel
                </button>
                <button
                  form="profile-form"
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm shadow-orange-500/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 size={13} />{" "}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  disabled={fetching}
                  className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm shadow-orange-500/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Edit3 size={13} /> Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-red-500 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
                >
                  <LogOut size={13} /> Log Out
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Identity strip (Enhanced Upload Visibility) ── */}
        <div className="mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-[4px_4px_0_rgba(15,23,42,0.03)]">
            {fetching ? (
              <div className="w-14 h-14 bg-slate-100 rounded-xl animate-pulse shrink-0" />
            ) : (
              <div
                onClick={() => isEditing && fileInputRef.current.click()}
                className={`w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-sm shadow-orange-500/20 shrink-0 relative overflow-hidden group transition-all duration-300 ${
                  isEditing 
                    ? "cursor-pointer ring-4 ring-orange-500/30 scale-105" 
                    : ""
                }`}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  formData.name?.charAt(0)?.toUpperCase() || "U"
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />

                {/* VISUAL OVERLAY: Visible icon on edit, darkens on hover */}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-all">
                    <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <Camera size={18} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                Account Holder
              </p>
              {fetching ? (
                <div className="w-36 h-5 bg-slate-100 rounded animate-pulse mb-1" />
              ) : (
                <p className="text-base font-bold text-slate-900 truncate">
                  {formData.name || "—"}
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                <p className="text-xs text-slate-400 font-medium truncate">
                  {fetching ? "..." : formData.email || "No email linked"}
                </p>
              </div>
            </div>

            {!fetching && (
              <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Mail size={11} className="text-slate-400" />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Email
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-700 truncate max-w-[220px]">
                  {formData.email || "—"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Profile form ─────────────────────────────────────── */}
        <form id="profile-form" onSubmit={handleSubmit(onSave)}>
          <div className="flex items-center gap-2 mb-4">
            <Home size={13} className="text-slate-400" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Contact &amp; Location
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fetching ? (
              <>
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <SkeletonTile key={i} />
                  ))}
                <SkeletonTile wide />
              </>
            ) : (
              <>
                {fields.map((field) => (
                  <Controller
                    key={field.name}
                    name={field.name}
                    control={control}
                    rules={field.rules}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <DataTile
                        label={field.label}
                        icon={field.icon}
                        name={field.name}
                        value={value}
                        isEditing={isEditing}
                        onChange={onChange}
                        placeholder={field.placeholder}
                        error={error}
                      />
                    )}
                  />
                ))}

                <Controller
                  name="address"
                  control={control}
                  rules={{ required: "Address is required" }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <DataTile
                      label="Delivery Address"
                      icon={MapPin}
                      name="address"
                      value={value}
                      isEditing={isEditing}
                      isTextArea
                      placeholder="Enter your full delivery address"
                      onChange={onChange}
                      error={error}
                      wide
                    />
                  )}
                />
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;