import React from "react";
import { useNavigate } from "react-router-dom";
import dashboardBg from "../assets/icons/dashboard_background.jpg";

// Import muscle group images
import abdominals from "../assets/icons/Muscle Group/Abdominals.jpg";
import biceps from "../assets/icons/Muscle Group/Biceps.jpg";
import calves from "../assets/icons/Muscle Group/Calves.jpg";
import chest from "../assets/icons/Muscle Group/Chest.jpg";
import forearms from "../assets/icons/Muscle Group/Forearms.jpg";
import glutes from "../assets/icons/Muscle Group/Glutes.jpg";
import hamstrings from "../assets/icons/Muscle Group/Hamstrings.jpg";
import lats from "../assets/icons/Muscle Group/Lats.jpg";
import lowerBack from "../assets/icons/Muscle Group/Lower Back.jpg";
import middleBack from "../assets/icons/Muscle Group/Middle Back.jpg";
import quadriceps from "../assets/icons/Muscle Group/Quadriceps.jpg";
import shoulders from "../assets/icons/Muscle Group/Shoulders.jpg";
import traps from "../assets/icons/Muscle Group/Traps.jpg";
import triceps from "../assets/icons/Muscle Group/Triceps.jpg";

const categoryData = [
  { id: 'abdominals', name: 'Abdominals', image: abdominals },
  { id: 'chest', name: 'Chest', image: chest },
  { id: 'shoulders', name: 'Shoulders', image: shoulders },
  { id: 'triceps', name: 'Triceps', image: triceps },
  { id: 'forearms', name: 'Forearms', image: forearms },
  { id: 'lats', name: 'Lats', image: lats },
  { id: 'middle_back', name: 'Middle Back', image: middleBack },
  { id: 'lower_back', name: 'Lower Back', image: lowerBack },
  { id: 'traps', name: 'Traps', image: traps },
  { id: 'biceps', name: 'Biceps', image: biceps },
  { id: 'quadriceps', name: 'Quadriceps', image: quadriceps },
  { id: 'glutes', name: 'Glutes', image: glutes },
  { id: 'hamstrings', name: 'Hamstrings', image: hamstrings },
  { id: 'calves', name: 'Calves', image: calves }
];

export default function Workout() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full text-white bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.8)), url(${dashboardBg})`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <div className="absolute top-6 left-6 flex items-center space-x-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center space-x-2 text-white hover:text-blue-300 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl">
            <h2 className="text-3xl font-bold mb-8">Select Muscle Group</h2>
            
            {/* Muscle Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {categoryData.map((category) => (
                <button
                  key={category.id}
                  onClick={() => navigate(`/exercises/${category.id}`)}
                  className="relative flex flex-col items-center justify-center p-10 rounded-xl transition-all hover:bg-gray-700/60 min-h-[250px] bg-gray-800/40 group"
                >
                  <div className="w-40 h-40 mb-6 overflow-hidden rounded-xl bg-gray-700/50">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <span className="text-2xl font-medium text-center text-white">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
