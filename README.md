# Legend Coffee Board

Legend Coffee Board is a production-grade real-time collaborative Kanban application built with React and TypeScript. It is designed to demonstrate senior-level frontend engineering principles, including distributed systems thinking, optimistic UI, offline-first architecture, conflict resolution, and role-based access control.

This project is not a CRUD demo. It models the frontend as a distributed system node that participates in synchronization, reconciliation, and eventual consistency.

---

## Live Link :: 

## Overview

Legend Coffee Board is a multi-user task management board similar to Trello. Multiple users can:

- Create, edit, delete, and move cards
- Reorder cards within columns
- Move cards across columns
- See changes reflected in real time
- Work offline with automatic synchronization on reconnect
- Operate under role-based permissions

The application is styled with a premium coffee-inspired design system and built with a scalable feature-based architecture.

---

## Core Engineering Focus

This project demonstrates:

- Real-time synchronization using WebSockets
- Optimistic updates with rollback support
- Conflict resolution via versioning and reconciliation
- Offline-first architecture with queued mutations
- Separation of server state and collaborative client state
- Role-based access control enforced at UI and mutation layers
- Scalable frontend architecture using modern React patterns

---

## Technology Stack

### Runtime and Core

- React 18+
- TypeScript (strict mode)
- Vite

### State Management

- TanStack Query for server state
- Zustand for collaborative and local state

### Realtime Communication

- Socket.io client

### Drag and Interaction

- @dnd-kit for accessible, extensible drag and drop

### Styling

- Tailwind CSS for layout and design system
- Styled-components for dynamic runtime styling

### Validation

- Zod for schema validation and runtime safety

### Offline Support

- IndexedDB for persistent local storage
- Mutation queue replay on reconnect

---

## Architectural Principles

### 1. Frontend as a Distributed System

Each client acts as a distributed node that:

- Emits mutations
- Receives events
- Reconciles state
- Maintains version consistency
- Handles temporary divergence

The UI is not treated as a rendering layer but as an active participant in synchronization.

---

### 2. Separation of Concerns

Server state and collaborative state are strictly separated.

| Concern | Tool |
|----------|------|
| Server state | TanStack Query |
| Local collaborative state | Zustand |
| Transport layer | Socket.io |
| Offline persistence | IndexedDB |
| Validation | Zod |

This separation prevents state entanglement and reduces race-condition complexity.

---

### 3. Real-Time Synchronization Strategy

When a user performs an action:

1. A local optimistic update is applied immediately.
2. A mutation request is sent to the server.
3. A WebSocket event is broadcast to connected clients.
4. Clients reconcile updates using version checks.
5. Stale updates are rejected.

Updates are patch-based, not full refetches, minimizing network overhead and improving scalability.

---

### 4. Optimistic UI with Rollback

All mutations follow this lifecycle:

- Capture previous state snapshot
- Apply optimistic update
- Send mutation to server
- If server rejects, rollback to snapshot
- Display feedback notification

This ensures immediate UI responsiveness while preserving data integrity.

---

### 5. Conflict Resolution

Each card contains:

- A version number
- Updated timestamp
- Author metadata

Conflict handling includes:

- Last-write-wins fallback
- Stale update rejection
- Soft locking during drag operations
- Server-authoritative reconciliation

This protects against race conditions in multi-user scenarios.

---

### 6. Offline-First Design

When the network is unavailable:

- Board state persists in IndexedDB
- Mutations are queued locally
- Unsynced state is visually indicated
- On reconnect, queued mutations replay in order
- Server reconciliation ensures eventual consistency

This models real-world distributed systems where temporary divergence is expected.

---

### 7. Role-Based Access Control

Roles include:

- Admin
- Editor
- Viewer

Permissions are enforced at:

- UI interaction layer
- Mutation layer
- Socket event emission layer

Unauthorized actions are prevented before reaching the server.

---

## Project Structure

The application follows a feature-based scalable architecture:

src/
app/
providers/
router/
features/
board/
components/
hooks/
services/
store/
types/
auth/
presence/
shared/
components/
hooks/
utils/
socket/
offline/
permissions/
theme/

This structure ensures:

- High cohesion
- Low coupling
- Feature isolation
- Scalability for large teams

---

## Developer Experience

- Strict TypeScript configuration
- ESLint and Prettier
- Husky pre-commit hooks
- Conventional commit standards
- Environment variable isolation via `.env` and `.env.example`
- Absolute imports
- Error boundaries per feature
- Suspense boundaries for data loading

---

## Why This Project Matters

Legend Coffee Board demonstrates:

- Understanding of distributed state management
- Handling of real-time race conditions
- Practical application of eventual consistency
- Advanced state separation strategies
- Production-grade drag and interaction patterns
- Resilience under unstable network conditions

It reflects the kind of engineering required in collaborative tools such as Trello, Notion, Linear, or Jira.


### Legend Coffee Board is designed as a serious frontend systems project, not a UI showcase. It demonstrates the ability to architect resilient, scalable, real-time collaborative applications with production-level engineering standards.

### It reflects distributed systems thinking implemented at the frontend layer.