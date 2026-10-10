# Architectural Remediation & Refactoring Plan

## Executive Summary

An architectural audit of the Algiers Premier 20 Gastronomic Applications Suite has revealed several critical flaws that prevent the system from being production-ready. While the applications successfully deploy, they suffer from severe security vulnerabilities (hardcoded credentials on the client), fundamental logic failures regarding state management (local storage for public data), and extreme code duplication (20 disconnected generated codebases). 

This document outlines the exact issues and provides a step-by-step, actionable roadmap to transition the suite to a secure, scalable, and maintainable architecture.

---

## 🔴 1. Critical Flaw: Hardcoded Client-Side Credentials

### The Issue
The administrative portal (`Admin.tsx`) is bundled into the client-side React application. The authentication logic uses hardcoded strings (e.g., `username === 'admin' && password === 'eldjenina2026!?'`). Because this is a Client-Side Rendered (CSR) app, these credentials are exposed in the JavaScript bundle downloaded by every public visitor, allowing anyone to bypass the login.

### The Fix
- **Immediate Action:** Remove the `Admin.tsx` route from the public Vite bundle entirely. 
- **Long-term Fix:** Authentication must be handled on the server. Implement a secure identity provider (e.g., Supabase Auth, Firebase, Auth0, or NextAuth) and issue secure HttpOnly session cookies or JWTs. 

---

## 🔴 2. Critical Flaw: Client-Side Data Persistence (`localStorage`)

### The Issue
The application relies on the browser's `localStorage` to save updates made in the admin portal (menu items, prices, hours). `localStorage` is scoped to the specific device and browser making the change. Therefore, changes made by a restaurant manager on their device will **never** propagate to customers viewing the live Vercel URL.

### The Fix
- Implement a centralized backend database (e.g., PostgreSQL, MongoDB).
- The frontend must fetch its data dynamically via an API request (e.g., `GET /api/restaurants/:slug`) rather than relying on static JSON files and `localStorage`.
- Admin updates must issue `POST`/`PUT` requests to the backend to update the centralized database.

---

## 🟡 3. High Risk: Code Generation vs. Shared Architecture

### The Issue
The suite uses a script (`generate_apps.js`) to stamp out 20 entirely disconnected React applications. There are no shared UI libraries or core logic. If a bug is found in a component (like `Hero.tsx`), developers must manually patch 20 separate codebases, or rerun the generator and wipe out any manual customisations.

### The Fix
Transition to one of the following modern architectural patterns:
1. **Multi-Tenant Architecture (Recommended):** Build a *single* Next.js application. Use dynamic routing (`/[slug]`) and middleware to fetch the correct restaurant data, branding colors, and menu from the database at runtime based on the requested domain or URL path.
2. **Monorepo (Alternative):** If standalone deployments are strictly required, migrate to a Monorepo tool like **Nx** or **Turborepo**. Extract the UI components into a shared `@restaurants/ui` package and business logic into `@restaurants/core`.

---

## 🚀 Implementation Roadmap (Step-by-Step Instructions)

### Phase 1: Security Triage (Immediate)
1. Delete the `Admin.tsx` component from all 20 applications.
2. Remove the `/#/admin` routing logic from `App.tsx` in all applications.
3. Remove the hardcoded Vercel deployment credentials from `scripts/deploy_all.js`.
4. Run `npm run build:all` and redeploy the suite to secure the public-facing apps.

### Phase 2: Database Layer & Data Migration (Week 1)
1. Set up a managed PostgreSQL database (e.g., Supabase, Neon, or Vercel Postgres).
2. Create two primary tables:
   - `restaurants` (id, slug, name, phone, address, branding_json, social_links)
   - `menu_items` (id, restaurant_id, category, name, description, price, is_available)
3. Write a one-time migration script to parse `restaurants_data.json` and insert all 20 restaurants into the new database.

### Phase 3: Multi-Tenant Frontend Refactor (Week 2-3)
1. Initialize a new Next.js App Router project: `npx create-next-app@latest algiers-multi-tenant`
2. Create a dynamic route: `app/[restaurantSlug]/page.tsx`.
3. In `page.tsx`, fetch the restaurant data from the database using the `restaurantSlug`.
4. Migrate the UI components (`Hero`, `MenuSection`, `HoursLocation`) from the old Vite apps into the Next.js `components/` directory.
5. Use inline styles or dynamically injected CSS variables (Tailwind arbitrary values) to apply the specific restaurant's `branding_json.color_palette` to the UI components.
6. Configure Vercel Edge Middleware to map custom domains (e.g., `restaurant-el-djenina.vercel.app`) to their respective dynamic routes internally.

### Phase 4: Centralized Admin Dashboard (Week 4)
1. Build a separate, dedicated admin portal (e.g., `admin.algiers-restaurants.com`) inside the Next.js app (under an `/admin` route protected by middleware).
2. Integrate an authentication provider (e.g., NextAuth.js or Supabase Auth).
3. Create Role-Based Access Control (RBAC) so that a logged-in user can only edit the `menu_items` and `restaurants` rows assigned to their specific `restaurant_id`.
4. Implement standard CRUD forms to update the database, instantly reflecting on the public-facing dynamic routes.
