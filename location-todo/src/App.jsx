import { useEffect, useState } from "react"; 
import { MapPin, PlusCircle, Trash2 } from "lucide-react";
import { getDistanceFromLatLonInMeters } from "./utils/distance";
import TaskMap from "./components/TaskMap";

const LOCAL_KEY = "location-tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [location, setLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clickedLocation, setClickedLocation] = useState(null);

  // Load tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const lat = 22.8524 + Math.random() * 0.002;
    const lng = 78.6301 + Math.random() * 0.002;
    const task = { name: newTask, lat, lng };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const handleDelete = (index) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setLocation({ lat: latitude, lng: longitude });

      const nearby = tasks.filter((task) => {
        const dist = getDistanceFromLatLonInMeters(
          latitude,
          longitude,
          task.lat,
          task.lng
        );
        return dist <= 50;
      });

      if (nearby.length) {
        alert(`Nearby: ${nearby.map((t) => t.name).join(", ")}`);
      } else {
        alert("No nearby tasks.");
      }
    });
  };

  // ✅ Yeh bahar hona chahiye tha — NOT inside any other function
  const handleMapClick = (latlng) => {
    setClickedLocation(latlng);
    setShowModal(true);
  };

  
  
  


  const handleAddTaskFromMap = () => {
    if (!newTask.trim() || !clickedLocation) return;
    const task = {
      name: newTask,
      lat: clickedLocation.lat,
      lng: clickedLocation.lng,
    };
    setTasks([...tasks, task]);
    setNewTask("");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
        📌 Location Based To-Do List
      </h1>
 {/* Header with Login Button */}
 <div className="flex justify-between items-center mb-6">
      
      <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow text-white">
        🔐 User Login
      </button>
    </div>
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task name"
          className="px-4 py-2 rounded-lg text-white w-64"
        />
        <button
          onClick={handleAddTask}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusCircle size={18} /> Add Task
        </button>
        <button
          onClick={handleGetLocation}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <MapPin size={18} /> Get Location
        </button>
      </div>

      <div className="grid gap-4 max-w-3xl mx-auto">
        {tasks.map((task, idx) => {
          const isNearby =
            location &&
            getDistanceFromLatLonInMeters(
              location.lat,
              location.lng,
              task.lat,
              task.lng
            ) <= 50;

          return (
            <div
              key={idx}
              className="bg-white/10 p-4 rounded-xl backdrop-blur border border-white/20 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-semibold capitalize">
                  {task.name}
                </h3>
                <p className="text-sm text-slate-300">
                  Lat: {task.lat.toFixed(5)} | Lng: {task.lng.toFixed(5)}
                </p>
                {isNearby && (
                  <p className="text-lime-400 font-semibold animate-pulse">
                    📍 Nearby
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(idx)}
                className="text-red-400 hover:text-red-500"
              >
                <Trash2 size={22} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Map Component */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-bold mb-2 text-center">🗺 Task Map</h2>
        <TaskMap tasks={tasks} location={location} onMapClick={handleMapClick} />
        
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white text-black p-6 rounded-xl w-80 space-y-4">
              <h2 className="text-lg font-bold">Add Task at Clicked Location</h2>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Task name"
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTaskFromMap}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

