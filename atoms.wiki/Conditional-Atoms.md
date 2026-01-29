# Conditional Atoms

Conditional atoms allow you to render content dynamically based on data, state, or route changes. They handle the creation and destruction of DOM elements automatically.

## Core Concepts

Conditional atoms work by placing a comment placeholder in the DOM. When the condition is met, they render the content and insert it after the placeholder. When the condition is no longer met, they remove the content.

All conditional atoms follow this signature pattern:
`AtomType(dataSource?, property, callback)`

## Data Sources

Conditional atoms can bind to three types of data sources:

1.  **Parent Data** (`On`, `If`): Binds to `parent.data` (or `parent.context.data` / `parent.state` if data is missing).
2.  **State** (`OnState`, `IfState`): Binds to `parent.state`.
3.  **Route** (`OnRoute`): Binds to `parent.route`.

## The `On` Family

The `On` atoms trigger whenever the watched property changes. They are useful for boolean toggles or rendering content that depends on a value.

### `On` (Parent Data)

```javascript
// Renders content when 'isLoading' is truthy
On('isLoading', (isLoading) => {
    return isLoading ? Loader() : Content();
});

// With explicit data source
On(someDataObj, 'status', (status) => {
    return status === 'active' ? ActiveView() : InactiveView();
});
```

### `OnState` (Component State)

```javascript
// Renders when state.isVisible changes
OnState('isVisible', (isVisible) => {
    if (!isVisible) return null;
    return Modal();
});
```

### `OnRoute` (Routing)

```javascript
// Renders when route.path changes
OnRoute('path', (path) => {
    return path === '/home' ? Home() : null;
});
```

## The `If` Family

The `If` atoms are specialized versions of `On` that only render when the property value **equals** a specific expected value.

### `If`

```javascript
// Only runs callback if 'status' === 'active'
If('status', 'active', () => {
    return ActiveContent();
});
```

### `IfState`

```javascript
// Only runs callback if state.mode === 'edit'
IfState('mode', 'edit', () => {
    return Editor();
});
```

## Specialized Conditional Atoms

### `OnLoad` / `OnStateLoad`
Triggers when a property is truthy (like `On` but semantically for loading states).

```javascript
OnLoad('dataLoaded', () => Content());
```

### `OnOpen` / `OnStateOpen`
Triggers when a property is truthy (semantically for open/closed states like modals).

```javascript
OnOpen('isModalOpen', () => ModalDialog());
```

## Callback Signature

The callback function provided to conditional atoms receives three arguments:

```javascript
(value, element, parent) => Atom | null
```

-   `value`: The current value of the watched property.
-   `element`: The comment placeholder DOM element.
-   `parent`: The parent component instance.

## Return Values

The callback **MUST** return one of the following:
1.  An Atom object (e.g., `Div(...)`) to render.
2.  `null` or `undefined` to render nothing (and remove any previously rendered content).

## Common Mistakes

1.  **Forgetting to return**: If you don't return an atom, nothing will render.
2.  **Returning DOM elements**: Always return Atom objects, not `document.createElement(...)`.
3.  **Incorrect Data Source**: Using `On` when you meant `OnState` (or vice versa).
