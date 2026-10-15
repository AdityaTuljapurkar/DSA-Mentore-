import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handelRegister = () => {
    navigate("/register");
  };

  const handel_logout = () => {
    navigate("/logout");
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Could not connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-cosmic-bg text-cosmic-text flex items-center justify-center p-4">
      {/* Glow highlight */}
      <div className="absolute w-72 h-72 bg-cosmic-cyan/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-cosmic-glass backdrop-blur-2xl border border-cosmic-border rounded-2xl p-8 shadow-2xl">
        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cosmic-cyan/[0.08] text-cosmic-cyan border border-cosmic-cyan/20 text-xl font-bold mb-3">
            &lt;/&gt;
          </div>
          <h1 className="text-2xl font-bold text-cosmic-text tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-cosmic-muted mt-1">
            Sign in to continue to DSA Mentor
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 p-3.5 bg-cosmic-error/[0.08] border border-cosmic-error/25 text-cosmic-error text-xs rounded-xl flex items-center gap-2">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-muted mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              placeholder="Enter your username"
              className="w-full bg-black/40 border border-cosmic-border text-cosmic-text px-4 py-3 rounded-xl text-sm outline-none focus:border-cosmic-cyan focus:ring-1 focus:ring-cosmic-cyan transition-all placeholder:text-cosmic-muted/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cosmic-muted mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-black/40 border border-cosmic-border text-cosmic-text px-4 py-3 rounded-xl text-sm outline-none focus:border-cosmic-cyan focus:ring-1 focus:ring-cosmic-cyan transition-all placeholder:text-cosmic-muted/50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer ${
              loading
                ? "bg-cosmic-cyan/20 text-cosmic-muted cursor-not-allowed"
                : "bg-gradient-to-br from-cosmic-cyan to-cyan-600 text-cosmic-bg hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] active:translate-y-0"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cosmic-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-cosmic-surface/90 px-3 text-cosmic-muted">
              Options
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handelRegister}
            className="flex-1 bg-transparent border border-cosmic-border text-cosmic-muted py-2.5 px-3 rounded-xl text-xs font-medium hover:text-cosmic-text hover:border-white/20 transition-all cursor-pointer"
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={handel_logout}
            className="flex-1 bg-transparent border border-cosmic-border text-cosmic-muted py-2.5 px-3 rounded-xl text-xs font-medium hover:text-cosmic-error hover:border-cosmic-error/30 transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}