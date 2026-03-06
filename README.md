# Next.js 16 Fullstack Boilerplate

A production-ready fullstack boilerplate built with **Next.js 16**, **Supabase**, **Stripe**, and **shadcn/ui** — organized with Domain-Driven Design (DDD).

## ✨ Features

- **Next.js 16** — App Router, React Compiler, Turbopack, `proxy.ts`
- **Supabase** — Auth (email/password, OAuth), PostgreSQL database with RLS
- **Role-Based Access Control** — Admin / Manager / User with role hierarchy
- **TanStack Query** — Server state management with caching
- **shadcn/ui** — Beautiful, accessible UI components
- **Stripe** — One-time payment checkout with webhooks
- **Resend** — Transactional email service
- **PostHog** — Product analytics & session recording
- **Sentry** — Error tracking & performance monitoring
- **Rate Limiting** — Upstash Redis/Ratelimit for API protection
- **SEO** — Dynamic sitemap, robots.txt, and OpenGraph image generation
- **React Hook Form** — Robust form handling with Zod resolvers
- **Debounce Search** — Reusable search input with custom hook
- **Domain-Driven Design** — Clean architecture with bounded contexts
- **TypeScript** — Full type safety throughout
- **Zod** — Schema validation for API inputs

## 📁 Project Structure

```
src/
├── app/                       # Next.js App Router
│   ├── (public)/              # Auth pages (login, register)
│   ├── (protected)/           # Authenticated pages
│   │   ├── dashboard/
│   │   ├── posts/             # CRUD with search
│   │   ├── orders/            # Order history + checkout
│   │   ├── settings/          # User preferences
│   │   └── admin/             # Admin-only pages
│   └── api/                   # API route handlers
├── domains/                   # DDD bounded contexts
│   ├── posts/                 # Post management domain
│   │   ├── entities/          # Types + Zod schemas
│   │   ├── repositories/      # Data access
│   │   ├── services/          # Business logic
│   │   └── hooks/             # TanStack Query hooks
│   ├── settings/              # Settings domain
│   └── payments/              # Stripe payments domain
├── shared/                    # Cross-cutting concerns
│   ├── auth/                  # DAL + RBAC utilities
│   ├── components/            # Shared UI components
│   ├── hooks/                 # Shared hooks (debounce, etc.)
│   ├── lib/                   # Client libraries
│   │   ├── supabase/          # Browser, server, proxy clients
│   │   └── stripe/            # Server + client Stripe
│   └── types/                 # Global type definitions
└── proxy.ts                   # Next.js 16 proxy (replaces middleware)

supabase/
└── migrations/                # SQL migrations with RLS policies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase project ([supabase.com](https://supabase.com))
- Stripe account ([stripe.com](https://stripe.com)) — for payments

### Setup

1. **Clone and install:**

```bash
git clone <your-repo-url>
cd boilerplate
npm install
```

2. **Configure environment variables:**

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (Email)
RESEND_API_KEY=re_123...

# Upstash (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# PostHog (Analytics)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Sentry (Error Tracking)
SENTRY_AUTH_TOKEN=sntry_...
NEXT_PUBLIC_SENTRY_DSN=https://...
```

3. **Run database migrations:**

Apply the SQL files in `supabase/migrations/` in order via the Supabase SQL Editor or CLI:

```bash
supabase db push
```

4. **Start development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🔐 Authentication & RBAC

### Roles

| Role | Access Level |
|---------|----------------------------------------------|
| `admin` | Full access, manage users, payments dashboard |
| `manager` | Manage all posts, limited admin features |
| `user` | Own content, personal settings, orders |

### Next.js 16 Auth Pattern

- **`proxy.ts`** — Session refresh + route redirects only (no auth logic)
- **Data Access Layer (`dal.ts`)** — `requireAuth()` and `requireAuthWithRole()` for server-side auth checks
- **RBAC (`rbac.ts`)** — Role hierarchy validation

To protect a server component:

```tsx
import { requireAuth, requireAuthWithRole } from "@/shared/auth/dal";

// Any authenticated user
const session = await requireAuth();

// Admin only
const { session, profile } = await requireAuthWithRole("admin");
```

## 📦 DDD: Adding a New Domain

1. Create the domain folder:

```
src/domains/your-domain/
├── entities/        # Types + Zod schemas
├── repositories/    # Supabase data access
├── services/        # Business logic + validation
└── hooks/           # TanStack Query hooks
```

2. Create API routes in `src/app/api/your-domain/`
3. Create pages in `src/app/(protected)/your-domain/`
4. Add SQL migration in `supabase/migrations/`

## 💳 Stripe Integration

### One-time Payments

The boilerplate includes a complete Stripe Checkout flow:

1. **Checkout API** (`/api/payments/checkout`) — Creates a Stripe session
2. **Webhook** (`/api/payments/webhook`) — Handles `checkout.session.completed`
3. **Order tracking** — Persisted in Supabase with status updates
4. **Admin dashboard** — Revenue stats + order history at `/admin/payments`

### Stripe Setup

```bash
# Install Stripe CLI for local webhook testing
stripe listen --forward-to localhost:3000/api/payments/webhook
```

## 🛠️ Tech Stack

| Technology | Purpose |
|---------------------|--------------------------------------|
| Next.js 16 | Framework (App Router, Turbopack) |
| React 19.2 | UI library |
| TypeScript | Type safety |
| Supabase | Auth + PostgreSQL database |
| TanStack Query | Server state management |
| shadcn/ui | UI component library |
| Stripe | Payment processing |
| Zod | Schema validation |
| Tailwind CSS | Styling |

## 📄 License

MIT
