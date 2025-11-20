# Mimkat Client

> Next.js client application với auto token refresh system sử dụng Axios interceptors.

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
- [Documentation](#documentation)

---

## 🎯 Tổng Quan

**Mimkat Client** là ứng dụng web client được xây dựng với Next.js, tích hợp hệ thống authentication hoàn chỉnh với auto token refresh sử dụng Axios interceptors.

### Highlights:

- ✅ **Auto Token Refresh** - Tự động refresh access token khi hết hạn
- ✅ **Request Queuing** - Tránh duplicate refresh calls
- ✅ **Axios Interceptors** - Clean và powerful
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Next.js 14** - App Router với Server Components
- ✅ **Internationalization** - Multi-language support (EN/VI)

---

## 🛠 Tech Stack

### Core

- **Next.js 14** - React Framework với App Router
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling

### HTTP Client

- **Axios** - Promise based HTTP client với interceptors

### State Management

- **React Context API** - Authentication state
- **React Hooks** - Local state management

### Internationalization

- **Custom i18n Context** - Multi-language support

---

## ✨ Features

### Authentication

- ✅ Email/Password Login & Register
- ✅ Google OAuth Login
- ✅ Email Verification
- ✅ Password Reset/Recovery
- ✅ Session Management
- ✅ Protected Routes
- ✅ Auto Token Refresh
- ✅ Persistent Login

### API Integration

- ✅ Axios Instance với Interceptors
- ✅ Request/Response Interceptors
- ✅ Auto Bearer Token Injection
- ✅ Auto 401 Handling
- ✅ Request Queuing
- ✅ Type-Safe API Client

### UI/UX

- ✅ Responsive Design
- ✅ Multi-language (EN/VI)
- ✅ Loading States
- ✅ Error Handling
- ✅ Form Validation

---

## 🚀 Setup

### Prerequisites

- Node.js **24.x** (sử dụng nvm)
- npm **11.x**
- Git

### Installation

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd mimkat-client
   ```

2. **Switch to Node 24**

   ```bash
   nvm use 24
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Setup environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Cập nhật các biến trong `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:3001
   ```

---

## 📁 Project Structure

```
mimkat-client/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── auth/                   # Auth pages (login, register, etc)
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Home page
│   │
│   ├── components/                 # React components
│   │   ├── GoogleLoginButton.tsx
│   │   ├── ProfileExample.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── context/                    # React contexts
│   │   └── UserContext.tsx         # User state + periodic refresh
│   │
│   ├── i18n/                       # Internationalization
│   │   ├── context.tsx             # i18n context
│   │   └── locales/                # Translation files
│   │       ├── en.json
│   │       └── vi.json
│   │
│   ├── lib/                        # Core libraries
│   │   ├── api.ts                  # Axios instance + interceptors ⭐
│   │   ├── api-client.ts           # API wrapper ⭐
│   │   ├── token.ts                # Token management
│   │   ├── api-client-examples.ts
│   │   └── README.md               # API documentation
│   │
│   └── services/                   # API services
│       └── auth.service.ts         # Authentication methods
│
├── public/                         # Static assets
├── .env.local                      # Environment variables (gitignored)
├── .env.example                    # Environment template
├── next.config.ts                  # Next.js config
├── tailwind.config.ts              # Tailwind config
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies
│
├── AUTO_REFRESH_TOKEN.md           # Token refresh documentation
├── AXIOS_MIGRATION.md              # Axios migration guide
└── README.md                       # This file
```

---

## 🔐 Authentication System

### Auto Token Refresh với Axios Interceptors

Hệ thống sử dụng **Axios interceptors** để tự động refresh token khi hết hạn:

#### Architecture:

```
Request → Request Interceptor (add token)
       → API Call
       → Response Interceptor (check 401)
       → Auto Refresh Token
       → Retry Request
       → Return Data
```

#### Flow:

1. **Request Interceptor** tự động thêm `Authorization` header
2. Nếu nhận **401 Unauthorized**:
   - Queue các concurrent requests
   - Refresh access token
   - Retry tất cả queued requests với token mới
3. Nếu refresh thất bại → redirect về `/auth`

#### Code Example:

```typescript
// Tự động handle tất cả!
import { apiClient } from "@/lib/api-client";

const user = await apiClient.get("/auth/me");
// Token tự động thêm, 401 tự động refresh!
```

#### Periodic Refresh:

User Context tự động refresh token mỗi **50 phút** (token hết hạn sau 60 phút):

```typescript
// Trong UserContext.tsx
useEffect(() => {
  if (!user) return;

  const refreshInterval = setInterval(async () => {
    await authService.refreshToken();
  }, 50 * 60 * 1000); // 50 phút

  return () => clearInterval(refreshInterval);
}, [user]);
```

---

## 🌐 API Client Usage

### Basic Usage

```typescript
import { apiClient } from "@/lib/api-client";

// GET request
const user = await apiClient.get("/auth/me");

// POST request
const post = await apiClient.post("/posts", {
  title: "Hello",
  content: "World",
});

// PUT request
const updated = await apiClient.put("/users/123", {
  name: "New Name",
});

// PATCH request
const patched = await apiClient.patch("/users/123", {
  avatar: "new-avatar.jpg",
});

// DELETE request
const deleted = await apiClient.delete("/posts/123");
```

### With TypeScript

```typescript
interface User {
  id: string;
  email: string;
  name: string;
}

// Type-safe response
const user = await apiClient.get<User>("/auth/me");
console.log(user.name); // TypeScript knows this!
```

### Error Handling

```typescript
import axios from "axios";

try {
  const data = await apiClient.get("/users/me");
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data.message);
  }
}
```

### Advanced Usage

```typescript
// With query params
const posts = await apiClient.get("/posts", {
  params: {
    page: 1,
    limit: 10,
    search: "axios",
  },
});

// Custom headers
const data = await apiClient.post("/posts", postData, {
  headers: {
    "X-Custom-Header": "value",
  },
});

// With timeout
const data = await apiClient.get("/slow-endpoint", {
  timeout: 5000, // 5 seconds
});
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

# Type check
npm run type-check
```

### Development Workflow

1. **Start development server**

   ```bash
   npm run dev
   ```

2. **Make changes** - Files auto-reload

3. **Check types**

   ```bash
   npm run type-check
   ```

4. **Lint code**

   ```bash
   npm run lint
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

### Hot Reload

Next.js tự động reload khi bạn save files:

- **Fast Refresh** cho React components
- **Server-side reload** cho API routes

---

## 🔧 Environment Variables

### Required Variables

```env
# API URL (Backend)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Google OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Environment Files

- `.env.local` - Local development (gitignored)
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.example` - Template for other developers

### Usage in Code

```typescript
// Client-side (NEXT_PUBLIC_ prefix required)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Server-side (no prefix needed)
const secret = process.env.SECRET_KEY;
```

---

## 📚 Documentation

### Main Docs

- **[AUTO_REFRESH_TOKEN.md](./AUTO_REFRESH_TOKEN.md)** - Auto refresh token system
- **[AXIOS_MIGRATION.md](./AXIOS_MIGRATION.md)** - Migration từ fetch sang axios
- **[src/lib/README.md](./src/lib/README.md)** - API client documentation
- **[src/lib/api-client-examples.ts](./src/lib/api-client-examples.ts)** - Usage examples

### External Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Axios Documentation](https://axios-http.com)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🔑 Key Features Explained

### 1. Auto Token Refresh

**Problem:** Access tokens hết hạn sau 60 phút → User bị logout

**Solution:**

- Axios response interceptor detect 401
- Auto refresh access token
- Retry failed requests
- Periodic refresh mỗi 50 phút

### 2. Request Queuing

**Problem:** Nhiều API calls cùng lúc → nhiều refresh token calls

**Solution:**

- Request đầu tiên trigger refresh
- Các requests sau được queue lại
- Sau khi refresh xong, retry tất cả

### 3. Type Safety

**Problem:** Runtime errors vì type mismatch

**Solution:**

- Full TypeScript support
- Generics cho API responses
- Compile-time type checking

### 4. Protected Routes

**Problem:** Users chưa login access protected pages

**Solution:**

- `ProtectedRoute` component
- Check authentication state
- Auto redirect to `/auth`

---

## 🎨 Styling

### Tailwind CSS

Dự án sử dụng **Tailwind CSS** cho styling:

```tsx
// Example
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-800">Welcome</h1>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Click Me
  </button>
</div>
```

### Global Styles

Global styles trong `src/app/globals.css`:

- Tailwind base, components, utilities
- Custom CSS variables
- Reset styles

---

## 🌍 Internationalization

### Supported Languages

- 🇺🇸 English (en)
- 🇻🇳 Vietnamese (vi)

### Usage

```tsx
"use client";

import { useI18n } from "@/i18n/context";

export default function MyComponent() {
  const { t, locale, setLocale } = useI18n();

  return (
    <div>
      <h1>{t.welcome.title}</h1>
      <p>{t.welcome.description}</p>

      <button onClick={() => setLocale("vi")}>Tiếng Việt</button>
    </div>
  );
}
```

### Adding Translations

Edit files in `src/i18n/locales/`:

- `en.json` - English translations
- `vi.json` - Vietnamese translations

---

## 🧪 Testing

### Manual Testing

1. **Authentication Flow**

   - Register new account
   - Verify email
   - Login
   - Check token refresh
   - Logout

2. **API Calls**

   - Make authenticated requests
   - Check auto token refresh
   - Test error handling

3. **Protected Routes**
   - Access protected pages
   - Check auto redirect

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

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables in Production

Set trong Vercel Dashboard:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

---

## 📝 Best Practices

### 1. Use API Client

✅ **DO:**

```typescript
const data = await apiClient.get("/users");
```

❌ **DON'T:**

```typescript
const response = await fetch(url, { headers: {...} });
```

### 2. Type Your API Responses

✅ **DO:**

```typescript
const user = await apiClient.get<User>("/auth/me");
```

❌ **DON'T:**

```typescript
const user = await apiClient.get("/auth/me");
```

### 3. Handle Errors

✅ **DO:**

```typescript
try {
  const data = await apiClient.get("/api");
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error(error.response?.data);
  }
}
```

❌ **DON'T:**

```typescript
const data = await apiClient.get("/api"); // No error handling
```

### 4. Use Protected Routes

✅ **DO:**

```tsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

❌ **DON'T:**

```tsx
// Check auth manually in every page
```

---

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Mimkat Team**

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Axios team for the HTTP client
- Tailwind CSS for the utility-first CSS framework

---

## 📞 Support

Nếu có vấn đề hoặc câu hỏi:

1. Check [Documentation](#documentation)
2. Check [AUTO_REFRESH_TOKEN.md](./AUTO_REFRESH_TOKEN.md)
3. Check [AXIOS_MIGRATION.md](./AXIOS_MIGRATION.md)
4. Open an issue

---

**Happy Coding! 🚀**
