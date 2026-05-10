# Productos Atelier Minimal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the `Productos` page as an Atelier minimal control desk with a master table and read-only detail panel.

**Architecture:** Keep backend unchanged for this first pass. Split the current large `productos/page.tsx` into a small page orchestrator, pure audit helpers, and focused UI components for controls, table, and product detail. The UI remains client-side and uses the existing product API wrappers.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS 4, existing shadcn/Radix UI components, lucide-react.

---

## Execution Notes

- Frontend worktree: `C:\Users\Tomas\Desktop\Software\crm-valkia\frontend\.worktrees\productos-atelier-minimal`
- Branch: `productos-atelier-minimal`
- Backend is intentionally out of scope for the first implementation.
- Baseline `npm run lint` fails before implementation because of an existing `no-explicit-any` error in `src/app/login/api/index.ts`.

## Tasks

- [ ] Create product audit helpers in `src/app/(dashboard)/productos/_lib/product-audit.ts`.
- [ ] Create `ProductControlBar` for search and filters.
- [ ] Create `ProductDetailPanel` for read-only desktop/mobile inspection.
- [ ] Create `ProductMasterTable` for the desktop table and mobile compact list.
- [ ] Replace the current expandable-row `Productos` page with master/detail orchestration.
- [ ] Run build and manual/visual verification.
