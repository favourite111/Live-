# LiveClass - Online Learning Platform

## Overview

LiveClass is a real-time online learning platform that connects teachers and students through scheduled live classes. The application enables teachers to create and manage virtual classes with meeting links, while students can browse and join scheduled sessions. Features include user authentication with email OTP verification, role-based access control (student/teacher/admin), and an admin dashboard for user management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Animations**: Framer Motion for page transitions and UI effects
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with typed schemas
- **Session Management**: Express-session with PostgreSQL session store (connect-pg-simple)
- **Authentication**: Passport.js with local strategy, password hashing using scrypt

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Managed via `drizzle-kit push` command

### Key Design Decisions

1. **Monorepo Structure**: Client, server, and shared code in one repository
   - `client/` - React frontend application
   - `server/` - Express backend
   - `shared/` - Shared types, schemas, and route definitions

2. **Type-Safe API Layer**: Routes defined with Zod schemas in `shared/routes.ts` provide end-to-end type safety between frontend and backend

3. **Session-Based Authentication**: Uses server-side sessions stored in PostgreSQL rather than JWT tokens, providing better security for session invalidation

4. **OTP Email Verification**: New users must verify their email via one-time password sent through nodemailer with Gmail

5. **Build System**: Custom build script using esbuild for server bundling and Vite for client, with selective dependency bundling to optimize cold start times

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Session Store**: `connect-pg-simple` for persistent session storage

### Email Service
- **Nodemailer with Gmail**: For sending OTP verification emails
- **Environment Variables**: `EMAIL_USER` and `EMAIL_PASS` (Gmail App Password)

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret for session encryption (optional, has default)
- `EMAIL_USER` - Gmail address for sending emails
- `EMAIL_PASS` - Gmail App Password for authentication

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit` - Database ORM and migrations
- `passport` / `passport-local` - Authentication
- `express-session` - Session management
- `@tanstack/react-query` - Data fetching and caching
- `zod` - Schema validation
- `date-fns` - Date formatting for class schedules