import { useEffect, useState } from "react";
import { Building2, Search, Plus, Check, Clock, Shield } from "lucide-react";
import {
  listCircles,
  createCircle,
  joinCircle,
  getMyMemberships,
  getCircleMembers,
  approveMember,
  CIRCLE_TYPE_LABELS,
  type Circle,
  type CircleType,
  type Membership,
  type MemberEntry,
} from "../lib/circles";
import Field from "../components/Field";

const TYPES = Object.keys(CIRCLE_TYPE_LABELS) as CircleType[];

function ModeratorPanel({ circleId }: { circleId: string }) {
  const [members, setMembers] = useState<MemberEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await getCircleMembers(circleId);
      setMembers(res.members);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circleId]);

  const pending = members.filter((m) => m.status === "PENDING");

  async function handleApprove(userId: string) {
    setBusyId(userId);
    try {
      await approveMember(circleId, userId);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="text-sm text-ink/50 mt-3">Loading members...</p>;
  if (pending.length === 0) return <p className="text-sm text-ink/50 mt-3">No pending requests.</p>;

  return (
    <div className="mt-3 flex flex-col gap-2">
      {pending.map((m) => (
        <div key={m.id} className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-2.5">
          <div>
            <p className="text-sm font-medium">{m.user.name}</p>
            <p className="text-xs text-ink/50">{m.user.email}</p>
          </div>
          <button
            onClick={() => handleApprove(m.userId)}
            disabled={busyId === m.userId}
            style={{ backgroundColor: "#0F6E56", color: "#FFFFFF" }}
            className="flex items-center gap-1 text-sm rounded-lg px-3 py-1.5 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Check size={14} /> {busyId === m.userId ? "..." : "Approve"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default function Circles() {
  const [myMemberships, setMyMemberships] = useState<Membership[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<CircleType | "">("");
  const [error, setError] = useState("");
  const [joinMessages, setJoinMessages] = useState<Record<string, { text: string; isError: boolean }>>({});
  const [expandedModeratorId, setExpandedModeratorId] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<CircleType>("SOCIETY");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [creating, setCreating] = useState(false);

  async function loadMemberships() {
    const res = await getMyMemberships();
    setMyMemberships(res.memberships);
  }

  async function loadCircles(nextSearch = search, nextType = typeFilter) {
    setLoading(true);
    setError("");
    try {
      const res = await listCircles({
        search: nextSearch || undefined,
        type: nextType || undefined,
      });
      setCircles(res.circles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load circles");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMemberships();
    loadCircles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadCircles();
  }

  function handleTypeChange(value: CircleType | "") {
    setTypeFilter(value);
    loadCircles(search, value);
  }

  function membershipFor(circleId: string) {
    return myMemberships.find((m) => m.circleId === circleId);
  }

  async function handleJoin(circleId: string) {
    try {
      await joinCircle(circleId);
      setJoinMessages((m) => ({
        ...m,
        [circleId]: { text: "Request sent. A moderator will approve you.", isError: false },
      }));
      await loadMemberships();
    } catch (err) {
      setJoinMessages((m) => ({
        ...m,
        [circleId]: { text: err instanceof Error ? err.message : "Failed to join", isError: true },
      }));
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateMessage("");
    setCreating(true);
    try {
      await createCircle({
        name,
        type,
        address: address || undefined,
        pincode: pincode || undefined,
      });
      setName("");
      setAddress("");
      setPincode("");
      setShowCreate(false);
      await loadCircles();
      await loadMemberships();
    } catch (err) {
      setCreateMessage(err instanceof Error ? err.message : "Failed to create circle");
    } finally {
      setCreating(false);
    }
  }

  const moderatingMemberships = myMemberships.filter((m) => m.isModerator);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl mb-1">Circles</h1>
          <p className="text-ink/60">Your society, college, or workplace. Activities here are just for your people.</p>
        </div>
        <button
          onClick={() => setShowCreate((v) => !v)}
          style={{ backgroundColor: "#0F6E56", color: "#FFFFFF" }}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> New circle
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-surface border border-black/5 rounded-2xl p-5 mb-6">
          <h2 className="font-display text-xl mb-4">Create a circle</h2>
          <Field label="Name" value={name} onChange={setName} placeholder="Green Valley Residency" />
          <label className="block mb-4">
            <span className="block text-sm font-medium text-ink/80 mb-1.5">Type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CircleType)}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-base outline-none focus:border-primary bg-surface"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{CIRCLE_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </label>
          <Field label="Address (optional)" value={address} onChange={setAddress} placeholder="Sector 12" />
          <Field label="Pincode (optional)" value={pincode} onChange={setPincode} placeholder="190001" />
          {createMessage && <p className="text-sm mb-4" style={{ color: "#C1502E" }}>{createMessage}</p>}
          <button
            type="submit"
            disabled={creating}
            style={{ backgroundColor: "#0F6E56", color: "#FFFFFF" }}
            className="w-full rounded-xl py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create circle"}
          </button>
          <p className="text-xs text-ink/50 mt-2">You become the circle's moderator automatically.</p>
        </form>
      )}

      {moderatingMemberships.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-xl mb-3 flex items-center gap-2">
            <Shield size={18} /> Circles you moderate
          </h2>
          <div className="flex flex-col gap-3">
            {moderatingMemberships.map((m) => (
              <div key={m.id} className="bg-surface rounded-2xl border border-black/5 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg">{m.circle.name}</h3>
                  <button
                    onClick={() => setExpandedModeratorId(expandedModeratorId === m.circleId ? null : m.circleId)}
                    className="text-sm text-primary font-medium"
                  >
                    {expandedModeratorId === m.circleId ? "Hide requests" : "Review requests"}
                  </button>
                </div>
                {expandedModeratorId === m.circleId && <ModeratorPanel circleId={m.circleId} />}
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search circles"
            className="w-full rounded-xl border border-black/10 pl-10 pr-4 py-3 text-base outline-none focus:border-primary"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => handleTypeChange(e.target.value as CircleType | "")}
          className="rounded-xl border border-black/10 px-4 py-3 text-base outline-none focus:border-primary bg-surface"
        >
          <option value="">All types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{CIRCLE_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </form>

      {loading && <p className="text-ink/50">Loading...</p>}
      {error && <p className="text-sm" style={{ color: "#C1502E" }}>{error}</p>}
      {!loading && !error && circles.length === 0 && (
        <p className="text-ink/50">No circles found. Create the first one for your community.</p>
      )}

      <div className="flex flex-col gap-3">
        {circles.map((circle) => {
          const joinMsg = joinMessages[circle.id];
          const membership = membershipFor(circle.id);

          return (
            <div key={circle.id} className="bg-surface rounded-2xl border border-black/5 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#E1F5EE" }}
                  >
                    <Building2 size={20} color="#0F6E56" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl leading-tight">{circle.name}</h3>
                    <p className="text-sm text-ink/60">
                      {CIRCLE_TYPE_LABELS[circle.type]}
                      {circle.address ? `, ${circle.address}` : ""}
                      {circle.pincode ? ` ${circle.pincode}` : ""}
                    </p>
                  </div>
                </div>

                {membership?.status === "VERIFIED" ? (
                  <span className="flex items-center gap-1 text-sm font-medium" style={{ color: "#0F6E56" }}>
                    <Check size={15} /> Member
                  </span>
                ) : membership?.status === "PENDING" ? (
                  <span className="flex items-center gap-1 text-sm text-ink/50">
                    <Clock size={15} /> Pending
                  </span>
                ) : (
                  <button
                    onClick={() => handleJoin(circle.id)}
                    className="text-sm font-medium rounded-xl px-4 py-2 border border-black/10 hover:border-black/25 transition-colors whitespace-nowrap"
                  >
                    Request to join
                  </button>
                )}
              </div>
              {joinMsg && (
                <p className="text-sm mt-3" style={{ color: joinMsg.isError ? "#C1502E" : "#0F6E56" }}>
                  {joinMsg.text}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}