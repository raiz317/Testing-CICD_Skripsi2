import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Maksimal 5x percobaan
  message: {
    status: 429,
    message:
      "Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Percobaan yang berhasil (status 200) tidak dihitung
});

export default loginLimiter;
