# CodeSub - Professional Web Development Services

A modern, responsive website for CodeSub, a web development agency specializing in high-performance websites for small to medium businesses. Built with SvelteKit, TailwindCSS, and modern development practices.

## 🚀 Features

- **Modern Tech Stack**: SvelteKit + TypeScript + TailwindCSS
- **Responsive Design**: Mobile-first approach with beautiful UI/UX
- **Service Showcase**: Detailed pages for Services, About, and Process
- **Tiered Pricing**: Three subscription tiers (Essential, Professional, Premium Care)
- **User Authentication**: Secure login/register system with Argon2 password hashing
- **Database Integration**: PostgreSQL with Drizzle ORM
- **Performance Optimized**: Fast loading times and SEO-friendly structure
- **Developer Experience**: ESLint, Prettier, TypeScript, and hot reload

## 🛠 Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with TypeScript
- **Styling**: [TailwindCSS](https://tailwindcss.com/) with custom utilities
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: Custom implementation with Argon2 password hashing
- **Icons**: Lucide Svelte (with custom fallbacks)
- **Development**: Vite, ESLint, Prettier, Playwright for E2E testing
- **Deployment**: Static adapter for fast, secure hosting

## 📋 Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Git

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd code-sub
npm install
# or
bun install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://root:mysecretpassword@localhost:5432/local"
```

### 3. Database Setup

Start the PostgreSQL database with Docker:

```bash
npm run db:start
```

Push the database schema:

```bash
npm run db:push
```

### 4. Development Server

```bash
npm run dev
# or
npm run dev -- --open
```

Visit `http://localhost:5173` to see the application.

## 📁 Project Structure

```
src/
├── routes/                    # SvelteKit file-based routing
│   ├── services/             # Services page
│   ├── about/                # About page
│   ├── process/              # Process timeline page
│   ├── pricing/              # Pricing tiers page
│   ├── contact/              # Contact form
│   ├── login/                # Authentication
│   └── register/             # User registration
├── lib/
│   ├── components/           # Reusable Svelte components
│   │   ├── ServiceCard.svelte    # Service tier display
│   │   ├── ProcessStep.svelte    # Process timeline steps
│   │   ├── Header.svelte         # Navigation header
│   │   └── Footer.svelte         # Site footer
│   ├── server/               # Server-side code
│   │   ├── auth.ts              # Authentication logic
│   │   └── db/                  # Database schema & config
│   └── pocketbase.ts         # Client state management
└── static/                   # Static assets
```

## 🎨 Key Pages

### Services Page (`/services`)
- **One-Time Projects**: Three tiers from $800-$5,000+
- **Recurring Services**: Essential ($49), Professional ($99), Premium Care ($199)
- Centralized call-to-action for better conversion

### About Page (`/about`)
- Company mission and values
- Team introduction with friendly, innovative tone
- Focus on community impact and opportunity creation

### Process Page (`/process`)
- 5-step visual timeline with icons
- Discovery → Strategy → Development → Launch → Support
- Clear expectations for client engagement

### Pricing Page (`/pricing`)
- Detailed feature comparison table
- Three care tiers with transparent pricing
- FAQ section addressing common concerns

## 💾 Database Commands

```bash
# Start PostgreSQL with Docker
npm run db:start

# Push schema changes to database
npm run db:push

# Generate migrations
npm run db:migrate

# Open database studio
npm run db:studio
```

## 🧪 Development Workflow

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run check
npm run check:watch

# Linting and formatting
npm run lint
npm run format

# End-to-end testing
npm run test:e2e

# Build for production
npm run build
npm run preview
```

## 🚀 Deployment

The project uses SvelteKit's static adapter for optimal performance:

```bash
npm run build
```

The built application will be in the `build/` directory, ready for deployment to any static hosting service (Netlify, Vercel, Cloudflare Pages, etc.).

## 🎯 Business Model

CodeSub offers:

1. **One-Time Website Projects**
   - Essential Online Presence ($800-$1,500)
   - Enhanced Marketing Hub ($1,500-$2,500)
   - Premium Digital Showcase ($2,500-$5,000+)

2. **Ongoing Care Subscriptions**
   - Essential Care ($49/month): Hosting, security, backups
   - Professional Care ($99/month): + Content updates, SEO, analytics
   - Premium Care ($199/month): + Advanced optimization, priority support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is proprietary software for CodeSub. All rights reserved.

## 🆘 Support

For technical support or questions about the codebase:
- Open an issue in the repository
- Contact the development team

---

Built with ❤️ by the CodeSub team
