import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../api/http";
import { mediaUrl } from "../api/mediaUrl";

export function MoviesPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const params = useMemo(() => ({ page, limit: 12, q: q.trim() || undefined }), [page, q]);

  useEffect(() => {
    let alive = true;
    setIsLoading(true);
    setError(null);
    http
      .get("/api/movies", { params })
      .then((res) => {
        if (!alive) return;
        setItems(res.data.items);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err?.response?.data?.message || "Load failed");
      })
      .finally(() => alive && setIsLoading(false));
    return () => { alive = false; };
  }, [params]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Filmlar</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {isLoading ? "Yuklanmoqda..." : `${items.length} ta film`}
          </p>
        </div>
        <input
          className="h-10 w-64 max-w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-white/10"
          placeholder="Qidirish..."
          value={q}
          onChange={(e) => { setPage(1); setQ(e.target.value); }}
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Poster grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((m) => (
          <Link
            to={`/movies/${m._id}`}
            key={m._id}
            className="group flex flex-col"
          >
            {/* Poster rasm */}
            <div className="relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <div className="aspect-[2/3]">
                {m.posterPath ? (
                  <img
                    src={mediaUrl(m.posterPath)}
                    alt={m.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800">
                    <span className="text-3xl">🎬</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Rasm yo'q</span>
                  </div>
                )}
              </div>

              {/* Hover overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/0 transition duration-300 group-hover:bg-black/20" />

              {/* Yil badge */}
              {m.releaseYear && (
                <div className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                  {m.releaseYear}
                </div>
              )}
            </div>

            {/* Ma'lumot */}
            <div className="mt-2 px-0.5">
              <div className="line-clamp-1 text-sm font-semibold leading-tight">{m.title}</div>
              {m.genres?.length > 0 && (
                <div className="mt-0.5 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {m.genres.slice(0, 2).join(" · ")}
                </div>
              )}
            </div>
          </Link>
        ))}

        {/* Skeleton (yuklanayotganda) */}
        {isLoading &&
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[2/3] animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-1 h-3 w-1/2 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-900" />
            </div>
          ))}
      </div>

      {!isLoading && items.length === 0 && !error && (
        <div className="py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Filmlar topilmadi.
        </div>
      )}

      {/* Sahifalash */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm disabled:opacity-40 dark:border-zinc-800"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Oldingi
          </button>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {page} / {totalPages}
          </span>
          <button
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm disabled:opacity-40 dark:border-zinc-800"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Keyingi →
          </button>
        </div>
      )}
    </div>
  );
}
