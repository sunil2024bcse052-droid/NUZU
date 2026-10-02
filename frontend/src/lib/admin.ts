import { apiRequest } from "./api";

export type ReportStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";
export type ReportCategory =
  | "HARASSMENT"
  | "UNSAFE_BEHAVIOR"
  | "FAKE_PROFILE"
  | "INAPPROPRIATE_CONTENT"
  | "NO_SHOW"
  | "OTHER";
export type RestrictionType = "ACTIVITY_CREATION_BLOCKED" | "TEMPORARY_SUSPENSION" | "PERMANENT_BAN";

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string | null;
  activityId: string | null;
  category: ReportCategory;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  reporter: { id: string; name: string; email: string };
  reportedUser: { id: string; name: string; email: string } | null;
  activity: { id: string; title: string } | null;
}

export interface Restriction {
  id: string;
  userId: string;
  restrictionType: RestrictionType;
  reason: string;
  appliedAt: string;
  reviewedAt: string | null;
  reviewerAdminId: string | null;
}

export async function getReportsForReview(status?: ReportStatus) {
  const qs = status ? `?status=${status}` : "";
  return apiRequest<{ reports: Report[] }>(`/admin/reports${qs}`);
}

export async function updateReportStatus(reportId: string, status: ReportStatus) {
  return apiRequest<{ report: Report }>(`/admin/reports/${reportId}`, {
    method: "PATCH",
    body: { status },
  });
}

export async function applyRestriction(input: {
  userId: string;
  restrictionType: RestrictionType;
  reason: string;
}) {
  return apiRequest<{ restriction: Restriction }>("/admin/restrictions", {
    method: "POST",
    body: input,
  });
}

export async function getUserRestrictions(userId: string) {
  return apiRequest<{ restrictions: Restriction[] }>(`/admin/restrictions/${userId}`);
}