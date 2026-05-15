# Veasyble Demo

Veasyble Demo is a clickable product prototype for coordinating retail visibility work between field executors and the Veasyble operations team. It demonstrates how applicants become trained executors, how tasks are accepted and completed, and how Ops monitors campaign health, submissions, escalations, and executor quality.

## Problem

Retail visibility campaigns are operationally messy: brands need in-store execution across many locations, executors need clear instructions and contact points, and Ops teams need to know which campaigns are filling, which tasks are late, and which submissions need review.

The main product problems this demo addresses are:

- Executors need a simple mobile-first workflow for training, task discovery, task execution, PoP submission, and task history.
- New executors should not access live task work before completing Veasyble Academy and passing the quiz requirement.
- Ops teams need a dashboard that organizes metrics by lifecycle phase instead of isolated numbers.
- Declined, cancelled, submitted, approved, rejected, and completed task states need to be visible in the right places without confusing active task lists.
- Deployment must stay connected to GitHub so Cloudflare can build and publish the latest version.

## Purpose

This repository is a front-end demo, not a production back end. It is meant to help stakeholders review the product experience, validate operational flows, and iterate quickly on UI and business logic.

The demo uses mocked data and browser `localStorage` for state such as accepted tasks, declined tasks, academy progress, started tasks, and task history.

## Tech Stack

- React 19
- TypeScript
- Vite
- TanStack Router / TanStack Start
- Tailwind CSS
- Radix UI primitives
- Lucide React icons
- Cloudflare Worker deployment via `wrangler.jsonc`

## Project Structure

```text
src/
  components/             Shared layout and UI components
  lib/
    academy-data.ts       Academy modules, quiz questions, and progress helpers
    auth.tsx              Demo authentication context
    format.ts             Display formatting helpers
    mock-data.ts          Demo executor, ops, task, campaign, and escalation data
    task-state.ts         Local task state: accepted, declined, cancelled, submitted, history
  routes/
    __root.tsx            Root app shell
    index.tsx             Entry redirect/landing route
    login.tsx             Portal selection and login form
    executor.*.tsx        Execution Team routes
    ops.*.tsx             Veasyble Ops routes
  routeTree.gen.ts        Generated TanStack route tree
wrangler.jsonc            Cloudflare Worker config
package.json              Scripts and dependencies
```

## Main Roles

### Execution Team

The Execution Team portal is the executor-facing experience. It is designed as a mobile app style flow where an executor can complete Academy, browse available tasks, accept work, execute tasks, submit Proof of Placement, and review profile history.

### Veasyble Ops

The Veasyble Ops portal is the internal operations dashboard. It is designed for monitoring onboarding, dispatch, execution, quality, campaign coverage, escalations, executor network health, and submitted task proof.

## Route Map

### Shared

- `/` - app entry route
- `/login` - portal selection and demo login

### Execution Team

- `/executor/academy` - Academy module overview
- `/executor/academy/module/:id/video` - module learning content
- `/executor/academy/module/:id/quiz` - module quiz
- `/executor/academy/module/:id/results` - quiz result
- `/executor/academy/complete` - Academy completion screen
- `/executor/home` - executor home and task tabs
- `/executor/tasks` - task browsing surface
- `/executor/task/:id` - task detail wrapper
- `/executor/task/:id/` - task detail screen
- `/executor/task/:id/pickup` - print/material pickup step
- `/executor/task/:id/pre-execute` - pre-execution step
- `/executor/task/:id/onsite` - on-site checklist and PoP flow
- `/executor/task/:id/submitted` - submitted/review state
- `/executor/profile` - profile shell
- `/executor/profile/` - profile overview, history, declined tasks
- `/executor/profile/setup` - executor profile setup
- `/executor/in-review` - account/application review state
- `/executor/knowledge` - knowledge resources

### Veasyble Ops

- `/ops/dashboard` - phase-based operations dashboard
- `/ops/campaigns` - campaign monitor
- `/ops/execution` - Submissions Check
- `/ops/escalations` - escalation queue
- `/ops/executors` - executor network shell
- `/ops/executors/` - executor network list
- `/ops/executors/:id` - executor detail
- `/ops/queue` - application queue shell
- `/ops/queue/` - application queue list
- `/ops/queue/application/:id` - application detail

Note: `/ops/submissions` may still exist as a route file, but it is intentionally removed from the visible Ops sidebar navigation. Current navigation points Ops review work to `/ops/execution`, labeled `Submissions Check`.

## Core Flows

### 1. Login and Portal Selection

1. User opens `/login`.
2. User chooses one of two portal options:
   - `Execution Team`
   - `Veasyble Ops`
3. User enters demo credentials.
4. Execution Team users are routed based on Academy completion.
5. Ops users are routed to `/ops/dashboard`.

Demo behavior:

- The login form may expose a demo checkbox for new-account testing.
- A new account that has not completed Academy should route to `/executor/academy`.
- A returning account that has completed Academy should route to `/executor/home`.

### 2. Academy Gating Flow

1. New executor logs in.
2. If Academy is incomplete, executor is redirected to `/executor/academy`.
3. Executor views each Academy module.
4. Executor completes each quiz.
5. Passing requires at least 70%.
6. After Academy completion, executor can access task work.

Protected executor work areas:

- `/executor/home`
- `/executor/tasks`
- `/executor/task/:id`
- Task execution sub-routes

These should remain inaccessible until Academy is fully completed and quiz requirements are passed.

### 3. Executor Home Flow

1. Executor lands on `/executor/home` after completing Academy.
2. Stats are shown at the top:
   - Tasks completed
   - Rating
   - Earnings
3. Home includes task surfaces for committed and available work.
4. The bottom navigation stays available:
   - Home
   - Tasks
   - Profile

Expected task organization:

- `My Tasks` shows tasks already accepted by the executor.
- `Browse Tasks` shows available tasks the executor can choose to add.
- Accepted tasks should not show Accept/Decline buttons.
- Declined tasks should not appear in Browse Tasks or My Tasks.
- Completed tasks should move out of My Tasks and into Profile History.

### 4. Browse Tasks Flow

1. Executor opens Browse Tasks.
2. Filter bar supports:
   - Time: Today, This Week, This Month, or date range
   - Location: district/city
   - Brand: brand name
3. Each available task card shows campaign, brand, store/district, date/time, pay, and action button.
4. Executor taps `View & Accept` to review task details.
5. Tasks outside executor availability remain visible with an orange `Outside Your Availability` badge.
6. Tasks previously declined are hidden.

### 5. Task Detail Flow

1. Executor opens `/executor/task/:id`.
2. Task detail shows campaign, store, timing, pay, print station, and execution requirements.
3. Contact Points section provides:
   - Brand Contact: Nguyen Thi Lan, Trade Marketing Manager, Pepsi Vietnam, 0901 234 567, Zalo link button
   - Retailer Contact: Tran Van Hung, Store Manager, FamilyMart Nguyen Trai, 0912 345 678, Zalo link button
4. Executor can start the execution flow or decline/cancel the task depending on task state.

### 6. Decline / Hide Task Flow

1. Executor taps `Decline` on an available task.
2. Confirmation modal appears: `An task nay? Task se duoc chuyen vao muc Da tu choi.`
3. On confirm, the task is removed from Browse Tasks.
4. The task is added to the Profile `Da tu choi` list.
5. The task should never appear in Browse Tasks or My Tasks again unless manually restored.
6. Profile allows `Unhide` for declined tasks.
7. If the task has not expired, Unhide returns it to Browse Tasks.

Implementation note: declined task ids are stored in `localStorage` by `src/lib/task-state.ts`.

### 7. Task Execution Flow

1. Executor starts an accepted task.
2. Executor confirms pickup/materials when required.
3. Executor completes pre-execution checks.
4. Executor checks in on-site.
5. Executor follows SOP checklist.
6. Executor captures and submits Proof of Placement.
7. Submitted task moves to review state.
8. Once approved, task becomes completed and moves to Profile History.

Task execution routes:

- `/executor/task/:id/pickup`
- `/executor/task/:id/pre-execute`
- `/executor/task/:id/onsite`
- `/executor/task/:id/submitted`

### 8. Completion and History Flow

1. PoP is submitted.
2. Ops review approves, rejects, or requests revision.
3. Approved task is marked completed.
4. Completed task is removed from My Tasks.
5. Completed task appears in Profile History in reverse chronological order.

Profile History entries should show:

- Campaign name
- Brand
- Store
- Date completed
- Pay received
- Rating received
- Status badge: Completed, Rejected, or Cancelled

Implementation note: task history is stored through `getTaskHistory`, `submitTask`, `approveTask`, `rejectTask`, and `cancelTask` in `src/lib/task-state.ts`.

### 9. Ops Dashboard Flow

1. Ops user logs in and lands on `/ops/dashboard`.
2. Metrics are grouped by operational phase:
   - Onboard Phase
   - Dispatch Phase
   - Execution Phase
   - Quality Phase
3. Alert colors are driven by configurable thresholds.
4. Ops Lead can open Threshold Settings from the dashboard.
5. Threshold changes update dashboard alert states in real time.

Threshold examples:

- Pending Applications alert when greater than 5
- Campaign fill rate warning when below 80%
- Late check-in alert when greater than 3 today
- PoP pass rate warning when below 85%
- Executor warning zone below 3.9
- Executor at risk below 3.5
- Executor suspended below 3.0

### 10. Campaign Monitor Flow

1. Ops opens `/ops/campaigns`.
2. Campaigns show fill status, assigned count, total slots, and risk indicators.
3. Ops can inspect campaign details.
4. Reassign buttons are intentionally removed.
5. Urgent campaigns can still expose surge-related controls where applicable.

### 11. Submissions Check Flow

1. Ops opens `/ops/execution` from sidebar label `Submissions Check`.
2. Ops reviews active task execution and submitted work.
3. Active tasks are classified by timing state such as on-time, overdue, or critical.
4. Submitted PoP can be reviewed using the review modal.
5. Review actions update task history state.

### 12. Escalation Flow

1. Ops opens `/ops/escalations`.
2. Escalations are grouped by phase and severity.
3. Ops can monitor open, in-progress, and resolved issues.
4. Demo escalations come from `src/lib/mock-data.ts`.

### 13. Executor Network Flow

1. Ops opens `/ops/executors`.
2. Ops reviews executor list, rating, status, and network quality.
3. Ops can open `/ops/executors/:id` for executor detail.
4. Rating thresholds inform warning, at-risk, and suspended states.

## Demo State and Persistence

This demo does not use a database. It uses browser `localStorage` keys, including:

- `veasyble_academy_progress`
- `veasyble_declined_task_ids`
- `veasyble_accepted_task_ids`
- `veasyble_task_history`
- `veasyble_cancelled_task_ids`
- `veasyble_print_pickup_confirmed`
- `veasyble_started_tasks`

To reset the demo, clear site data in the browser or remove these keys from localStorage.

## Local Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build production assets:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Deployment Notes

The project includes `wrangler.jsonc` for Cloudflare Worker deployment.

Important Cloudflare notes:

- The Cloudflare project must be connected to the GitHub repository for automatic deploys.
- Production should deploy from the `main` branch.
- If the website still shows old UI after a push, check whether Cloudflare is disconnected from GitHub.
- If a deployment uses stale output, redeploy with cleared build cache.
- The project previously failed when Cloudflare ran `bun install --frozen-lockfile` with a stale lockfile. The repo should keep package metadata and lockfiles consistent before deployment.

## Current Demo Credentials

Use the login screen with the default demo account shown in the form. The app uses mocked authentication and routes by selected portal rather than a production identity provider.

## Product Status

This is an interactive demo. Before production use, the app would need real authentication, role authorization, API-backed task state, server-side Academy completion checks, durable submission storage, audit logs, and production-grade deployment monitoring.
