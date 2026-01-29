# Responsive Atoms

Responsive atoms provide a powerful, mobile-first way to handle responsive design directly in your JavaScript/HTML structure. They allow you to render different components or layouts based on the window size.

## How It Works

The system uses a global `sizeData` object that tracks the window width and current breakpoint. All responsive atoms bind to this data source, ensuring efficient updates (a single resize listener for the entire application).

## Breakpoints

The library uses Tailwind CSS compatible breakpoints:

-   **xs**: 0px - 639px
-   **sm**: 640px - 767px
-   **md**: 768px - 1023px
-   **lg**: 1024px - 1279px
-   **xl**: 1280px - 1535px
-   **2xl**: 1536px+

## Mobile-First Atoms

These atoms render when the screen size is **at least** the specified breakpoint (and larger). This follows the "mobile-first" philosophy.

-   `OnXs`: Renders on all sizes (0px+).
-   `OnSm`: Renders on sm, md, lg, xl, 2xl (640px+).
-   `OnMd`: Renders on md, lg, xl, 2xl (768px+).
-   `OnLg`: Renders on lg, xl, 2xl (1024px+).
-   `OnXl`: Renders on xl, 2xl (1280px+).
-   `On2Xl`: Renders on 2xl only (1536px+).

```javascript
// Renders on Medium screens and up (Tablet, Desktop)
OnMd(() => Navigation());

// Renders on Large screens and up (Desktop)
OnLg(() => Sidebar());
```

## Exact Breakpoint Atoms

These atoms render **only** when the screen size matches the specific breakpoint range.

-   `OnXsOnly`: 0px - 639px
-   `OnSmOnly`: 640px - 767px
-   `OnMdOnly`: 768px - 1023px
-   `OnLgOnly`: 1024px - 1279px
-   `OnXlOnly`: 1280px - 1535px
-   `On2XlOnly`: 1536px+

```javascript
// Renders ONLY on mobile phones
OnXsOnly(() => MobileMenu());
```

## Semantic Device Atoms

These atoms group breakpoints into logical device categories.

-   `OnPhone`: Renders on **xs** and **sm** (0px - 767px).
-   `OnTablet`: Renders on **md** (768px - 1023px).
-   `OnDesktop`: Renders on **lg**, **xl**, and **2xl** (1024px+).

```javascript
OnPhone(() => BottomNav());
OnDesktop(() => TopNav());
```

## Usage

Responsive atoms take a callback function that returns the content to render.

```javascript
OnMd((size, parent) => {
    return Div({ class: 'desktop-layout' }, [
        // Content for medium screens and up
    ]);
});
```

The callback receives:
-   `size`: The current breakpoint name (e.g., 'md', 'lg').
-   `parent`: The parent component instance.

## Performance Note

Responsive atoms are highly optimized. They use a single global resize listener and the Base Framework's data binding system. When a component using these atoms is destroyed, the bindings are automatically cleaned up.
