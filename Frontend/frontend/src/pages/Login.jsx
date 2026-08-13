import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    // Connect this form to your Django login API when authentication is ready.
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#1f2a44_0%,#101522_45%,#080b12_100%)] px-6 font-sans text-slate-50">
      <section
        className="w-full max-w-sm rounded-2xl border border-slate-700/80 bg-slate-900/95 p-8 shadow-2xl shadow-black/40 sm:p-10"
        aria-labelledby="login-title"
      >
        <div className="grid size-11 place-items-center rounded-xl bg-indigo-500 text-xs font-extrabold tracking-wider">DSA</div>
        <p className="mt-6 text-xs font-bold tracking-[0.1em] text-indigo-300">WELCOME BACK</p>
        <h1 id="login-title" className="mt-2 text-3xl font-bold tracking-tight">Sign in to DSA Mentor</h1>
        <p className="mt-2 text-sm text-slate-400">Continue your learning journey.</p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold text-slate-200">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-slate-50 outline-none placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            required
          />

          <div className="mt-2 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-semibold text-slate-200">Password</label>
            <a href="#forgot-password" className="text-xs font-semibold text-indigo-300 hover:text-indigo-200">Forgot password?</a>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-3 text-sm text-slate-50 outline-none placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            required
          />

          <button type="submit" className="mt-4 rounded-lg bg-indigo-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-900">
            Sign in
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-400">
          New to DSA Mentor? <a href="#signup" className="font-semibold text-indigo-300 hover:text-indigo-200">Create an account</a>
        </p>
      </section>
    </main>
  );
}
