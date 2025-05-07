import React from "react";
import { useNavigate } from "react-router-dom";
import workoutIcon from "../assets/icons/workout.jpg";
import photosIcon from "../assets/icons/photo.jpg";

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
    <div className="h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-between p-8 relative">
      
      {/* Profile Button */}
      <div className="absolute top-4 left-4 cursor-pointer flex items-center space-x-2" onClick={handleProfileClick}>
        <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center font-bold">
          P
        </div>
        <span className="font-semibold">Profile</span>
      </div>

      {/* Center Content */}
      <div className="flex justify-center items-center space-x-8 mt-16">
        
        {/* Workout Tracking Card */}
        <div
          className="bg-gray-800 w-96 h-96 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 transition"
          onClick={handleWorkoutClick}
        >
          <img src={workoutIcon} alt="Workout" className="w-40 h-40 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Workout Tracking</h2>
          <p className="text-gray-400 text-center">Log your exercises and track progress</p>
        </div>

        {/* Daily Body Photos Card */}
        <div
          className="bg-gray-800 w-96 h-96 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 transition"
          onClick={handlePhotosClick}
        >
          <img src={photosIcon} alt="Photos" className="w-40 h-40 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Daily Body Photos</h2>
          <p className="text-gray-400 text-center">Upload daily photos to monitor changes</p>
        </div>
      </div>

      {/* Quote */}
      <div className="mt-16 text-center italic text-gray-400">
        "Today's effort is tomorrow's result!"
      </div>
    </div>
  );
}
