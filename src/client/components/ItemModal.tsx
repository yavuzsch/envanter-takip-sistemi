import { useState, FormEvent, useEffect } from "react";
import api from "../api/client";
import type { Item } from "../pages/ItemsPage";
import "./ItemModal.css";

interface Props {
  item: Item | null;
  onSaved: (item: Item) => void;
  onClose: () => void;
}

export default function ItemModal({ item, onSaved, onClose }: Props) {
  const isEdit = !!item;
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [quantity, setQuantity] = useState(String(item?.quantity ?? ""));
  const [price, setPrice] = useState(String(item?.price ?? ""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = {
        name,
        description: description || undefined,
        quantity: Number(quantity),
        price: Number(price),
      };
      let res;
      if (isEdit) {
        res = await api.patch<Item>(`/items/${item.id}`, body);
      } else {
        res = await api.post<Item>("/items", body);
      }
      onSaved(res.data);
    } catch (err: any) {
      const msgs = err.response?.data?.errors ?? [err.response?.data?.message ?? "Hata oluştu."];
      setError(msgs.join(" "));
    } finally {
      setLoading(false);
    }
  }

  // ESC ile kapat
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? "Ürünü Düzenle" : "Yeni Ürün"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="field">
            <label>Ürün Adı *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ürün adını girin"
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label>Açıklama</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="İsteğe bağlı"
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Miktar *</label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="field">
              <label>Fiyat (₺) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {error && <div className="modal-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Kaydediliyor…" : isEdit ? "Güncelle" : "Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}