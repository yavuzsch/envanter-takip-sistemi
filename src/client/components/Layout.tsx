import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">▣</span>
          <span className="logo-text">ENVANTER</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/items"
            // isActive parametresine boolean tipini açıkça tanımladık
            className={({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">◈</span>
            Ürünler
          </NavLink>

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              // Aynı tip tanımını buradaki NavLink için de uyguladık
              className={({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <span className="nav-icon">◆</span>
              Rapor
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            {/* user null check ekleyerek olası çalışma zamanı hatalarını önledik */}
            <div className="user-avatar">{user?.email?.[0].toUpperCase() ?? "?"}</div>
            <div className="user-details">
              <span className="user-email">{user?.email}</span>
              <span className={`user-role ${user?.role}`}>{user?.role}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Çıkış Yap">
            ⏻
          </button>
        </div>
      </aside>

      <main className="content">
        {/* Outlet, App.tsx'teki alt rotaların (ItemsPage, AdminPage) burada görünmesini sağlar */}
        <Outlet />
      </main>
    </div>
  );
}