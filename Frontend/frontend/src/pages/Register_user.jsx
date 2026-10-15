import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [conformPassword, setConformPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== conformPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        username,
        password,
      });

      setMessage(response.data.message || "Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      const responseData = err.response?.data;
      setError(responseData?.error || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  const isMismatch = conformPassword && conformPassword !== password;

  return (
    <div className="min-h-screen bg-cosmic-bg text-cosmic-text flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cosmic-cyan/[0.04] rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar / Brand */}
      <header className="flex justify-between items-center max-w-5xl w-full mx-auto">
        <Link to="/" className="flex items-center gap-2.5 text-sm font-bold tracking-wider uppercase text-cosmic-text hover:text-cosmic-cyan transition-colors">
          <span className="w-8 h-8 rounded-lg bg-cosmic-cyan/[0.08] border border-cosmic-cyan/20 text-cosmic-cyan flex items-center justify-center text-xs font-mono">
            &lt;/&gt;
          </span>
          DSA Mentor
        </Link>
        <Link
          to="/login"
          className="text-xs font-medium text-cosmic-muted hover:text-cosmic-cyan transition-colors border border-cosmic-border px-3.5 py-1.5 rounded-lg"
        >
          Sign In →
        </Link>
      </header>

      {/* Center Registration Card */}
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md bg-cosmic-glass backdrop-blur-2xl border border-cosmic-border rounded-2xl p-8 shadow-2xl">
          {/* Card Title */}
          <div className="mb-7">
            <span className="text-[11px] font-semibold text-cosmic-cyan uppercase tracking-widest bg-cosmic-cyan/[0.08] px-2.5 py-1 rounded-md border border-cosmic-cyan/20">
              Get Started
            </span>
            <h1 className="text-2xl font-bold text-cosmic-text mt-3 tracking-tight">
              Create your account
            </h1>
            <p className="text-xs text-cosmic-muted mt-1 leading-relaxed">
              Start your personalized algorithmic journey with real-time AI mentoring.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 bg-cosmic-error/[0.08] border border-cosmic-error/25 text-cosmic-error text-xs rounded-xl flex items-center gap-2">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {message && (
            <div className="mb-5 p-3.5 bg-cosmic-success/[0.08] border border-cosmic-success/25 text-cosmic-success text-xs rounded-xl flex items-center gap-2">
              <span>✓</span>
              <span>{message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-[11px] font-semibold uppercase tracking-wider text-cosmic-muted mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                placeholder="Choose a username"
                className="w-full bg-black/40 border border-cosmic-border text-cosmic-text px-4 py-2.5 rounded-xl text-xs outline-none focus:border-cosmic-cyan focus:ring-1 focus:ring-cosmic-cyan transition-all placeholder:text-cosmic-muted/40"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-semibold uppercase tracking-wider text-cosmic-muted mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="Create a password"
                className="w-full bg-black/40 border border-cosmic-border text-cosmic-text px-4 py-2.5 rounded-xl text-xs outline-none focus:border-cosmic-cyan focus:ring-1 focus:ring-cosmic-cyan transition-all placeholder:text-cosmic-muted/40"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="conformpassword"
                className="block text-[11px] font-semibold uppercase tracking-wider text-cosmic-muted mb-1.5"
              >
                Confirm Password
              </label>
              <input
                id="conformpassword"
                type="password"
                value={conformPassword}
                onChange={(event) => setConformPassword(event.target.value)}
                required
                placeholder="Re-enter your password"
                className={`w-full bg-black/40 border text-cosmic-text px-4 py-2.5 rounded-xl text-xs outline-none transition-all placeholder:text-cosmic-muted/40 ${
                  isMismatch
                    ? "border-cosmic-error/60 focus:border-cosmic-error"
                    : "border-cosmic-border focus:border-cosmic-cyan"
                }`}
              />
              {isMismatch && (
                <span className="text-cosmic-error text-[11px] mt-1 block">
                  Passwords do not match
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isMismatch}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer mt-2 ${
                loading || isMismatch
                  ? "bg-cosmic-cyan/20 text-cosmic-muted cursor-not-allowed"
                  : "bg-gradient-to-r from-cosmic-cyan to-cyan-500 text-cosmic-bg hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,229,255,0.25)] active:translate-y-0"
              }`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-xs text-cosmic-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cosmic-cyan font-semibold hover:underline ml-1"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-cosmic-muted/60 py-2">
        DSA Mentor Platform • Built for algorithmic mastery
      </footer>
    </div>
  );
}