import React from "react";

const Dashboard = () => {
  const todayMeal = {
    type: "Dinner",
    name: "Paneer Butter Masala",
    vendor: "HomeKitchen",
    time: "7:30 PM",
    image: "https://source.unsplash.com/100x100/?paneer-curry",
  };

  const upcomingMeals = [
    {
      day: "Mon",
      name: "Dal + Rice",
      image: "https://source.unsplash.com/50x50/?dal",
    },
    {
      day: "Tue",
      name: "Roti + Sabji",
      image: "https://source.unsplash.com/50x50/?indian-food",
    },
    {
      day: "Wed",
      name: "Paneer Curry",
      image: "https://source.unsplash.com/50x50/?paneer",
    },
  ];

  return (
    <div className="space-y-6">

      {/* 🍱 Today's Meal */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Today’s Meal
        </h2>

        <div className="flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            <img
              src={todayMeal.image}
              alt="meal"
              className="w-16 h-16 rounded-xl object-cover"
            />

            <div>
              <p className="text-sm text-gray-500">{todayMeal.type}</p>
              <h3 className="text-xl font-bold text-gray-900">
                {todayMeal.name}
              </h3>
              <p className="text-sm text-gray-500">
                by {todayMeal.vendor} • {todayMeal.time}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-400">
              Change
            </button>
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
              Skip
            </button>
          </div>

        </div>
      </div>

      {/* 📅 Grid Section */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Upcoming Meals */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Upcoming Meals
          </h2>

          <ul className="space-y-3">
            {upcomingMeals.map((meal, index) => (
              <li key={index} className="flex items-center justify-between">
                
                <div className="flex items-center gap-3">
                  <img
                    src={meal.image}
                    alt="meal"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <span className="text-sm text-gray-700">
                    {meal.name}
                  </span>
                </div>

                <span className="text-sm text-gray-500">
                  {meal.day}
                </span>

              </li>
            ))}
          </ul>
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Subscription
          </h2>

          <p className="text-sm text-gray-600">Monthly Plan</p>
          <p className="text-sm text-gray-600">10 days left</p>
          <p className="text-sm text-gray-600">Next billing: 5 April</p>

          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-400">
              Manage
            </button>
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
              Pause
            </button>
          </div>
        </div>
      </div>

      {/* ⚡ Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-400">
            Change Today’s Meal
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            Skip Tomorrow
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            Browse Vendors
          </button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;