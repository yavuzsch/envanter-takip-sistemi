import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import ItemModal from "../components/ItemModal";
import "./ItemsPage.css";

export interface Item {
  id: number;
  name: string;
  description: string | null;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export default function ItemsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const isAdmin = user?.role === "admin";

  async function fetchItems() {
    try {
      const res = await api.get<Item[]>("/items");
      setItems(res.data);
    } catch {
      // hata
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;
    await api.delete(`/items/${id}`);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleteId(null);
  }

  function openCreate() {
    setEditItem(null);
    setModalOpen(true);
  }

  function openEdit(item: Item) {
    setEditItem(item);
    setModalOpen(true);
  }

  function handleSaved(item: Item) {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      return [item, ...prev];
    });
    setModalOpen(false);
  }

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = items.reduce((acc, i) => acc + i.quantity * i.price, 0);

  return (
    <div className="items-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Ürünler</h1>
          <p className="page-sub">
            {items.length} ürün · Toplam stok değeri:{" "}
            <strong>₺{totalValue.toLocaleString("tr-TR")}</strong>
          </p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={openCreate}>
            + Yeni Ürün
          </button>
        )}
      </div>

      <div className="search-bar">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          placeholder="Ürün ara…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Yükleniyor…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span>◈</span>
          <p>Ürün bulunamadı.</p>
        </div>
      ) : (
        <div className="items-table-wrap">
          <table className="items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Ürün Adı</th>
                <th>Açıklama</th>
                <th>Miktar</th>
                <th>Birim Fiyat</th>
                <th>Toplam</th>
                {isAdmin && <th>İşlemler</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="id-cell">{item.id}</td>
                  <td className="name-cell">{item.name}</td>
                  <td className="desc-cell">{item.description ?? "—"}</td>
                  <td>
                    <span
                      className={`qty-badge ${
                        item.quantity === 0
                          ? "out"
                          : item.quantity < 5
                          ? "low"
                          : "ok"
                      }`}
                    >
                      {item.quantity}
                    </span>
                  </td>
                  <td>₺{item.price.toLocaleString("tr-TR")}</td>
                  <td className="total-cell">
                    ₺{(item.quantity * item.price).toLocaleString("tr-TR")}
                  </td>
                  {isAdmin && (
                    <td className="actions-cell">
                      <button
                        className="action-btn edit"
                        onClick={() => openEdit(item)}
                      >
                        Düzenle
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        Sil
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <ItemModal
          item={editItem}
          onSaved={handleSaved}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}