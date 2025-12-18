# Base Atoms - AI Coding Instructions

## Architecture Overview
This is an npm package that provides atomic HTML components for the Base Framework. It exports reusable, composable atoms that serve as building blocks for component-based architecture.

**Key Dependencies:**
- `@base-framework/base`: Core framework providing `Atom`, `Builder`, and `dataBinder`
- Built as ESM module with TypeScript declarations generated from JSDoc

## CRITICAL: What Atoms Return
**Atoms return OBJECTS, NOT DOM elements.** This is fundamental to understanding Base Atoms:

```javascript
// ✅ CORRECT - Atoms return objects
const element = Div({ class: 'container' }); // Returns { class: 'container', tag: 'div' }

// ❌ WRONG - Do NOT treat atoms as DOM elements
const element = Div({ class: 'container' });
element.appendChild(child); // ERROR: Objects don't have appendChild

// ✅ CORRECT - Children go in the atom definition
const element = Div({ class: 'container' }, [
    Span('child text')
]);
```

**The Base Framework's Builder converts these objects into DOM elements during rendering.**

## Import Patterns

### Available Imports
```javascript
// Core framework imports (from @base-framework/base package)
import { Atom, Builder, dataBinder, Data, Component } from '@base-framework/base';

// HTML element atoms (from this package)
import { Div, Span, Button, Input, Form, Section, Article } from '@base-framework/atoms';

// Conditional rendering atoms (from this package)
import { On, OnState, OnRoute, If, IfState, OnLoad, OnStateLoad, OnOpen, OnStateOpen } from '@base-framework/atoms';

// Responsive atoms (from this package)
import { OnXs, OnSm, OnMd, OnLg, OnXl, On2Xl } from '@base-framework/atoms';
import { OnXsOnly, OnSmOnly, OnMdOnly, OnLgOnly, OnXlOnly, On2XlOnly } from '@base-framework/atoms';
import { OnPhone, OnTablet, OnDesktop } from '@base-framework/atoms';

// Utility atoms (from this package)
import { UseParent } from '@base-framework/atoms';
```

### Import Rules
- **NEVER** import `Div`, `Span`, `Button` etc. from `@base-framework/base` - they come from `@base-framework/atoms`
- **ALWAYS** import `Atom`, `Builder`, `dataBinder`, `Data`, `Component` from `@base-framework/base`
- When creating new atom files, import `Atom` from `@base-framework/base`, not from atoms package

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

## Common Mistakes to Avoid

### ❌ MISTAKE 1: Treating Atoms as DOM Elements
```javascript
// ❌ WRONG - Atoms return objects, not DOM elements
const div = Div();
div.appendChild(child); // ERROR
div.innerHTML = 'text'; // ERROR
document.body.appendChild(div); // ERROR

// ✅ CORRECT - Let the framework handle DOM operations
const div = Div({ class: 'container' }, [
    Span('child')
]);
// Framework's Builder will create actual DOM elements
```

### ❌ MISTAKE 2: Forgetting Children Arrays
```javascript
// ❌ WRONG - Multiple children without array
Div({ class: 'container' },
    Span('one'),
    Span('two')
);

// ✅ CORRECT - Wrap multiple children in array
Div({ class: 'container' }, [
    Span('one'),
    Span('two')
]);
```

### ❌ MISTAKE 3: Wrong Event Handler Signature
```javascript
// ❌ WRONG - Missing parent parameter
Button({
    click(event) {
        // Can't access parent component
    }
});

// ✅ CORRECT - Include both event and parent parameters
Button({
    click(event, parent) {
        // Now you can access parent.data, parent.state, etc.
        parent.data.count++;
    }
});
```

### ❌ MISTAKE 4: Wrong Conditional Atom Returns
```javascript
// ❌ WRONG - Returning undefined or not returning atom objects
On('loaded', (loaded) => {
    if (loaded) {
        Content(); // Missing return statement
    }
});

// ❌ WRONG - Returning plain objects without tag
On('loaded', (loaded) => {
    return { text: 'loaded' }; // Missing tag property
});

// ✅ CORRECT - Always return atom objects or null
On('loaded', (loaded) => {
    if (loaded) {
        return Content(); // Return the atom
    }
    return null; // Or return null when condition not met
});

// ✅ CORRECT - Using ternary for cleaner code
On('loaded', (loaded) => loaded ? Content() : Loader());
```

### ❌ MISTAKE 5: Not Spreading Props
```javascript
// ❌ WRONG - Losing all props passed to atom
const CustomButton = Atom((props, children) => ({
    tag: 'button',
    class: 'custom-btn',
    children
}));

// ✅ CORRECT - Spread props to preserve all properties
const CustomButton = Atom((props, children) => ({
    tag: 'button',
    ...props, // Spread props to preserve everything
    class: `custom-btn ${props.class || ''}`, // Merge classes if needed
    children
}));

// ✅ ALSO CORRECT - Use Button atom and spread props
const CustomButton = Atom((props, children) => Button({
    ...props,
    class: `custom-btn ${props.class || ''}`,
    children
}));
```

### ❌ MISTAKE 6: Missing Tag Property
```javascript
// ❌ WRONG - Creating element without tag
const MyElement = (props) => ({
    ...props,
    class: 'my-element'
});

// ✅ CORRECT - Include tag property for custom elements
const MyElement = (props) => ({
    tag: 'div', // Must specify the HTML tag
    ...props,
    class: 'my-element'
});

// ✅ BETTER - Use existing atom as base
const MyElement = Atom((props, children) => Div({
    ...props,
    class: 'my-element',
    children
}));
```

### ❌ MISTAKE 7: Wrong Responsive Atom Usage
```javascript
// ❌ WRONG - Not returning anything from callback
OnMd(() => {
    Div('content'); // Missing return
});

// ❌ WRONG - Trying to use like a wrapper component
OnMd({
    Div('content') // Not a function callback
});

// ✅ CORRECT - Pass callback that returns atoms
OnMd((size, parent) => {
    return Div({ class: 'desktop-content' }, [
        H1('Desktop View'),
        P('This appears on medium screens and larger')
    ]);
});

// ✅ CORRECT - Shorter syntax
OnMd(() => Div('Desktop content'));
```

### ❌ MISTAKE 8: Incorrect Data Binding in On Atoms
```javascript
// ❌ WRONG - Passing undefined data source
On(undefined, 'loaded', (loaded) => Content());

// ❌ WRONG - Wrong property name
On('isLoaded', (loaded) => Content()); // Property might be 'loaded' not 'isLoaded'

// ✅ CORRECT - Let On atom find data source automatically
On('loaded', (loaded) => loaded ? Content() : Loader());

// ✅ CORRECT - Explicitly specify data source
On(parent.data, 'loaded', (loaded) => loaded ? Content() : Loader());

// ✅ CORRECT - Use specific atom types
OnState('loaded', (loaded) => loaded ? Content() : Loader());
OnRoute('path', (path) => path === '/home' ? Home() : null);
```

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

## Quick Reference Guide

### Golden Rules
1. **Atoms return objects, not DOM elements**
2. **Always wrap multiple children in arrays**
3. **Event handlers need `(event, parent)` signature**
4. **Conditional atom callbacks must return atom objects or null**
5. **Always spread `...props` to preserve properties**
6. **Custom elements need a `tag` property**
7. **Import HTML atoms from `@base-framework/atoms`**
8. **Import `Atom`, `Builder`, `Data` from `@base-framework/base`**

### Most Common Patterns

#### Creating a Basic Atom
```javascript
import { Atom } from '@base-framework/base';

const MyAtom = Atom((props, children) => ({
    tag: 'div',
    ...props,
    children
}));
```

#### Using Atoms with Children
```javascript
// Single child (string or atom)
Div('text')
Div(Span('text'))

// Multiple children (array)
Div([
    Span('one'),
    Span('two')
])

// With props and children
Div({ class: 'container' }, [
    Span('child')
])
```

#### Event Handlers
```javascript
Button({
    click(event, parent) {
        parent.data.count++;
    }
})
```

#### Conditional Rendering
```javascript
// Auto-detect data source
On('loaded', (loaded) => loaded ? Content() : Loader())

// Specific data source
OnState('loaded', (loaded) => loaded ? Content() : null)
OnRoute('path', (path) => path === '/home' ? Home() : null)

// With boolean check
OnLoad((loaded) => Dashboard())
OnOpen(() => Modal())

// With exact value match
If('status', 'active', () => ActiveContent())
IfState('mode', 'edit', () => Editor())
```

#### Responsive Design
```javascript
// Mobile-first (shows on breakpoint AND larger)
OnMd(() => Div('Desktop navigation'))

// Semantic devices
OnPhone(() => Div('Mobile layout'))
OnTablet(() => Div('Tablet layout'))
OnDesktop(() => Div('Desktop layout'))

// Exact breakpoint only
OnMdOnly(() => Div('Only on medium screens'))
```

### Debugging Checklist
When atoms don't work as expected, check:
- [ ] Are you returning objects from atom functions?
- [ ] Are multiple children wrapped in an array?
- [ ] Does your custom element have a `tag` property?
- [ ] Are you spreading `...props` to preserve properties?
- [ ] Do event handlers have `(event, parent)` signature?
- [ ] Are conditional callbacks returning atoms or null?
- [ ] Are imports coming from the correct packages?