import { useEffect, useState } from "react";
import { http } from "../api/http";

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [botUsers, setBotUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      http.get("/api/admin/stats"),
      http.get("/api/admin/users", { params: { limit: 5 } }),
      http.get("/api/admin/bot-users", { params: { limit: 5 } })
    ])
      .then(([statsRes, usersRes, botRes]) => {
        setStats(statsRes.data);
        setUsers(usersRes.data.items || []);
        setBotUsers(botRes.data.items || []);
      })
      .catch((err) => setError(err?.response?.data?.message || "Load failed"))
      .finally(() => setIsLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: "Sayt foydalanuvchilari", value: stats.userCount, icon: "👥" },
        { label: "Telegram foydalanuvchilari", value: stats.tgUserCount, icon: "🤖" },
        { label: "Filmlar", value: stats.movieCount, icon: "🎬" },
        { label: "Reviewlar", value: stats.reviewCount, icon: "⭐" }
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Tizim statistikasi</p>
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
        <>
          {/* Statistika kartalar */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="text-2xl">{card.icon}</div>
                <div className="mt-2 text-3xl font-bold tracking-tight">{card.value}</div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{card.label}</div>
              </div>
            ))}
          </div>

          {/* So'nggi foydalanuvchilar va Telegram userlar */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-sm font-semibold">So'nggi sayt foydalanuvchilari</div>
              <div className="mt-3 space-y-2">
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
                  >
                    <div>
                      <div className="text-sm font-semibold">{u.name}</div>
                      <div className="text-xs text-zinc-500">{u.email}</div>
                    </div>
                    {u.isAdmin && (
                      <span className="rounded-lg bg-zinc-900 px-2 py-0.5 text-xs text-white dark:bg-white dark:text-zinc-900">
                        Admin
                      </span>
                    )}
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="text-sm text-zinc-500">Foydalanuvchilar yo'q.</div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-sm font-semibold">So'nggi Telegram foydalanuvchilari</div>
              <div className="mt-3 space-y-2">
                {botUsers.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
                  >
                    <div>
                      <div className="text-sm font-semibold">
                        {u.firstName} {u.lastName || ""}
                      </div>
                      <div className="text-xs text-zinc-500">
                        @{u.username || "—"} · ID: {u.telegramId}
                      </div>
                    </div>
                    {u.isAdmin && (
                      <span className="rounded-lg bg-zinc-900 px-2 py-0.5 text-xs text-white dark:bg-white dark:text-zinc-900">
                        Admin
                      </span>
                    )}
                  </div>
                ))}
                {botUsers.length === 0 && (
                  <div className="text-sm text-zinc-500">Telegram foydalanuvchilar yo'q.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
