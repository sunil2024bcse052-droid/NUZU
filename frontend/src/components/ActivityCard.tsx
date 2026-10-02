import { Link } from "react-router-dom";
import {
  MapPin,
  Users,
  Clock,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import type { Activity } from "../lib/activities";
import { formatTimeWindow } from "../lib/activities";

export default function ActivityCard({
  activity,
}: {
  activity: Activity;
}) {
  const date = new Date(activity.date);

  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const timeWindow = formatTimeWindow(
    activity.date,
    activity.durationMinutes ?? 60,
  );

  const participantCount = activity._count?.participants ?? 0;

  const capacity = activity.capacity;

  const spotsLeft =
    capacity !== undefined
      ? Math.max(capacity - participantCount, 0)
      : null;

  const isFull = spotsLeft === 0;

  return (
    <Link
      to={`/activities/${activity.id}`}
      className="
        nuzu-card
        nuzu-card-interactive
        group
        flex
        h-full
        flex-col
        overflow-hidden
      "
    >
      {/* Top accent */}
      <div className="h-1 w-full bg-[var(--color-primary)]" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">

        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">

          <div className="min-w-0">
            <span className="nuzu-tag mb-3">
              {activity.category}
            </span>

            <h3
              className="
                line-clamp-2
                text-xl
                font-bold
                leading-tight
                text-[var(--color-text)]
                transition-colors
                duration-200
                group-hover:text-[var(--color-primary)]
              "
            >
              {activity.title}
            </h3>
          </div>

          {/* Activity icon */}
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[var(--color-primary-soft)]
              text-[var(--color-primary)]
              transition-transform
              duration-200
              group-hover:scale-105
            "
          >
            <CalendarDays size={20} />
          </div>
        </div>

        {/* Activity details */}
        <div className="mb-5 space-y-3">

          {/* Date + time */}
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-[var(--color-surface-soft)]
                text-[var(--color-text-secondary)]
              "
            >
              <Clock size={15} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text)]">
                {dateLabel}
              </p>

              <p className="text-xs text-[var(--color-text-muted)]">
                {timeWindow}
              </p>
            </div>
          </div>

          {/* Distance */}
          {activity.distance_km !== undefined && (
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[var(--color-surface-soft)]
                  text-[var(--color-text-secondary)]
                "
              >
                <MapPin size={15} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {activity.distance_km.toFixed(1)} km away
                </p>

                <p className="text-xs text-[var(--color-text-muted)]">
                  Activity location
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="nuzu-divider mb-4" />

        {/* Participants */}
        <div className="mb-5 flex items-center justify-between gap-3">

          <div className="flex items-center gap-3">

            {/* Avatar stack */}
            <div className="nuzu-avatar-stack">
              <div className="nuzu-avatar h-8 w-8 text-xs">
                <Users size={14} />
              </div>

              {participantCount > 0 && (
                <div
                  className="
                    nuzu-avatar
                    h-8
                    w-8
                    bg-[var(--color-primary-light)]
                    text-[10px]
                    text-[var(--color-primary)]
                  "
                >
                  {participantCount}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">
                {participantCount}{" "}
                {participantCount === 1
                  ? "person"
                  : "people"}{" "}
                joined
              </p>

              {capacity !== undefined && (
                <p className="text-xs text-[var(--color-text-muted)]">
                  {isFull
                    ? "Activity is full"
                    : `${spotsLeft} ${
                        spotsLeft === 1
                          ? "spot"
                          : "spots"
                      } left`}
                </p>
              )}
            </div>
          </div>

          {/* Capacity indicator */}
          {capacity !== undefined && (
            <div
              className="
                shrink-0
                rounded-full
                px-3
                py-1.5
                text-xs
                font-semibold
              "
              style={{
                backgroundColor: isFull
                  ? "var(--color-danger-light)"
                  : "var(--color-success-light)",
                color: isFull
                  ? "var(--color-danger)"
                  : "var(--color-success)",
              }}
            >
              {isFull ? "Full" : `${spotsLeft} left`}
            </div>
          )}
        </div>

        {/* CTA */}
        <div
          className="
            mt-auto
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-[var(--color-border)]
            bg-[var(--color-surface-soft)]
            px-4
            py-3
            text-sm
            font-semibold
            text-[var(--color-text)]
            transition-all
            duration-200
            group-hover:border-[var(--color-primary)]
            group-hover:bg-[var(--color-primary-soft)]
            group-hover:text-[var(--color-primary)]
          "
        >
          <span>
            View activity
          </span>

          <ArrowRight
            size={17}
            className="
              transition-transform
              duration-200
              group-hover:translate-x-1
            "
          />
        </div>
      </div>
    </Link>
  );
}