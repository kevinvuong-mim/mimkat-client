# Quick Start - Google OAuth Login

## 🚀 Bắt đầu nhanh (5 bước)

### 1. Lấy Google Client ID

- Vào: https://console.cloud.google.com/apis/credentials
- Tạo OAuth 2.0 Client ID
- Copy Client ID

### 2. Cấu hình .env.local

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=paste-your-client-id-here
```

### 3. Chạy app

```bash
nvm use 24
npm run dev
```

### 4. Test

- Mở http://localhost:3000
- Click "Đăng nhập / Đăng ký"
- Click nút Google
- Chọn tài khoản Google

### 5. Kiểm tra kết quả

```javascript
// Mở Console (F12)
console.log(localStorage.getItem("accessToken"));
console.log(localStorage.getItem("refreshToken"));
```

## 📁 Files quan trọng

| File                                   | Mục đích                               |
| -------------------------------------- | -------------------------------------- |
| `.env.local`                           | Cấu hình Client ID (KHÔNG commit)      |
| `src/app/auth/page.tsx`                | Trang đăng nhập với Google button      |
| `src/components/GoogleLoginButton.tsx` | Google OAuth component                 |
| `src/lib/api.ts`                       | API utilities (fetch, refresh, logout) |
| `src/app/auth/callback/page.tsx`       | Xử lý OAuth callback                   |

## 🔑 API Utilities

```typescript
import { fetchProtectedData, logout, isAuthenticated } from "@/lib/api";

// Gọi protected API (auto refresh token)
const data = await fetchProtectedData("/api/user/profile");

// Check đăng nhập
if (isAuthenticated()) {
  // Logged in
}

// Đăng xuất
logout();
```

## 🎯 Backend Endpoint Required

```
POST /auth/google/verify
```

Request:

```json
{
  "token": "google-credential-token-here"
}
```

Response:

```json
{
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": "uuid",
    "email": "user@gmail.com",
    "fullName": "User Name"
  }
}
```

## 🐛 Troubleshooting

| Lỗi                                  | Giải pháp                                |
| ------------------------------------ | ---------------------------------------- |
| "Google Client ID is not configured" | Check `.env.local` và restart dev server |
| Popup bị chặn                        | Cho phép popup trong browser             |
| CORS error                           | Enable CORS trên backend                 |
| 401 error                            | Check backend đang chạy                  |

## 📖 Docs đầy đủ

- `GOOGLE_OAUTH_SETUP.md` - Setup chi tiết
- `TEST_GOOGLE_LOGIN.md` - Hướng dẫn test
- `IMPLEMENTATION_SUMMARY.md` - Tổng quan implementation
- `FRONTEND_INTEGRATION.md` - Doc gốc từ backend

## ✅ Checklist

- [ ] Google Client ID đã tạo
- [ ] `.env.local` đã cấu hình
- [ ] Backend đang chạy
- [ ] Endpoint `/auth/google/verify` hoạt động
- [ ] CORS đã enable
- [ ] Node v24 đã active (`nvm use 24`)
- [ ] Dependencies đã install (`npm install`)

---

**Ready to test?** → `npm run dev` → http://localhost:3000/auth
