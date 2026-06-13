import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../store/auth";

export function RegisterPage() {
  const nav = useNavigate();
  const token = authStore((s) => s.token);
  const register = authStore((s) => s.register);
  const isLoading = authStore((s) => s.isLoading);
  const error = authStore((s) => s.error);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (token) nav("/movies");
  }, [token, nav]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!name || !email || !password) return setLocalError("Hamma fieldlar majburiy");
    if (password.length < 6) return setLocalError("Parol kamida 6 ta belgi bo‘lsin");
    await register(name, email, password);
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h1 className="text-xl font-semibold">Register</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Yangi account yarating</p>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="text-sm">Name</label>
          <input
            className="mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:focus:ring-white/10"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input
            className="mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:focus:ring-white/10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@mail.com"
          />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input
            className="mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:focus:ring-white/10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
          />
        </div>
        {(localError || error) && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {localError || error}
          </div>
        )}
        <button
          disabled={isLoading}
          className="h-11 w-full rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          {isLoading ? "Loading..." : "Create account"}
        </button>
      </form>
      <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
        Account bormi?{" "}
        <Link className="underline" to="/login">
          Login
        </Link>
      </div>
    </div>
  );
}

