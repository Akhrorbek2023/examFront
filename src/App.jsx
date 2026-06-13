import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";

// Lazy loading — sahifalar kerakli vaqtda yuklanadi
// Named export uchun `.then(m => ({ default: m.ComponentName }))` ishlatiladi
const LoginPage = lazy(() =>
  import("./pages/Login").then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("./pages/Register").then((m) => ({ default: m.RegisterPage }))
);
const MoviesPage = lazy(() =>
  import("./pages/Movies").then((m) => ({ default: m.MoviesPage }))
);
const MovieDetailPage = lazy(() =>
  import("./pages/MovieDetail").then((m) => ({ default: m.MovieDetailPage }))
);
const NewMoviePage = lazy(() =>
  import("./pages/NewMovie").then((m) => ({ default: m.NewMoviePage }))
);
const AdminMoviesPage = lazy(() =>
  import("./pages/AdminMovies").then((m) => ({ default: m.AdminMoviesPage }))
);
const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard").then((m) => ({ default: m.AdminDashboard }))
);
const ProfilePage = lazy(() =>
  import("./pages/Profile").then((m) => ({ default: m.ProfilePage }))
);
const StatsPage = lazy(() =>
  import("./pages/Stats").then((m) => ({ default: m.StatsPage }))
);

// Yuklanayotganda ko'rsatiladigan placeholder
function Loading() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
      Yuklanmoqda...
    </div>
  );
}

export default function App() {
  return (
    <Shell>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Navigate to="/movies" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/stats" element={<StatsPage />} />

          {/* Login kerak */}
          <Route
            path="/movies/new"
            element={
              <ProtectedRoute>
                <NewMoviePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Faqat admin */}
          <Route
            path="/admin/movies"
            element={
              <AdminRoute>
                <AdminMoviesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route path="*" element={<div className="p-6">Not found</div>} />
        </Routes>
      </Suspense>
    </Shell>
  );
}
