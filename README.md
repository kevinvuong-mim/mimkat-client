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

### UI Components

- **Shadcn UI** - Re-usable components built with Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful & consistent icons
- **Sonner** - Toast notifications

### Form Management

- **React Hook Form** - Performant forms với easy validation
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Zod resolver cho React Hook Form

### Internationalization

- **next-intl** - Internationalization cho Next.js App Router

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

### API Integration

- ✅ Axios Instance với Response Interceptor
- ✅ Auto 401 Handling & Token Refresh
- ✅ Request Queuing để tránh duplicate refresh
- ✅ Type-Safe API Client
- ✅ React Query integration
- ✅ Automatic retry với stale queries

### UI/UX

- ✅ Responsive Design
- ✅ Multi-language (EN/VI) với next-intl
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

   ```bash
   git clone <repository-url>
   cd mimkat-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env
   ```

   Cập nhật các biến trong `.env`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Run development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

---

## 📁 Project Structure

```
mimkat-client/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (private)/              # Protected routes group
│   │   │   ├── profile/            # User profile page
│   │   │   └── change-password/    # Change password page
│   │   ├── (public)/               # Public routes group
│   │   │   ├── login/              # Login page
│   │   │   ├── register/           # Register page
│   │   │   ├── verify-email/       # Email verification
│   │   │   ├── forgot-password/    # Forgot password
│   │   │   └── reset-password/     # Reset password
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Home page
│   │
│   ├── components/                 # React components
│   │   ├── ui/                     # Shadcn UI components
│   │   │   ├── avatar.tsx
│   │   │   ├── button.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── sonner.tsx
│   │   └── GoogleLoginButton.tsx   # Google OAuth component
│   │
│   ├── context/                    # React contexts
│   │   └── UserContext.tsx         # User state management
│   │
│   ├── i18n/                       # Internationalization
│   │   └── locales/                # Translation files
│   │       ├── en.json
│   │       └── vi.json
│   │
│   ├── lib/                        # Core libraries
│   │   ├── api.ts                  # Axios instance + interceptors ⭐
│   │   ├── constants.ts            # App constants
│   │   ├── public-route.ts         # Public route checker
│   │   └── utils.ts                # Utility functions
│   │
│   ├── providers/                  # App providers
│   │   └── QueryProvider.tsx       # React Query provider
│   │
│   ├── services/                   # API services
│   │   ├── auth.service.ts         # Authentication methods
│   │   └── user.service.ts         # User-related methods
│   │
│   ├── types/                      # TypeScript types
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── i18n.ts
│   │   ├── index.ts
│   │   ├── session.ts
│   │   └── user.ts
│   │
│   └── middleware.ts               # Next.js middleware (route protection)
│
├── public/                         # Static assets
├── .env                            # Environment variables (gitignored)
├── .env.example                    # Environment template
├── next.config.ts                  # Next.js config
├── tsconfig.json                   # TypeScript config
├── tailwind.config.ts              # Tailwind CSS config
├── components.json                 # Shadcn UI config
├── package.json                    # Dependencies
└── README.md                       # This file
```

---

## 🔐 Authentication System

### Auto Token Refresh với Axios Interceptors

Hệ thống sử dụng **Axios response interceptor** để tự động refresh token khi hết hạn:

#### Architecture:

```
Request → API Call (với cookies)
       → Response Interceptor (check 401)
       → Auto Refresh Token
       → Retry Request
       → Return Data
```

#### Flow:

1. API calls tự động gửi kèm **cookies** (withCredentials: true)
2. Nếu nhận **401 Unauthorized**:
   - Queue các concurrent requests
   - Call `/auth/refresh` để refresh access token
   - Retry tất cả queued requests với token mới
3. Nếu refresh thất bại:
   - Reject tất cả queued requests
   - Redirect về `/login` (chỉ khi không phải public route)

#### Code Example:

```typescript
// src/lib/api.ts
import { apiClient } from "@/lib/api";

// Tất cả requests tự động handle 401!
const user = await apiClient.get("/auth/me");
```

#### Middleware Protection:

Next.js middleware tự động bảo vệ protected routes:

```typescript
// src/middleware.ts
// Redirect về /login nếu chưa authenticated
// Cho phép access public routes
```

---

## 🌐 API Client Usage

### Basic Usage

```typescript
import { apiClient } from "@/lib/api";

// GET request - response interceptor tự động return response.data
const user = await apiClient.get("/auth/me");

// POST request
const result = await apiClient.post("/auth/login", {
  email: "user@example.com",
  password: "password123",
});

// PATCH request
const updated = await apiClient.patch("/auth/change-password", {
  currentPassword: "old123",
  newPassword: "new123",
});
```

### With Services Layer

```typescript
// src/services/auth.service.ts
import { apiClient } from "@/lib/api";

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }),

  register: (email: string, password: string) =>
    apiClient.post("/auth/register", { email, password }),

  logout: () => apiClient.post("/auth/logout"),

  getCurrentUser: () => apiClient.get("/auth/me"),

  refreshToken: () =>
    axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true }),
};
```

### With React Query

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

export function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: userService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;

  return <div>Welcome, {user.email}</div>;
}
```

### Error Handling

```typescript
import axios from "axios";

try {
  await authService.login(email, password);
} catch (error) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || "Login failed";
    toast.error(message);
  }
}
```

---

## 🧑‍💻 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Development Workflow

1. **Start development server**

   ```bash
   npm run dev
   ```

2. **Make changes** - Files auto-reload

3. **Lint code**

   ```bash
   npm run lint
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Hot Reload

Next.js 15 tự động reload khi bạn save files:

- **Fast Refresh** cho React components
- **Turbopack** cho faster development build

---

## 🔧 Environment Variables

### Required Variables

```env
# API URL (Backend)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Google OAuth Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Environment Files

- `.env` - Environment variables (gitignored)
- `.env.example` - Template for other developers

### Usage in Code

```typescript
// Client-side (NEXT_PUBLIC_ prefix required)
import { API_URL } from "@/lib/constants";

// src/lib/constants.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL!;
```

---

## 🔑 Key Features Explained

### 1. Auto Token Refresh

**Problem:** Access tokens hết hạn → User bị logout

**Solution:**

- Axios response interceptor detect 401
- Auto call `/auth/refresh` để lấy token mới
- Retry failed requests với token mới
- Request queuing để tránh duplicate refresh calls

### 2. Request Queuing

**Problem:** Nhiều API calls cùng lúc → nhiều refresh token calls

**Solution:**

- Request đầu tiên trigger refresh
- Các requests sau được queue lại
- Sau khi refresh xong, retry tất cả requests trong queue

### 3. Route Groups

**Problem:** Cần tổ chức routes và apply layouts khác nhau

**Solution:**

- `(public)/` - Public routes (login, register, etc.)
- `(private)/` - Protected routes (profile, change-password)
- Middleware tự động check authentication

### 4. Type Safety

**Problem:** Runtime errors vì type mismatch

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

### Usage với next-intl

```tsx
"use client";

import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("login");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
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
- [next-intl](https://next-intl-docs.vercel.app)

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
