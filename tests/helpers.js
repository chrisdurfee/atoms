import { Builder, Component, Data } from '@base-framework/base';

/**
 * This will wait until every pending publish batch has been delivered.
 *
 * @returns {Promise<void>}
 */
export const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * This will create a container element attached to the document body.
 *
 * @returns {HTMLElement}
 */
export const createContainer = () =>
{
	const container = document.createElement('div');
	document.body.appendChild(container);
	return container;
};

/**
 * This will mount a layout into a new container inside a component
 * that owns the given data.
 *
 * @param {object} layout
 * @param {object} [values={}]
 * @param {object} [props={}] - Props passed to the host component.
 * @returns {{ container: HTMLElement, data: object, parent: object }}
 */
export const mount = (layout, values = {}, props = {}) =>
{
	class Host extends Component
	{
		/**
		 * @returns {object}
		 */
		setData()
		{
			return new Data(values);
		}

		/**
		 * @returns {object}
		 */
		render()
		{
			return layout;
		}
	}

	const parent = new Host(props);
	const container = createContainer();
	Builder.render(parent, container);
	return { container, data: parent.data, parent };
};
