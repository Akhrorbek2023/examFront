import { authStore } from "../store/auth";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const user = authStore((s) => s.user);
  const logout = authStore((s) => s.logout);
  const nav = useNavigate();
  const botUsername = import.meta.env.VITE_BOT_USERNAME || "";

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Sizning ma'lumotlaringiz</p>
      </div>

      {/* Foydalanuvchi ma'lumotlari */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-sm font-semibold">Ma'lumotlar</div>
        <div className="mt-4 space-y-4">
          <div className="grid gap-1">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Ism</div>
            <div className="font-semibold">{user?.name || "—"}</div>
          </div>
          <div className="grid gap-1">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Email</div>
            <div>{user?.email || "—"}</div>
          </div>
          <div className="grid gap-1">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Rol</div>
            <div>
              {user?.isAdmin ? (
                <span className="inline-flex items-center rounded-lg bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">
                  Admin
                </span>
              ) : (
                <span className="inline-flex items-center rounded-lg border border-zinc-200 px-2.5 py-1 text-xs dark:border-zinc-700">
                  Foydalanuvchi
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <button
            onClick={handleLogout}
            className="h-9 rounded-xl border border-zinc-200 px-4 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Chiqish
          </button>
        </div>
      </div>

      {/* Telegram Bot bo'limi */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-sm font-semibold">Telegram Bot</div>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Telegram botimiz orqali filmlarni ko'ring, reytinglarni bilib oling va yangi filmlardan
          xabardor bo'ling!
        </p>

        <div className="mt-4">
          {botUsername ? (
            <a
              href={`https://t.me/${botUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#229ED9] px-4 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Botni ochish
            </a>
          ) : (
            <div className="rounded-xl border border-zinc-200 p-3 text-sm text-zinc-500 dark:border-zinc-700">
              Bot username sozlanmagan. Frontend .env ga{" "}
              <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">VITE_BOT_USERNAME</code>{" "}
              qo'shing.
            </div>
          )}
        </div>

        <div className="mt-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
          <div className="text-sm font-semibold">Bot nima qila oladi?</div>
          <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-300">
            <li>🎬 So'nggi filmlarni ko'rish</li>
            <li>⭐ Top reytingli filmlar ro'yxati</li>
            <li>🔥 Eng mashhur filmlar</li>
            <li>📋 Film tafsilotlari (reyting, davomiylik)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
