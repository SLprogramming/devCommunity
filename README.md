# DevCommunity

A modern developer community platform built with **Next.js 16**, **React 19**, **TypeScript**, and **Prisma ORM**. Features real-time interactions, comprehensive authentication, and a polished developer experience.

---

## 🚀 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | Next.js 16.2 (App Router), React 19, TypeScript |
| **Database** | PostgreSQL (Neon), Prisma ORM |
| **Authentication** | Better-auth (email/password, Google OAuth, email OTP) |
| **Styling** | Tailwind CSS v4, shadcn/ui (Radix UI), hugeicons |
| **State Management** | Zustand (client), Next.js Cache + Server Actions (server) |
| **File Storage** | Vercel Blob |
| **Email** | Resend |
| **Tooling** | ESLint, React Compiler, pnpm |

---

## ✨ Features

### 🔐 Authentication
- **Email/Password** with mandatory email verification
- **Google OAuth** (one-click sign-in)
- **Email OTP** for password reset & sign-in
- **Session management** with secure HTTP-only cookies
- **Protected routes** & middleware

### 📝 Posts & Content
- **Rich post creation**: caption, Markdown content, images (≤2MB), hashtags
- **Image upload** to Vercel Blob with automatic cleanup on delete
- **Publish/Unpublish** toggle for drafts
- **Reactions**: Like, Love, Laugh, Dislike (toggleable)
- **Threaded comments** with replies
- **Share tracking** & **view counting** (deduplicated per device/24h)
- **Hashtag system** with auto-creation & discovery

### 👤 Profiles
- **Customizable profiles**: bio, avatar, banner, job title, location, GitHub link
- **Tech stack tags** (multi-select with autocomplete)
- **Tabbed navigation**: Posts, Reactions, Comments, Drafts
- **Follow/Unfollow** with real-time count updates
- **Network page**: Followers & Following lists with follow status

### 🔍 Search
- **Global search** across posts, users, and hashtags
- **Quick search** dropdown in navbar (debounced)
- **Dedicated search page** with tabbed results
- **Hashtag pages** (`/tag/:name`) with aggregated posts

### 🎨 UI/UX
- **Dark/Light mode** (system-aware, persisted)
- **Responsive layout**: collapsible sidebar, mobile sheet navigation
- **Loading skeletons** & optimistic UI updates
- **Toast notifications** (Sonner) for all actions
- **Top loader** (Next.js Toploader) for navigation feedback

---

## 📁 Project Structure

```
devCommunity/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (login, signup, etc.)
│   ├── (primaryLayout)/          # Main app layout with sidebar
│   │   ├── page.tsx              # Feed (home)
│   │   ├── post/                 # Post routes
│   │   ├── profile/              # Profile routes
│   │   ├── search/               # Search page
│   │   └── tag/                  # Hashtag pages
│   ├── api/auth/                 # Better-auth API routes
│   ├── generated/prisma/         # Generated Prisma Client
│   ├── globals.css               # Tailwind v4 + CSS variables
│   └── layout.tsx                # Root layout (providers, fonts)
├── components/
│   ├── ui/                       # shadcn/ui components (Button, Avatar, etc.)
│   └── theme/                    # ThemeProvider, ThemeToggle, TopLoader
├── feature/                      # Feature-based modules (colocated)
│   ├── auth/                     # Auth actions, queries, components
│   ├── post/                     # Post actions, queries, store, components
│   ├── profile/                  # Profile actions, queries, components
│   ├── follow/                   # Follow actions, queries, components
│   └── search/                   # Search actions, queries
├── hooks/                        # Custom React hooks
├── lib/                          # Shared utilities & configs
│   ├── auth.ts                   # Better-auth server config
│   ├── auth-client.ts            # Better-auth client config
│   ├── prisma.ts                 # Prisma Client (Neon adapter)
│   ├── email.ts                  # Resend email helper
│   └── utils.ts                  # cn(), formatters, etc.
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Migration history
├── public/                       # Static assets
├── .env                          # Environment variables
├── next.config.ts                # Next.js config
├── components.json               # shadcn/ui config
├── tsconfig.json                 # TypeScript config
└── package.json
```

---

## 🛠 Getting Started

### Prerequisites
- **Node.js 20+**
- **pnpm** (recommended) or npm/yarn
- **Neon PostgreSQL** database (or any Postgres)
- **Resend** account (for emails)
- **Google Cloud** project (for OAuth)
- **Vercel Blob** (for image storage)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd devCommunity

# Install dependencies
pnpm install

# Generate Prisma Client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host/db?sslmode=require"

# Better-auth
BETTER_AUTH_SECRET="your-32-char-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Resend (Email)
RESEND_API_KEY="re_xxxxxxxxxxxx"

# Vercel Blob (auto-configured on Vercel, or set locally)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token"
```

> **Generate `BETTER_AUTH_SECRET`**: `openssl rand -hex 32`

---

## 📦 Available Scripts

```bash
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm prisma generate    # Generate Prisma Client
pnpm prisma migrate dev # Run migrations in dev
pnpm prisma studio      # Open Prisma Studio
```

---

## 🗄 Database Schema Overview

| Model | Description |
|-------|-------------|
| **User** | Core auth user (email, name, role, image) |
| **Profile** | Extended profile (bio, banner, tech stack, links) |
| **Post** | Content (caption, content, image, hashtags, published) |
| **Comment** | Threaded comments (parent/child replies) |
| **Reaction** | Post reactions (LIKE, LOVE, LAUGH, DISLIKE) |
| **Share** | Post shares tracking |
| **Follow** | Many-to-many self-referential (follower/following) |
| **Hashtag/Tag** | Content tagging & tech stack |
| **Session/Account/Verification** | Better-auth internals |

---

## 🔑 Key Implementation Details

### Server Actions & Cache Invalidation
All mutations use **Next.js Server Actions** with **cache tags** for granular revalidation:

```typescript
// Example: Creating a post invalidates relevant caches
revalidatePath("/");
updateTag("posts");
updateTag(`user-posts-${authorId}`);
```

### Authentication Flow
- **Server**: `lib/auth.ts` configures Better-auth with Prisma adapter
- **Client**: `lib/auth-client.ts` provides typed hooks (`useSession`, `signIn`, etc.)
- **Middleware**: Protects routes via cookie-based session validation

### Image Handling
- Uploads via **Vercel Blob** (`@vercel/blob`)
- Max 2MB, auto-named with timestamp
- Deleted from Blob when post is deleted

### Search Architecture
- **Quick search** (navbar): Parallel queries for posts/users/tags (4/3/4 results)
- **Full search** (`/search`): Paginated, tabbed results with highlighting
- **Hashtag pages**: Server-rendered with cached post aggregation

---

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Add environment variables
4. Deploy — Vercel auto-detects Next.js config

### Manual (Docker/Node)
```bash
pnpm build
pnpm start
```

> Ensure `BETTER_AUTH_URL` matches your production domain.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use for personal or commercial projects.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) — The React Framework
- [Better-auth](https://better-auth.com/) — Modern authentication
- [Prisma](https://prisma.io/) — Next-gen ORM
- [shadcn/ui](https://ui.shadcn.com/) — Beautiful accessible components
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Neon](https://neon.tech/) — Serverless Postgres
- [Vercel](https://vercel.com/) — Deployment & Blob storage
- [Resend](https://resend.com/) — Transactional emails