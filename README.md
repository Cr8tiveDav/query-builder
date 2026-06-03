# QueryCraft - Visual Query Builder

QueryCraft is a highly interactive, schema-driven visual query builder built with Next.js (App Router), TypeScript, and Tailwind CSS. It allows users to visually compose complex logical queries (rules and nested logical groups), preview compiled syntax in real-time, execute queries against simulated databases, and analyze results instantly.

---

## Directory & Component Architecture

Below is the directory tree of the restructured component layout:

```text
src/
├── app/
│   ├── builder/
│   │   └── page.tsx              # Workstation workspace page
│   ├── layout.tsx                # Global layout with ThemeProvider
│   └── page.tsx                  # Landing page assembler
├── components/
│   ├── builder/                  # Workstation / Editor components
│   │   ├── canvas/
│   │   │   └── QueryCanvas.tsx   # Canvas grid & results table
│   │   ├── modals/
│   │   │   └── SavePresetModal.tsx
│   │   ├── nodes/
│   │   │   ├── QueryGroup.tsx    # Conjunction node (AND/OR tree)
│   │   │   └── RuleRow.tsx       # Individual query rule input row
│   │   ├── preview/
│   │   │   └── OutputPreview.tsx # Syntax-highlighted SQL/JSON previewer
│   │   ├── sidebar/
│   │   │   └── Sidebar.tsx       # Query presets & run history panels
│   │   └── AppShell.tsx          # Workspace page shell layout
│   ├── homepage/                 # Landing page marketing components
│   │   ├── CtaBanner.tsx         # Bottom Banner layout section
│   │   ├── Features.tsx          # Landing Features Grid block
│   │   └── Hero.tsx              # Landing Hero details & live mockup
│   ├── navigation/               # Universal navigation headers
│   │   ├── Footer.tsx            # Copyright footer bar
│   │   ├── LandingNavbar.tsx     # Floating landing header
│   │   └── WorkspaceNavbar.tsx   # Editor workspace header
│   └── providers/
│       └── ThemeProvider.tsx     # System theme context wrapper
```

---

## Technical Architecture & Core Systems

### 1. State Management Decisions
- **Single Source of Truth (Zustand)**: We opted for Zustand for our global state container. Zustand offers lightweight, fast, boilerplate-free state tracking without the context re-render overhead of Redux or React Context.
- **Normalized Query Tree Structure**: The query workspace is stored as a nested tree hierarchy of logical group nodes and rule nodes:
  ```typescript
  export type QueryNode = QueryGroup | QueryRule;
  export type LogicalOperator = 'AND' | 'OR';
  
  export interface QueryRule {
    id: string;
    type: 'rule';
    field: string;
    operator: string;
    value: any;
  }
  
  export interface QueryGroup {
    id: string;
    type: 'group';
    conjunction: LogicalOperator;
    children: QueryNode[];
    isCollapsed?: boolean;
  }
  ```
- **Derived State Patterns**: Validation error states and dynamic syntax compilations are derived reactively inside components (using custom validation/evaluation utilities) rather than sync-saved in the store. This avoids state duplication sync bugs and ensures instant component updates.

---

### 2. Recursive UI & Engine Strategies
- **Recursive React Rendering**: Group panels render their children recursively by checking `child.type === 'group'`. Logical sub-groups nesting depth is theoretically unlimited, and visual indentation scales dynamically with HSL theme color coding based on active depth.
- **Recursive AST Compiler Compilation**: Compilers (`generateSQL`, `generateMongoDB`, `generateGraphQL`) perform Depth-First Search (DFS) traversals on the query tree:
  - Base Case (Rule Node): Compiles operator mappings into target-specific syntax (e.g. `age > 18` or `status: { _eq: "active" }`).
  - Recursive Step (Group Node): Joins compiled outputs of its children using the group's active conjunction gate (`AND`/`OR` or `$and`/$or` or `_and`/`_or`).
- **Sanitized Import/Export Parser**: The JSON query importer runs a deep recursive validation checklist verifying the AST schema structure and fields to protect the app state from corrupt uploads.

---

### 3. Query Execution Simulator
- **Mock Database Datasets**: Contains 50+ mock rows for `Users`, `Products`, and `Logs` databases, reflecting multiple types (strings, numbers, booleans, enums, ISO dates).
- **Logical Evaluator**: The evaluator engine (`evaluateQuery`) processes the visual query rules dynamically in-memory, filtering the selected schema dataset matching logical operator constraints.
- **Results Table Grid**: Renders schema-driven dynamic columns. Displays paginated blocks of 5 rows, handles column sorting (alphabetical, numerical, and boolean) in-memory, and shows loading and empty-result warnings.

---

### 4. Performance Optimization Techniques
- **Component Isolation**: Edits inside a `RuleRow` update local inputs or push targeted changes back to the Zustand store, preventing global re-renders.
- **Event Bubbling & Drag-and-Drop Optimization**: Native HTML5 Drag-and-Drop features stop nested group events from bubbling (`e.stopPropagation()`). Hover coordinates are evaluated efficiently to prevent visual lag.
- **Thin Tokenizer Syntax Highlighter**: Built a custom, dependency-free regex token split highlighter. Splitting text and wrapping matches inside color-coded React `span` blocks runs in sub-milliseconds, bypassing heavy library dependencies like Prism.js or Shiki.

---

## Key Keyboard Shortcuts
- `Cmd + Enter` (or `Ctrl + Enter`): Run query search
- `Cmd + S` (or `Ctrl + S`): Open "Save Preset" form modal
- `Esc`: Close open modal overlays
- `Ctrl + Alt + R`: Reset visual workspace canvas

---

## Design Choices & Trade-offs
- **Custom Highlighter vs Libraries**: Using a lightweight regex-based token highlight engine instead of Prism/Shiki avoided bundle bloating and hydration mismatches on Next.js SSR.
- **HTML5 Drag-and-Drop vs React Dnd-Kit**: Native HTML5 drag features keep bundle weights small and preserve recursive nesting flexibility without the structural constraints of standard drag-and-drop frameworks.
- **Client-Side Simulation**: Running evaluator algorithms in-memory on the client is extremely fast, responsive, and completely self-contained for offline usage, though it represents a trade-off against server-side processing for extremely large datasets.
