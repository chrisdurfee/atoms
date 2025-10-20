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
 * Initialize the size tracking system.
 */
const initializeSizeTracker = () =>
{
	if (typeof window === 'undefined')
	{
		return;
	}

	// Set initial values
	const currentWidth = window.innerWidth;
	const currentBreakpoint = getBreakpointName(currentWidth);

	// @ts-ignore
	sizeData.size = currentBreakpoint;
	// @ts-ignore
	sizeData.width = currentWidth;

	/**
	 * Handle window resize events.
	 */
	const handleResize = () =>
	{
		const newWidth = window.innerWidth;
		const newBreakpoint = getBreakpointName(newWidth);

		// Only update if the breakpoint or width actually changed
		// @ts-ignore
		if (newWidth !== sizeData.width || newBreakpoint !== sizeData.size)
		{
			// @ts-ignore
			sizeData.width = newWidth;
			// @ts-ignore
			sizeData.size = newBreakpoint;
		}
	};

	// Add resize listener
	window.addEventListener('resize', handleResize);

	// Return cleanup function
	return () =>
	{
		window.removeEventListener('resize', handleResize);
	};
};

// Initialize the tracker immediately
let cleanup = null;
if (typeof window !== 'undefined')
{
	cleanup = initializeSizeTracker();
}

/**
 * Factory for creating responsive breakpoint atoms.
 *
 * @param {string} targetBreakpoint - The breakpoint name (xs, sm, md, lg, xl, 2xl)
 * @returns {function} The responsive atom factory function
 */
const createResponsiveAtom = (targetBreakpoint) =>
{
	return (callback) =>
	{
		if (typeof callback !== 'function')
		{
			return;
		}

		// Use the On atom to watch the sizeData.size property
		return On(sizeData, 'size', (currentBreakpoint, ele, parent) =>
		{
			// Check if current breakpoint meets the target requirement
			if (matchesBreakpoint(currentBreakpoint, targetBreakpoint))
			{
				// Pass the current width to the callback for additional context
				// @ts-ignore
				return callback(parent);
			}

			// Return null to prevent rendering when breakpoint doesn't match
			return null;
		});
	};
};

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
 * Export cleanup function for testing or manual cleanup.
 */
	export { cleanup as cleanupSizeTracker };


