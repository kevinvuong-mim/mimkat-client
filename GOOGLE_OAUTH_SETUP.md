# Google OAuth Setup Guide

## Bước 1: Cấu hình Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo một project mới hoặc chọn project hiện có
3. Vào **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Chọn Application type: **Web application**
6. Thêm Authorized JavaScript origins:
   - `http://localhost:3000` (cho backend)
   - `http://localhost:3001` (nếu frontend chạy port khác)
7. Thêm Authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (backend callback)
8. Lưu và copy **Client ID**

## Bước 2: Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục root của project:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Google OAuth Client ID (từ Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

**Lưu ý:** Thay `your-google-client-id-here.apps.googleusercontent.com` bằng Client ID thực tế từ Google Cloud Console.

## Bước 3: Cài đặt Dependencies

```bash
# Chuyển sang Node version 24
nvm use 24

# Cài đặt dependencies
npm install
```

## Bước 4: Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000` (hoặc port khác nếu 3000 đã được sử dụng).

## Cách sử dụng

### Option 3: Sử dụng @react-oauth/google (Đã triển khai)

1. **Đăng nhập với Google button:**

   - Component `GoogleLoginButton` được tích hợp sẵn trong trang `/auth`
   - Khi user click vào button, Google OAuth popup sẽ xuất hiện
   - Sau khi xác thực thành công, credential sẽ được gửi tới backend

2. **Flow hoạt động:**

   ```
   User clicks "Sign in with Google"
   → Google OAuth popup opens
   → User authenticates with Google
   → Google returns credential token
   → Frontend sends token to backend endpoint: POST /auth/google/verify
   → Backend verifies token and returns accessToken & refreshToken
   → Tokens stored in localStorage
   → User redirected to home page
   ```

3. **Callback page:**
   - Trang `/auth/callback` xử lý redirect từ backend (nếu sử dụng redirect flow)
   - Tự động lưu tokens vào localStorage
   - Redirect user về trang chủ

## API Endpoints Backend

Đảm bảo backend có các endpoints sau:

1. **POST /auth/google/verify**

   - Body: `{ token: string }` (Google credential token)
   - Response:

   ```json
   {
     "message": "Google login successful",
     "user": { ... },
     "accessToken": "...",
     "refreshToken": "..."
   }
   ```

2. **GET /auth/google** (Optional - cho redirect flow)

   - Redirect user tới Google OAuth

3. **GET /auth/google/callback** (Optional - cho redirect flow)
   - Xử lý callback từ Google
   - Redirect về frontend với tokens

## Các tính năng đã triển khai

- ✅ Google Login với @react-oauth/google
- ✅ Token management (access & refresh tokens)
- ✅ Automatic token refresh khi expired
- ✅ Protected API calls với authentication
- ✅ Callback page xử lý authentication flow
- ✅ Error handling
- ✅ Multi-language support (EN/VI)

## Utility Functions

File `src/lib/api.ts` cung cấp các hàm hữu ích:

- `fetchProtectedData(endpoint, options)` - Gọi API có authentication
- `refreshToken()` - Refresh access token
- `logout()` - Đăng xuất user
- `isAuthenticated()` - Kiểm tra trạng thái đăng nhập

### Ví dụ sử dụng:

```typescript
import { fetchProtectedData, logout, isAuthenticated } from "@/lib/api";

// Gọi protected API
const data = await fetchProtectedData("/api/user/profile");

// Kiểm tra authentication
if (isAuthenticated()) {
  // User đã đăng nhập
}

// Đăng xuất
logout();
```

## Troubleshooting

### Lỗi "Google Client ID is not configured"

- Kiểm tra file `.env.local` đã có `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- Restart dev server sau khi thêm environment variable

### Google OAuth popup bị block

- Cho phép popup trong browser settings
- Đảm bảo domain được thêm vào Authorized JavaScript origins

### Token expired

- Function `fetchProtectedData` tự động refresh token
- Nếu refresh thất bại, user sẽ được redirect về trang login

## Production Deployment

Khi deploy production:

1. Update `.env.production`:

   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-production-client-id
   ```

2. Thêm production domain vào Google Cloud Console:

   - Authorized JavaScript origins: `https://your-frontend-domain.com`
   - Authorized redirect URIs: `https://your-backend-domain.com/auth/google/callback`

3. **Quan trọng:** Sử dụng HTTPS cho production
4. Cân nhắc sử dụng httpOnly cookies thay vì localStorage cho tokens

## Tài liệu tham khảo

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
