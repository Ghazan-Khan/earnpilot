# EarnPilot – AI Income Booster

A viral, single-page AI tool that analyzes a user's income situation and generates a bold "Income Upgrade Plan" in under 60 seconds.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/earnpilot run dev` — run the frontend (port assigned by workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY` — auto-set by Replit AI Integrations

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, html-to-image, sonner
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- AI: OpenAI via Replit AI Integrations (no user API key needed)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- OpenAPI spec: `lib/api-spec/openapi.yaml`
- Frontend: `artifacts/earnpilot/src/`
  - Main page: `src/pages/Home.tsx`
  - Components: `src/components/` (Hero, InputForm, Loader, ResultCard, ShareCard, CircularScore)
- Backend income route: `artifacts/api-server/src/routes/income.ts`
- AI client: `lib/integrations-openai-ai-server/`

## Architecture decisions

- OpenAPI-first: spec in `lib/api-spec/openapi.yaml` drives codegen for both React Query hooks and Zod validators
- AI via Replit AI Integrations proxy — no user API key required, billed to Replit credits
- LocalStorage persistence: results saved to `earnpilot_result` key for instant reload
- Single-page layout: hero → form → loader → results, all on one scroll-driven page
- Share image uses html-to-image to render a DOM element to PNG client-side

## Product

- Users enter monthly income, main skill, and time available per day
- AI (gpt-5.2) returns a structured Income Upgrade Plan: under-earning gap, score, biggest mistake, 3 opportunities, 7-day plan, potential increase
- Results displayed with dramatic animations (count-up numbers, staggered cards, circular score ring)
- Viral share features: copy-to-clipboard text + downloadable PNG share card

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After OpenAPI spec changes, always re-run `pnpm --filter @workspace/api-spec run codegen` before using updated types
- `pnpm run typecheck:libs` may show errors in `lib/integrations-openai-ai-react` (missing react peer dep) — these don't affect runtime
- html-to-image must be in earnpilot's devDependencies (not a workspace catalog package)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
