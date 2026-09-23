import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createActivity } from "../lib/activities";
import Field from "../components/Field";

const CATEGORIES = ["Sports", "Study", "Volunteering", "Trip", "Discussion", "Other"];

export default function CreateActivity() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState("8");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!navigator.geolocation) {
      setError("Your browser doesn't support location access.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocating(false);
        setLoading(true);
        try {
          const isoDate = new Date(`${date}T${time}`).toISOString();
          await createActivity({
            title,
            description,
            category,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            date: isoDate,
            capacity: Number(capacity),
          });
          navigate("/");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to create activity");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLocating(false);
        setError("Location access is needed to post an activity at your current spot.");
      }
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-display text-3xl mb-1">Create an activity</h1>
      <p className="text-ink/60 mb-6">Uses your current location as the meeting spot.</p>

      <form onSubmit={handleSubmit}>
        <Field label="Title" value={title} onChange={setTitle} placeholder="Evening Badminton" />

        <label className="block mb-4">
          <span className="block text-sm font-medium text-ink/80 mb-1.5">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Casual badminton, all levels welcome"
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-base outline-none focus:border-primary"
          />
        </label>

        <label className="block mb-4">
          <span className="block text-sm font-medium text-ink/80 mb-1.5">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-base outline-none focus:border-primary bg-surface"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Date" type="date" value={date} onChange={setDate} />
          <Field label="Time" type="time" value={time} onChange={setTime} />
        </div>

        <Field label="Capacity" type="number" value={capacity} onChange={setCapacity} />

        {error && <p className="text-sm mb-4" style={{ color: "#C1502E" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading || locating}
          style={{ backgroundColor: "#0F6E56", color: "#FFFFFF" }}
          className="w-full rounded-xl py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {locating ? "Getting your location..." : loading ? "Creating..." : "Create activity"}
        </button>
      </form>
    </div>
  );
}