# Hướng dẫn test Google Login

## Chuẩn bị

### 1. Cấu hình Google Cloud Console

1. Truy cập https://console.cloud.google.com/
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Chọn **Web application**
6. Thêm Authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost:3001` (nếu frontend chạy port khác)
7. Thêm Authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
8. Copy Client ID

### 2. Cấu hình Environment Variables

Mở file `.env.local` và thay đổi:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

Thay `your-client-id-here.apps.googleusercontent.com` bằng Client ID thực tế từ Google Cloud Console.

### 3. Đảm bảo Backend đang chạy

Backend cần có endpoint:

```
POST /auth/google/verify
```

Body:

```json
{
  "token": "google-credential-token"
}
```

Response:

```json
{
  "message": "Google login successful",
  "user": {
    "id": "uuid",
    "email": "user@gmail.com",
    "fullName": "John Doe",
    "avatar": "url"
  },
  "accessToken": "jwt-token",
  "refreshToken": "jwt-refresh-token"
}
```

## Chạy ứng dụng

```bash
# Đảm bảo đang sử dụng Node v24
nvm use 24

# Cài đặt dependencies (nếu chưa cài)
npm install

# Chạy development server
npm run dev
```

## Test flow

1. Mở browser và truy cập: http://localhost:3000
2. Click vào button "Đăng nhập / Đăng ký"
3. Trên trang đăng nhập, click vào button "Sign in with Google" (Google logo)
4. Google OAuth popup sẽ xuất hiện
5. Chọn tài khoản Google để đăng nhập
6. Sau khi xác thực thành công:
   - Frontend gửi credential token tới backend endpoint `/auth/google/verify`
   - Backend verify token và trả về accessToken & refreshToken
   - Tokens được lưu vào localStorage
   - User được redirect về trang chủ

## Kiểm tra kết quả

### Trong Browser Console:

```javascript
// Kiểm tra tokens đã được lưu
console.log(localStorage.getItem("accessToken"));
console.log(localStorage.getItem("refreshToken"));
```

### Test Protected API calls:

```javascript
import { fetchProtectedData } from "@/lib/api";

// Gọi protected endpoint
const data = await fetchProtectedData("/api/user/profile");
console.log(data);
```

## Các trường hợp lỗi thường gặp

### 1. "Google Client ID is not configured"

**Nguyên nhân:** Chưa cấu hình NEXT_PUBLIC_GOOGLE_CLIENT_ID trong .env.local
**Giải pháp:**

- Kiểm tra file .env.local
- Restart dev server: `npm run dev`

### 2. Google OAuth popup bị chặn

**Nguyên nhân:** Browser chặn popup
**Giải pháp:**

- Cho phép popup trong browser settings
- Click vào icon popup bị chặn trên address bar

### 3. "Origin not allowed"

**Nguyên nhân:** Domain chưa được thêm vào Authorized JavaScript origins
**Giải pháot:** Thêm `http://localhost:3000` vào Google Cloud Console

### 4. Backend trả về lỗi 401/403

**Nguyên nhân:** Token không hợp lệ hoặc backend chưa sẵn sàng
**Giải pháp:**

- Kiểm tra backend đang chạy
- Kiểm tra endpoint `/auth/google/verify` có hoạt động không

### 5. CORS error

**Nguyên nhân:** Backend chưa enable CORS cho frontend domain
**Giải pháp:** Enable CORS trên backend cho `http://localhost:3000`

## Debug mode

Bật console trong browser (F12) để xem:

- Network requests
- Console logs
- localStorage content

## Alternative: Test với redirect flow

Nếu muốn test với redirect flow thay vì popup:

1. Truy cập trực tiếp: http://localhost:3000/auth/google
2. Đăng nhập với Google
3. Sẽ được redirect về: http://localhost:3000/auth/callback?accessToken=...&refreshToken=...
4. Page callback sẽ tự động lưu tokens và redirect về trang chủ

## Cấu trúc files đã tạo

```
src/
├── app/
│   ├── auth/
│   │   ├── page.tsx              # Login page với Google OAuth button
│   │   └── callback/
│   │       └── page.tsx          # Callback handler
│   └── ...
├── components/
│   └── GoogleLoginButton.tsx    # Google OAuth component
└── lib/
    └── api.ts                   # API utilities (fetch, refresh token)

.env.local                        # Environment variables
.env.example                      # Example env file
GOOGLE_OAUTH_SETUP.md            # Setup documentation
TEST_GOOGLE_LOGIN.md             # Test instructions (this file)
```

## Next steps

Sau khi test thành công:

1. Implement protected routes
2. Add user profile display
3. Add logout functionality
4. Handle token expiration gracefully
5. Consider using httpOnly cookies for production

## Support

Nếu gặp vấn đề, check:

1. Browser console errors
2. Network tab trong DevTools
3. Backend logs
4. Google Cloud Console credentials settings
