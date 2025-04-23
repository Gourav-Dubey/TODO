import { useEffect, useState } from "react";
import { getDistanceFromLatLonInMeters } from "../utils/distance";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [nearbyTaskIds, setNearbyTaskIds] = useState([]);

  const getLiveLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  };

  const checkNearbyTasks = () => {
    if (location.lat && location.lng && tasks.length > 0) {
      const nearby = tasks.filter((task) => {
        const dist = getDistanceFromLatLonInMeters(
          location.lat,
          location.lng,
          task.lat,
          task.lng
        );
        return dist <= 50; // within 50 meters
      });

      const nearbyIds = nearby.map((task) => task.id);
      setNearbyTaskIds(nearbyIds);

      if (nearby.length > 0) {
        alert(`You are near: ${nearby.map((t) => t.title).join(", ")}`);
      }
    }
  };

  useEffect(() => {
    // Check every 10 seconds
    const interval = setInterval(() => {
      getLiveLocation();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkNearbyTasks();
  }, [location]);

  const handleGetLocation = () => {
    getLiveLocation();
  };

  const handleAddTask = () => {
    if (taskInput && location.lat && location.lng) {
      const newTask = {
        id: Date.now(),
        title: taskInput,
        lat: location.lat,
        lng: location.lng,
      };
      setTasks([...tasks, newTask]);
      setTaskInput("");
    } else {
      alert("Enter task and get location first!");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <input
          className="p-2 rounded bg-gray-800 border border-gray-600"
          type="text"
          placeholder="Task name"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition duration-300">
  📍 Get Location
</button>

        <button
          onClick={handleAddTask}
          className="ml-2 px-3 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          ➕ Add Task
        </button>
      </div>

      <div>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded mb-2 ${
              nearbyTaskIds.includes(task.id)
                ? "bg-green-700"
                : "bg-gray-800"
            }`}
          >
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-300">
              Lat: {task.lat}, Lng: {task.lng}
            </p>
            {nearbyTaskIds.includes(task.id) && (
              <p className="text-yellow-300 font-bold">🟢 Nearby Task!</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;


