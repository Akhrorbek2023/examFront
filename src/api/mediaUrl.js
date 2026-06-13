const base = import.meta.env.VITE_API_URL || "http://localhost:5005";

// posterPath bazada "/uploads/filename.jpg" ko'rinishida saqlanadi
// shuning uchun faqat base + path qilamiz, /uploads/ ikki marta qo'shilmasin
export const mediaUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : "/" + path}`;
};