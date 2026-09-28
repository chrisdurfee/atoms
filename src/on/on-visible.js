import { Builder } from "@base-framework/base";

/**
 * Shared intersection observers keyed by root margin, so every
 * OnVisible on a page with the same margin uses one observer.
 *
 * @type {Map<string, IntersectionObserver>}
 */
const observers = new Map();

/**
 * The callbacks waiting for their element to become visible.
 *
 * @type {WeakMap<Element, function>}
 */
const pending = new WeakMap();

/**
 * This will get the shared observer for a root margin.
 *
 * @param {string} rootMargin
 * @returns {IntersectionObserver}
 */
const getObserver = (rootMargin) =>
{
	let observer = observers.get(rootMargin);
	if (observer)
	{
		return observer;
	}

	observer = new IntersectionObserver((entries) =>
	{
		for (const entry of entries)
		{
			if (!entry.isIntersecting)
			{
				continue;
			}

			const show = pending.get(entry.target);
			if (show)
			{
				show();
			}
		}
	}, { rootMargin });

	observers.set(rootMargin, observer);
	return observer;
};

/**
 * This will stop watching an element.
 *
 * @param {Element} ele
 * @param {string} rootMargin
 * @returns {void}
 */
const unobserve = (ele, rootMargin) =>
{
	pending.delete(ele);

	const observer = observers.get(rootMargin);
	if (observer)
	{
		observer.unobserve(ele);
	}
};

/**
 * This will build the content into the wrapper once.
 *
 * @param {Element} ele
 * @param {function} callBack
 * @param {object} parent
 * @returns {void}
 */
const renderContent = (ele, callBack, parent) =>
{
	let layout;
	try
	{
		layout = callBack(parent);
	}
	catch (error)
	{
		console.error('Base Atoms: an OnVisible callback threw an error.', error);
		return;
	}

	/**
	 * This will remove the placeholder and the reserved height
	 * before the content is added.
	 */
	while (ele.firstChild)
	{
		Builder.removeNode(ele.firstChild);
	}

	// @ts-ignore
	ele.style.minHeight = '';

	if (layout == null)
	{
		return;
	}

	try
	{
		Builder.build(layout, ele, parent);
	}
	catch (error)
	{
		console.error('Base Atoms: failed to build an OnVisible layout.', error);
	}
};

/**
 * This will render content only once its wrapper scrolls near the
 * viewport. Until then the wrapper holds the placeholder and a
 * reserved min height, so the page doesn't jump when it loads.
 *
 * Browsers without IntersectionObserver render the content at once.
 *
 * @param {function} callBack - Receives the parent and returns the layout.
 * @param {object} [options]
 * @param {object|null} [options.placeholder] - A layout shown until visible.
 * @param {string} [options.minHeight] - The height reserved until visible.
 * @param {string} [options.rootMargin='200px'] - How far ahead to load.
 * @param {string} [options.class] - The wrapper class.
 * @param {string} [options.tag='div'] - The wrapper tag.
 * @returns {object}
 *
 * @example
 * OnVisible(() => CommentsSection(), { minHeight: '480px', placeholder: Skeleton() })
 */
export const OnVisible = (callBack, options = {}) =>
{
	const {
		placeholder = null,
		minHeight = '',
		rootMargin = '200px',
		tag = 'div'
	} = options;

	return {
		tag,
		class: options.class,
		style: minHeight ? 'min-height:' + minHeight : undefined,
		children: placeholder ? [placeholder] : [],
		onCreated: (ele, parent) =>
		{
			if (typeof callBack !== 'function')
			{
				return;
			}

			if (typeof IntersectionObserver === 'undefined')
			{
				renderContent(ele, callBack, parent);
				return;
			}

			pending.set(ele, () =>
			{
				unobserve(ele, rootMargin);
				renderContent(ele, callBack, parent);
			});

			getObserver(rootMargin).observe(ele);
		},
		onDestroyed: (ele) =>
		{
			unobserve(ele, rootMargin);
		}
	};
};

export default OnVisible;
