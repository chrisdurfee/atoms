import { Data } from "@base-framework/base";
import { On } from "./on.js";

/**
 * Tailwind CSS breakpoint sizes (mobile-first).
 */
const BREAKPOINTS =
{
	xs: 0,     // Extra small devices
	sm: 640,   // Small devices
	md: 768,   // Medium devices
	lg: 1024,  // Large devices
	xl: 1280,  // Extra large devices
	'2xl': 1536 // 2x extra large devices
};

/**
 * Gets the current breakpoint name based on window width.
 *
 * @param {number} width - The window width
 * @returns {string} The breakpoint name
 */
const getBreakpointName = (width) =>
{
	if (width >= BREAKPOINTS['2xl']) return '2xl';
	if (width >= BREAKPOINTS.xl) return 'xl';
	if (width >= BREAKPOINTS.lg) return 'lg';
	if (width >= BREAKPOINTS.md) return 'md';
	if (width >= BREAKPOINTS.sm) return 'sm';
	return 'xs';
};

/**
 * Checks if current window width meets the breakpoint requirement.
 *
 * @param {string} currentBreakpoint - Current breakpoint name
 * @param {string} targetBreakpoint - Target breakpoint to check
 * @returns {boolean} True if current breakpoint is >= target breakpoint
 */
const matchesBreakpoint = (currentBreakpoint, targetBreakpoint) =>
{
	const current = BREAKPOINTS[currentBreakpoint] || 0;
	const target = BREAKPOINTS[targetBreakpoint] || 0;
	return current >= target;
};

/**
 * Global data object for window size tracking.
 */
const sizeData = new Data({
	size: null,
	width: 0
});

/**
 * Tracks whether the size system has been initialized to avoid
 * registering more than one resize listener.
 *
 * @type {boolean}
 */
let isInitialized = false;

/**
 * Holds the cleanup function returned by the size tracker once it has
 * been initialized, so it can be invoked for manual teardown or tests.
 *
 * @type {(() => void)|null}
 */
let cleanup = null;

/**
 * Initialize the size tracking system.
 */
const initializeSizeTracker = () =>
{
	// Set initial values
	const currentWidth = window.innerWidth;
	const currentBreakpoint = getBreakpointName(currentWidth);

	// @ts-ignore
	sizeData.size = currentBreakpoint;
	// @ts-ignore
	sizeData.width = currentWidth;

	let rafId = null;

	/**
	 * Handle window resize events. Updates are throttled with
	 * requestAnimationFrame and only published when the breakpoint
	 * actually changes, so resizing doesn't flood the data pub/sub
	 * with per-pixel updates.
	 */
	const handleResize = () =>
	{
		if (rafId !== null)
		{
			return;
		}

		rafId = window.requestAnimationFrame(() =>
		{
			rafId = null;

			const newWidth = window.innerWidth;
			const newBreakpoint = getBreakpointName(newWidth);

			// @ts-ignore
			if (newBreakpoint !== sizeData.size)
			{
				// @ts-ignore
				sizeData.width = newWidth;
				// @ts-ignore
				sizeData.size = newBreakpoint;
			}
		});
	};

	// Add resize listener
	window.addEventListener('resize', handleResize);

	// Return cleanup function
	return () =>
	{
		if (rafId !== null)
		{
			window.cancelAnimationFrame(rafId);
			rafId = null;
		}
		window.removeEventListener('resize', handleResize);
	};
};

/**
 * Lazily initializes the size tracker the first time a responsive
 * atom is created. This keeps the module side-effect free at import
 * time, so apps that never use a responsive atom never register a
 * resize listener. The initialized flag is only latched when a
 * window exists, so a server render doesn't prevent the client
 * from initializing later.
 *
 * @returns {void}
 */
const ensureSizeTracker = () =>
{
	if (isInitialized || typeof window === 'undefined')
	{
		return;
	}

	isInitialized = true;
	cleanup = initializeSizeTracker();
};

/**
 * Factory for creating responsive breakpoint atoms. Takes a predicate
 * that decides whether the layout should render for the current
 * breakpoint, so mobile-first, exact, and semantic device atoms all
 * share one implementation.
 *
 * @param {function(string): boolean} matches - Predicate for the current breakpoint name
 * @returns {function} The responsive atom factory function
 */
const createBreakpointAtom = (matches) =>
{
	return (callback) =>
	{
		if (typeof callback !== 'function')
		{
			return null;
		}

		ensureSizeTracker();

		// Use the On atom to watch the sizeData.size property
		return On(sizeData, 'size', (currentBreakpoint, ele, parent) =>
		{
			if (matches(currentBreakpoint))
			{
				// Pass the current size to the callback for additional context
				return callback(currentBreakpoint, parent);
			}

			// Return null to prevent rendering when breakpoint doesn't match
			return null;
		});
	};
};

/**
 * Factory for creating mobile-first responsive atoms (renders on the
 * target breakpoint and larger).
 *
 * @param {string} targetBreakpoint - The breakpoint name (xs, sm, md, lg, xl, 2xl)
 * @returns {function} The responsive atom factory function
 */
const createResponsiveAtom = (targetBreakpoint) =>
	createBreakpointAtom((currentBreakpoint) => matchesBreakpoint(currentBreakpoint, targetBreakpoint));

/**
 * This will create a responsive xs breakpoint atom (0px+).
 * Renders when window width is 0px or larger (always renders).
 *
 * @param {function} callback - The callback function to render the layout
 * @returns {object} The responsive atom
 */
export const OnXs = createResponsiveAtom('xs');

/**
 * This will create a responsive sm breakpoint atom (640px+).
 * Renders when window width is 640px or larger.
 *
 * @param {function} callback - The callback function to render the layout
 * @returns {object} The responsive atom
 */
export const OnSm = createResponsiveAtom('sm');

/**
 * This will create a responsive md breakpoint atom (768px+).
 * Renders when window width is 768px or larger.
 *
 * @param {function} callback - The callback function to render the layout
 * @returns {object} The responsive atom
 */
export const OnMd = createResponsiveAtom('md');

/**
 * This will create a responsive lg breakpoint atom (1024px+).
 * Renders when window width is 1024px or larger.
 *
 * @param {function} callback - The callback function to render the layout
 * @returns {object} The responsive atom
 */
export const OnLg = createResponsiveAtom('lg');

/**
 * This will create a responsive xl breakpoint atom (1280px+).
 * Renders when window width is 1280px or larger.
 *
 * @param {function} callback - The callback function to render the layout
 * @returns {object} The responsive atom
 */
export const OnXl = createResponsiveAtom('xl');

/**
 * This will create a responsive 2xl breakpoint atom (1536px+).
 * Renders when window width is 1536px or larger.
 *
 * @param {function} callback - The callback function to render the layout
 * @returns {object} The responsive atom
 */
export const On2Xl = createResponsiveAtom('2xl');

/**
 * Export the size data for external access if needed.
 */
export { sizeData };

/**
 * Factory for creating exact breakpoint atoms (only renders on specific size).
 *
 * @param {string} targetBreakpoint - The exact breakpoint name
 * @returns {function} The exact responsive atom factory function
 */
const createExactBreakpointAtom = (targetBreakpoint) =>
	createBreakpointAtom((currentBreakpoint) => currentBreakpoint === targetBreakpoint);

/**
 * Renders only on xs breakpoint (0-639px).
 *
 * @param {function} callback - The callback function to render the layout
 * @returns {object} The responsive atom
 */
export const OnXsOnly = createExactBreakpointAtom('xs');

/**
 * Renders only on sm breakpoint (640-767px).
 *
 * @param {function} callback - The callback function to render the layout
 * @returns {object} The responsive atom
 */
export const OnSmOnly = createExactBreakpointAtom('sm');

/**
 * Renders only on md breakpoint (768-1023px).
 *
 * @param {function} callback - The callback function to render the layout
 * @returns {object} The responsive atom
 */
export const OnMdOnly = createExactBreakpointAtom('md');

/**
 * Renders only on lg breakpoint (1024-1279px).
 *
 * @param {function} callback - The callback function to render the layout
 * @returns {object} The responsive atom
 */
export const OnLgOnly = createExactBreakpointAtom('lg');

/**
 * Renders only on xl breakpoint (1280-1535px).
 *
 * @param {function} callback - The callback function to render the layout
 * @returns {object} The responsive atom
 */
export const OnXlOnly = createExactBreakpointAtom('xl');

/**
 * Renders only on 2xl breakpoint (1536px+).
 *
 * @param {function} callback - The callback function to render the layout
 * @returns {object} The responsive atom
 */
export const On2XlOnly = createExactBreakpointAtom('2xl');

/**
 * Factory for creating semantic device breakpoint atoms.
 *
 * @param {string[]} targetBreakpoints - Array of breakpoint names that match this device
 * @returns {function} The semantic responsive atom factory function
 */
const createSemanticBreakpointAtom = (targetBreakpoints) =>
	createBreakpointAtom((currentBreakpoint) => targetBreakpoints.includes(currentBreakpoint));

/**
 * Renders on phone-sized devices (xs and sm breakpoints: 0-767px).
 * Includes extra small and small devices.
 *
 * @param {function} callback - The callback function to render the layout
 * @returns {object} The responsive atom
 */
export const OnPhone = createSemanticBreakpointAtom(['xs', 'sm']);

/**
 * Renders on tablet-sized devices (md breakpoint: 768-1023px).
 * Includes medium devices.
 *
 * @param {function} callback - The callback function to render the layout
 * @returns {object} The responsive atom
 */
export const OnTablet = createSemanticBreakpointAtom(['md']);

/**
 * Renders on desktop-sized devices (lg, xl, 2xl breakpoints: 1024px+).
 * Includes large, extra large, and 2x extra large devices.
 *
 * @param {function} callback - The callback function to render the layout
 * @returns {object} The responsive atom
 */
export const OnDesktop = createSemanticBreakpointAtom(['lg', 'xl', '2xl']);

/**
 * Tears down the size tracking system and allows it to be lazily
 * re-initialized by the next responsive atom (useful for tests,
 * HMR, and teardown/re-init cycles).
 *
 * @returns {void}
 */
export const cleanupSizeTracker = () =>
{
	if (cleanup)
	{
		cleanup();
		cleanup = null;
	}
	isInitialized = false;
};


