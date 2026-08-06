# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build         # Production build
npm start             # Run production build
npm run lint           # next lint
npm run type-check    # tsc --noEmit (no test suite exists — this is the primary correctness check)
```

There is no test runner configured (no Jest/Vitest/Playwright, no `*.test.*` files). Rely on `type-check` and manual verification via `npm run dev`.

## Tech stack

Next.js 14 (App Router) + TypeScript (strict mode) + Tailwind CSS + Supabase (Postgres/Auth/RLS) + TanStack React Query v5 + React Hook Form + Zod.

Path aliases (see `tsconfig.json`): `@/*` → `src/*`, plus `@/app`, `@/components`, `@/hooks`, `@/lib`, `@/modules`, `@/services`, `@/types`.

## Architecture

Layered structure: `app/` (routes) → `modules/<domain>` (domain UI + local logic) → `services/` (Supabase data access) → `lib/supabase.ts` (client). `QueryProvider` (`src/components/QueryProvider.tsx`) wraps the whole app in `src/app/layout.tsx` and configures the single React Query client (1 min staleTime, 10 min gcTime).

Each domain module under `src/modules/<domain>/` follows (or is migrating toward) this shape:
- `components/` — module-specific UI
- `types.ts` — module-local types/interfaces
- `validators.ts` or `schemas.ts` — Zod schemas
- `index.ts` — the module's public exports (only import from a module via its `index.ts`, not deep paths, except where the code below notes an exception in progress)

Supabase access is centralized in `src/lib/supabase.ts` (throws at import time if `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing — any module touching Supabase requires `.env.local` to be populated, even for type-checking-adjacent work). Data access is meant to live in `src/services/*.service.ts` classes (static methods, one per domain), called from React Query hooks — never call `supabase` directly from components.

### Mid-refactor duplication (patients module)

The patients module is actively being migrated from a flat/tenant-scoped schema to a normalized one, and the two layers currently coexist. Know which is which before editing:

- **Old layer** (schema: `patients.tenant_id`, `patients.full_name` directly on the row): `src/types/index.ts`'s `Patient`/`Guardian`-adjacent shapes used by `src/modules/patients/types.ts`, `src/modules/patients/validators.ts`, `src/hooks/usePatients.ts`, `src/modules/patients/components/CreatePatientForm.tsx`.
- **New layer** (schema: `profiles` table holds `full_name`/`phone`; `patients` row has `profile_id`, `document_type_id` (numeric FK), `document_number`, no `tenant_id`; guardians linked via a `patient_guardians` join table with `is_primary`): `src/types/index.ts`'s `Patient`/`PatientEntity`/`Guardian`/`PatientGuardian` types (the canonical, current shapes — note this file mixes both eras), `src/modules/patients/schemas.ts`, `src/modules/patients/services/patients.service.ts` (thin wrapper delegating to `src/services/patient.service.ts`), `src/modules/patients/hooks/useCreatePatient.ts`, `src/modules/patients/components/PatientForm.tsx`, `src/app/dashboard/patients/create/page.tsx`.

`src/services/patient.service.ts` itself already implements the **new** normalized schema (profiles + patients + guardians + patient_guardians, no tenant scoping) — it is the source of truth for what the DB actually looks like today, and it disagrees with the SQL in `SETUP.md`/`README.md` (which still describe the old flat/tenant schema). When touching patients, follow `src/services/patient.service.ts` and the new-layer files above, not the older ones or the docs. The `document_type_id` string→number mapping (`cc`/`ti`/`ce`/`pasaporte` → `1`/`2`/`3`/`4`) is currently hardcoded in `src/modules/patients/hooks/useCreatePatient.ts`.

The appointments module (`src/modules/appointments/`, `src/services/appointment.service.ts`, `src/hooks/useAppointments.ts`) has not been migrated and still uses the old flat/tenant-scoped shape described in the README — treat it as a separate, currently-consistent pattern, not as a template for new patients work.

### Multi-tenancy

Multi-tenant design (`tenant_id` on tenant-scoped tables, RLS policies keyed on it) is documented in `README.md`/`ARCHITECTURE.md`/`SETUP.md` and still applies to `appointments`, `branches`, etc., but has been dropped from the patients tables in the new schema — don't assume `tenant_id` exists on `patients`/`profiles`/`guardians`.

### UI components

Reusable primitives live in `src/components/` (`Button`, `Input`, `Card`+`CardHeader`/`CardBody`/`CardFooter`, `LoadingAndStates` for spinner/error/success/empty states). Some Radix primitives (`@radix-ui/react-dialog`, `-dropdown-menu`, `-label`, `-select`) are dependencies but only some are wired into `src/components` — check there before reaching for Radix directly.

### Public marketing site vs. internal dashboard

The app now serves two distinct experiences from the same Next.js project:

- **Public marketing site** (Óptica Guillén's storefront): `src/app/(public)/` route group — `page.tsx` (home, `/`), `servicios/`, `nosotros/`, `contacto/`. Wrapped by `src/app/(public)/layout.tsx`, which renders `PublicHeader`/`PublicFooter` from `src/components/public/`. This is unauthenticated, has no Supabase dependency, and uses the `brand-*` Tailwind colors (teal/navy, defined in `tailwind.config.js`) rather than the shadcn-style `primary`/`secondary` tokens used by the dashboard. All business facts (name, phone/WhatsApp, address, hours, team, social links) live in `src/lib/brand.ts` — update content there, not by hardcoding strings in page files.
- **Internal dashboard** (patient/appointment management): everything under `src/app/dashboard/`, gated behind login. Login now lives at `/login` (`src/app/login/page.tsx`) rather than at `/`, since `/` is the public home page. `LoginForm` still redirects to `/dashboard` on success, so this didn't require touching auth logic.

Because `src/app/(public)/` is a route group, it contributes no path segment — `(public)/servicios/page.tsx` serves `/servicios`, not `/(public)/servicios`. Don't add a `src/app/page.tsx` — it would collide with `(public)/page.tsx` for the `/` route.

## Documentation in this repo

`README.md`, `SETUP.md` (includes the SQL schema — see caveat above), `ARCHITECTURE.md`, and `PROJECT_SUMMARY.md` describe the project's Phase 1 design and are largely accurate for architecture/patterns/roadmap, but their DB schema and patients-module code samples reflect the **old** layer described above, not current code — verify against actual source before relying on their code snippets.
