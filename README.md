# Mimkat Client

A modern, full-featured authentication client application built with Next.js 16, React 19, and TypeScript.

## 📋 Prerequisites

- Node.js >= 20.0.0
- npm, yarn, or pnpm

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/kevinvuong-mim/mimkat-client.git
cd mimkat-client
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your environment variables:

```env
NEXT_PUBLIC_API_URL=your_api_url
```

## 🚀 Getting Started

### Development Mode

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
mimkat-client/
├── public/             # Static files
│   └── images/         # Image assets
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── (private)/  # Protected routes
│   │   └── (public)/   # Public routes
│   ├── components/     # Reusable UI components
│   │   └── ui/         # Shadcn/UI components
│   ├── context/        # React Context providers
│   ├── i18n/           # Internationalization
│   │   └── locales/    # Translation files
│   ├── lib/            # Utility functions
│   ├── providers/      # App providers (Query, Theme)
│   ├── services/       # API services
│   └── types/          # TypeScript types
├── components.json     # Shadcn/UI configuration
├── next.config.ts      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## 🎨 Tech Stack

### Core

- **Next.js 15** - React Framework
- **React 19** - UI Library
- **TypeScript** - Type Safety

### UI/Styling

- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Headless UI Components
- **Lucide React** - Icon Library
- **next-themes** - Theme Management

### Forms & Validation

- **React Hook Form** - Form Management
- **Zod** - Schema Validation
- **@hookform/resolvers** - Form Resolvers

### Data Fetching

- **TanStack Query (React Query)** - Server State Management
- **Axios** - HTTP Client

### Code Quality

- **ESLint** - Linting
- **Prettier** - Code Formatting
- **TypeScript ESLint** - TypeScript Linting

## 🌐 Internationalization

The application supports multiple languages:

- English (en)
- Vietnamese (vi)

Translation files are located in `src/i18n/locales/`.

## 🎯 Key Features Implementation

### Protected Routes

Routes under `(private)` folder require authentication.

### API Integration

All API calls are centralized in `src/services/`:

- `auth.service.ts` - Authentication endpoints
- `users.service.ts` - User management endpoints

### Error Handling

Centralized error handling in `src/lib/error-handler.ts`

### Theme Support

Light and Dark themes with system preference detection.

## 📝 Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Prettier Plugin for Tailwind CSS** for class sorting

Format your code before committing:

```bash
npm run format
npm run lint:fix
```
