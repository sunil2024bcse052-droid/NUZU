import { useEffect, useState } from "react";
import { AlertTriangle, ShieldAlert, Check, X } from "lucide-react";
import {
  getReportsForReview,
  updateReportStatus,
  applyRestriction,
  getUserRestrictions,
  type Report,
  type ReportStatus,
  type RestrictionType,
  type Restriction,
} from "../lib/admin";

const CATEGORY_LABELS: Record<string, string> = {
  HARASSMENT: "Harassment",
  UNSAFE_BEHAVIOR: "Unsafe behavior",
  FAKE_PROFILE: "Fake profile",
  INAPPROPRIATE_CONTENT: "Inappropriate content",
  NO_SHOW: "No-show",
  OTHER: "Other",
};

const RESTRICTION_LABELS: Record<RestrictionType, string> = {
  ACTIVITY_CREATION_BLOCKED: "Block activity creation",
  TEMPORARY_SUSPENSION: "Temporary suspension",
  PERMANENT_BAN: "Permanent ban",
};

function RestrictionPanel({ userId, onDone }: { userId: string; onDone: () => void }) {
  const [restrictionType, setRestrictionType] = useState<RestrictionType>("ACTIVITY_CREATION_BLOCKED");
  const [reason, setReason] = useState("");
  const [history, setHistory] = useState<Restriction[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getUserRestrictions(userId).then((res) => setHistory(res.restrictions));
  }, [userId]);

  async function handleApply() {
    if (!reason.trim()) {
      setMessage("Please give a reason.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await applyRestriction({ userId, restrictionType, reason });
      setMessage("Restriction applied.");
      setReason("");
      const res = await getUserRestrictions(userId);
      setHistory(res.restrictions);
      onDone();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to apply restriction");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-black/10 p-4">
      <p className="text-sm font-medium mb-2">Escalation ladder</p>
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <select
          value={restrictionType}
          onChange={(e) => setRestrictionType(e.target.value as RestrictionType)}
          className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary bg-surface"
        >
          {(Object.keys(RESTRICTION_LABELS) as RestrictionType[]).map((t) => (
            <option key={t} value={t}>{RESTRICTION_LABELS[t]}</option>
          ))}
        </select>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for this action"
          className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={handleApply}
          disabled={busy}
          style={{ backgroundColor: "#C1502E", color: "#FFFFFF" }}
          className="rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
        >
          {busy ? "Applying..." : "Apply"}
        </button>
      </div>
      {message && <p className="text-sm" style={{ color: "#0F6E56" }}>{message}</p>}

      {history.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-ink/50 mb-1">Restriction history</p>
          {history.map((r) => (
            <p key={r.id} className="text-xs text-ink/60">
              {RESTRICTION_LABELS[r.restrictionType]} - {new Date(r.appliedAt).toLocaleDateString()} - {r.reason}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "">("");
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
  const [expandedRestrictionUserId, setExpandedRestrictionUserId] = useState<string | null>(null);

  async function load(status?: ReportStatus) {
    setLoading(true);
    try {
      const res = await getReportsForReview(status || undefined);
      setReports(res.reports);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilterChange(value: ReportStatus | "") {
    setStatusFilter(value);
    load(value || undefined);
  }

  async function handleStatusChange(reportId: string, status: ReportStatus) {
    await updateReportStatus(reportId, status);
    await load(statusFilter || undefined);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl mb-1 flex items-center gap-2">
        <ShieldAlert size={26} /> Admin dashboard
      </h1>
      <p className="text-ink/60 mb-6">Review reports and apply the escalation ladder.</p>

      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(e.target.value as ReportStatus | "")}
          className="rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary bg-surface"
        >
          <option value="">Open and under review</option>
          <option value="OPEN">Open only</option>
          <option value="UNDER_REVIEW">Under review only</option>
          <option value="RESOLVED">Resolved</option>
          <option value="DISMISSED">Dismissed</option>
        </select>
      </div>

      {loading && <p className="text-ink/50">Loading...</p>}
      {!loading && reports.length === 0 && (
        <p className="text-ink/50">No reports match this filter.</p>
      )}

      <div className="flex flex-col gap-3">
        {reports.map((report) => (
          <div key={report.id} className="bg-surface rounded-2xl border border-black/5 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#FDF3EE" }}
                >
                  <AlertTriangle size={18} color="#C1502E" />
                </div>
                <div>
                  <p className="font-medium">{CATEGORY_LABELS[report.category] ?? report.category}</p>
                  <p className="text-sm text-ink/70 mt-0.5">{report.reason}</p>
                  <p className="text-xs text-ink/50 mt-1">
                    Filed by {report.reporter.name}
                    {report.reportedUser ? ` against ${report.reportedUser.name}` : ""}
                    {report.activity ? ` on "${report.activity.title}"` : ""}
                  </p>
                </div>
              </div>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                style={{ backgroundColor: "#E1F5EE", color: "#0F6E56" }}
              >
                {report.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {report.status !== "UNDER_REVIEW" && (
                <button
                  onClick={() => handleStatusChange(report.id, "UNDER_REVIEW")}
                  className="text-sm rounded-lg px-3 py-1.5 border border-black/10 hover:border-black/25 transition-colors"
                >
                  Mark under review
                </button>
              )}
              <button
                onClick={() => handleStatusChange(report.id, "RESOLVED")}
                className="flex items-center gap-1 text-sm rounded-lg px-3 py-1.5 border border-black/10 hover:border-black/25 transition-colors"
              >
                <Check size={14} /> Resolve
              </button>
              <button
                onClick={() => handleStatusChange(report.id, "DISMISSED")}
                className="flex items-center gap-1 text-sm rounded-lg px-3 py-1.5 border border-black/10 hover:border-black/25 transition-colors"
              >
                <X size={14} /> Dismiss
              </button>
              {report.reportedUserId && (
                <button
                  onClick={() =>
                    setExpandedRestrictionUserId(
                      expandedRestrictionUserId === report.reportedUserId ? null : report.reportedUserId
                    )
                  }
                  style={{ color: "#C1502E" }}
                  className="text-sm rounded-lg px-3 py-1.5 border border-black/10 hover:border-black/25 transition-colors"
                >
                  {expandedRestrictionUserId === report.reportedUserId ? "Hide restriction" : "Apply restriction"}
                </button>
              )}
            </div>

            {report.reportedUserId && expandedRestrictionUserId === report.reportedUserId && (
              <RestrictionPanel userId={report.reportedUserId} onDone={() => load(statusFilter || undefined)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}