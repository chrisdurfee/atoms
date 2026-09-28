import { dataBinder } from "@base-framework/base";
import { Comment as BaseComment } from "../comment.js";
import { insertAfterPlaceholder, removePreviousNodes } from "../render.js";

/**
 * Data source types for conditional rendering atoms.
 */
const DATA_SOURCES =
{
	PARENT: 'parent',
	STATE: 'state',
	ROUTE: 'route'
};

/**
 * Gets the appropriate data source based on the type.
 *
 * @param {object} parent - The parent component
 * @param {string} sourceType - The data source type
 * @returns {object|null} The data source
 */
const getDataSource = (parent, sourceType) =>
{
	switch (sourceType)
	{
		case DATA_SOURCES.PARENT:
			return getParentData(parent);
		case DATA_SOURCES.STATE:
			return parent ? parent.state : null;
		case DATA_SOURCES.ROUTE:
			return parent ? parent.route : null;
		default:
			return null;
	}
};

/**
 * Resolves a fallback value. Function fallbacks are invoked so they
 * can return a layout; any other value is returned as-is.
 *
 * @param {*} fallback - The fallback value or function
 * @param {*} value - The current watched value
 * @param {object} ele - The placeholder element
 * @param {object} parent - The parent component
 * @returns {*} The resolved fallback layout
 */
const resolveFallback = (fallback, value, ele, parent) =>
{
	return (typeof fallback === 'function') ? fallback(value, ele, parent) : fallback;
};

/**
 * Creates a conditional callback that only executes when the value equals the expected value.
 *
 * @param {function} callback - The callback to execute
 * @param {*} expectedValue - The value to compare against
 * @param {*} [fallback=null] - The fallback value when condition is not met
 * @returns {function} The conditional callback
 */
const createEqualityCallback = (callback, expectedValue, fallback = null) =>
{
	return (value, ele, parent) =>
	{
		return (value === expectedValue)
			? callback(value, ele, parent)
			: resolveFallback(fallback, value, ele, parent);
	};
};

/**
 * Creates a conditional callback that only executes when the value is truthy.
 *
 * @param {function} callback - The callback to execute
 * @param {*} [fallback=null] - The fallback value when condition is not met
 * @returns {function} The conditional callback
 */
const createBooleanCallback = (callback, fallback = null) =>
{
	return (value, ele, parent) =>
	{
		return (value)
			? callback(value, ele, parent)
			: resolveFallback(fallback, value, ele, parent);
	};
};

/**
 * Generic factory for creating conditional rendering atoms.
 *
 * @param {string} dataSourceType - The type of data source to use
 * @param {function|null} [callbackTransformer=null] - Function to transform the callback
 * @param {number} [requiredArgs=2] - Number of args (excluding callback) that indicate data source was provided
 * @param {function|null} [rendersUndefined=null] - Predicate receiving the resolved settings that returns true when the atom renders something for an undefined value
 * @returns {function} The atom factory function
 */
const createConditionalAtom = (dataSourceType, callbackTransformer = null, requiredArgs = 2, rendersUndefined = null) =>
{
	return (...args) =>
	{
		const settings = [...args];
		const callback = settings.pop();
		if (typeof callback !== 'function')
		{
			return null;
		}

		return Comment(
		{
			onCreated: (ele, parent) =>
			{
				const localSettings = [...settings];

				/**
				 * Auto-inject the data source if not provided. When no
				 * data source is passed, the first argument is the prop
				 * name (a string), so a string first argument also
				 * indicates the data source was omitted.
				 */
				if (localSettings.length < requiredArgs || typeof localSettings[0] === 'string')
				{
					const data = getDataSource(parent, dataSourceType);
					localSettings.unshift(data);
				}

				const data = localSettings[0];
				const prop = localSettings[1];
				if (!data || typeof prop !== 'string')
				{
					console.error('Base Atoms: unable to resolve the data source or property for a conditional atom.', { data, prop });
					return;
				}

				const finalCallback = callbackTransformer ? callbackTransformer(callback, localSettings) : callback;
				const renderUndefined = rendersUndefined ? rendersUndefined(localSettings) : false;
				const update = updateLayout(finalCallback, ele, prop, parent, renderUndefined);
				dataBinder.watch(ele, data, prop, update);
			}
		});
	};
};

/**
 * Checks whether load-style atom settings include a fallback layout.
 *
 * @param {Array<any>} settings - The resolved settings (data, callback, fallback)
 * @returns {boolean}
 */
const hasFallback = (settings) => settings.length === 3 && settings[2] != null;

/**
 * Special factory for OnLoad-style functions that have different argument patterns.
 *
 * @param {string} dataSourceType - The type of data source to use
 * @param {string} prop - The property name to watch
 * @param {function} callbackTransformer - Function to transform the callback
 * @param {function|null} [rendersUndefined=null] - Predicate receiving the resolved settings that returns true when the atom renders something for an undefined value
 * @returns {function} The atom factory function
 */
const createLoadStyleAtom = (dataSourceType, prop, callbackTransformer, rendersUndefined = null) =>
{
	return (...args) =>
	{
		const settings = [...args];
		const callback = (typeof settings[0] === 'function') ? settings[0] : settings[1];
		if (typeof callback !== 'function')
		{
			return null;
		}

		return Comment(
		{
			onCreated: (ele, parent) =>
			{
				const localSettings = [...settings];

				if (localSettings.length < 2 || typeof localSettings[0] === 'function')
				{
					const data = getDataSource(parent, dataSourceType);
					localSettings.unshift(data);
				}

				const data = localSettings[0];
				if (!data)
				{
					console.error('Base Atoms: unable to resolve the data source for a conditional atom.');
					return;
				}

				const finalCallback = callbackTransformer(callback, localSettings);
				const renderUndefined = rendersUndefined ? rendersUndefined(localSettings) : false;
				const update = updateLayout(finalCallback, ele, prop, parent, renderUndefined);
				dataBinder.watch(ele, data, prop, update);
			}
		});
	};
};

/**
 * Checks if a value is a non-null object (including arrays).
 *
 * @param {*} value
 * @returns {boolean}
 */
const isObject = (value) => value !== null && typeof value === 'object';

/**
 * Sentinel marking a placeholder that has not rendered yet. It can
 * never equal a published value, so the first publish is always
 * distinguishable from a repeated one.
 *
 * @type {object}
 */
const NOT_RENDERED = {};

/**
 * This will set up the update layout function.
 *
 * @param {function} callBack
 * @param {object} ele
 * @param {string} prop
 * @param {object} parent
 * @param {boolean} [renderUndefined=false] - Render the first publish even when the value is undefined
 * @returns {function}
 */
const updateLayout = (callBack, ele, prop, parent, renderUndefined = false) =>
{
	/**
	 * @type {*} lastValue - Tracks the last rendered value to
	 * skip redundant updates for primitive values.
	 *
	 * Starting as the NOT_RENDERED sentinel lets the immediate
	 * publish from dataBinder.watch() be skipped when the watched
	 * value has not been set yet (undefined). Without this, every
	 * conditional atom on a page renders its empty branch on mount
	 * and then tears it down and rebuilds when the real value
	 * arrives, doubling the render work on every page switch. When
	 * the watched value already exists at mount (route params, app
	 * state, resumed components), the initial publish carries a
	 * defined value and renders normally.
	 *
	 * Atoms that render something for undefined (a fallback such
	 * as a loading skeleton, or an If comparing to undefined) set
	 * renderUndefined so that first publish is not skipped.
	 */
	let lastValue = NOT_RENDERED;

	/**
	 * This will update the layout.
	 *
	 * @param {object} value
	 * @returns {void}
	 */
	return (value) =>
	{
		/**
		 * Skip the undefined publishes that arrive before the
		 * first render when nothing would be rendered for them.
		 */
		if (lastValue === NOT_RENDERED && value === undefined && !renderUndefined)
		{
			return;
		}

		/**
		 * Skip redundant updates for the same primitive value.
		 * Object values (arrays, objects) always pass through
		 * since their contents may have changed.
		 */
		if (value === lastValue && !isObject(value))
		{
			return;
		}

		/**
		 * Guard against the comment element being detached
		 * from the DOM (e.g. parent was removed during an
		 * update cycle) before running the user callback.
		 */
		if (!ele.parentNode)
		{
			lastValue = value;
			removePreviousNodes(ele);
			return;
		}

		/**
		 * The user callback and layout build are wrapped so a
		 * throwing callback cannot break the data pub/sub flush
		 * and silently kill all subsequent updates.
		 *
		 * The callback runs before the previous nodes are
		 * removed, so a throwing callback leaves the previous
		 * render in place and a later publish of the same value
		 * retries.
		 *
		 * The previous nodes are still removed before the new
		 * layout is built. Building first would let a new
		 * persisted child resume the scope of the child it is
		 * replacing while that child is still alive, and the old
		 * child's teardown would then drop the new child's
		 * persisted entry.
		 */
		let layout;
		try
		{
			layout = callBack(value, ele, parent);
		}
		catch (error)
		{
			console.error('Base Atoms: a conditional render callback threw an error.', error);
			return;
		}

		if (layout == null)
		{
			lastValue = value;
			removePreviousNodes(ele);
			return;
		}

		lastValue = value;
		removePreviousNodes(ele);

		/**
		 * The callback may have detached the placeholder while
		 * it ran, so there is nowhere left to insert.
		 */
		if (!ele.parentNode)
		{
			return;
		}

		/**
		 * This will build the layout and insert it after the
		 * comment element.
		 */
		try
		{
			insertAfterPlaceholder(layout, ele, parent);
		}
		catch (error)
		{
			console.error('Base Atoms: failed to build a conditional layout.', error);
		}
	};
};

/**
 * This will create a comment.
 *
 * @param {object} props
 * @returns {object}
 */
const Comment = (props) => BaseComment({
	type: 'on',
	onCreated: props.onCreated,
	onDestroyed: (ele) => removePreviousNodes(ele)
});

/**
 * This will get the parent set data.
 *
 * @param {object} parent
 * @returns {object|null}
 */
export const getParentData = (parent) =>
{
	if (!parent)
	{
		return null;
	}

	if (parent.data)
	{
		return parent.data;
	}

	if (parent.context && parent.context.data)
	{
		return parent.context.data;
	}

	if (parent.state)
	{
		return parent.state;
	}

	return null;
};

/**
 * This will create an on data tag.
 *
 * @overload
 * @param {object} data
 * @param {string} prop
 * @param {function} callBack
 *
 * @overload
 * @param {string} prop
 * @param {function} callBack
 *
 * @returns {object}
 */
export const On = createConditionalAtom(DATA_SOURCES.PARENT);

/**
 * This will create an on state tag.
 *
 * @overload
 * @param {object} data
 * @param {string} prop
 * @param {function} callBack
 *
 * @overload
 * @param {string} prop
 * @param {function} callBack
 *
 * @returns {object}
 */
export const OnState = createConditionalAtom(DATA_SOURCES.STATE);

/**
 * This will create an on route tag.
 *
 * @overload
 * @param {object} data
 * @param {string} prop
 * @param {function} callBack
 *
 * @overload
 * @param {string} prop
 * @param {function} callBack
 *
 * @returns {object}
 */
export const OnRoute = createConditionalAtom(DATA_SOURCES.ROUTE);

/**
 * This will create a match data tag. The watched value is passed to
 * the predicate and the layout is only rebuilt when the predicate
 * result flips, so value changes that keep the same match (e.g. a
 * breakpoint moving from lg to xl for a desktop atom) don't rebuild
 * the subtree. The callback is only called while the predicate
 * matches; nothing is rendered otherwise.
 *
 * @param {object} data - The data source to watch
 * @param {string} prop - The property name to watch
 * @param {function(*): boolean} matches - Predicate for the watched value
 * @param {function} callBack - Called with (value, ele, parent) when the predicate matches
 * @returns {object|null}
 */
export const OnMatch = (data, prop, matches, callBack) =>
{
	if (typeof callBack !== 'function')
	{
		return null;
	}

	return Comment(
	{
		onCreated: (ele, parent) =>
		{
			if (!data || typeof prop !== 'string')
			{
				console.error('Base Atoms: unable to resolve the data source or property for a conditional atom.', { data, prop });
				return;
			}

			const update = updateLayout(
				(value) => matches(value) ? callBack(value, ele, parent) : null,
				ele,
				prop,
				parent
			);

			/**
			 * @type {boolean|null} lastMatch - The last predicate
			 * result, null until the first publish.
			 */
			let lastMatch = null;
			dataBinder.watch(ele, data, prop, (value) =>
			{
				const matched = (matches(value) === true);
				if (matched === lastMatch)
				{
					return;
				}

				lastMatch = matched;
				update(value);
			});
		}
	});
};

/**
 * This will create an if data tag.
 *
 * @overload
 * @param {object} data
 * @param {string} prop
 * @param {*} value
 * @param {function} callBack
 *
 * @overload
 * @param {string} prop
 * @param {*} value
 * @param {function} callBack
 *
 * @returns {object}
 */
export const If = createConditionalAtom(
	DATA_SOURCES.PARENT,
	(callback, settings) => createEqualityCallback(callback, settings[2]),
	3,
	(settings) => settings[2] === undefined
);

/**
 * This will create an if state tag.
 *
 * @overload
 * @param {object} data
 * @param {string} prop
 * @param {*} value
 * @param {function} callBack
 *
 * @overload
 * @param {string} prop
 * @param {*} value
 * @param {function} callBack
 *
 * @returns {object}
 */
export const IfState = createConditionalAtom(
	DATA_SOURCES.STATE,
	(callback, settings) => createEqualityCallback(callback, settings[2]),
	3,
	(settings) => settings[2] === undefined
);

/**
 * This will create an on load data tag.
 *
 * @overload
 * @param {object} data
 * @param {function} callBack
 * @param {function|object|null} [notLoaded=null]
 *
 * @overload
 * @param {function} callBack
 * @param {function|object|null} [notLoaded=null]
 *
 * @returns {object}
 */
export const OnLoad = createLoadStyleAtom(
	DATA_SOURCES.PARENT,
	'loaded',
	(callback, settings) =>
	{
		const notLoaded = (settings.length === 3) ? settings[2] : null;
		return createBooleanCallback(callback, notLoaded);
	},
	hasFallback
);

/**
 * This will create an on state load tag.
 *
 * @overload
 * @param {object} data
 * @param {function} callBack
 * @param {function|object|null} [notLoaded=null]
 *
 * @overload
 * @param {function} callBack
 * @param {function|object|null} [notLoaded=null]
 *
 * @returns {object}
 */
export const OnStateLoad = createLoadStyleAtom(
	DATA_SOURCES.STATE,
	'loaded',
	(callback, settings) =>
	{
		const notLoaded = (settings.length === 3) ? settings[2] : null;
		return createBooleanCallback(callback, notLoaded);
	},
	hasFallback
);

/**
 * This will create an on open data tag.
 *
 * @overload
 * @param {object} data
 * @param {function} callBack
 * @param {function|object|null} [notOpen=null]
 *
 * @overload
 * @param {function} callBack
 * @param {function|object|null} [notOpen=null]
 *
 * @returns {object}
 */
export const OnOpen = createLoadStyleAtom(
	DATA_SOURCES.PARENT,
	'open',
	(callback, settings) =>
	{
		const notOpen = (settings.length === 3) ? settings[2] : null;
		return createBooleanCallback(callback, notOpen);
	},
	hasFallback
);

/**
 * This will create an on state open tag.
 *
 * @overload
 * @param {object} data
 * @param {function} callBack
 * @param {function|object|null} [notOpen=null]
 *
 * @overload
 * @param {function} callBack
 * @param {function|object|null} [notOpen=null]
 *
 * @returns {object}
 */
export const OnStateOpen = createLoadStyleAtom(
	DATA_SOURCES.STATE,
	'open',
	(callback, settings) =>
	{
		const notOpen = (settings.length === 3) ? settings[2] : null;
		return createBooleanCallback(callback, notOpen);
	},
	hasFallback
);

// Re-export responsive atoms from on-size.js for backward compatibility
export { On2Xl, On2XlOnly, OnDesktop, OnLg, OnLgOnly, OnMd, OnMdOnly, OnPhone, OnSm, OnSmOnly, OnTablet, OnXl, OnXlOnly, OnXs, OnXsOnly } from './on-size.js';

