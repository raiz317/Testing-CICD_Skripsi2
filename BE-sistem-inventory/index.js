import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport.js";
import Router from "./routes/routes.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_SESSION || "BE_Instockfow_Secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(Router);

/*app.get("/api/products", isAuthenticated, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});*/

/*app.get("/api/suppliers", isAuthenticated, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM suppliers");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});*/

/*app.get("/api/users/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Belum login" });
  }
});*/

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: `Rute API [${req.method}] ${req.originalUrl} tidak ditemukan di server!`,
  });
});

app.listen(port, () => {
  console.log(`Server running is port ${port}`);
});
