import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../lib/auth";
import Field from "../components/Field";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginUser({ email, password });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-6 md:mt-16 px-4">
      <h1 className="font-display text-4xl mb-1">Welcome back</h1>
      <p className="text-ink/60 mb-8">Log in to see what's happening nearby.</p>

      <form onSubmit={handleSubmit}>
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

        {error && <p className="text-sm mb-4" style={{ color: "#C1502E" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: "#0F6E56", color: "#FFFFFF" }}
          className="w-full rounded-xl py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-center text-sm text-ink/60 mt-6">
        New to Nuzu? <Link to="/register" className="text-primary font-medium">Create an account</Link>
      </p>
    </div>
  );
}