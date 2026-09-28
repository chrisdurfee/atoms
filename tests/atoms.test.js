import { Builder } from '@base-framework/base';
import { afterEach, describe, expect, it } from 'vitest';
import { Doctype, Head, Link, Meta, Title } from '../src/atoms.js';
import { createContainer } from './helpers.js';

afterEach(() =>
{
	document.body.innerHTML = '';
});

/**
 * This will build a layout and return the container.
 *
 * @param {object} layout
 * @returns {HTMLElement}
 */
const render = (layout) =>
{
	const container = createContainer();
	Builder.build(layout, container, null);
	return container;
};

describe('document head atoms', () =>
{
	it('Title accepts a string', () =>
	{
		const layout = Title('Hello');
		expect(layout.tag).toBe('title');
		expect(layout[0]).toBeUndefined();

		const title = render(layout).querySelector('title');
		expect(title.textContent).toBe('Hello');
	});

	it('Title keeps object props working', () =>
	{
		const title = render(Title({ text: 'From props' })).querySelector('title');
		expect(title.textContent).toBe('From props');
	});

	it('Meta and Link keep object props working', () =>
	{
		const container = render(Head([
			Meta({ name: 'description', content: 'Test' }),
			Link({ rel: 'stylesheet', href: '/app.css' })
		]));

		const meta = container.querySelector('meta');
		expect(meta.getAttribute('name')).toBe('description');
		expect(meta.getAttribute('content')).toBe('Test');

		const link = container.querySelector('link');
		expect(link.getAttribute('rel')).toBe('stylesheet');
		expect(link.getAttribute('href')).toBe('/app.css');
	});

	it('Doctype keeps its tag and props', () =>
	{
		const layout = Doctype({ html: true });
		expect(layout.tag).toBe('DOCTYPE');
		expect(layout.html).toBe(true);
		expect(Doctype().tag).toBe('DOCTYPE');
	});
});
