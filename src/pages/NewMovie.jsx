import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/http";

export function NewMoviePage() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [genres, setGenres] = useState("");
  const [posterFile, setPosterFile] = useState(null);
  const [backdropFile, setBackdropFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError("Title majburiy");
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      if (description.trim()) fd.append("description", description.trim());
      if (releaseYear !== "") fd.append("releaseYear", String(releaseYear));
      if (durationMinutes !== "") fd.append("durationMinutes", String(durationMinutes));
      if (genres.trim()) fd.append("genres", genres.trim());
      if (posterFile) fd.append("poster", posterFile);
      if (backdropFile) fd.append("backdrop", backdropFile);

      const res = await http.post("/api/movies", fd);
      nav(`/movies/${res.data._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Create failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h1 className="text-xl font-semibold">Add movie</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Only logged in users can create</p>
      <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
        <div>
          <label className="text-sm">Title</label>
          <input
            className="mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-transparent px-3 text-sm dark:border-zinc-800"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm">Description</label>
          <textarea
            className="mt-1 min-h-28 w-full rounded-xl border border-zinc-200 bg-transparent p-3 text-sm dark:border-zinc-800"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm">Release year</label>
            <input
              className="mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-transparent px-3 text-sm dark:border-zinc-800"
              type="number"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm">Duration (min)</label>
            <input
              className="mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-transparent px-3 text-sm dark:border-zinc-800"
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-sm">Genres (comma separated)</label>
          <input
            className="mt-1 h-11 w-full rounded-xl border border-zinc-200 bg-transparent px-3 text-sm dark:border-zinc-800"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            placeholder="Action, Drama"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm">Poster (image)</label>
            <input
              className="mt-1 block w-full text-sm"
              type="file"
              accept="image/*"
              onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
            />
          </div>
          <div>
            <label className="text-sm">Backdrop (image)</label>
            <input
              className="mt-1 block w-full text-sm"
              type="file"
              accept="image/*"
              onChange={(e) => setBackdropFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        )}
        <button
          disabled={isLoading}
          className="h-11 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          {isLoading ? "Loading..." : "Create"}
        </button>
      </form>
    </div>
  );
}
