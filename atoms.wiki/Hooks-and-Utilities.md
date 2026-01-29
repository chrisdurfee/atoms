# Hooks and Utilities

## UseParent

`UseParent` is a utility atom that allows you to access the parent component's context within a child structure, even if you aren't inside a standard component method.

It works similarly to a conditional atom but renders immediately and provides access to the `parent` instance.

### Usage

```javascript
import { UseParent } from '@base-framework/atoms';

const MyComponent = Atom((props, children) => {
    return Div({ class: 'wrapper' }, [
        // Access parent data/state here
        UseParent((parent) => {
            return Span(`Count is: ${parent.data.count}`);
        })
    ]);
});
```

### Callback Signature

```javascript
(parent) => Atom | Array<Atom>
```

-   `parent`: The parent component instance.

The callback should return an Atom or an array of Atoms to render.

### When to use

Use `UseParent` when you are defining a static atom structure (like a reusable UI part) but need to access dynamic data from the component that will eventually render it.

## Comment

The `Comment` atom is primarily used internally by conditional and responsive atoms as a placeholder. However, it can be used if you need to insert an HTML comment into the DOM.

```javascript
import { Comment } from './comment.js'; // Internal import usually

Comment({
    type: 'my-marker',
    onCreated: (ele) => console.log('Comment created'),
    onDestroyed: (ele) => console.log('Comment destroyed')
});
```
