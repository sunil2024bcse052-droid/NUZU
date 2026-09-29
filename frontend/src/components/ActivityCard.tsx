import { Link } from "react-router-dom";
import { MapPin, Users, Clock } from "lucide-react";
import type { Activity } from "../lib/activities";
import { formatTimeWindow } from "../lib/activities";

export default function ActivityCard({ activity }: { activity: Activity }) {
  const date = new Date(activity.date);
  const dateLabel = date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const timeWindow = formatTimeWindow(activity.date, activity.durationMinutes ?? 60);

  return (
    <Link
      to={`/activities/${activity.id}`}
      className="bg-surface rounded-2xl border border-black/5 p-5 flex flex-col gap-3 hover:border-black/15 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-2xl leading-tight">{activity.title}</h3>
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
          style={{ backgroundColor: "#E1F5EE", color: "#0F6E56" }}
        >
          {activity.category}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/60">
        <span className="flex items-center gap-1">
          <Clock size={15} /> {dateLabel}, {timeWindow}
        </span>
        {activity.distance_km !== undefined && (
          <span className="flex items-center gap-1">
            <MapPin size={15} /> {activity.distance_km.toFixed(1)} km away
          </span>
        )}
        {activity._count && (
          <span className="flex items-center gap-1">
            <Users size={15} /> {activity._count.participants}/{activity.capacity} joined
          </span>
        )}
      </div>
    </Link>
  );
}