import { useEffect, useMemo, useState } from "react";
import { http } from "../api/http";
import { mediaUrl } from "../api/mediaUrl";

const emptyForm = () => ({
  title: "",
  description: "",
  releaseYear: "",
  durationMinutes: "",
  genres: "",
  posterFile: null,
  backdropFile: null
});

const movieToForm = (m) => ({
  title: m?.title || "",
  description: m?.description || "",
  releaseYear: m?.releaseYear ? String(m.releaseYear) : "",
  durationMinutes: m?.durationMinutes ? String(m.durationMinutes) : "",
  genres: Array.isArray(m?.genres) ? m.genres.join(", ") : "",
  posterFile: null,
  backdropFile: null
});

export function AdminMoviesPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const params = useMemo(() => ({ page, limit: 10, q: q.trim() || undefined }), [page, q]);

  const load = () => {
    let alive = true;
    setIsLoading(true);
    setError(null);
    http
      .get("/api/movies", { params })
      .then((res) => {
        if (!alive) return;
        setItems(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err?.response?.data?.message || "Load failed");
      })
      .finally(() => alive && setIsLoading(false));
    return () => {
      alive = false;
    };
  };

  useEffect(() => load(), [params]);

  const startCreate = () => {
    setMode("create");
    setEditingId(null);
    setFormError(null);
    setForm(emptyForm());
  };

  const startEdit = (m) => {
    setMode("edit");
    setEditingId(m._id);
    setFormError(null);
    setForm(movieToForm(m));
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("title", form.title.trim());
    if (form.description.trim()) fd.append("description", form.description.trim());
    if (form.releaseYear !== "") fd.append("releaseYear", String(form.releaseYear));
    if (form.durationMinutes !== "") fd.append("durationMinutes", String(form.durationMinutes));
    if (form.genres.trim()) fd.append("genres", form.genres.trim());
    if (form.posterFile) fd.append("poster", form.posterFile);
    if (form.backdropFile) fd.append("backdrop", form.backdropFile);
    return fd;
  };

  const onSave = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!form.title.trim()) return setFormError("Title majburiy");
    setSaving(true);
    try {
      const fd = buildFormData();
      if (mode === "create") {
        await http.post("/api/movies", fd);
        startCreate();
      } else {
        await http.put(`/api/movies/${editingId}`, fd);
      }
      await load();
    } catch (err) {
      setFormError(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("O‘chirasizmi?")) return;
    setDeletingId(id);
    try {
      await http.delete(`/api/movies/${id}`);
      await load();
      if (editingId === id) startCreate();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin · Movies</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Create, update, delete movies</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            className="h-11 w-64 max-w-full rounded-xl border border-zinc-200 bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:focus:ring-white/10"
            placeholder="Search..."
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Movies</div>
            <button
              type="button"
              onClick={startCreate}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              New
            </button>
          </div>

          {isLoading && <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">Loading...</div>}
          {error && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="mt-4 space-y-2">
            {items.map((m) => (
              <div
                key={m._id}
                className={`group flex items-center gap-3 rounded-xl border p-3 transition ${
                  editingId === m._id
                    ? "border-zinc-900/20 bg-zinc-50 dark:border-white/15 dark:bg-zinc-900/30"
                    : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/30"
                }`}
              >
                <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                  {m.posterPath ? <img alt="" className="h-full w-full object-cover" src={mediaUrl(m.posterPath)} /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{m.title}</div>
                  <div className="truncate text-xs text-zinc-600 dark:text-zinc-300">
                    {m.releaseYear ? `${m.releaseYear}` : "—"} · {(m.genres || []).slice(0, 3).join(", ") || "No genres"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(m)}
                    className="rounded-lg border border-zinc-200 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === m._id}
                    onClick={() => onDelete(m._id)}
                    className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-900/50 dark:text-red-200 dark:hover:bg-red-950/40"
                  >
                    {deletingId === m._id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && !isLoading && <div className="text-sm text-zinc-600 dark:text-zinc-300">No movies.</div>}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-800"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              Page {page} / {totalPages}
            </div>
            <button
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-800"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{mode === "create" ? "Create movie" : "Edit movie"}</div>
          <form className="mt-4 grid gap-3" onSubmit={onSave}>
            <div>
              <label className="text-sm">Title</label>
              <input
                className="mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-transparent px-3 text-sm dark:border-zinc-800"
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm">Description</label>
              <textarea
                className="mt-1 min-h-24 w-full rounded-xl border border-zinc-200 bg-transparent p-3 text-sm dark:border-zinc-800"
                value={form.description}
                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm">Release year</label>
                <input
                  className="mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-transparent px-3 text-sm dark:border-zinc-800"
                  type="number"
                  value={form.releaseYear}
                  onChange={(e) => setForm((s) => ({ ...s, releaseYear: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm">Duration (min)</label>
                <input
                  className="mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-transparent px-3 text-sm dark:border-zinc-800"
                  type="number"
                  value={form.durationMinutes}
                  onChange={(e) => setForm((s) => ({ ...s, durationMinutes: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm">Genres (comma separated)</label>
              <input
                className="mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-transparent px-3 text-sm dark:border-zinc-800"
                value={form.genres}
                onChange={(e) => setForm((s) => ({ ...s, genres: e.target.value }))}
                placeholder="Action, Drama"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm">Poster (image)</label>
                <input
                  className="mt-1 block w-full text-sm"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm((s) => ({ ...s, posterFile: e.target.files?.[0] || null }))}
                />
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Yangi rasm tanlasangiz yangilanadi</div>
              </div>
              <div>
                <label className="text-sm">Backdrop (image)</label>
                <input
                  className="mt-1 block w-full text-sm"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm((s) => ({ ...s, backdropFile: e.target.files?.[0] || null }))}
                />
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Yangi rasm tanlasangiz yangilanadi</div>
              </div>
            </div>

            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                {formError}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                disabled={saving}
                className="h-11 flex-1 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                {saving ? "Saving..." : mode === "create" ? "Create" : "Update"}
              </button>
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={startCreate}
                  className="h-11 rounded-xl border border-zinc-200 px-4 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

