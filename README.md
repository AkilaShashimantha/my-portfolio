# Akila Shashimantha — Editorial Portfolio & Admin CMS

A production-grade, full-stack Personal Portfolio & Admin CMS engineered under the **Warm Swiss Editorial & Architectural Studio** design manifesto.

All public sections are 100% database-driven via Prisma ORM and manageable via a protected Admin CMS accessible exclusively to `akilashashimantha84@gmail.com`.

---

## 🏛️ Design System ("Warm Swiss Editorial")
- **Palette**:
  - Background Primary: Warm Alabaster Paper (`#F6F4F0`)
  - Background Secondary / Cards: Warm Stone (`#EFECE6`)
  - Structural Hairlines: Crisp Warm Grey (`#DCD8CF`, 1px solid)
  - Text Primary: Deep Archival Ink (`#161615`)
  - Text Muted: Warm Graphite (`#63605A`)
  - Primary Accent: Burnt Terracotta (`#C84B31`)
  - Secondary Accent: Deep Forest Olive (`#2A3B32`)
- **Typography**:
  - Headings: `Instrument Serif` (large, expressive, tight tracking)
  - Body / Controls: `Plus Jakarta Sans`
  - Technical / Index / Timestamps: `JetBrains Mono`

---

## 🔒 Security & Single-Admin Architecture
- **Admin Email**: `akilashashimantha84@gmail.com`
- **Auth.js (NextAuth v5)**:
  - Whitelist enforcement in `signIn` callback and `lib/auth-guard.ts` (`requireAdmin()`).
  - Edge middleware (`middleware.ts`) guarding `/admin/:path*` and `/api/admin/:path*`.
  - Development Credentials fallback strictly gated by `ADMIN_EMAIL === "akilashashimantha84@gmail.com"` and `ADMIN_SECRET_PASSWORD`.

---

## 🗄️ Database Architecture (Prisma ORM)
- `SiteProfile`: Singleton bio, headline, avatar, resume, and availability status.
- `SocialLink`: Reorderable social directory with handles and visibility toggle.
- `Photo`: Spatial visual log with aspect ratios (Portrait, Landscape, Square) and lightbox viewer.
- `Project`: Architectural case studies with tech stack tags, live links, and repository links.
- `WorkExperience`: Career ledger with company, timeline, and dynamic bullet highlights.
- `Certificate`: Verified credentials with badge previews and verification URLs.
- `ContactSubmission`: Inbox submissions with honeypot spam protection and status filters.

---

## 🚀 Getting Started

### 1. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Prisma Database
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the portfolio and [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS.

### 4. Running Verification Tests
```bash
npx tsx test/portfolio.test.ts
```

### 5. Production Build
```bash
npm run build
npm run start
```
