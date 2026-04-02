export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">

      {/* Card */}
      <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/60 px-16 py-14 w-full max-w-sm">

        {/* Logo */}
        <img
          src="/logo.png"
          alt="MyMeal"
          className="w-28 h-20 mb-4"
        />

        {/* Brand */}
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
          My<span className="text-orange-500">Meal</span>
        </h1>
        <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-10">
          Your Meal, Your Choice
        </p>

        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-gray-100 border-t-orange-500 rounded-full animate-spin mb-6"></div>

        {/* Text */}
        <p className="text-gray-700 font-semibold text-base">
          Preparing your meals...
        </p>
        <p className="text-sm text-gray-400 mt-1 text-center">
          Getting today's menu ready for you
        </p>

      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-gray-300">
        © {new Date().getFullYear()} MyMeal. All rights reserved.
      </p>

    </div>
  );
}