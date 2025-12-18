import { Builder } from "@base-framework/base";
import { Comment as BaseComment } from "../comment.js";

/**
 * This will set up the update layout function.
 *
 * @param {function} callBack
 * @param {object} ele
 * @param {object} parent
 * @returns {function}
 */
const updateLayout = (callBack, ele, parent) =>
{
	/**
	 * This will remove the previous element if it exists.
	 */
	if (ele._prevEle)
	{
		Builder.removeNode(ele._prevEle);
		ele._prevEle = null;
	}

	const layout = callBack(parent);
	if (layout === undefined)
	{
		return;
	}

	/**
	 * This will build the layout and insert it after the
	 * comment element.
	 */
	const frag = Builder.build(layout, null, parent);
	ele._prevEle = frag.childNodes[0];

	ele.parentNode.insertBefore(frag, ele.nextSibling);
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
	onDestroyed: (ele) =>
	{
		if (ele._prevEle)
		{
			Builder.removeNode(ele._prevEle);
			ele._prevEle = null;
		}
	}
});

/**
 * This will create a use parent tag.
 *
 * @param {function} callBack
 * @returns {object}
 */
export const UseParent = (callBack) =>
{
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