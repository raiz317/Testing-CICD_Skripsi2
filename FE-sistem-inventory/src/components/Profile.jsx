import { useState } from "react";
import "../styles/profile.css";

function Profile(props) {
  const { user, setUser } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [prevUser, setPrevUser] = useState(user);

  if (user !== prevUser) {
    setPrevUser(user);
    if (user) {
      setFormValues((prev) => ({
        ...prev,
        username: user.username || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validasi password jika user ingin mengubahnya
    if (formValues.newPassword || formValues.confirmPassword) {
      if (!formValues.currentPassword) {
        alert("Masukkan password saat ini untuk mengubah password.");
        setLoading(false);
        return;
      }
      if (formValues.newPassword !== formValues.confirmPassword) {
        alert("Password baru dan konfirmasi password tidak cocok.");
        setLoading(false);
        return;
      }
      if (formValues.newPassword.length < 8) {
        alert("Password baru minimal 8 karakter.");
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        username: formValues.username,
        email: formValues.email,
      };

      // Hanya kirim password jika diisi
      if (formValues.newPassword) {
        payload.currentPassword = formValues.currentPassword;
        payload.newPassword = formValues.newPassword;
      }

      const response = await fetch("http://localhost:3000/api/users/update", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memperbarui profil");
      }

      // Update state user global
      setUser({
        ...user,
        username: formValues.username,
        email: formValues.email,
      });

      // Reset form password
      setFormValues((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      alert("Profil berhasil diperbarui!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert(
        error.message || "Terjadi kesalahan pada server saat menyimpan profil.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-loading">Memuat data profil pengguna...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header Profil */}
        <div className="profile-header">
          <div className="avatar-wrapper">
            <div className="avatar-fallback">
              {user.username ? user.username.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
          <h2>{user.username}</h2>
          <p className="profile-role">ID Anggota: #{user.id}</p>
        </div>

        {/* Konten Utama */}
        <div className="profile-body">
          {isEditing ? (
            <form onSubmit={handleSaveSubmit} className="profile-form">
              {/* Username & Email */}
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formValues.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Alamat Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Separator Password */}
              <div className="form-divider">
                <span>Ubah Password (Opsional)</span>
              </div>

              <div className="form-group">
                <label htmlFor="currentPassword">Password Saat Ini</label>
                <input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  value={formValues.currentPassword}
                  onChange={handleChange}
                  placeholder="Masukkan password saat ini"
                  autoComplete="current-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Password Baru</label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={formValues.newPassword}
                  onChange={handleChange}
                  placeholder="Minimal 8 karakter"
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Konfirmasi Password Baru
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password baru"
                  autoComplete="new-password"
                />
              </div>

              <div className="profile-actions">
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setFormValues({
                      username: user.username,
                      email: user.email,
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setIsEditing(false);
                  }}
                  disabled={loading}
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="info-section">
                <h3>Informasi Akun</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">👤 Username</span>
                    <span className="info-value">{user.username}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📧 Email</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                  Edit Profil
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
