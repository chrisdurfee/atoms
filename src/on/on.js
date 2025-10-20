import { Builder, dataBinder } from "@base-framework/base";
import { Comment as BaseComment } from "src/comment.js";

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
		return (value === expectedValue) ? callback(value, ele, parent) : fallback;
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
	return createEqualityCallback(callback, true, fallback);
};



/**
 * Generic factory for creating conditional rendering atoms.
 *
 * @param {string} dataSourceType - The type of data source to use
 * @param {string|null} [defaultProp=null] - Default property name for this atom type
 * @param {function|null} [callbackTransformer=null] - Function to transform the callback
 * @returns {function} The atom factory function
 */
const createConditionalAtom = (dataSourceType, defaultProp = null, callbackTransformer = null) =>
{
	return (...args) =>
	{
		const settings = [...args];
		const callback = settings.pop();
		if (typeof callback !== 'function')
		{
			return;
		}

		return Comment(
		{
			onCreated: (ele, parent) =>
			{
				// Auto-inject data source if not provided
				if (settings.length < (defaultProp ? 1 : 2))
				{
					const data = getDataSource(parent, dataSourceType);
					settings.unshift(data);
				}

				// Use default property if provided and not specified
				const prop = defaultProp || settings[1];
				const finalCallback = callbackTransformer ? callbackTransformer(callback, settings) : callback;

				const update = updateLayout(finalCallback, ele, prop, parent);
				dataBinder.watch(ele, settings[0], prop, update);
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
			return;
		}

		return Comment(
		{
			onCreated: (ele, parent) =>
			{
				if (settings.length < 2 || typeof settings[0] === 'function')
				{
					const data = getDataSource(parent, dataSourceType);
					settings.unshift(data);
				}

				const finalCallback = callbackTransformer(callback, settings);
				const update = updateLayout(finalCallback, ele, prop, parent);
				dataBinder.watch(ele, settings[0], prop, update);
			}
		});
	};
};



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
	 * This will hold the previous child element to
	 * help remove it when updating.
	 *
	 * @type {(object|null)} prevEle
	 */
	let prevEle = null;

	/**
	 * This will update the layout.
	 *
	 * @param {object} value
	 * @returns {void}
	 */
	return (value) =>
	{
		let layout = callBack(value, ele, parent);
		if (layout === undefined)
		{
			return;
		}

		/**
		 * This will remove the previous element if it exists.
		 */
		if (prevEle)
		{
			Builder.removeNode(prevEle);
		}

		/**
		 * This will build the layout and insert it after the
		 * comment element.
		 */
		const frag = Builder.build(layout, null, parent);
		prevEle = frag.children[0];

		ele.parentNode.insertBefore(frag, ele.nextSibling);
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
	onCreated: props.onCreated
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
	null,
	(callback, settings) => createEqualityCallback(callback, settings[2])
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
	null,
	(callback, settings) => createEqualityCallback(callback, settings[2])
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
 *
 * @overload
 * @param {function} callBack
 *
 * @returns {object}
 */
export const OnOpen = createLoadStyleAtom(
	DATA_SOURCES.PARENT,
	'open',
	(callback) => createBooleanCallback(callback)
);

/**
 * This will create an on state open tag.
 *
 * @overload
 * @param {object} data
 * @param {function} callBack
 *
 * @overload
 * @param {function} callBack
 *
 * @returns {object}
 */
export const OnStateOpen = createLoadStyleAtom(
	DATA_SOURCES.STATE,
	'open',
	(callback) => createBooleanCallback(callback)
);

// Re-export responsive atoms from on-size.js for backward compatibility
export { On2Xl, OnLg, OnMd, OnSm, OnXl, OnXs } from './on-size.js';

