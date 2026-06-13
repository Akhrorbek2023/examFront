import { useEffect, useState } from "react";
import { http } from "../api/http";

// Bu sahifa ommaviy — login kerak emas
// Faqat film va review sonini ko'rsatadi
export function StatsPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    http
      .get("/api/admin/public-stats")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err?.response?.data?.message || "Load failed"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Statistika</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Loyiha ko'rsatkichlari</p>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          Yuklanmoqda...
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-4xl">🎬</div>
            <div className="mt-3 text-4xl font-bold tracking-tight">{stats.movieCount}</div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Jami filmlar</div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-4xl">⭐</div>
            <div className="mt-3 text-4xl font-bold tracking-tight">{stats.reviewCount}</div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Jami reviewlar</div>
          </div>
        </div>
      )}
    </div>
  );
}
