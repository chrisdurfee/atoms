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
			return parent.state;
		case DATA_SOURCES.ROUTE:
			return parent.route;
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
 * @returns {function} The atom factory function
 */
const createConditionalAtom = (dataSourceType, callbackTransformer = null, requiredArgs = 2) =>
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
				const update = updateLayout(finalCallback, ele, prop, parent);
				dataBinder.watch(ele, data, prop, update);
			}
		});
	};
};

/**
 * Special factory for OnLoad-style functions that have different argument patterns.
 *
 * @param {string} dataSourceType - The type of data source to use
 * @param {string} prop - The property name to watch
 * @param {function} callbackTransformer - Function to transform the callback
 * @returns {function} The atom factory function
 */
const createLoadStyleAtom = (dataSourceType, prop, callbackTransformer) =>
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
				const update = updateLayout(finalCallback, ele, prop, parent);
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
 * This will set up the update layout function.
 *
 * @param {function} callBack
 * @param {object} ele
 * @param {string} prop
 * @param {object} parent
 * @returns {function}
 */
const updateLayout = (callBack, ele, prop, parent) =>
{
	/**
	 * @type {*} lastValue - Tracks the last rendered value to
	 * skip redundant updates for primitive values.
	 *
	 * Starting as undefined intentionally skips the immediate
	 * publish from dataBinder.watch() when the watched value has
	 * not been set yet. Without this, every conditional atom on a
	 * page renders its empty/fallback branch on mount and then
	 * tears it down and rebuilds when the real value arrives,
	 * doubling the render work on every page switch. When the
	 * watched value already exists at mount (route params, app
	 * state, resumed components), the initial publish carries a
	 * defined value and renders normally.
	 */
	let lastValue;

	/**
	 * This will update the layout.
	 *
	 * @param {object} value
	 * @returns {void}
	 */
	return (value) =>
	{
		/**
		 * Skip redundant updates for the same primitive value.
		 * Object values (arrays, objects) always pass through
		 * since their contents may have changed.
		 */
		if (value === lastValue && !isObject(value))
		{
			return;
		}
		lastValue = value;

		/**
		 * This will remove the previous nodes if they exist.
		 */
		removePreviousNodes(ele);

		/**
		 * Guard against the comment element being detached
		 * from the DOM (e.g. parent was removed during an
		 * update cycle) before running the user callback.
		 */
		if (!ele.parentNode)
		{
			return;
		}

		/**
		 * The user callback and layout build are wrapped so a
		 * throwing callback cannot break the data pub/sub flush
		 * and silently kill all subsequent updates.
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
	3
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
	3
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
	}
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
	}
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
	}
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
	}
);

// Re-export responsive atoms from on-size.js for backward compatibility
export { On2Xl, On2XlOnly, OnDesktop, OnLg, OnLgOnly, OnMd, OnMdOnly, OnPhone, OnSm, OnSmOnly, OnTablet, OnXl, OnXlOnly, OnXs, OnXsOnly } from './on-size.js';

