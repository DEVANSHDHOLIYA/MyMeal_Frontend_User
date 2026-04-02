import React from "react";
import { useNavigate } from "react-router-dom";

const developers = [
  {
    name: "Devansh Dholiya",
    role: "Full Stack Developer",
    avatar: "DD",
    github: "https://github.com/DEVANSHDHOLIYA",
    linkedin: "https://www.linkedin.com/in/devansh-dholiya-274017249/",
    bio: "Full-stack developer passionate about building modern web applications using React.js, Node.js, MongoDB, and Tailwind CSS. Focused on creating scalable systems and solving real-world problems through technology.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm flex justify-between items-center px-6 md:px-16 py-4">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.png"
            className="w-16 h-12 hover:rotate-6 transition-transform duration-300"
            alt="logo"
          />
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">
            My<span className="text-orange-500">Meal</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-600 font-semibold hover:text-orange-500 transition-colors"
          >
            User Login
          </button>

          <button
            onClick={() => navigate("/vendor/login")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all active:scale-95"
          >
            Vendor Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-50 via-transparent to-transparent opacity-70"></div>

        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          Smart Tiffin Subscription
        </div>

        <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 max-w-4xl leading-[1.1]">
          Your Meal, <span className="text-orange-500">Your Choice</span>
        </h2>

        <p className="text-gray-500 mt-8 max-w-2xl text-lg md:text-xl leading-relaxed">
          MyMeal lets you customize your daily tiffin subscription. Choose meals
          you love, skip the ones you don't, and enjoy flexible meal planning
          designed for busy professionals and students.
        </p>

        {/* Role Selection */}
        <div className="grid sm:grid-cols-2 gap-6 mt-14 max-w-3xl w-full">

          {/* User */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              For Customers
            </h3>

            <p className="text-gray-500 text-sm mb-6">
              Choose and customize your daily meals easily.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/signup")}
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition"
              >
                Create Account
              </button>

              <button
                onClick={() => navigate("/login")}
                className="border border-gray-200 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Login
              </button>
            </div>
          </div>

          {/* Vendor */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              For Vendors
            </h3>

            <p className="text-gray-500 text-sm mb-6">
              Manage your tiffin service and daily menus.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/vendor/signup")}
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition"
              >
                Register Vendor
              </button>

              <button
                onClick={() => navigate("/vendor/login")}
                className="border border-gray-200 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Vendor Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-16 py-32 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Why Choose MyMeal
            </h3>

            <div className="w-20 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full"></div>

            <p className="text-gray-500 mt-6 text-lg">
              A smarter way to manage your daily meals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Daily Meal Selection",
                desc: "Choose what you want to eat each day instead of following a fixed weekly menu.",
              },
              {
                title: "Meal Customization",
                desc: "Swap dishes based on your taste preferences, diet goals, or allergies.",
              },
              {
                title: "Flexible Subscription",
                desc: "Pause, skip, or modify meals anytime without canceling your subscription.",
              },
              {
                title: "Healthy Choices",
                desc: "Select meals that match your dietary preferences like high-protein or vegetarian.",
              },
              {
                title: "Smart Recommendations",
                desc: "Get suggested meals based on your past selections and preferences.",
              },
              {
                title: "No More Food Waste",
                desc: "Only receive the meals you actually want to eat.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-10 rounded-[2rem] border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-orange-500 rounded-2xl mb-8 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200">
                  {i + 1}
                </div>

                <h4 className="text-2xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h4>

                <p className="text-gray-500 text-lg leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="px-6 md:px-16 py-32 bg-white">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-20">
            <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Meet the Developer
            </h3>

            <div className="w-20 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full"></div>

            <p className="text-gray-500 mt-6 text-lg max-w-xl mx-auto">
              The developer behind MyMeal who turned a real-world food
              subscription problem into a digital solution.
            </p>
          </div>

          {developers.map((dev, i) => (
            <div
              key={i}
              className="p-10 rounded-[2rem] border border-gray-200 bg-gray-50 text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-orange-500 flex items-center justify-center text-white text-2xl font-black mb-6">
                {dev.avatar}
              </div>

              <h4 className="text-xl font-bold text-gray-900">{dev.name}</h4>

              <p className="text-orange-500 text-sm font-semibold mt-1 mb-3">
                {dev.role}
              </p>

              <p className="text-gray-500 text-sm">{dev.bio}</p>

              <div className="flex justify-center gap-4 mt-6">
                <a
                  href={dev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 font-semibold hover:text-gray-900"
                >
                  GitHub
                </a>

                <a
                  href={dev.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 font-semibold hover:text-orange-500"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-24 bg-white border-t border-gray-100">
        <h3 className="text-3xl font-bold mb-8 text-gray-900">
          Start Customizing Your Meals Today
        </h3>

        <button
          onClick={() => navigate("/signup")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl shadow-orange-200 transition-all hover:scale-105"
        >
          Join MyMeal
        </button>

        <p className="mt-10 text-gray-400 text-sm">
          © {new Date().getFullYear()} MyMeal. All rights reserved.
        </p>
      </footer>
    </div>
  );
}