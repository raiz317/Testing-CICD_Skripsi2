export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res
    .status(401)
    .json({ message: "Akses ditolak! Anda harus login terlebih dahulu." });
};
