import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin, Star, Phone, X, SlidersHorizontal, ArrowRight } from "lucide-react";
import { BACKEND_URL } from "../config/config";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState({ state: "", city: "" });
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [rating, setRating] = useState(2.5);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user_token = localStorage.getItem("user_token");
  const Authorization_Header = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user_token}`,
    },
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/user/get_vendor`, {}, Authorization_Header);
      if (response.data.success) {
        setVendors(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const uniqueStates = [
    ...new Set(
      vendors
        .map((v) => v.state?.trim())
        .filter(Boolean)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    ),
  ];

  const availableCities = [
    ...new Set(
      vendors
        .filter((v) =>
          !searchTerm.state ||
          v.state?.toLowerCase().trim() === searchTerm.state.toLowerCase().trim()
        )
        .map((v) => v.city?.trim())
        .filter(Boolean)
        .map((c) => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase())
    ),
  ];

  const filteredVendors = vendors.filter((vendor) => {
    const matchState = searchTerm.state
      ? vendor.state?.toLowerCase().trim() === searchTerm.state.toLowerCase().trim()
      : true;
    const matchCity = searchTerm.city
      ? vendor.city?.toLowerCase().trim() === searchTerm.city.toLowerCase().trim()
      : true;
    return matchState && matchCity;
  });

  const handleviewdetails = (vendor_id) => {
    navigate(`/showvendors/viewdetail/${vendor_id}`);
  };

  const handleRatingSubmit = async () => {
    const toastid = toast.loading("Giving Rating..");
    if (!rating) {
      toast.error("Rating is required", { id: toastid });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/rating/giverating`, {
        vendor_id: selectedVendor._id,
        rating: rating,
        review: review
      }, Authorization_Header);

      if (response.data.success) {
        toast.success("Rating submitted successfully!", { id: toastid });
        setShowRatingModal(false);
        setRating(2.5);
        setReview("");
        reset({ review: "", rating: 2.5 });
        fetchVendors();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not submit rating", { id: toastid });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 px-6 md:px-12 py-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">Vendor Catalog</h1>
            <p className="text-slate-500 font-medium mt-1 text-sm">Discover certified kitchens delivering near you.</p>
          </div>

          {/* FILTERS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:max-w-md">
            <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 shrink-0">
              <SlidersHorizontal size={14} />
              <span className="text-xs font-bold uppercase tracking-widest">Filter</span>
            </div>
            <select
              className="flex-1 pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer appearance-none"
              value={searchTerm.state}
              onChange={(e) => setSearchTerm({ state: e.target.value, city: "" })}
            >
              <option value="">All States</option>
              {uniqueStates.sort().map(state => <option key={state} value={state}>{state}</option>)}
            </select>

            <select
              className="flex-1 pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer appearance-none disabled:opacity-40"
              value={searchTerm.city}
              onChange={(e) => setSearchTerm({ ...searchTerm, city: e.target.value })}
              disabled={!searchTerm.state}
            >
              <option value="">All Cities</option>
              {availableCities.sort().map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
        </header>

        {/* VENDOR CARDS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[4px_4px_0_rgba(15,23,42,0.03)] animate-pulse">
                <div className="h-44 bg-slate-100 relative">
                  <div className="absolute inset-0 bg-orange-500/5" />
                </div>
                <div className="p-6 space-y-4">
                  <div className="h-5 w-36 bg-slate-200 rounded" />
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <div className="h-3 w-28 bg-slate-100 rounded" />
                    <div className="h-9 w-24 bg-orange-500/20 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50">
            <Search size={28} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No vendors found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor._id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[4px_4px_0_rgba(15,23,42,0.03)] hover:border-slate-300 transition-colors flex flex-col"
              >
                {/* Image */}
                <div className="h-44 bg-slate-100 border-b border-slate-200 relative overflow-hidden group">
                  <img
                    src={vendor.profileImage || "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80"}
                    alt={vendor.companyname}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-100 px-2.5 py-1 rounded-full shadow-sm">
                    <Star size={12} className="text-orange-500" fill="currentColor" />
                    <span className="text-xs font-bold text-slate-800">{vendor.rating || "0.0"}</span>
                  </div>
                  {/* Give Rating */}
                  <button
                    onClick={() => { setSelectedVendor(vendor); setShowRatingModal(true); }}
                    className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors cursor-pointer shadow-sm"
                  >
                    Rate
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">{vendor.companyname || "Vendor Name"}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-6">
                    <MapPin size={12} className="text-orange-500" /> {vendor.city}
                    <span className="mx-1 text-slate-300">·</span>
                    <Phone size={12} className="text-slate-400" /> {vendor.phoneno}
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleviewdetails(vendor._id)}
                      className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-widest py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                    >
                      View Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RATING MODAL */}
        {showRatingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowRatingModal(false)} />

            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">Rate Your Experience</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">
                    {selectedVendor?.companyname}
                  </p>
                </div>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleRatingSubmit)} className="p-6 space-y-6">
                <input type="hidden" {...register("rating", { required: "Rating is required" })} />

                {/* Star Rating */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Your Rating</p>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="relative w-10 h-10 flex">
                        <Star className="absolute inset-0 w-10 h-10 text-slate-200" />
                        <Star
                          className={`absolute inset-0 w-10 h-10 transition-all ${
                            rating >= star - 0.5 ? 'text-orange-500' : 'text-transparent'
                          } ${rating >= star ? 'fill-current' : ''}`}
                          style={{
                            clipPath: rating === star - 0.5 ? 'inset(0 50% 0 0)' : 'none',
                            fill: rating >= star ? 'currentColor' : (rating === star - 0.5 ? 'currentColor' : 'none')
                          }}
                        />
                        <button type="button" className="absolute left-0 cursor-pointer w-1/2 h-full z-20"
                          onClick={() => { setRating(star - 0.5); setValue("rating", star - 0.5, { shouldValidate: true }); }} />
                        <button type="button" className="absolute right-0 cursor-pointer w-1/2 h-full z-20"
                          onClick={() => { setRating(star); setValue("rating", star, { shouldValidate: true }); }} />
                      </div>
                    ))}
                    <span className="ml-3 text-lg font-black text-orange-500 w-8">{rating}</span>
                  </div>
                  {errors.rating && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-2 text-center">{errors.rating.message}</p>
                  )}
                </div>

                {/* Review Textarea */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Written Review</p>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm font-medium text-slate-900 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 resize-none transition-colors"
                    placeholder="Share your feedback about this kitchen..."
                    rows="4"
                    {...register("review", { required: "Review is required" })}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                  {errors.review && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">{errors.review.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 cursor-pointer text-white rounded-lg font-bold text-xs uppercase tracking-widest shadow-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Vendors;