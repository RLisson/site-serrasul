# Serrasul Frontend Agent Notes

Use this workspace as a Next.js App Router app rooted in [frontend/app](app). Keep changes minimal, local, and consistent with the existing source files.

## Commands

Run app work from [frontend/package.json](package.json): `npm run dev`, `npm run build`, `npm run lint`, and `npm run start`. There is no test script in this workspace.

## Code Boundaries

Keep browser-only Firebase code in [app/lib/firebaseClient.ts](app/lib/firebaseClient.ts) and server-only Firebase Admin code in [app/lib/firebaseAdmin.ts](app/lib/firebaseAdmin.ts) and [app/lib/auth.ts](app/lib/auth.ts). The client API helper in [app/lib/api.ts](app/lib/api.ts) attaches Firebase ID tokens; server handlers should verify those tokens with Admin auth.

## App Structure

The main entry points are [app/layout.tsx](app/layout.tsx), [app/page.tsx](app/page.tsx), and [app/admin/page.tsx](app/admin/page.tsx). Shared helpers live under [app/lib](app/lib).

## Pitfalls

The files under [app/api/usuarios/api.ts](app/api/usuarios/api.ts) and [app/api/planos](app/api/planos) are regular modules, not App Router `route.ts` handlers, so do not assume they are exposed as routes.

Several handlers call `verifyToken(request)` from [app/lib/auth.ts](app/lib/auth.ts); await that call before relying on the decoded token so auth failures stay inside surrounding error handling.

## References

The workspace README is mostly stock Next.js output, so prefer the source files above for repo-specific behavior.
