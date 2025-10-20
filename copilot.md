# Base Atoms - AI Coding Instructions

## Architecture Overview
This is an npm package that provides atomic HTML components for the Base Framework. It exports reusable, composable atoms that serve as building blocks for component-based architecture.

**Key Dependencies:**
- `@base-framework/base`: Core framework providing `Atom`, `Builder`, and `dataBinder`
- Built as ESM module with TypeScript declarations generated from JSDoc

## Core Patterns

### Atom Creation Patterns
Two primary patterns for creating atoms:

1. **Simple Function Atoms** (for basic HTML elements):
```javascript
const Meta = (props) => ({ ...props, tag: 'meta' });
```

2. **Atom Wrapper Functions** (for composable atoms):
```javascript
const Div = Atom((props, children) => Tag(props, children));
```

### Component Composition
Atoms use composition over inheritance. Children are passed as arrays:
```javascript
const SecondaryButton = Atom((props, children) => Button({
    ...props,
    class: 'secondary-btn',
    children
}));
```

### Special Atoms Architecture
Located in `/src/on/` and `/src/use/` directories:

- **On Atoms**: Conditional rendering based on data binding (`On`, `OnState`, `OnRoute`)
- **Responsive Atoms**: Mobile-first breakpoint rendering (`OnXs`, `OnSm`, `OnMd`, `OnLg`, `OnXl`, `On2Xl`)
- **UseParent**: Provides access to parent component context
- Use **comment placeholders** to maintain DOM position during dynamic updates

#### Responsive Breakpoint System
The responsive atoms (`OnXs`, `OnSm`, `OnMd`, `OnLg`, `OnXl`, `On2Xl`) use a Data-based size tracking system:

- Global `sizeData` object tracks current breakpoint and window width
- Single resize listener updates all responsive atoms efficiently
- Mobile-first approach: each breakpoint renders on matching size AND larger
- Tailwind CSS compatible breakpoints (640px, 768px, 1024px, 1280px, 1536px)
- Located in `/src/on/on-size.js` with re-exports in `/src/on/on.js`

## Development Workflows

### Build Process
```bash
npm run build        # Builds dist/ with esbuild + generates TypeScript declarations
npm run prepublishOnly  # Pre-publish build step
```

### File Structure
- `src/atoms.js`: Main export file with all HTML element atoms
- `src/on/on.js`: Dynamic conditional rendering atoms
- `src/on/on-size.js`: Responsive breakpoint atoms and size tracking system
- `src/use/use.js`: Parent component access utilities
- `src/comment.js`: Comment placeholder utility

## Code Conventions

### JSDoc Documentation
All atoms require comprehensive JSDoc with proper type annotations:
```javascript
/**
 * Creates a button element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
```

### Event Handling Pattern
Event callbacks receive `(event, parent)` parameters for parent component access:
```javascript
Button({
    click(event, parent) {
        // Access parent component here
    }
})
```

### Flexible Argument Handling
Atoms support multiple call patterns:
- Props only: `Div({class: 'text'})`
- Children only: `Div('text')` or `Div([childrenArray])`
- Both: `Div({class: 'text'}, children)`

## Critical Implementation Details

### Dynamic Rendering (On Atoms)
- Use comment placeholders to maintain DOM insertion points
- Handle previous element cleanup in `updateLayout` functions
- Support data binding to component data, context, or state

### Responsive Breakpoint Implementation
- Responsive atoms use Data object for efficient size tracking
- Single window resize listener manages all breakpoint updates
- Mobile-first rendering: each breakpoint shows on current size AND larger
- Automatic cleanup prevents memory leaks when components unmount
- Server-side rendering safe with window existence checks

### Base Framework Integration
- Always import `Atom` from `@base-framework/base`
- Use `Builder.build()` and `Builder.removeNode()` for DOM manipulation
- Leverage `dataBinder` for reactive data connections
- Use `Data` class for global state management (e.g., responsive size tracking)

### TypeScript Support
- Enable `allowJs: true` and `checkJs: true` in tsconfig.json
- Generate declarations with `emitDeclarationOnly: true`
- Map Base Framework types in `paths` configuration

When working with this codebase, focus on maintaining the established patterns for atom creation, JSDoc documentation, and the flexible argument handling that allows atoms to work seamlessly within the Base Framework ecosystem. The responsive breakpoint atoms demonstrate how to integrate with the Base Framework's Data system for efficient global state management.