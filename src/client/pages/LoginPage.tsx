import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthPage.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/items");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-icon">▣</span>
          <span className="brand-text">ENVANTER</span>
        </div>

        <h1 className="auth-title">Giriş Yap</h1>
        <p className="auth-sub">Sisteme erişmek için oturum açın.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ad@inventory.com"
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label>Parola</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-btn" disabled={loading}>
            {loading ? "Giriş yapılıyor…" : "Giriş Yap →"}
          </button>
        </form>

        <p className="auth-switch">
          Hesabınız yok mu? <Link to="/register">Kayıt ol</Link>
        </p>

        <div className="auth-hint">
          <span>admin@inventory.com / admin123</span>
          <span>user@inventory.com / user123</span>
        </div>
      </div>
    </div>
  );
}