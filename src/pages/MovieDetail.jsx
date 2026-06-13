import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { http } from "../api/http";
import { authStore } from "../store/auth";
import { mediaUrl } from "../api/mediaUrl";

export function MovieDetailPage() {
  const { id } = useParams();
  const token = authStore((s) => s.token);
  const user = authStore((s) => s.user);

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [rating, setRating] = useState(8);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setIsLoading(true);
    setError(null);
    Promise.all([http.get(`/api/movies/${id}`), http.get(`/api/movies/${id}/reviews`)])
      .then(([m, r]) => {
        if (!alive) return;
        setMovie(m.data);
        setReviews(r.data.items || []);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err?.response?.data?.message || "Load failed");
      })
      .finally(() => alive && setIsLoading(false));
    return () => { alive = false; };
  }, [id]);

  const avgRating =
    reviews.length
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const submitReview = async () => {
    if (!id) return;
    setActionError(null);
    setSubmitting(true);
    try {
      const res = await http.post(`/api/movies/${id}/reviews`, { rating, comment });
      setReviews((prev) => [res.data, ...prev]);
      setComment("");
      setRating(8);
    } catch (err) {
      setActionError(err?.response?.data?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await http.delete(`/api/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="aspect-[16/9] animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-8 w-1/2 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-1/3 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white" to="/movies">
        ← Orqaga
      </Link>

      {movie && (
        <>
          {/* HERO — backdrop + poster + info */}
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {/* Backdrop */}
            <div className="relative">
              <div className="aspect-[21/9] bg-zinc-200 dark:bg-zinc-900">
                {movie.backdropPath || movie.posterPath ? (
                  <img
                    src={mediaUrl(movie.backdropPath || movie.posterPath)}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-900">
                    <span className="text-5xl opacity-30">🎬</span>
                  </div>
                )}
                {/* qoraygan gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* Poster + title (backdrop ustida) */}
              <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-5 sm:p-6">
                {/* Poster */}
                <div className="hidden shrink-0 overflow-hidden rounded-xl border-2 border-white/20 shadow-2xl sm:block">
                  <div className="w-28 md:w-36">
                    <div className="aspect-[2/3] bg-zinc-800">
                      {movie.posterPath ? (
                        <img
                          src={mediaUrl(movie.posterPath)}
                          alt={movie.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl">🎬</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="min-w-0 pb-1">
                  <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                    {movie.title}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/80">
                    {movie.releaseYear && <span>{movie.releaseYear}</span>}
                    {movie.durationMinutes && (
                      <>
                        <span className="text-white/40">·</span>
                        <span>{movie.durationMinutes} min</span>
                      </>
                    )}
                    {avgRating && (
                      <>
                        <span className="text-white/40">·</span>
                        <span className="font-semibold text-yellow-400">⭐ {avgRating}</span>
                        <span className="text-white/50 text-xs">({reviews.length} sharh)</span>
                      </>
                    )}
                  </div>
                  {movie.genres?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {movie.genres.map((g) => (
                        <span
                          key={g}
                          className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tavsif */}
            {movie.description && (
              <div className="p-5 sm:p-6">
                <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{movie.description}</p>
              </div>
            )}
          </div>

          {/* REVIEWLAR */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Sharhlar</h2>
                {reviews.length > 0 && (
                  <p className="text-sm text-zinc-500">{reviews.length} ta sharh · o'rtacha {avgRating}</p>
                )}
              </div>
              {!token && (
                <Link to="/login" className="text-sm text-zinc-500 underline hover:text-zinc-900 dark:hover:text-white">
                  Sharh qoldirish uchun kiring
                </Link>
              )}
            </div>

            {/* Sharh yozish formasi */}
            {token && (
              <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Sharh qoldiring</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-xs text-zinc-500">Reyting (1–10)</label>
                    <input
                      className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                      type="number"
                      min={1}
                      max={10}
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-zinc-500">Izoh</label>
                    <input
                      className="mt-1 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Fikringizni yozing..."
                    />
                  </div>
                </div>
                {actionError && (
                  <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                    {actionError}
                  </div>
                )}
                <button
                  disabled={submitting}
                  onClick={submitReview}
                  className="mt-3 h-10 rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                  {submitting ? "Yuborilmoqda..." : "Yuborish"}
                </button>
              </div>
            )}

            {/* Sharhlar ro'yxati */}
            <div className="mt-4 space-y-3">
              {reviews.map((r) => (
                <div key={r._id} className="rounded-xl border border-zinc-100 p-4 dark:border-zinc-800">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* Reyting aylana */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">
                        {r.rating}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          {"⭐".repeat(Math.round(r.rating / 2))}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString("uz-UZ") : ""}
                        </div>
                      </div>
                    </div>
                    {/* Faqat o'z sharhini o'chira oladi */}
                    {user && String(r.userId) === String(user.id) && (
                      <button
                        onClick={() => deleteReview(r._id)}
                        className="text-xs text-red-500 hover:text-red-700 dark:text-red-400"
                      >
                        O'chirish
                      </button>
                    )}
                  </div>
                  {r.comment && (
                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{r.comment}</p>
                  )}
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="py-8 text-center text-sm text-zinc-400">
                  Hali sharh yo'q. Birinchi bo'ling!
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
