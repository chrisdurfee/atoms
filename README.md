# Base Atoms

**Version**: 1.0.0

## Overview
This documentation aims to guide the enhancement of component scalability and reusability within your projects through the use of atoms. Atoms are designed to function as the fundamental building blocks in a component-based architecture.

This module will add default atoms to your project.

## Atom Scope
Within our component model, each component autonomously generates its own scope. When components are nested, unique scopes are established at each level. Atoms inherit the scope of their parent component, gaining access to the component's state and data, and enabling directive manipulation and event handling.

### Global Reusability
Atoms are globally defined and reusable entities, mirroring the nested capabilities characteristic of other layout constructs.

## Atom Types
Atoms can be instantiated using various methodologies:

### Function Atoms
These atoms are instantiated with either standard functions or arrow functions, equipped with a props object to transfer properties to the atoms.

```javascript
const Div = (props, children) => ({
    ...props,
    children
});
```

### Atom Callbacks
Atoms may be created using the Atom function, which accepts a callback function as its sole parameter. The callback function is passed a props object and children array and returns an object containing the atom's layout.

```javascript
const Button = Atom((props, children) => ({
    tag: 'button',
    ...props,
    children
}));
```

#### Atom Nesting
Atoms should use composition to nest other atoms. This is achieved by passing the children array to the atoms args.

```javascript
const SecondaryButton = Atom((props, children) => (Button({
    ...props,
    class: 'secondary-btn',
    children
}));
```

## Adding Event Listeners
Event listener callbacks within atoms accept two parameters: the originating event object and the "parent" component object in which the atom resides.

### Accessing the Parent Component in an Atom
```javascript
class Page extends Component
{
    render()
    {
        return Div([
            SecondaryButton({
                /**
                 * This will add a click event listener to the button.
                 *
                 * @param {Event} event The event object
                 * @param {Component} parent The parent component object
                 * @returns {void}
                 */
                click(event, parent) =>
                {
                    // Code to access the parent component
                }
            })
        ]);
    }
}
```

## Utilization of Atoms
To leverage an atom, invoke its function and pass the requisite values via a props and children. The Atoms created with the Atom callback functions support passing optional props or children to the atom. The props object should always be first but if the atom does not require props, the children array or string can be passed as the first argument.

```javascript
// props only
Div({class: 'text'});

// text child only
Div('test');

// array child only
Div([
    Div('test')
]);

// props and text child
Div({class: 'text'}, 'test');

// props and array children
Div({class: 'text'}, [
    Div('test'),
    Div('test')
]);
```

### Example of Atom Utilization
```typescript
SecondaryButton({
    click(e) =>
    {
        // Handle the click event
    }
})
```

The implementation of atoms is aimed at enhancing the readability and modularity of extensive layouts.

### Illustrative Example of a Complex Layout
```typescript
Section([
    Article({ class: 'post' }, [
        Header([
            H1('Title')
        ])
    ])
])
```

## Special Atoms
Special atoms are atoms that have been pre-configured with specific properties. These atoms are designed to simplify the creation of common components. This library has a few special atoms that can help create complex actions.

### On Atom
The On atom allows a child to be added or removed based on a bindable data property. This atom makes the child not need to have an "onSet" property on a parent wrapper allowing for easier layouts with less code.

```javascript

// The traditional way using a parent wrapper with an onSet property
Div({
    class: "p-4 transition",
    onState: ["loaded", (loaded) => (!loaded)
        ? SkeletonPost()
        : Post(post)
    ]
})

// The new way using the On atom
Div({ class: "p-4 transition" }, [
    On('loaded', (loaded) => (!loaded)
    ? SkeletonPost()
    : Post(post))
])

// Or with a state
Div({ class: "p-4 transition" }, [
    OnState('loaded', (loaded) => (!loaded)
    ? SkeletonPost()
    : Post(post))
])

// Children can now be added dynamically without a wrapper
Div({ class: "p-4 transition" }, [
    H1('Title'),

    // this will add or remove this child based on the loaded state
    On('loaded', (loaded) => (!loaded)
    ? SkeletonPost()
    : Post(post))
])

```

The On, OnState, and OnRoute atoms support two overloads. The first overload is the data property to bind to and the second is the callback function that will be called when the data property changes.

### On Atom Overloads
```javascript

// This will watch to the component data, or context data, or component state in that order if the first two are not set in the component.
// data property, callback
On('loaded', (loaded) => (!loaded)
    ? SkeletonPost()
    : Post(post))

```

The second overload allows for a custom data source to be used. This allows for more flexibility with the layouts.

```javascript

// watching on the component route
// data source, data property, callback
On(this.route, 'loaded', (loaded) => (!loaded)
    ? SkeletonPost()
    : Post(post))

// With the OnRoute Atom
OnRoute('loaded', (loaded) => (!loaded)
    ? SkeletonPost()
    : Post(post))

```

The callback function will be called when the data property changes. The callback function will be called with the new value of the data property, the element that the watcher is using, and the parent component.

```javascript
// the new data value, the element that the watcher is using, the parent component object
(loaded, element, parent) =>
{
    // handle the loaded state
}
```

## Contributing

Contributions to Base Framework are welcome. Follow these steps to contribute:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Commit your changes with clear, descriptive messages.
- Push your branch and submit a pull request.
- Before contributing, read our CONTRIBUTING.md for coding standards and community guidelines.

## License

Base Atoms are licensed under the MIT License. See the LICENSE file for details.
