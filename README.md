# Mimkat Client

> Next.js 15 client application với auto token refresh system sử dụng Axios interceptors và React Query.

## 📋 Table of Contents

- [Tổng Quan](#tổng-quan)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Authentication System](#authentication-system)
- [API Client Usage](#api-client-usage)
- [Development](#development)
- [Environment Variables](#environment-variables)

---

## 🎯 Tổng Quan

**Mimkat Client** là ứng dụng web client được xây dựng với Next.js 15, tích hợp hệ thống authentication hoàn chỉnh với auto token refresh sử dụng Axios interceptors và React Query.

### Highlights:

- ✅ **Auto Token Refresh** - Tự động refresh access token khi hết hạn
- ✅ **Request Queuing** - Tránh duplicate refresh calls
- ✅ **Axios Interceptors** - Clean và powerful HTTP client
- ✅ **React Query** - Server state management với caching
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Next.js 15** - App Router với React 19
- ✅ **Internationalization** - Multi-language support (EN/VI)
- ✅ **UI Components** - Shadcn UI với Tailwind CSS

---

## 🛠 Tech Stack

### Core

- **Next.js 15** - React Framework với App Router
- **React 19** - UI Library
- **TypeScript 5** - Type Safety

### HTTP Client & State

- **Axios** - Promise based HTTP client với interceptors
- **React Query (TanStack Query)** - Server state management với caching và devtools

### UI Components & Theming

- **Shadcn UI** - Re-usable components built with Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful & consistent icons
- **Sonner** - Toast notifications
- **next-themes** - Theme management (dark/light mode)

### Form Management

- **React Hook Form** - Performant forms với easy validation
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Zod resolver cho React Hook Form

### Internationalization

- **Custom i18n Context** - Custom implementation với React Context API

---

## ✨ Features

### Authentication

- ✅ Email/Password Login & Register
- ✅ Google OAuth Login
- ✅ Email Verification
- ✅ Password Reset/Recovery
- ✅ Change Password (cả users có và không có password)
- ✅ Protected Routes với Middleware
- ✅ Auto Token Refresh với Axios Interceptors
- ✅ Cookie-based Session Management
- ✅ Session Management Dashboard (view & revoke active sessions)

### API Integration

- ✅ Axios Instance với Response Interceptor
- ✅ Auto 401 Handling & Token Refresh
- ✅ Request Queuing để tránh duplicate refresh
- ✅ Type-Safe API Client
- ✅ React Query integration
- ✅ Automatic retry với stale queries

### UI/UX

- ✅ Responsive Design

## 🎯 Tổng Quan

- ✅ Dark/Light Mode với next-themes
- ✅ Loading States
- ✅ Toast Notifications (Sonner)
- ✅ Form Validation với Zod
- ✅ Shadcn UI Components
- ✅ Route Groups cho public/private routes

---

## 🚀 Setup

### Prerequisites

- Node.js **18.x hoặc cao hơn**
- npm hoặc yarn
- Git

### Installation

1. **Clone repository**

# Mimkat Client

## Tổng Quan

- Next.js 15 + React 19 + TypeScript
- Auto token refresh, request queuing
- Multi-language (EN/VI), dark/light mode
- UI: Shadcn UI, Tailwind CSS
- Form: React Hook Form + Zod

## Tech Stack

- Next.js 15, React 19, TypeScript
- Axios, React Query
- Shadcn UI, Tailwind CSS, Radix UI
- React Hook Form, Zod
- Sonner (toast), next-themes

## Setup

1. Clone repo & cài đặt:

```bash
git clone <repository-url>
cd mimkat-client
npm install
# hoặc
yarn install
```

2. Tạo file `.env` từ `.env.example` và cập nhật biến:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

3. Chạy dev server:

```bash
npm run dev
# hoặc
yarn dev
```

4. Truy cập: http://localhost:3000

## Cấu Trúc Dự Án

```
mimkat-client/
├── src/
│   ├── app/ (public, private routes)
│   ├── components/ui/ (Shadcn UI)
│   ├── context/, i18n/, lib/, providers/, services/, types/
│   └── middleware.ts
├── public/
├── .env, .env.example
├── next.config.ts, tailwind.config.ts, tsconfig.json
├── package.json
└── README.md
```

## Authentication System

- Auto token refresh với Axios interceptor
- Request queuing tránh duplicate refresh
- Middleware bảo vệ private routes

## API Client Usage

```typescript
import { apiClient } from "@/lib/api-client";
const user = await apiClient.get("/auth/me");
```

## Development

## Cấu Trúc Dự Án (Chi tiết hơn)

```bash
npm run dev      # Dev server
npm run build    # Build production
npm start        # Start production
npm run lint     # Lint code
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Best Practices

- Sử dụng service layer cho API
- Dùng React Query cho data fetching
- Xử lý lỗi với toast
- Tổ chức routes theo group (public/private)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TanStack Query](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## License

MIT License

## Team

Mimkat Team
**Solution:**

- Full TypeScript support
- Type definitions cho API responses
- Zod schema validation
- Compile-time type checking

---

## 🌍 Internationalization

### Supported Languages

- 🇺🇸 English (en)
- 🇻🇳 Vietnamese (vi)

### Usage với Custom i18n Context

```tsx
"use client";

import { useI18n } from "@/i18n/context";

export default function LoginPage() {
  const { t, locale, setLocale } = useI18n();

  return (
    <div>
      <h1>{t.login.title}</h1>
      <p>{t.login.description}</p>
      <button onClick={() => setLocale(locale === "en" ? "vi" : "en")}>
        Switch Language
      </button>
    </div>
  );
}
```

### Adding Translations

Edit files trong `src/i18n/locales/`:

```json
// en.json
{
  "login": {
    "title": "Welcome back",
    "description": "Sign in to your account"
  }
}

// vi.json
{
  "login": {
    "title": "Chào mừng trở lại",
    "description": "Đăng nhập vào tài khoản của bạn"
  }
}
```

---

## 🧪 Testing

### Manual Testing

1. **Authentication Flow**

   - Register new account
   - Verify email từ inbox
   - Login với credentials
   - Access protected routes
   - Test token auto-refresh (wait for 401)
   - Change password
   - Logout

2. **Google OAuth**

   - Click "Sign in with Google"
   - Complete OAuth flow
   - Check session creation

3. **Password Reset**

   - Request password reset
   - Check email inbox
   - Reset password với token
   - Login với password mới

4. **Protected Routes**
   - Try access `/profile` without login → redirect to `/login`
   - Login → can access `/profile`
   - Logout → redirect to `/login`

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project trong Vercel Dashboard
3. Set environment variables
4. Deploy

### Environment Variables in Production

Set trong Vercel Dashboard:

- `NEXT_PUBLIC_API_URL` - Production API URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth Client ID

---

## 📝 Best Practices

### 1. Use Services Layer

✅ **DO:**

```typescript
import { authService } from "@/services/auth.service";

await authService.login(email, password);
```

❌ **DON'T:**

```typescript
await apiClient.post("/auth/login", { email, password });
```

### 2. Use React Query for Data Fetching

✅ **DO:**

```typescript
const { data, isLoading } = useQuery({
  queryKey: ["user"],
  queryFn: userService.getCurrentUser,
});
```

❌ **DON'T:**

```typescript
const [user, setUser] = useState(null);
useEffect(() => {
  userService.getCurrentUser().then(setUser);
}, []);
```

### 3. Handle Errors with Toast

✅ **DO:**

```typescript
import { toast } from "sonner";

try {
  await authService.login(email, password);
  toast.success("Login successful!");
} catch (error) {
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data?.message || "Login failed");
  }
}
```

### 4. Use Route Groups

✅ **DO:**

```
app/
├── (public)/login/
└── (private)/profile/
```

❌ **DON'T:**

```
app/
├── login/
└── profile/ (manual auth check)
```

---

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📚 Resources

### Official Documentation

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [TanStack Query](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com)
- [Shadcn UI](https://ui.shadcn.com)
- [next-themes](https://github.com/pacocoursey/next-themes)

### Useful Links

- [Zod Schema Validation](https://zod.dev)
- [React Hook Form](https://react-hook-form.com)
- [Tailwind CSS](https://tailwindcss.com)

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

- **Mimkat Team**

---

**Happy Coding! 🚀**
