# Envanter Takip Sistemi

Yazılım Kalite Güvencesi dersi kapsamında geliştirilmiş, TypeScript ve Express tabanlı RESTful envanter yönetim uygulaması.

## Teknoloji Yığını

- **Backend:** Node.js (LTS), TypeScript, Express.js
- **Veritabanı:** SQLite (better-sqlite3)
- **Oturum Yönetimi:** express-session + httpOnly cookie
- **Parola Güvenliği:** bcrypt (10 salt round)
- **Frontend:** React + Vite (bonus)
- **Test:** Vitest + Supertest

## Kurulum

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Veritabanını oluştur ve seed verisini yükle
npm run db:seed

# 3. Uygulamayı başlat
npm run dev
```

## Varsayılan Kullanıcılar

| Rol | E-posta | Parola |
|---|---|---|
| Admin | admin@inventory.com | admin123 |
| User | user@inventory.com | user123 |

## Testleri Çalıştırma

```bash
# Tüm testler (17 unit + 10 smoke)
npm test

# Sadece unit testler
npm run test:unit

# Sadece smoke testler
npm run test:smoke
```

## API Uç Noktaları

| Method | Endpoint | Açıklama | Yetki |
|---|---|---|---|
| POST | /api/auth/register | Kayıt ol | Herkese açık |
| POST | /api/auth/login | Giriş yap | Herkese açık |
| POST | /api/auth/logout | Çıkış yap | Giriş gerekli |
| GET | /api/items | Tüm itemları listele | Giriş gerekli |
| GET | /api/items/:id | Tek item getir | Giriş gerekli |
| POST | /api/items | Item oluştur | Giriş gerekli |
| PATCH | /api/items/:id | Item güncelle | Giriş gerekli |
| DELETE | /api/items/:id | Item sil | Giriş gerekli |
| GET | /api/admin/report | Yönetici raporu | Admin gerekli |

## Proje Yapısı

```
├── src/
│   ├── client/            # React frontend
│   └── server/
│       ├── modules/       # auth, item, admin
│       ├── middleware/    # auth, validate
│       └── config/        # db
├── test/
│   ├── unit/
│   └── smoke/
├── index.html             # Frontend giriş noktası
├── server.ts              # Backend giriş noktası
├── vite.config.ts         # Vite derleme yapılandırması
├── tsconfig.json          # TypeScript yapılandırması
├── tsconfig.server.json   # Sunucu TypeScript yapılandırması
└── package.json
```

## Kaynak Kod

https://github.com/yavuzsch/envanter-takip-sistemi

---
