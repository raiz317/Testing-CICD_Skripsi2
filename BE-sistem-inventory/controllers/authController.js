import passport from "passport";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

const authController = {
  register: async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const passwordRegex = /^[A-Z](?=.*[a-zA-Z])(?=.*\d).{7,}$/;
      if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password minimal 8 karakter, harus diawali huruf besar, dan mengandung huruf serta angka!",
        });
      }
      const existingUser = await userModel.findByEmailOrUsername(
        email,
        username,
      );

      if (existingUser.length > 0) {
        return res
          .status(400)
          .json({ message: "Username atau Email sudah terdaftar!" });
      }

      await userModel.create(username, email, password);
      return res.status(201).json({ message: "Registrasi Berhasil" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  login: (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return res.status(500).json({ message: err.message });
      if (!user) {
        return res.status(401).json({
          message: info?.message || "Username atau password salah",
        });
      }

      req.logIn(user, (err) => {
        if (err) return res.status(500).json({ message: err.message });
        return res.json({
          message: "Login Sukses!",
          user: { id: user.id, username: user.username, email: user.email },
        });
      });
    })(req, res, next);
  },

  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: err.message });
      req.session.destroy(() => {
        return res.json({
          message: "Berhasil hancurkan session server, silakan keluar!",
        });
      });
    });
  },

  getMe: (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Belum login" });
    }
  },

  updateProfile: async (req, res) => {
    const { username, email, currentPassword, newPassword } = req.body;
    const currentUserId = req.user.id;

    try {
      // Validasi dasar
      if (!username || !email) {
        return res
          .status(400)
          .json({ message: "Username dan Email wajib diisi!" });
      }

      // Cek duplikat username/email
      const duplicateUser = await userModel.checkDuplicate(
        username,
        email,
        currentUserId,
      );
      if (duplicateUser.length > 0) {
        return res
          .status(400)
          .json({ message: "Username atau Email sudah digunakan!" });
      }

      let newHashedPassword = null;

      // Jika user ingin mengubah password
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({
            message: "Password saat ini wajib diisi untuk mengubah password!",
          });
        }

        // Validasi format password baru (sama seperti register)
        const passwordRegex = /^[A-Z](?=.*[a-zA-Z])(?=.*\d).{7,}$/;
        if (!passwordRegex.test(newPassword)) {
          return res.status(400).json({
            message:
              "Password baru minimal 8 karakter, harus diawali huruf besar, dan mengandung huruf serta angka!",
          });
        }

        // Ambil data user (termasuk password hash)
        const user = await userModel.findById(currentUserId);
        if (!user) {
          return res.status(404).json({ message: "User tidak ditemukan!" });
        }

        // Verifikasi password lama
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Password saat ini salah!" });
        }

        // Hash password baru
        const saltRounds = 10;
        newHashedPassword = await bcrypt.hash(newPassword, saltRounds);
      }

      // Update ke database
      await userModel.updateProfile(
        currentUserId,
        username,
        email,
        newHashedPassword,
      );

      // Update data di session
      req.user.username = username;
      req.user.email = email;

      return res.json({ message: "Profil berhasil diperbarui!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default authController;
