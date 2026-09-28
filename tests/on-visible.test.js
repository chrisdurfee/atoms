import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Div, Img, OnVisible } from '../src/atoms.js';
import { flush, mount } from './helpers.js';

/**
 * A controllable IntersectionObserver stand-in.
 */
class FakeObserver
{
	static instances = [];

	constructor(callback, options)
	{
		this.callback = callback;
		this.options = options;
		this.targets = new Set();
		FakeObserver.instances.push(this);
	}

	observe(ele)
	{
		this.targets.add(ele);
	}

	unobserve(ele)
	{
		this.targets.delete(ele);
	}

	/**
	 * This will report the targets as visible.
	 */
	reveal()
	{
		this.callback([...this.targets].map((target) => ({ target, isIntersecting: true })));
	}
}

afterEach(() =>
{
	document.body.innerHTML = '';
});

describe('OnVisible', () =>
{
	beforeEach(() =>
	{
		FakeObserver.instances = [];
		vi.stubGlobal('IntersectionObserver', FakeObserver);
	});

	afterEach(() =>
	{
		vi.unstubAllGlobals();
	});

	it('shows the placeholder and reserved height until visible', async () =>
	{
		const callback = vi.fn(() => Div({ class: 'content' }));
		const { container } = mount(Div([
			OnVisible(callback, { minHeight: '300px', placeholder: Div({ class: 'placeholder' }), rootMargin: '10px' })
		]));

		const wrapper = container.querySelector('.placeholder').parentNode;
		expect(wrapper.style.minHeight).toBe('300px');
		expect(callback).not.toHaveBeenCalled();

		const observer = FakeObserver.instances.find((item) => item.options.rootMargin === '10px');
		observer.reveal();
		await flush();

		expect(callback).toHaveBeenCalledTimes(1);
		expect(container.querySelector('.placeholder')).toBeNull();
		expect(container.querySelector('.content')).not.toBeNull();
		expect(wrapper.style.minHeight).toBe('');
		expect(observer.targets.size).toBe(0);
	});

	it('stops observing when destroyed before it is visible', () =>
	{
		const { container, parent } = mount(Div([
			OnVisible(() => Div(), { rootMargin: '20px' })
		]));

		const observer = FakeObserver.instances.find((item) => item.options.rootMargin === '20px');
		expect(observer.targets.size).toBe(1);

		parent.destroy();
		expect(observer.targets.size).toBe(0);
		expect(container.children.length).toBe(0);
	});
});

describe('OnVisible without IntersectionObserver', () =>
{
	it('renders the content at once', () =>
	{
		vi.stubGlobal('IntersectionObserver', undefined);
		const { container } = mount(Div([
			OnVisible(() => Div({ class: 'content' }), { placeholder: Div({ class: 'placeholder' }) })
		]));

		expect(container.querySelector('.content')).not.toBeNull();
		expect(container.querySelector('.placeholder')).toBeNull();
		vi.unstubAllGlobals();
	});
});

describe('Img', () =>
{
	it('decodes asynchronously unless told otherwise', () =>
	{
		const { container } = mount(Div([
			Img({ src: 'a.png', class: 'one' }),
			Img({ src: 'b.png', class: 'two', decoding: 'sync' })
		]));

		const read = (ele) => ele.getAttribute('decoding') || ele.decoding;
		expect(read(container.querySelector('.one'))).toBe('async');
		expect(read(container.querySelector('.two'))).toBe('sync');
	});
});
