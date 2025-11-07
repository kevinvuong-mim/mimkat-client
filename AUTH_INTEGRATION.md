# Mimkat Client - Authentication Integration

Tích hợp hoàn chỉnh Authentication giữa Mimkat Client và Mimkat API.

## 🚀 Tính năng

- ✅ Đăng ký tài khoản với email/password
- ✅ Xác thực email qua link trong email
- ✅ Đăng nhập với email/password
- ✅ Đăng nhập với Google OAuth
- ✅ Đăng xuất
- ✅ Tự động refresh token (mỗi 50 phút)
- ✅ Protected routes (yêu cầu đăng nhập)
- ✅ Quản lý session với localStorage

## 📋 Cấu trúc

```
mimkat-client/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── page.tsx                    # Trang đăng ký/đăng nhập
│   │   │   ├── verify-email/
│   │   │   │   └── page.tsx               # Xác thực email từ link
│   │   │   └── google/
│   │   │       └── callback/
│   │   │           └── page.tsx           # Google OAuth callback
│   │   ├── layout.tsx                     # Root layout với AuthProvider
│   │   └── page.tsx                       # Home page với user info
│   ├── components/
│   │   ├── GoogleLoginButton.tsx          # Nút đăng nhập Google
│   │   └── ProtectedRoute.tsx             # Component bảo vệ routes
│   ├── context/
│   │   └── AuthContext.tsx                # Context quản lý auth state
│   └── services/
│       └── auth.service.ts                # Service gọi API
└── .env.example                           # Biến môi trường mẫu
```

## 🔧 Cài đặt

### 1. Clone và cài đặt dependencies

```bash
cd mimkat-client
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

Cập nhật các giá trị:

```env
# URL của mimkat-api backend
NEXT_PUBLIC_API_URL=http://localhost:3000

# Google OAuth Client ID (optional - chỉ cần nếu dùng Google login)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 3. Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3001`

## 📖 Luồng hoạt động

### 1. Đăng ký với Email/Password

```
User nhập email + password → API tạo tài khoản → Gửi email verification
→ User check email → Click link verify → Email được xác thực → Có thể đăng nhập
```

**Endpoints sử dụng:**

- `POST /api/v1/auth/register` - Đăng ký
- `GET /api/v1/auth/verify-email?token=xxx` - Xác thực email
- `POST /api/v1/auth/resend-verification` - Gửi lại email xác thực

### 2. Đăng nhập với Email/Password

```
User nhập email + password → API kiểm tra → Trả về accessToken + refreshToken
→ Lưu vào localStorage → Redirect về home
```

**Endpoints sử dụng:**

- `POST /api/v1/auth/login` - Đăng nhập

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "uuid-refresh-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "emailVerified": true
  }
}
```

### 3. Đăng nhập với Google

```
User click "Đăng nhập với Google" → Redirect đến /api/v1/auth/google
→ Google OAuth consent screen → User cấp quyền
→ Google callback về /api/v1/auth/google/callback
→ API trả về tokens → Client lưu tokens → Redirect về home
```

**Endpoints sử dụng:**

- `GET /api/v1/auth/google` - Khởi tạo OAuth flow
- `GET /api/v1/auth/google/callback` - Xử lý callback

### 4. Đăng xuất

```
User click logout → Gọi API với refreshToken → API vô hiệu hóa token
→ Xóa localStorage → Redirect về /auth
```

**Endpoints sử dụng:**

- `POST /api/v1/auth/logout` - Đăng xuất

### 5. Auto Refresh Token

```
Mỗi 50 phút → Tự động gọi API refresh → Nhận tokens mới
→ Cập nhật localStorage → Tiếp tục session
```

**Endpoints sử dụng:**

- `POST /api/v1/auth/refresh` - Refresh token

## 🛡️ Bảo mật

### Token Management

- **Access Token**: Hết hạn sau 1 giờ
- **Refresh Token**: Hết hạn sau 7 ngày
- **Auto refresh**: Tự động làm mới sau 50 phút
- **Storage**: Lưu trong localStorage (client-side)

### Protected Routes

Sử dụng component `ProtectedRoute` để bảo vệ các trang:

```tsx
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

Hoặc với yêu cầu email đã verify:

```tsx
<ProtectedRoute requireEmailVerification={true}>
  <div>Protected content here</div>
</ProtectedRoute>
```

## 🎯 Sử dụng Auth Context

### Trong component

```tsx
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const {
    user, // Thông tin user hiện tại
    isAuthenticated, // Trạng thái đăng nhập
    isLoading, // Đang load auth state
    login, // Function đăng nhập
    register, // Function đăng ký
    logout, // Function đăng xuất
  } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🔍 API Service

Service `authService` cung cấp các methods:

```typescript
// Đăng ký
await authService.register({ email, password });

// Đăng nhập
await authService.login({ email, password });

// Đăng xuất
await authService.logout({ refreshToken }, accessToken);

// Refresh token
await authService.refreshToken({ refreshToken });

// Verify email
await authService.verifyEmail(token);

// Resend verification email
await authService.resendVerification({ email });

// Khởi tạo Google login
authService.initiateGoogleLogin();
```

## 🐛 Xử lý lỗi

### Lỗi thường gặp

1. **Email chưa verify**

   - Error: "Please verify your email before logging in"
   - Giải pháp: Click "Gửi lại email xác thực" ở trang login

2. **Token hết hạn**

   - Tự động refresh nếu còn refresh token
   - Nếu refresh token hết hạn → Logout và yêu cầu đăng nhập lại

3. **Google OAuth failed**
   - Kiểm tra `NEXT_PUBLIC_GOOGLE_CLIENT_ID` trong `.env.local`
   - Kiểm tra Google OAuth credentials trong API

## 📝 Notes

- **CORS**: Đảm bảo API đã cấu hình CORS cho client URL
- **Environment**: Chỉnh `NEXT_PUBLIC_API_URL` theo môi trường (dev/staging/prod)
- **Google OAuth**: Cần cấu hình callback URL trong Google Cloud Console

## 🚀 Production Checklist

- [ ] Cấu hình CORS trên API cho production URL
- [ ] Update `NEXT_PUBLIC_API_URL` với production API URL
- [ ] Cấu hình Google OAuth production credentials
- [ ] Kiểm tra SSL/HTTPS cho cả client và API
- [ ] Test flow đăng ký → verify → login
- [ ] Test Google OAuth flow
- [ ] Test auto refresh token
- [ ] Test logout

## 🤝 Tích hợp với API

API endpoints cần thiết (đã có trong `mimkat-api`):

- ✅ `POST /api/v1/auth/register`
- ✅ `POST /api/v1/auth/login`
- ✅ `POST /api/v1/auth/logout`
- ✅ `POST /api/v1/auth/refresh`
- ✅ `GET /api/v1/auth/verify-email`
- ✅ `POST /api/v1/auth/resend-verification`
- ✅ `GET /api/v1/auth/google`
- ✅ `GET /api/v1/auth/google/callback`

Tham khảo tài liệu API trong `mimkat-api/documents/apis/auth/`
