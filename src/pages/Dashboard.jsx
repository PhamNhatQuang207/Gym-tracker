import React from "react";
import { useNavigate } from "react-router-dom";
import workoutIcon from "../assets/icons/workout.jpg";
import photosIcon from "../assets/icons/photo.jpg";
import dashboardBg from "../assets/icons/dashboard_background.jpg";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    // Navigate to profile or settings page (optional)
    console.log("Profile clicked");
  };

  const handleWorkoutClick = () => {
    navigate("/workout");
  };

  const handlePhotosClick = () => {
    navigate("/photos");
  };

  return (
    <div
      className="min-h-screen w-full text-white bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.7), rgba(31, 41, 55, 0.7)), url(${dashboardBg})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        imageRendering: "crisp-edges",
      }}
    >
      {/* Header Section */}
      <header className="w-full px-8 py-6 flex justify-between items-center relative">
        <div
          className="flex items-center space-x-2 cursor-pointer z-10"
          onClick={handleProfileClick}
        >
          <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center font-bold hover:bg-blue-600 transition">
            P
          </div>
          <span className="font-semibold text-lg">Profile</span>
        </div>
        <h1 className="text-3xl font-bold absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Gym Tracker App
        </h1>
        <div className="w-12 invisible">Profile</div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-2">Welcome back!</h2>
          <p className="text-gray-400">What would you like to track today?</p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Workout Tracking Card */}
          <div
            className="bg-gray-800 p-8 rounded-xl flex flex-col items-center justify-center cursor-pointer 
                     hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 
                     shadow-lg hover:shadow-2xl"
            onClick={handleWorkoutClick}
          >
            <img
              src={workoutIcon}
              alt="Workout"
              className="w-32 h-32 mb-6 rounded-lg"
            />
            <h2 className="text-2xl font-bold mb-3">Workout Tracking</h2>
            <p className="text-gray-400 text-center">
              Log your exercises and track progress
            </p>
          </div>

          {/* Daily Body Photos Card */}
          <div
            className="bg-gray-800 p-8 rounded-xl flex flex-col items-center justify-center cursor-pointer 
                     hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 
                     shadow-lg hover:shadow-2xl"
            onClick={handlePhotosClick}
          >
            <img
              src={photosIcon}
              alt="Photos"
              className="w-32 h-32 mb-6 rounded-lg"
            />
            <h2 className="text-2xl font-bold mb-3">Daily Body Photos</h2>
            <p className="text-gray-400 text-center">
              Upload daily photos to monitor changes
            </p>
          </div>
        </div>
      </main>

      {/* Footer Quote */}
      <footer className="fixed bottom-0 w-full py-6">
        <div className="text-center italic text-white font-medium">
          "Today's effort is tomorrow's result!"
        </div>
      </footer>
    </div>
  );
}
