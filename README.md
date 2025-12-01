# Mimkat Client

> Next.js 15 client application với hệ thống authentication hoàn chỉnh, auto token refresh sử dụng Axios interceptors và React Query.

## 📋 Mục Lục

- [Tổng Quan](#-tổng-quan)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Setup](#-setup)
- [Project Structure](#-project-structure)
- [Authentication System](#-authentication-system)
- [API Client Usage](#-api-client-usage)
- [Internationalization](#-internationalization)
- [Development](#-development)
- [Deployment](#-deployment)
- [Best Practices](#-best-practices)

---

## 🎯 Tổng Quan

**Mimkat Client** là ứng dụng web client được xây dựng với Next.js 15, tích hợp hệ thống authentication hoàn chỉnh với auto token refresh sử dụng Axios interceptors và React Query.

### Highlights

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

### HTTP Client & State Management

- **Axios** - Promise based HTTP client với interceptors
- **React Query (TanStack Query v5)** - Server state management với caching và devtools

### UI Components & Styling

- **Shadcn UI** - Re-usable components built with Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful & consistent icons
- **Sonner** - Toast notifications
- **next-themes** - Theme management (dark/light mode)

### Form Management

- **React Hook Form** - Performant forms với easy validation
- **Zod v4** - TypeScript-first schema validation
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
- ✅ Protected Routes với Next.js Middleware
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
- ✅ Dark/Light Mode với next-themes
- ✅ Loading States & Skeleton Screens
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

```bash
git clone <repository-url>
cd mimkat-client
```

2. **Cài đặt dependencies**

```bash
npm install
# hoặc
yarn install
```

3. **Tạo file `.env`**

Copy file `.env.example` thành `.env` và cập nhật các biến môi trường:

```bash
cp .env.example .env
```

Cập nhật file `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. **Chạy development server**

```bash
npm run dev
# hoặc
yarn dev
```

5. **Truy cập ứng dụng**

Mở trình duyệt và truy cập: [http://localhost:3001](http://localhost:3001)

---

## 📁 Project Structure

```
mimkat-client/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (public)/            # Public routes (login, register, etc.)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── verify-email/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── (private)/           # Protected routes
│   │   │   ├── page.tsx         # Home/Dashboard
│   │   │   ├── [identifier]/    # User profile
│   │   │   ├── sessions/        # Session management
│   │   │   └── change-password/
│   │   ├── layout.tsx           # Root layout
│   │   └── not-found.tsx
│   ├── components/
│   │   └── ui/                  # Shadcn UI components
│   ├── context/
│   │   └── user-context.tsx     # User context provider
│   ├── i18n/                    # Internationalization
│   │   ├── context.tsx
│   │   └── locales/             # EN/VI translations
│   ├── lib/
│   │   ├── api-client.ts        # Axios instance với interceptors
│   │   └── utils.ts             # Utility functions
│   ├── providers/               # React providers
│   │   ├── query-provider.tsx
│   │   └── theme-provider.tsx
│   ├── services/                # API service layer
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── types/                   # TypeScript type definitions
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── session.ts
│   │   └── i18n.ts
│   └── middleware.ts            # Next.js middleware cho auth
├── public/                      # Static assets
├── .env                         # Environment variables
├── .env.example                 # Environment variables template
├── next.config.ts               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

---

## 🔐 Authentication System

### Auto Token Refresh Flow

1. **Request được gửi** với access token trong cookie
2. **Server response 401** khi token hết hạn
3. **Axios Interceptor** bắt lỗi 401
4. **Request được queue** để tránh duplicate refresh
5. **Refresh token API** được gọi để lấy token mới
6. **Token mới được lưu** vào cookie
7. **Queued requests được retry** với token mới

### Protected Routes

Middleware kiểm tra authentication cookie và redirect nếu cần:

```typescript
// src/middleware.ts
- Public routes: /login, /register, /verify-email, etc.
- Private routes: /, /sessions, /change-password, /[identifier]
```

---

## 🔌 API Client Usage

### Sử dụng API Client

```typescript
import { apiClient } from "@/lib/api-client";

// GET request
const response = await apiClient.get("/auth/me");

// POST request
const response = await apiClient.post("/auth/login", {
  email: "user@example.com",
  password: "password123",
});
```

### Sử dụng Services Layer (Recommended)

```typescript
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";

// Login
await authService.login(email, password);

// Get current user
const user = await userService.getCurrentUser();

// Update profile
await userService.updateProfile({ name: "New Name" });
```

### Sử dụng với React Query

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ["user"],
  queryFn: userService.getCurrentUser,
});

// Mutate data
const mutation = useMutation({
  mutationFn: userService.updateProfile,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
  },
});
```

---

## 🌍 Internationalization

### Supported Languages

- 🇺🇸 English (en)
- 🇻🇳 Vietnamese (vi)

### Sử dụng i18n Context

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
        {locale === "en" ? "Tiếng Việt" : "English"}
      </button>
    </div>
  );
}
```

### Thêm Translations

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

## 💻 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Environment Variables

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

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
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` - Production API URL
4. Deploy

---

## 📝 Best Practices

### 1. Sử dụng Services Layer

✅ **DO:**

```typescript
import { authService } from "@/services/auth.service";
await authService.login(email, password);
```

❌ **DON'T:**

```typescript
await apiClient.post("/auth/login", { email, password });
```

### 2. Sử dụng React Query cho Data Fetching

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

### 3. Xử lý Errors với Toast

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

### 4. Sử dụng Route Groups

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
└── profile/ (manual auth check trong component)
```

### 5. Type Safety

✅ **DO:**

```typescript
import type { User } from "@/types/user";
import type { ApiResponse } from "@/types/api";

const response: ApiResponse<User> = await apiClient.get("/auth/me");
```

---

## 📚 Resources

### Official Documentation

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [TanStack Query](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

### Useful Links

- [Zod Schema Validation](https://zod.dev)
- [React Hook Form](https://react-hook-form.com)
- [next-themes](https://github.com/pacocoursey/next-themes)

---

## 📄 License

MIT License

---

## 👥 Team

Mimkat Team

---

**Happy Coding! 🚀**
