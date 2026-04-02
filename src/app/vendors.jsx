import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin, Star, Phone, X } from "lucide-react";
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
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()) // Normalizes to "Surat"
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
      .map((c) => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()) // Normalizes to "Surat"
  ),
];
 const filteredVendors = vendors.filter((vendor) => {
  // Check State (Case Insensitive)
  const matchState = searchTerm.state 
    ? vendor.state?.toLowerCase().trim() === searchTerm.state.toLowerCase().trim() 
    : true;

  // Check City (Case Insensitive)
  const matchCity = searchTerm.city 
    ? vendor.city?.toLowerCase().trim() === searchTerm.city.toLowerCase().trim() 
    : true;

  return matchState && matchCity;
});

const handleviewdetails=(vendor_id)=>{
  navigate(`/showvendors/viewdetail/${vendor_id}`);
}

const handleRatingSubmit = async () => {
  const toastid=toast.loading("Giving Rating..")
  if (!rating) {
    toast.error("Rating is required",{id:toastid});
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
      toast.success("Rating submitted successfully!",{id:toastid});
      setShowRatingModal(false);
      setRating(2.5);
      setReview("");
    reset({ review: "", rating: 2.5 });
      fetchVendors(); 
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Could not submit rating",{id:toastid});
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Available Vendors</h1>
          <p className="text-gray-500 mt-1">Discover the best meals near you.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
          <div className="relative flex-1">
            <select
              className="block w-full pl-4 pr-10 py-3 border border-gray-200 outline-none rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer text-sm"
              value={searchTerm.state}
              onChange={(e) => setSearchTerm({ state: e.target.value, city: "" })}
            >
              <option value="">All States</option>
              {uniqueStates.sort().map(state => <option key={state} value={state}>{state}</option>)}
            </select>
          </div>

          <div className="relative flex-1">
            <select
              className="block w-full pl-4 pr-10 py-3 border outline-none border-gray-200 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer text-sm"
              value={searchTerm.city}
              onChange={(e) => setSearchTerm({ ...searchTerm, city: e.target.value })}
              disabled={!searchTerm.state}
            >
              <option value="">All Cities</option>
              {availableCities.sort().map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Vendor Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => <div key={n} className="h-64 bg-gray-100 animate-pulse rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVendors.map((vendor) => (
            <div key={vendor._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="h-40 bg-orange-100 relative">
                <img src={vendor.profileImage || "/api/placeholder/400/320"} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm">
                  <button 
                    onClick={() => { setSelectedVendor(vendor); setShowRatingModal(true); }}
                    className="cursor-pointer hover:text-orange-800 transition-colors"
                  >
                    Give Rating
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{vendor.companyname || "Vendor Name"}</h3>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-semibold text-gray-700">{vendor.rating || 0}</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-4"><MapPin className="w-4 h-4 mr-1 text-orange-500" />{vendor.city}</div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center text-sm font-medium text-gray-600"><Phone className="w-4 h-4 mr-2" />{vendor.phoneno}</div>
                  <button className="bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer hover:bg-orange-700 transition-colors" onClick={() => handleviewdetails(vendor._id)}>View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- RATING MODAL --- */}
   {showRatingModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-gray-900/40" onClick={() => setShowRatingModal(false)} />
    
    <div className="relative bg-white w-full max-w-md rounded-[2rem] p-8 shadow-xl border border-gray-100">
      <button onClick={() => setShowRatingModal(false)} className="absolute top-6 right-6 p-2 rounded-lg text-gray-400 hover:text-orange-600">
        <X className="w-5 h-5" />
      </button>
      
      <div className="mb-6">
        <h2 className="text-xl font-black text-gray-900">Rate Experience</h2>
        <p className="text-gray-400 font-bold text-[9px] uppercase tracking-wider mt-1">
          Reviewing: {selectedVendor?.companyname}
        </p>
      </div>

     <form onSubmit={handleSubmit(handleRatingSubmit)} className="space-y-5">
        
       <input
            type="hidden"
            {...register("rating", { required: "Rating is required" })}
            />
        <div className="flex flex-col items-center gap-2 py-4">
  <div className="flex justify-center items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <div key={star} className="relative w-10 h-10 flex text-gray-200">
        
        {/* Background Star (The gray part) */}
        <Star className="absolute inset-0 w-10 h-10 text-gray-200" />

        {/* The Colored Star (The orange part) */}
        <Star 
          className={`absolute inset-0 w-10 h-10 transition-all ${
            rating >= star - 0.5 ? 'text-orange-500' : 'text-transparent'
          } ${rating >= star ? 'fill-current' : ''}`} 
          style={{
            clipPath: rating === star - 0.5 ? 'inset(0 50% 0 0)' : 'none',
            // Only fill the current star if it's a full star or the previous ones
            fill: rating >= star ? 'currentColor' : (rating === star - 0.5 ? 'currentColor' : 'none')
          }}
        />

        {/* Left Half Button (0.5) */}
        <button
          type="button"
          className="absolute left-0 cursor-pointer w-1/2 h-full z-20"
          onClick={() => {
            setRating(star - 0.5);
            setValue("rating", star - 0.5, { shouldValidate: true });
            }}
        />

        {/* Right Half Button (1.0) */}
        <button
          type="button"
          className="absolute right-0 cursor-pointer w-1/2 h-full z-20"
          onClick={() => {
            setRating(star);
            setValue("rating", star, { shouldValidate: true });
            }}
        />
      </div>
    ))}
    
    <span className="ml-4 font-black text-orange-600 text-lg w-8">
      {rating}
    </span>
  </div>

  {/* Display Error Message ONLY ONCE below all stars */}
  {errors.rating && (
    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
      {errors.rating.message}
    </p>
  )}
</div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Write a Review</p>
          <textarea
            className="w-full bg-orange-50/30 border-2 border-orange-100 rounded-xl p-4 font-bold text-gray-900 outline-none text-sm focus:border-orange-500 focus:bg-white"
            placeholder="Share your feedback..."
            rows="4"
            {...register("review", { required: "Review is required" })}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            />
        </div>
          {errors.review && (
            <p className="text-red-500 text-xs">
                {errors.review.message}
            </p>
            )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-orange-600 cursor-pointer text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg hover:bg-orange-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default Vendors;