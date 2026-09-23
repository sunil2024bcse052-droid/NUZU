import { MapPin, Users, Calendar } from "lucide-react";
import type { Activity } from "../lib/activities";

export default function ActivityCard({ activity }: { activity: Activity }) {
  const date = new Date(activity.date);
  const dateLabel = date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const timeLabel = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  return (
    <div className="bg-surface rounded-2xl border border-black/5 p-5 flex flex-col gap-3">
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
          <Calendar size={15} /> {dateLabel}, {timeLabel}
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
    </div>
  );
}