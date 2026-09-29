import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Award } from "lucide-react";
import { getMyProfile, type Profile } from "../lib/user";
import { getMyPointsHistory, type PointsEntry } from "../lib/points";
import { clearToken } from "../lib/api";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [points, setPoints] = useState<{ total: number; entries: PointsEntry[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyProfile(), getMyPointsHistory()])
      .then(([profileRes, pointsRes]) => {
        setProfile(profileRes.user);
        setPoints(pointsRes);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  if (loading) return <p className="text-ink/50">Loading...</p>;
  if (!profile) return <p style={{ color: "#C1502E" }}>Failed to load profile.</p>;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl">{profile.name}</h1>
          <p className="text-ink/60 text-sm">{profile.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-ink/50 hover:text-alert transition-colors"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>

      <div
        className="rounded-2xl p-5 mb-6 flex items-center gap-4"
        style={{ backgroundColor: "#E1F5EE" }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#0F6E56" }}
        >
          <Award size={22} color="#FFFFFF" />
        </div>
        <div>
          <p className="text-2xl font-display" style={{ color: "#0F6E56" }}>{points?.total ?? 0} points</p>
          <p className="text-sm text-ink/60">from {points?.entries.length ?? 0} verified check-ins</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-display text-xl mb-2">Interests</h2>
        {profile.interests.length === 0 ? (
          <p className="text-sm text-ink/50">No interests set yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="text-sm px-3 py-1 rounded-full border border-black/10"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display text-xl mb-2">Points history</h2>
        {!points || points.entries.length === 0 ? (
          <p className="text-sm text-ink/50">No points earned yet. Attend an activity and check in to earn your first points.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {points.entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between text-sm py-2 border-b border-black/5">
                <div>
                  <p className="font-medium">{entry.activity?.title ?? entry.reason}</p>
                  <p className="text-ink/50 text-xs">{new Date(entry.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="font-medium" style={{ color: "#0F6E56" }}>+{entry.points}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}