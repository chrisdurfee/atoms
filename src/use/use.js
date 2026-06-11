import { Comment as BaseComment } from "../comment.js";
import { insertAfterPlaceholder, removePreviousNodes } from "../render.js";

/**
 * This will set up the update layout function.
 *
 * @param {function} callBack
 * @param {object} ele
 * @param {object} parent
 * @returns {void}
 */
const updateLayout = (callBack, ele, parent) =>
{
	/**
	 * This will remove the previous nodes if they exist.
	 */
	removePreviousNodes(ele);

	/**
	 * Guard against the comment element being detached
	 * from the DOM before running the user callback.
	 */
	if (!ele.parentNode)
	{
		return;
	}

	let layout;
	try
	{
		layout = callBack(parent);
	}
	catch (error)
	{
		console.error('Base Atoms: a UseParent callback threw an error.', error);
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
		console.error('Base Atoms: failed to build a UseParent layout.', error);
	}
};

/**
 * This will create a comment.
 *
 * @param {object} props
 * @returns {object}
 */
const Comment = (props) => BaseComment({
	type: 'use',
	onCreated: props.onCreated,
	onDestroyed: (ele) => removePreviousNodes(ele)
});

/**
 * This will create a use parent tag.
 *
 * @param {function} callBack
 * @returns {object}
 */
export const UseParent = (callBack) =>
{
	if (typeof callBack !== 'function')
	{
		return null;
	}

	/**
	 * This will create a comment to use as a placeholder
	 * to keep the layout in place.
	 */
	return Comment({
		onCreated: (ele, parent) =>
		{
			updateLayout(callBack, ele, parent);
		}
	});
};