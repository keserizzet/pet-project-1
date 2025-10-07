# NannyCare

Nanny hizmeti sunan şirket için React + Firebase tabanlı demo uygulama.

## Özellikler
- Sayfalar: Home, Nannies, Favorites (React Router)
- Firebase Authentication: Email/Password ile kayıt, giriş, çıkış
- Realtime Database: `nannies` listesinden kartlar, 3'erli yükleme ve "Load more"
- Sıralama/Filtre: A→Z, Z→A, fiyata göre, rating'e göre
- Favoriler: Giriş gereklidir; localStorage'da kalıcıdır, `Favorites` sayfası listeler
- Read more: Kartın detayları ve ebeveyn yorumları
- Make an appointment: Doğrulamalı form, başvurular `appointments` altında kayıt olur

## Teknolojiler
- React (Vite)
- React Router
- Firebase Web SDK (Auth, Realtime Database)
- react-hook-form + yup

## Kurulum
```bash
npm i
npm run dev
```

`.env.local` içeriği örneği:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=https://<PROJECT>-default-rtdb.<region>.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

## Firebase
1. Authentication → Email/Password etkinleştir.
2. Realtime Database oluştur ve `nannies` datasını import et (JSON).
3. Geliştirme kuralları örneği:
```json
{
  "rules": {
    ".read": true,
    "nannies": { ".write": false },
    "favorites": { "$uid": { ".write": "auth != null && auth.uid === $uid" } },
    "appointments": { ".write": "auth != null" }
  }
}
```

## Deploy
- Netlify önerilir: `npm run build` → `dist` klasörünü yayınla.
- Vite SPA için 404 yönlendirmesini Netlify ayarlarından `/* /index.html 200` olarak ekle.

## Notlar
- Demo amaçlı temel stiller eklidir; makete göre genişletilebilir.
- Veriler Realtime Database üzerinde alfabetik paginasyon için `name` ile sıralanır.
