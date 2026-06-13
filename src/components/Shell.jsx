import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { authStore } from "../store/auth";
import { toggleTheme } from "../store/theme";

export function Shell({ children }) {
  const nav = useNavigate();
  const token = authStore((s) => s.token);
  const user = authStore((s) => s.user);
  const logout = authStore((s) => s.logout);

  useEffect(() => {
    authStore.getState().hydrate();
  }, []);

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          {/* Chap tomon — asosiy navigatsiya */}
          <div className="flex items-center gap-4">
            <Link to="/movies" className="font-semibold tracking-tight">
              Movies
            </Link>
            <Link
              to="/stats"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              Statistika
            </Link>
            {token && (
              <Link
                to="/movies/new"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              >
                Qo'shish
              </Link>
            )}
            {token && user?.isAdmin && (
              <>
                <Link
                  to="/admin/movies"
                  className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                >
                  Filmlar
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* O'ng tomon — auth va sozlamalar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              Tema
            </button>
            {!token ? (
              <>
                <Link className="rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900" to="/login">
                  Kirish
                </Link>
                <Link
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  to="/register"
                >
                  Ro'yxat
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="hidden rounded-xl px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 md:block"
                >
                  {user?.name || user?.email}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    nav("/login");
                  }}
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  Chiqish
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
