# Core Atoms

The `@base-framework/atoms` package provides a comprehensive set of atomic components that map directly to HTML elements. These atoms are the building blocks of the Base Framework's component architecture.

## Fundamental Concept

**Atoms return plain JavaScript objects, NOT DOM elements.**

This is the most critical concept to understand. When you call an atom function, it returns a configuration object that the Base Framework's `Builder` uses to construct the actual DOM.

```javascript
// Returns: { tag: 'div', class: 'container', children: [...] }
const element = Div({ class: 'container' }, [
    Span('Hello World')
]);
```

## Usage Patterns

### Basic Usage

Atoms can be used with properties, children, or both.

```javascript
import { Div, Span, Button } from '@base-framework/atoms';

// Props only
Div({ class: 'container' });

// Children only (single child)
Div(Span('text'));

// Children only (array of children)
Div([
    Span('Item 1'),
    Span('Item 2')
]);

// Props and Children
Div({ class: 'card' }, [
    H1('Title'),
    P('Content')
]);
```

### Event Handling

Event handlers are passed as properties. The callback receives the event object and the parent component instance.

```javascript
Button({
    class: 'btn',
    click: (event, parent) => {
        // 'parent' is the component instance containing this atom
        parent.data.count++;
    }
}, 'Click Me');
```

## Available Atoms

The library exports atoms for almost all standard HTML tags.

### Structural
- `Html`, `Body`, `Head`
- `Div`, `Section`, `Article`, `Header`, `Footer`, `Main`, `Nav`, `Aside`
- `Dialog`

### Text & Typography
- `H1`, `H2`, `H3`, `H4`, `H5`, `H6`
- `P`, `Span`, `Text`
- `Br`, `Hr`
- `A` (Anchor)

### Lists
- `Ul`, `Ol`, `Li`

### Forms & Input
- `Form`, `Input`, `Label`, `Button`, `SubmitButton`
- `Select`, `Option`, `Textarea`
- `Checkbox` (Special atom that sets `type: 'checkbox'`)

### Media
- `Img`, `Audio`, `Video`, `Source`, `Track`
- `Canvas`, `Svg`, `Path`, `Circle`, `Rect`, `Line`, `Polyline`, `Polygon`

### Tables
- `Table`, `Thead`, `Tbody`, `Tfoot`, `Tr`, `Th`, `Td`, `Caption`, `Col`, `Colgroup`

### Meta & Scripting
- `Script`, `Style`, `Link`, `Meta`, `Title`, `Base`
- `Doctype`

## Creating Custom Atoms

You can create your own atoms using the `Atom` function from `@base-framework/base`.

```javascript
import { Atom } from '@base-framework/base';
import { Div } from '@base-framework/atoms';

// Composition pattern (Recommended)
const Card = Atom((props, children) => Div({
    ...props,
    class: `card ${props.class || ''}`,
    children
}));

// Usage
Card({ class: 'featured' }, [
    H1('Card Title')
]);
```

## Best Practices

1.  **Always spread props**: When creating custom atoms, spread `...props` to ensure all attributes (classes, events, data attributes) are passed down.
2.  **Use arrays for multiple children**: While single children can be passed directly, it's safer and more consistent to always use an array for children.
3.  **Import from the correct package**: Import HTML atoms from `@base-framework/atoms`, not `@base-framework/base`.
