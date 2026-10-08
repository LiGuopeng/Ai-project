# Todo List Components

## Reusable Components

| Component | Type | Source | Implementation |
| --- | --- | --- | --- |
| `Sidebar` | Module | `GvclJ` | Update existing component |
| `NavItem` | Primitive | `bzDlp` and variants | Rendered by `Sidebar` |
| `Topbar` | Module | `qd5UK` | Update existing component |
| `TodoItem` | Composite | `gUpy8` and repeated rows | Update existing component |
| `TodoInput` | Composite | `clmvr` plus input state | Update existing component |
| `TodoList` | Module | `gdcXu` | Update existing component |

## States

- Navigation: default and active `Today`.
- Task: pending, completed, loading, empty and error.
- Add task: collapsed action and expanded input form.
- Responsive: desktop sidebar, compact mobile header/content layout.

## Build Order

1. Tokens and page layout.
2. Sidebar and topbar primitives.
3. Task row and add-task interaction.
4. Dashboard composition and responsive pass.
5. Visual verification against Pencil frame and API interaction checks.
