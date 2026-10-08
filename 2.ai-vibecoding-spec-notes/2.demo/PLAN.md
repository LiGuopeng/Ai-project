# Todo List Design Plan

## Overview

- Source: Pencil frame `Todoist Home` (`bi8Au`), baseline `1200 x 760`.
- Target: existing React 18 + Vite H5 app in `apps/frontend/web`.
- Styling: existing CSS entry `src/index.css`; icons use the installed `lucide-react` package.
- Data: keep the existing `hooks/useTodos.ts` -> `services/todo.ts` -> API -> PostgreSQL flow.
- Responsive behavior: preserve the desktop two-column composition and collapse the sidebar/content spacing for narrow screens.

## Design Tokens

| Role | Value |
| --- | --- |
| Page background | `#FFFFFF` |
| Sidebar background | `#F7F8FA` |
| Primary text | `#172033` |
| Body text | `#334155` |
| Secondary text | `#64748B` |
| Muted text | `#94A3B8` |
| Blue accent | `#2563EB` |
| Active navigation | `#E6EEF9` |
| Divider | `#F1F5F9` / `#E5E7EB` |
| Content radius | `8px` / `10px` |
| Font | `Inter`, system sans fallback |

## Modules

1. Sidebar: brand, search, primary navigation, projects, profile.
2. Top Header: greeting and help/notification/avatar actions.
3. Today Header: star, title, count, more action.
4. Daily Summary: short motivational message.
5. Task List: reusable task rows with checkbox, metadata, tag and actions.
6. Add Task: full-width outlined action that opens the existing add form.

