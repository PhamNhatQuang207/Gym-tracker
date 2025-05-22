import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import dashboardBg from "../assets/icons/dashboard_background.jpg";

export default function Workout() {
  const [exercises, setExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [sets, setSets] = useState([{ reps: "", weight: "" }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastWorkout, setLastWorkout] = useState(null);
      const [showHistory, setShowHistory] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError("");
      
      try {
        // First, get the total count
        const { count } = await supabase
          .from("exercises")
          .select("*", { count: 'exact', head: true });
        
        console.log("Total exercises in database:", count);
        
        let allData = [];
        let currentOffset = 0;
        const pageSize = 1000;
        
        // Fetch all pages
        while (currentOffset < count) {
          console.log(`Fetching exercises from offset ${currentOffset} to ${currentOffset + pageSize - 1}`);
          
          const { data, error } = await supabase
            .from("exercises")
            .select("*")
            .order("category", { ascending: true })
            .range(currentOffset, currentOffset + pageSize - 1);
            
          if (error) {
            console.error("Database error:", error);
            setError("Failed to load exercises. Please try again.");
            setLoading(false);
            return;
          }
          
          if (!data || data.length === 0) {
            break;
          }
          
          allData = [...allData, ...data];
          console.log(`Fetched ${data.length} exercises (total so far: ${allData.length})`);
          currentOffset += pageSize;
        }
        
        if (allData.length === 0) {
          console.log("No exercises found in database");
          setError("No exercises found in the database.");
          setLoading(false);
          return;
        }
        
        console.log("Total exercises fetched:", allData.length);
        const uniqueCategories = [...new Set(allData.map((ex) => ex.category))];
        console.log("Available categories:", uniqueCategories);
        
        setExercises(allData);
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Fetch workout history
  useEffect(() => {
    const fetchWorkoutHistory = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      
      if (!user) return;

      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching workout history:", error);
        return;
      }

      setWorkoutHistory(data || []);
    };

    fetchWorkoutHistory();
  }, []); // Empty dependency array means this runs once when component mounts

  const filteredExercises = exercises.filter(
    (ex) => ex.category === selectedCategory
  );

  const handleSetChange = (index, field, value) => {
    const updatedSets = [...sets];
    updatedSets[index][field] = value;
    setSets(updatedSets);
  };

  const addSet = () => {
    setSets([...sets, { reps: "", weight: "" }]);
  };

  const removeSet = (index) => {
    const updated = sets.filter((_, i) => i !== index);
    setSets(updated);
  };

  // Update local storage when selections change
  useEffect(() => {
    localStorage.setItem('workoutCategory', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem('workoutExercise', selectedExercise);
  }, [selectedExercise]);

  useEffect(() => {
    localStorage.setItem('workoutSets', JSON.stringify(sets));
  }, [sets]);

  // Fetch last workout data when exercise is selected
  const fetchLastWorkout = async (exerciseId) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    
    if (!user) return;

    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id)
      .eq("exercise_id", exerciseId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
      console.error("Error fetching last workout:", error);
      return;
    }

    if (data) {
      setSets(data.sets);
      setLastWorkout(data);
    } else {
      setSets([{ reps: "", weight: "" }]);
      setLastWorkout(null);
    }
  };

  const handleSave = async () => {
    try {
      // Validate input
      if (!selectedExercise) {
        setError("Please select an exercise");
        return;
      }
      
      if (sets.some(set => !set.reps || !set.weight)) {
        setError("Please fill in all reps and weights");
        return;
      }

      // Get user session
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        setError("Please log in to save your workout");
        return;
      }

      // Get the exercise ID
      const exercise = filteredExercises.find(ex => ex.name === selectedExercise);
      if (!exercise) {
        setError("Exercise not found");
        return;
      }

      // Prepare the workout data
      const workoutData = {
        user_id: user.id,
        exercise_id: exercise.id,
        exercise_name: selectedExercise,
        category: selectedCategory,
        sets: sets.map((set, index) => ({
          set_number: index + 1,
          reps: parseInt(set.reps),
          weight: parseFloat(set.weight)
        })),
        created_at: new Date().toISOString()
      };

      let error;
      
      if (lastWorkout) {
        // Update existing workout
        const { error: updateError } = await supabase
          .from("workouts")
          .update(workoutData)
          .eq("id", lastWorkout.id);
        error = updateError;
      } else {
        // Insert new workout
        const { error: insertError } = await supabase
          .from("workouts")
          .insert(workoutData);
        error = insertError;
      }

      if (error) {
        console.error("Error saving workout:", error);
        setError("Failed to save workout. Please try again.");
        return;
      }

      // Success - clear form and local storage
      setSelectedExercise("");
      setSets([{ reps: "", weight: "" }]);
      setError("");
      localStorage.removeItem('workoutCategory');
      localStorage.removeItem('workoutExercise');
      localStorage.removeItem('workoutSets');
      
      // Show success message
      alert("Workout saved successfully! 💪");
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Clear local storage when navigating away
  useEffect(() => {
    return () => {
      // Only clear if not on current workout
      if (window.location.pathname !== '/workout') {
        localStorage.removeItem('workoutCategory');
        localStorage.removeItem('workoutExercise');
        localStorage.removeItem('workoutSets');
      }
    };
  }, []);

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
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Workout Tracking</h2>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition"
              >
                {showHistory ? "New Workout" : "View History"}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : showHistory ? (
              // Workout History View
              <div className="space-y-4">
                {workoutHistory.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No workout history found.</p>
                ) : (
                  workoutHistory.map((workout) => (
                    <div key={workout.id} className="bg-gray-700/30 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">{workout.exercise_name}</h3>
                          <p className="text-gray-400">{workout.category}</p>
                        </div>
                        <p className="text-sm text-gray-400">{formatDate(workout.created_at)}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {workout.sets.map((set, idx) => (
                          <div key={idx} className="bg-gray-600/30 p-3 rounded-lg flex items-center space-x-4">
                            <div className="w-8 h-8 flex items-center justify-center bg-gray-500 rounded-full text-sm font-medium">
                              {set.set_number}
                            </div>
                            <div>
                              <p className="text-sm text-gray-300">
                                {set.reps} reps @ {set.weight}kg
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              // New Workout Form
              <div className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="text-gray-300 text-sm font-medium block mb-2">
                    Exercise Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedExercise("");
                    }}
                    className="bg-gray-700/50 px-4 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-white"
                  >
                    <option
                      value=""
                      className="bg-gray-800"
                    >
                      -- Choose Category --
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-gray-800">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Exercise Selection */}
                {selectedCategory && (
                  <div>
                    <label className="text-gray-300 text-sm font-medium block mb-2">
                      Exercise
                    </label>
                    <select
                      value={selectedExercise}
                      onChange={(e) => {
                        setSelectedExercise(e.target.value);
                        const exercise = filteredExercises.find(ex => ex.name === e.target.value);
                        if (exercise) {
                          fetchLastWorkout(exercise.id);
                        }
                      }}
                      className="bg-gray-700/50 px-4 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-white"
                    >
                      <option
                        value=""
                        className="bg-gray-800"
                      >
                        -- Choose Exercise --
                      </option>
                      {filteredExercises.map((ex) => (
                        <option key={ex.id} value={ex.name} className="bg-gray-800">
                          {ex.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sets Section */}
                {selectedExercise && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">Sets</h3>
                      <button
                        onClick={addSet}
                        className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition flex items-center space-x-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Add Set</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {sets.map((set, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 bg-gray-700/30 p-4 rounded-lg"
                        >
                          <div className="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-gray-400 text-sm block mb-1">
                                Reps
                              </label>
                              <input
                                type="number"
                                placeholder="0"
                                value={set.reps}
                                onChange={(e) =>
                                  handleSetChange(index, "reps", e.target.value)
                                }
                                className="bg-gray-700/50 px-4 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-white"
                              />
                            </div>
                            <div>
                              <label className="text-gray-400 text-sm block mb-1">
                                Weight (kg)
                              </label>
                              <input
                                type="number"
                                placeholder="0"
                                value={set.weight}
                                onChange={(e) =>
                                  handleSetChange(index, "weight", e.target.value)
                                }
                                className="bg-gray-700/50 px-4 py-2 rounded-lg w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-white"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => removeSet(index)}
                            className="text-red-400 hover:text-red-300 transition p-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Save Button */}
                    <div className="pt-6">
                      <button
                        onClick={handleSave}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Save Workout</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="text-red-400 bg-red-500/10 border border-red-500 p-3 rounded-lg mt-4">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
