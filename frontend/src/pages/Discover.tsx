import { useEffect, useState } from "react";
import {
  Compass,
  MapPin,
  RefreshCw,
  Plus,
  Sparkles,
  AlertCircle,
  LocateFixed,
} from "lucide-react";
import { Link } from "react-router-dom";
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
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load activities",
          );
        }
      },
      () => {
        setStatus("location-denied");
      },
    );
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Hero / Header */}
      <section
        className="
          relative
          mb-8
          overflow-hidden
          rounded-3xl
          border
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          px-6
          py-8
          shadow-sm
          sm:px-8
          sm:py-10
        "
      >
        {/* Decorative background */}
        <div
          className="
            pointer-events-none
            absolute
            -right-16
            -top-20
            h-56
            w-56
            rounded-full
            bg-[var(--color-primary-soft)]
            opacity-70
            blur-2xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            right-20
            h-40
            w-40
            rounded-full
            bg-[var(--color-primary-light)]
            opacity-50
            blur-3xl
          "
        />

        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-2">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[var(--color-primary-soft)]
                text-[var(--color-primary)]
              "
            >
              <Compass size={20} />
            </div>

            <span
              className="
                text-sm
                font-semibold
                text-[var(--color-primary)]
              "
            >
              Discover
            </span>
          </div>

          <div className="max-w-2xl">
            <h1
              className="
                mb-3
                text-3xl
                font-bold
                leading-tight
                tracking-tight
                text-[var(--color-text)]
                sm:text-4xl
              "
            >
              Find something to do nearby.
            </h1>

            <p
              className="
                max-w-xl
                text-base
                leading-relaxed
                text-[var(--color-text-secondary)]
                sm:text-lg
              "
            >
              Discover activities happening around you and meet people
              who are interested in the same things.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[var(--color-border)]
                bg-white/80
                px-4
                py-2
                text-sm
                font-medium
                text-[var(--color-text-secondary)]
                backdrop-blur
              "
            >
              <MapPin
                size={16}
                className="text-[var(--color-primary)]"
              />
              Within 5 km
            </div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[var(--color-border)]
                bg-white/80
                px-4
                py-2
                text-sm
                font-medium
                text-[var(--color-text-secondary)]
                backdrop-blur
              "
            >
              <LocateFixed
                size={16}
                className="text-[var(--color-primary)]"
              />
              Based on your location
            </div>
          </div>
        </div>
      </section>

      {/* Section heading */}
      <section className="mb-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Sparkles
                size={17}
                className="text-[var(--color-primary)]"
              />

              <h2
                className="
                  text-xl
                  font-bold
                  text-[var(--color-text)]
                "
              >
                Activities near you
              </h2>
            </div>

            <p className="text-sm text-[var(--color-text-muted)]">
              Explore something interesting happening nearby.
            </p>
          </div>

          {status === "ready" && activities.length > 0 && (
            <span
              className="
                w-fit
                rounded-full
                bg-[var(--color-primary-soft)]
                px-3
                py-1.5
                text-sm
                font-semibold
                text-[var(--color-primary)]
              "
            >
              {activities.length}{" "}
              {activities.length === 1 ? "activity" : "activities"}
            </span>
          )}
        </div>
      </section>

      {/* Loading */}
      {status === "loading" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
                overflow-hidden
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                p-6
                shadow-sm
              "
            >
              <div className="animate-pulse">
                <div className="mb-5 flex justify-between gap-4">
                  <div className="w-full">
                    <div className="mb-3 h-5 w-20 rounded-full bg-gray-200" />
                    <div className="h-6 w-3/4 rounded-lg bg-gray-200" />
                  </div>

                  <div className="h-11 w-11 rounded-xl bg-gray-200" />
                </div>

                <div className="space-y-3">
                  <div className="h-8 w-2/3 rounded-lg bg-gray-200" />
                  <div className="h-8 w-1/2 rounded-lg bg-gray-200" />
                </div>

                <div className="my-5 h-px bg-gray-200" />

                <div className="h-10 w-full rounded-xl bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Location denied */}
      {status === "location-denied" && (
        <div
          className="
            rounded-2xl
            border
            border-[var(--color-warning)]
            bg-[var(--color-warning-light)]
            p-6
            sm:p-8
          "
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white
                text-[var(--color-warning)]
                shadow-sm
              "
            >
              <MapPin size={22} />
            </div>

            <div>
              <h3
                className="
                  mb-1
                  text-lg
                  font-bold
                  text-[var(--color-text)]
                "
              >
                Location access is needed
              </h3>

              <p
                className="
                  max-w-2xl
                  text-sm
                  leading-relaxed
                  text-[var(--color-text-secondary)]
                "
              >
                Nuzu uses your location to find activities happening
                within 5 km of you. Allow location access in your
                browser and refresh the page.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div
          className="
            rounded-2xl
            border
            border-[var(--color-danger)]
            bg-[var(--color-danger-light)]
            p-6
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white
                text-[var(--color-danger)]
              "
            >
              <AlertCircle size={20} />
            </div>

            <div>
              <h3
                className="
                  mb-1
                  font-semibold
                  text-[var(--color-text)]
                "
              >
                Something went wrong
              </h3>

              <p
                className="
                  text-sm
                  leading-relaxed
                  text-[var(--color-text-secondary)]
                "
              >
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {status === "ready" && activities.length === 0 && (
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            rounded-3xl
            border
            border-dashed
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-6
            py-14
            text-center
          "
        >
          <div
            className="
              mb-5
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-[var(--color-primary-soft)]
              text-[var(--color-primary)]
            "
          >
            <Compass size={28} />
          </div>

          <h3
            className="
              mb-2
              text-xl
              font-bold
              text-[var(--color-text)]
            "
          >
            Nothing nearby yet
          </h3>

          <p
            className="
              mb-6
              max-w-md
              text-sm
              leading-relaxed
              text-[var(--color-text-muted)]
            "
          >
            There aren't any activities within 5 km right now.
            Create something and give people nearby something to
            join.
          </p>

          <Link
            to="/create"
            className="
              nuzu-button-primary
              inline-flex
              items-center
              gap-2
            "
          >
            <Plus size={18} />
            Create an activity
          </Link>
        </div>
      )}

      {/* Activities */}
      {status === "ready" && activities.length > 0 && (
        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          "
        >
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
            />
          ))}
        </div>
      )}

      {/* Bottom helper */}
      {status === "ready" && activities.length > 0 && (
        <div
          className="
            mt-8
            flex
            items-center
            justify-center
            gap-2
            text-center
            text-xs
            text-[var(--color-text-muted)]
          "
        >
          <MapPin size={14} />
          Showing activities within 5 km of your current location
        </div>
      )}
    </div>
  );
}