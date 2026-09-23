import { useEffect, useState } from "react";
import { getNearbyActivities } from "../lib/activities";
import type { Activity } from "../lib/activities";
import ActivityCard from "../components/ActivityCard";

type Status = "loading" | "ready" | "error" | "location-denied";

export default function Discover() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("Your browser doesn't support location access.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const result = await getNearbyActivities(latitude, longitude, 5);
          setActivities(result.activities);
          setStatus("ready");
        } catch (err) {
          setStatus("error");
          setError(err instanceof Error ? err.message : "Failed to load activities");
        }
      },
      () => {
        setStatus("location-denied");
      }
    );
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">Discover nearby</h1>
      <p className="text-ink/60 mb-6">Activities happening within 5km of you.</p>

      {status === "loading" && <p className="text-ink/50">Finding your location...</p>}

      {status === "location-denied" && (
        <div className="rounded-xl p-5" style={{ backgroundColor: "#FDF3EE" }}>
          <p className="text-sm" style={{ color: "#C1502E" }}>
            Location access is needed to find nearby activities. Please allow location access
            in your browser and refresh the page.
          </p>
        </div>
      )}

      {status === "error" && (
        <p className="text-sm" style={{ color: "#C1502E" }}>{error}</p>
      )}

      {status === "ready" && activities.length === 0 && (
        <p className="text-ink/50">No activities nearby yet. Be the first to create one!</p>
      )}

      {status === "ready" && activities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}