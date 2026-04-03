import { useState, useEffect } from "react";
import api from "../api/client";
import "./AdminPage.css";

interface Report {
  totalItems: number;
  totalUsers: number;
  totalValue: number;
}

export default function AdminPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Report>("/admin/report")
      .then((res) => setReport(res.data))
      .catch(() => setError("Rapor yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Yönetici Raporu</h1>
          <p className="page-sub">Sistem genelinde özet istatistikler</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Yükleniyor…</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : report ? (
        <div className="report-grid">
          <div className="stat-card accent">
            <div className="stat-label">Toplam Ürün</div>
            <div className="stat-value">{report.totalItems}</div>
            <div className="stat-icon">◈</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Kayıtlı Kullanıcı</div>
            <div className="stat-value">{report.totalUsers}</div>
            <div className="stat-icon">◉</div>
          </div>
          <div className="stat-card wide">
            <div className="stat-label">Toplam Stok Değeri</div>
            <div className="stat-value large">
              ₺{report.totalValue.toLocaleString("tr-TR")}
            </div>
            <div className="stat-icon">◆</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}