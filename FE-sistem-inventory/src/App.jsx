/*import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOptions = {
    credentials: "include",
  };

  const fetchAuthenticatedData = async () => {
    try {
      const meRes = await fetch(
        "http://localhost:3000/api/users/me",
        fetchOptions,
      );

      if (!meRes.ok) throw new Error("Belum login atau session habis");

      const userData = await meRes.json();
      setUser(userData);

      const [productRes, supplierRes] = await Promise.all([
        fetch("http://localhost:3000/api/products", fetchOptions),
        fetch("http://localhost:3000/api/suppliers", fetchOptions),
      ]);

      if (!productRes.ok) throw new Error("Gagal mengambil data produk");
      if (!supplierRes.ok) throw new Error("Gagal mengambil data supplier");

      const productsData = await productRes.json();
      const suppliersData = await supplierRes.json();

      if (Array.isArray(productsData)) setProducts(productsData);
      if (Array.isArray(suppliersData)) setSuppliers(suppliersData);
    } catch (error) {
      console.warn("Autentikasi gagal atau sesi habis:", error.message);
      setUser(null);
      setProducts([]);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/users/me", fetchOptions)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      fetch("http://localhost:3000/api/products", fetchOptions),
      fetch("http://localhost:3000/api/suppliers", fetchOptions),
    ])
      .then(async ([p, s]) => {
        if (!p.ok || !s.ok) throw new Error("Gagal mengambil data");

        setProducts(await p.json());
        setSuppliers(await s.json());
      })
      .catch((error) => console.error(error.message));
  }, [user]);

  const handleLogout = () => {
    fetch("http://localhost:3000/api/logout", {
      method: "POST",
      ...fetchOptions,
    })
      .then(() => {
        setUser(null);
        setProducts([]);
        setSuppliers([]);
      })
      .catch((err) => console.error("Gagal melakukan logout server:", err));
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h3>Memeriksa Sesi Autentikasi InstockFlow...</h3>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard
                products={products}
                suppliers={suppliers}
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/products"
          element={
            user ? (
              <Products
                products={products}
                setProducts={setProducts}
                suppliers={suppliers}
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/suppliers"
          element={
            user ? (
              <Suppliers
                suppliers={suppliers}
                setSuppliers={setSuppliers}
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;*/

import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./components/Profile.jsx";
import "./App.css";

const API_URL = "http://localhost:3000";

const fetchOptions = {
  credentials: "include",
};

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Cek session saat aplikasi pertama kali dibuka
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/me`, fetchOptions);

        if (!response.ok) {
          throw new Error("Belum login atau session habis");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.warn("Autentikasi gagal atau sesi habis:", error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // 2. Ambil products dan suppliers hanya setelah user berhasil login
  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const [productResponse, supplierResponse] = await Promise.all([
          fetch(`${API_URL}/api/products`, fetchOptions),
          fetch(`${API_URL}/api/suppliers`, fetchOptions),
        ]);

        if (!productResponse.ok) {
          throw new Error("Gagal mengambil data produk");
        }

        if (!supplierResponse.ok) {
          throw new Error("Gagal mengambil data supplier");
        }

        const productsData = await productResponse.json();
        const suppliersData = await supplierResponse.json();

        if (Array.isArray(productsData)) {
          setProducts(productsData);
        }

        if (Array.isArray(suppliersData)) {
          setSuppliers(suppliersData);
        }
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error.message);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        ...fetchOptions,
      });

      setUser(null);
      setProducts([]);
      setSuppliers([]);
    } catch (error) {
      console.error("Gagal melakukan logout server:", error.message);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h3>Memeriksa Sesi Autentikasi InstockFlow...</h3>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard
                products={products}
                suppliers={suppliers}
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/products"
          element={
            user ? (
              <Products
                products={products}
                setProducts={setProducts}
                suppliers={suppliers}
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/suppliers"
          element={
            user ? (
              <Suppliers
                suppliers={suppliers}
                setSuppliers={setSuppliers}
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/profile"
          element={
            user ? (
              <Profile user={user} setUser={setUser} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
