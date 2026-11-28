import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import db from "./db.js";
import bcrypt from "bcrypt";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const [users] = await db.query(
          "SELECT * FROM users WHERE email = ? OR username = ?",
          [email, email],
        );

        const user = users[0];
        const match = user
          ? await bcrypt.compare(password, user.password)
          : false;

        if (!user || !match) {
          // Selalu kembalikan pesan yang sama
          return done(null, false, {
            message: "Email/Username atau Password salah!",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
      // try {
      //   const [users] = await db.query(
      //     "SELECT * FROM users WHERE email = ? OR username = ?",
      //     [email, email],
      //   );
      //   if (users.length === 0) {
      //     return done(null, false, { message: "Akun tidak ditemukan!" });
      //   }
      //   const user = users[0];
      //   const match = await bcrypt.compare(password, user.password);
      //   if (!match) {
      //     return done(null, false, { message: "Password salah!" });
      //   }
      //   return done(null, user);
      // } catch (error) {
      //   return done(error);
      // }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await db.query(
      "SELECT id, username, email FROM users WHERE id = ?",
      [id],
    );
    if (rows.length === 0) return done(null, false);
    done(null, rows[0]);
  } catch (error) {
    done(error);
  }
});

export default passport;
