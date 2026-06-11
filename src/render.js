import { Builder } from "@base-framework/base";

/**
 * Removes the previously rendered nodes tracked on a placeholder
 * element. Layouts can build to multiple root nodes, so every root
 * node is tracked and removed to prevent orphaned DOM nodes.
 *
 * @param {object} ele - The placeholder comment element.
 * @returns {void}
 */
export const removePreviousNodes = (ele) =>
{
	const nodes = ele._prevNodes;
	if (!nodes)
	{
		return;
	}

	for (const node of nodes)
	{
		Builder.removeNode(node);
	}
	ele._prevNodes = null;
};

/**
 * Builds a layout and inserts it after the placeholder comment,
 * tracking every root node so multi-root layouts can be fully
 * removed on the next update or when the placeholder is destroyed.
 *
 * @param {object} layout - The layout to build.
 * @param {object} ele - The placeholder comment element.
 * @param {object} parent - The parent component.
 * @returns {void}
 */
export const insertAfterPlaceholder = (layout, ele, parent) =>
{
	const frag = Builder.build(layout, null, parent);
	ele._prevNodes = Array.from(frag.childNodes);
	ele.parentNode.insertBefore(frag, ele.nextSibling);
};
