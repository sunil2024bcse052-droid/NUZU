import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../lib/auth";
import Field from "../components/Field";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser({ name, email, password, birthDate });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-6 md:mt-16 px-4">
      <h1 className="font-display text-4xl mb-1">Join Nuzu</h1>
      <p className="text-ink/60 mb-2">Meet nearby, in real life. You must be 18 or older.</p>
      <p className="text-ink/50 text-sm mb-8">Password needs 8+ characters, one uppercase letter, and one number.</p>

      <form onSubmit={handleSubmit}>
        <Field label="Name" value={name} onChange={setName} placeholder="Your name" />
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 8 characters" />
        <Field label="Date of birth" type="date" value={birthDate} onChange={setBirthDate} />

        {error && <p className="text-sm mb-4" style={{ color: "#C1502E" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: "#0F6E56", color: "#FFFFFF" }}
          className="w-full rounded-xl py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-ink/60 mt-6">
        Already have an account? <Link to="/login" className="text-primary font-medium">Log in</Link>
      </p>
    </div>
  );
}