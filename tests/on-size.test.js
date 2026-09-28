import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanupSizeTracker, Div, OnDesktop, OnMdOnly, sizeData } from '../src/atoms.js';
import { flush, mount } from './helpers.js';

/**
 * This will set the window width and fire a resize event. The
 * requestAnimationFrame stub runs the frame in a microtask.
 *
 * @param {number} width
 * @returns {Promise<void>}
 */
const resize = async (width) =>
{
	Object.defineProperty(window, 'innerWidth', { value: width, configurable: true, writable: true });
	window.dispatchEvent(new Event('resize'));
	await flush();
};

beforeEach(() =>
{
	vi.stubGlobal('requestAnimationFrame', (cb) =>
	{
		queueMicrotask(() => cb(0));
		return 1;
	});
	vi.stubGlobal('cancelAnimationFrame', () => {});
	Object.defineProperty(window, 'innerWidth', { value: 1100, configurable: true, writable: true });
});

afterEach(() =>
{
	cleanupSizeTracker();
	vi.unstubAllGlobals();
	document.body.innerHTML = '';
});

describe('package exports', () =>
{
	it('re-exports sizeData and cleanupSizeTracker from the entry', () =>
	{
		expect(sizeData).toBeDefined();
		expect(typeof sizeData.get).toBe('function');
		expect(typeof cleanupSizeTracker).toBe('function');
	});
});

describe('breakpoint atoms', () =>
{
	it('only rebuilds when the match result flips', async () =>
	{
		const callback = vi.fn(() => Div({ class: 'desktop' }));
		const { container } = mount(Div([OnDesktop(callback)]));

		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback.mock.calls[0][0]).toBe('lg');
		const first = container.querySelector('.desktop');
		expect(first).not.toBeNull();

		await resize(1300);
		expect(sizeData.size).toBe('xl');
		expect(callback).toHaveBeenCalledTimes(1);
		expect(container.querySelector('.desktop')).toBe(first);

		await resize(800);
		expect(container.querySelector('.desktop')).toBeNull();
		expect(callback).toHaveBeenCalledTimes(1);

		await resize(1600);
		expect(callback).toHaveBeenCalledTimes(2);
		expect(callback.mock.calls[1][0]).toBe('2xl');
		expect(container.querySelector('.desktop')).not.toBeNull();
	});

	it('renders exact atoms only on their breakpoint', async () =>
	{
		const { container } = mount(Div([OnMdOnly(() => Div({ class: 'md' }))]));
		expect(container.querySelector('.md')).toBeNull();

		await resize(800);
		expect(container.querySelector('.md')).not.toBeNull();

		await resize(1100);
		expect(container.querySelector('.md')).toBeNull();
	});
});

describe('sizeData.width', () =>
{
	it('stays current within a breakpoint', async () =>
	{
		mount(Div([OnDesktop(() => Div())]));
		expect(sizeData.width).toBe(1100);

		await resize(1150);
		expect(sizeData.size).toBe('lg');
		expect(sizeData.width).toBe(1150);
	});
});
