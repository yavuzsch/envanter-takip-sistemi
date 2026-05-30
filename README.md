# Envanter Takip Sistemi
TypeScript ve Express tabanlı RESTful envanter yönetim uygulaması.


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

Uygulama başladıktan sonra tarayıcıda aç: http://localhost:5173


## Varsayılan Kullanıcılar
| Rol | E-posta | Parola |
|---|---|---|
| Admin | admin@inventory.com | admin123 |
| User | user@inventory.com | user123 |


## Testleri Çalıştırma
Testler ayrı bir klasörde bulunmaktadır. Önce bağımlılıkları yükleyin:
```bash
cd test
npm install
```

Ardından testleri çalıştırın:
```bash
# Tüm testler
npm test

# Sadece unit testler
npm run test:unit

# Sadece smoke testler
npm run test:smoke
```


## API Uç Noktaları
| Metod | Uçnokta | Açıklama | Yetki |
|---|---|---|---|
| POST | /api/auth/register | Kayıt ol | Herkese açık |
| POST | /api/auth/login | Giriş yap | Herkese açık |
| POST | /api/auth/logout | Çıkış yap | Giriş gerekli |
| GET | /api/items | Tüm ögeleri listele | Giriş gerekli |
| GET | /api/items/:id | Tek öge getir | Giriş gerekli |
| POST | /api/items | Öge oluştur | Giriş gerekli |
| PATCH | /api/items/:id | Öge güncelle | Giriş gerekli |
| DELETE | /api/items/:id | Öge sil | Giriş gerekli |
| GET | /api/admin/report | Yönetici raporu | Yönetici gerekli |


## Proje Yapısı
```
├── src/
│   ├── client/  # frontend
│   └── server/  # backend
├── test/  # testler
│   ├── src/
│   ├── tests/
│   │   ├── unit/
│   │   └── smoke/
│   └── package.json
├── reports/  # ESLint ve SonarQube raporları
├── index.html
├── server.ts
├── vite.config.ts
├── tsconfig.json
├── tsconfig.server.json
├── sonar-project.properties
└── package.json
```