const LS_THEME = "movies_theme";

export function initTheme() {
  const stored = localStorage.getItem(LS_THEME);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = stored ? stored === "dark" : prefersDark;
  document.documentElement.classList.toggle("dark", isDark);
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem(LS_THEME, isDark ? "dark" : "light");
}

