import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  LoaderCircle,
  MapPin,
  Users,
} from "lucide-react";
import {
  getActivity,
  joinActivity,
  leaveActivity,
} from "../lib/activities";
import type { Activity } from "../lib/activities";
import { formatTimeWindow } from "../lib/activities";

type Status = "loading" | "ready" | "error";

export default function ActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!id) {
      setStatus("error");
      setError("Activity not found.");
      return;
    }

    let cancelled = false;

    async function loadActivity() {
      try {
        setStatus("loading");
        setError("");

        const result = await getActivity(id);

        if (!cancelled) {
          setActivity(result.activity);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load this activity.",
          );
        }
      }
    }

    loadActivity();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const participantCount = activity?._count?.participants ?? 0;

  const capacity = activity?.capacity;

  const spotsLeft = useMemo(() => {
    if (capacity === undefined || capacity === null) {
      return null;
    }

    return Math.max(capacity - participantCount, 0);
  }, [capacity, participantCount]);

  const isFull = spotsLeft === 0 && capacity !== undefined;

  const progress = useMemo(() => {
    if (!capacity || capacity <= 0) {
      return 0;
    }

    return Math.min((participantCount / capacity) * 100, 100);
  }, [capacity, participantCount]);

  async function handleJoin() {
    if (!activity || joining || joined || isFull) {
      return;
    }

    try {
      setJoining(true);
      setError("");

      await joinActivity(activity.id);

      setJoined(true);

      setActivity((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          _count: {
            ...current._count,
            participants: participantCount + 1,
          },
        };
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to join this activity.",
      );
    } finally {
      setJoining(false);
    }
  }

  async function handleLeave() {
    if (!activity || joining) {
      return;
    }

    try {
      setJoining(true);
      setError("");

      await leaveActivity(activity.id);

      setJoined(false);

      setActivity((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          _count: {
            ...current._count,
            participants: Math.max(participantCount - 1, 0),
          },
        };
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to leave this activity.",
      );
    } finally {
      setJoining(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 h-5 w-24 animate-pulse rounded bg-[var(--color-surface-soft)]" />

        <div className="nuzu-card overflow-hidden">
          <div className="h-2 animate-pulse bg-[var(--color-primary-soft)]" />

          <div className="space-y-6 p-6 sm:p-8">
            <div className="h-6 w-24 animate-pulse rounded-full bg-[var(--color-surface-soft)]" />

            <div className="space-y-3">
              <div className="h-10 w-3/4 animate-pulse rounded-lg bg-[var(--color-surface-soft)]" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-[var(--color-surface-soft)]" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-2xl bg-[var(--color-surface-soft)]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error" || !activity) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
        >
          <ArrowLeft size={17} />
          Go back
        </button>

        <div className="nuzu-card p-8 text-center sm:p-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-danger-light)] text-[var(--color-danger)]">
            <MapPin size={24} />
          </div>

          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            We couldn't load this activity
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {error || "The activity may no longer exist."}
          </p>

          <Link
            to="/"
            className="nuzu-button-primary mt-6 inline-flex"
          >
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  const date = new Date(activity.date);

  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const timeWindow = formatTimeWindow(
    activity.date,
    activity.durationMinutes ?? 60,
  );

  return (
    <div className="mx-auto w-full max-w-5xl pb-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
      >
        <ArrowLeft size={17} />
        Back to Discover
      </button>

      <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
        {/* Hero */}
        <div className="relative overflow-hidden bg-[var(--color-primary)] px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/5" />

          <div className="relative">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
                {activity.category}
              </span>

              {activity.isSmallGroup && (
                <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                  Small group
                </span>
              )}
            </div>

            <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
              {activity.title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              Join people nearby and take part in this activity.
            </p>
          </div>
        </div>

        {/* Main */}
        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0">
            {/* Activity information */}
            <section>
              <h2 className="mb-4 text-lg font-bold text-[var(--color-text)]">
                Activity details
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoCard
                  icon={<CalendarDays size={19} />}
                  iconClass="bg-purple-50 text-purple-600"
                  label="Date"
                  value={dateLabel}
                />

                <InfoCard
                  icon={<Clock3 size={19} />}
                  iconClass="bg-blue-50 text-blue-600"
                  label="Time"
                  value={timeWindow}
                />

                {activity.distance_km !== undefined && (
                  <InfoCard
                    icon={<MapPin size={19} />}
                    iconClass="bg-orange-50 text-orange-600"
                    label="Distance"
                    value={`${activity.distance_km.toFixed(1)} km away`}
                  />
                )}

                <InfoCard
                  icon={<Users size={19} />}
                  iconClass="bg-emerald-50 text-emerald-600"
                  label="Participants"
                  value={`${participantCount} ${
                    participantCount === 1 ? "person" : "people"
                  } joined`}
                />
              </div>
            </section>

            {/* Social proof */}
            <section className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-[var(--color-text)]">
                    People are joining
                  </h2>

                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {participantCount === 0
                      ? "Be the first person to join."
                      : `${participantCount} ${
                          participantCount === 1 ? "person is" : "people are"
                        } going to this activity.`}
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  <Users size={22} />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {Array.from({
                    length: Math.min(Math.max(participantCount, 1), 5),
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--color-surface-soft)] bg-[var(--color-primary-light)] text-xs font-bold text-[var(--color-primary)]"
                    >
                      {index === 0 && participantCount === 0
                        ? "+"
                        : "•"}
                    </div>
                  ))}
                </div>

                <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                  {participantCount === 0
                    ? "Your spot could be first"
                    : "Join the group"}
                </span>
              </div>
            </section>

            {/* Capacity */}
            {capacity !== undefined && capacity !== null && (
              <section className="mt-8">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--color-text)]">
                    Activity capacity
                  </span>

                  <span
                    className={`text-sm font-semibold ${
                      isFull
                        ? "text-[var(--color-danger)]"
                        : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {participantCount}/{capacity}
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-surface-soft)]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFull
                        ? "bg-[var(--color-danger)]"
                        : "bg-[var(--color-primary)]"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  {isFull
                    ? "This activity has reached its capacity."
                    : `${spotsLeft} ${
                        spotsLeft === 1 ? "spot" : "spots"
                      } remaining`}
                </p>
              </section>
            )}
          </div>

          {/* Join panel */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
                Ready to join?
              </p>

              <h2 className="mt-2 text-xl font-bold text-[var(--color-text)]">
                {joined ? "You're going!" : "Take part in this activity"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                {joined
                  ? "You're on the participant list. See you there!"
                  : "Meet people nearby and participate in something you enjoy."}
              </p>

              {error && (
                <div className="mt-4 rounded-xl border border-[var(--color-danger)]/20 bg-[var(--color-danger-light)] p-3 text-sm text-[var(--color-danger)]">
                  {error}
                </div>
              )}

              <div className="mt-5">
                {joined ? (
                  <button
                    type="button"
                    onClick={handleLeave}
                    disabled={joining}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 text-sm font-bold text-[var(--color-text)] transition hover:border-[var(--color-danger)] hover:text-[var(--color-danger)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {joining ? (
                      <>
                        <LoaderCircle size={18} className="animate-spin" />
                        Leaving...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Joined
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleJoin}
                    disabled={joining || isFull}
                    className="nuzu-button-primary flex w-full items-center justify-center gap-2 py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {joining ? (
                      <>
                        <LoaderCircle size={18} className="animate-spin" />
                        Joining...
                      </>
                    ) : isFull ? (
                      "Activity is full"
                    ) : (
                      <>
                        <Users size={18} />
                        Join activity
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="mt-5 border-t border-[var(--color-border)] pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">
                    Participants
                  </span>

                  <span className="font-bold text-[var(--color-text)]">
                    {participantCount}
                    {capacity !== undefined && ` / ${capacity}`}
                  </span>
                </div>

                {capacity !== undefined && (
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  iconClass,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            {label}
          </p>

          <p className="mt-1 text-sm font-bold leading-5 text-[var(--color-text)]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}