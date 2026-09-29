import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import {
  getActivity,
  getParticipants,
  joinActivity,
  generateQr,
  scanQr,
  type Activity,
  type Participant,
} from "../lib/activities";
import { getMyProfile } from "../lib/user";

export default function ActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [myUserId, setMyUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [scanToken, setScanToken] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([getActivity(id), getParticipants(id), getMyProfile()])
      .then(([activityRes, participantsRes, profileRes]) => {
        setActivity(activityRes.activity);
        setParticipants(participantsRes.participants);
        setMyUserId(profileRes.user.id);
      })
      .catch((err) => setMessage(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  const isCreator = activity?.creatorId === myUserId;
  const isParticipant = participants.some((p) => p.userId === myUserId);

  async function handleJoin() {
    if (!id) return;
    setMessage("");
    try {
      await joinActivity(id);
      setMessage("You're in! See you there.");
      setMessageIsError(false);
      const res = await getParticipants(id);
      setParticipants(res.participants);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to join");
      setMessageIsError(true);
    }
  }

  async function handleGenerateQr() {
    if (!id) return;
    try {
      const res = await generateQr(id);
      setQrImage(res.qrImageDataUrl);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to generate QR");
      setMessageIsError(true);
    }
  }

  async function handleScan() {
    if (!id || !scanToken) return;
    try {
      const res = await scanQr(id, scanToken);
      setMessage(`Checked in! You earned ${res.pointsAwarded} points.`);
      setMessageIsError(false);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Check-in failed");
      setMessageIsError(true);
    }
  }

  if (loading) return <p className="text-ink/50">Loading...</p>;
  if (!activity) return <p style={{ color: "#C1502E" }}>Activity not found.</p>;

  const date = new Date(activity.date);

  return (
    <div className="max-w-lg mx-auto">
      <span
        className="text-xs font-medium px-2.5 py-1 rounded-full"
        style={{ backgroundColor: "#E1F5EE", color: "#0F6E56" }}
      >
        {activity.category}
      </span>
      <h1 className="font-display text-3xl mt-3 mb-2">{activity.title}</h1>
      <p className="text-ink/70 mb-4">{activity.description}</p>

      <div className="flex flex-col gap-2 text-sm text-ink/60 mb-6">
        <span className="flex items-center gap-2">
          <Calendar size={16} /> {date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} at {date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
        </span>
        <span className="flex items-center gap-2">
          <Users size={16} /> {participants.length}/{activity.capacity} joined
        </span>
        {activity.creator && (
          <span className="flex items-center gap-2">
            <MapPin size={16} /> Hosted by {activity.creator.name}
          </span>
        )}
      </div>

      {message && (
        <p className="text-sm mb-4" style={{ color: messageIsError ? "#C1502E" : "#0F6E56" }}>
          {message}
        </p>
      )}

      {!isCreator && !isParticipant && (
        <button
          onClick={handleJoin}
          style={{ backgroundColor: "#0F6E56", color: "#FFFFFF" }}
          className="w-full rounded-xl py-3 font-medium hover:opacity-90 transition-opacity mb-6"
        >
          Join activity
        </button>
      )}

      {isCreator && (
        <div className="border-t border-black/10 pt-6 mb-6">
          <h2 className="font-display text-xl mb-3">Attendance QR code</h2>
          <p className="text-sm text-ink/60 mb-3">Generate a QR code for participants to scan at the venue.</p>
          <button
            onClick={handleGenerateQr}
            style={{ backgroundColor: "#D9A441", color: "#FFFFFF" }}
            className="rounded-xl py-2.5 px-5 font-medium hover:opacity-90 transition-opacity"
          >
            Generate QR code
          </button>
          {qrImage && (
            <div className="mt-4 bg-surface border border-black/10 rounded-xl p-4 inline-block">
              <img src={qrImage} alt="Attendance QR code" className="w-48 h-48" />
              <p className="text-xs text-ink/50 mt-2 text-center">Valid for 10 minutes</p>
            </div>
          )}
        </div>
      )}

      {isParticipant && !isCreator && (
        <div className="border-t border-black/10 pt-6">
          <h2 className="font-display text-xl mb-3">Check in</h2>
          <p className="text-sm text-ink/60 mb-3">
            Paste the QR token shown by the host (in a full app, this happens by scanning the code with your camera).
          </p>
          <div className="flex gap-2">
            <input
              value={scanToken}
              onChange={(e) => setScanToken(e.target.value)}
              placeholder="Paste QR token"
              className="flex-1 rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={handleScan}
              style={{ backgroundColor: "#0F6E56", color: "#FFFFFF" }}
              className="rounded-xl px-5 font-medium hover:opacity-90 transition-opacity"
            >
              Check in
            </button>
          </div>
        </div>
      )}
    </div>
  );
}