# Next.js 16 Fullstack Boilerplate

A production-ready fullstack boilerplate built with **Next.js 16**, **Better Auth**, **Neon (PostgreSQL)**, **Stripe**, and **shadcn/ui** — organized with Domain-Driven Design (DDD).

## ✨ Features

- **Next.js 16** — App Router, React Compiler, Turbopack
- **Better Auth** — Modular, type-safe authentication with database sessions
- **Neon DB** — Serverless PostgreSQL database
- **Drizzle ORM** — Type-safe ORM for PostgreSQL
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
│   │   ├── repositories/      # Drizzle data access
│   │   ├── services/          # Business logic
│   │   └── hooks/             # TanStack Query hooks
│   ├── settings/              # Settings domain
│   └── payments/              # Stripe payments domain
├── shared/                    # Cross-cutting concerns
│   ├── auth/                  # Better Auth Client, DAL + RBAC utilities
│   ├── components/            # Shared UI components
│   ├── hooks/                 # Shared hooks (debounce, etc.)
│   ├── lib/                   # Client libraries
│   │   └── stripe/            # Server + client Stripe
│   └── types/                 # Global type definitions
└── lib/                       # Core library config
    ├── db/                    # Drizzle DB & Schema
    └── auth.ts                # Better Auth Server config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22 LTS (Required by Better Auth)
- Neon Database project ([neon.tech](https://neon.tech))
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
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000

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

3. **Push database schema:**

```bash
npx drizzle-kit push
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

### Auth Pattern

- **Data Access Layer (`dal.ts`)** — `getSession()` and `requireAuthWithRole()` for server-side auth checks using Better Auth.
- **RBAC (`rbac.ts`)** — Role hierarchy validation.

To protect a server component:

```tsx
import { getSession, requireAuthWithRole } from "@/shared/auth/dal";

// Any authenticated user
const session = await getSession();

// Admin only
await requireAuthWithRole("admin");
```

## 📦 DDD: Adding a New Domain

1. Create the domain folder:

```
src/domains/your-domain/
├── entities/        # Types (camelCase) + Zod schemas
├── repositories/    # Drizzle data access
├── services/        # Business logic + validation
└── hooks/           # TanStack Query hooks
```

2. Create API routes in `src/app/api/your-domain/`
3. Create pages in `src/app/(protected)/your-domain/`
4. Update Drizzle schema in `src/lib/db/schema.ts` and run `npx drizzle-kit push`

## 💳 Stripe Integration

### One-time Payments

The boilerplate includes a complete Stripe Checkout flow:

1. **Checkout API** (`/api/payments/checkout`) — Creates a Stripe session
2. **Webhook** (`/api/payments/webhook`) — Handles `checkout.session.completed`
3. **Order tracking** — Persisted in Neon with status updates
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
| Better Auth | Modular, type-safe authentication |
| Neon DB | Serverless PostgreSQL database |
| Drizzle ORM | Type-safe Database ORM |
| TanStack Query | Server state management |
| shadcn/ui | UI component library |
| Stripe | Payment processing |
| Zod | Schema validation |
| Tailwind CSS | Styling |

## 📄 License

MIT
