import { Builder, Component } from '@base-framework/base';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Div, If, On, OnLoad, OnOpen } from '../src/atoms.js';
import { getParentData } from '../src/on/on.js';
import { createContainer, flush, mount } from './helpers.js';

afterEach(() =>
{
	document.body.innerHTML = '';
});

describe('undefined first publish', () =>
{
	it('renders the OnLoad fallback while loaded is undefined', async () =>
	{
		const { container, data } = mount(Div([
			OnLoad(() => Div({ class: 'content' }, 'loaded'), Div({ class: 'skeleton' }, 'loading'))
		]));

		expect(container.querySelector('.skeleton')).not.toBeNull();
		expect(container.querySelector('.content')).toBeNull();

		data.loaded = true;
		await flush();
		expect(container.querySelector('.skeleton')).toBeNull();
		expect(container.querySelector('.content')).not.toBeNull();
	});

	it('renders a function OnOpen fallback while open is undefined', () =>
	{
		const { container } = mount(Div([
			OnOpen(() => Div({ class: 'open' }), () => Div({ class: 'closed' }))
		]));

		expect(container.querySelector('.closed')).not.toBeNull();
	});

	it('renders If when comparing to undefined', () =>
	{
		const { container } = mount(Div([
			If('status', undefined, () => Div({ class: 'empty' }))
		]));

		expect(container.querySelector('.empty')).not.toBeNull();
	});

	it('still skips the undefined publish when there is no fallback', async () =>
	{
		const callback = vi.fn(() => Div({ class: 'content' }));
		const { container, data } = mount(Div([
			OnLoad(callback)
		]));

		expect(callback).not.toHaveBeenCalled();

		data.loaded = true;
		await flush();
		expect(callback).toHaveBeenCalledTimes(1);
		expect(container.querySelector('.content')).not.toBeNull();
	});

	it('still skips the undefined publish for On', () =>
	{
		const callback = vi.fn(() => Div({ class: 'content' }));
		mount(Div([
			On('missing', callback)
		]));

		expect(callback).not.toHaveBeenCalled();
	});
});

describe('callback before remove', () =>
{
	it('keeps the previous render when the callback throws', async () =>
	{
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		const { container, data } = mount(Div([
			On('mode', (mode) =>
			{
				if (mode === 'bad')
				{
					throw new Error('boom');
				}
				return Div({ class: 'mode-' + mode });
			})
		]), { mode: 'a' });

		expect(container.querySelector('.mode-a')).not.toBeNull();

		data.mode = 'bad';
		await flush();
		expect(error).toHaveBeenCalled();
		expect(container.querySelector('.mode-a')).not.toBeNull();

		data.mode = 'b';
		await flush();
		expect(container.querySelector('.mode-a')).toBeNull();
		expect(container.querySelector('.mode-b')).not.toBeNull();
	});

	it('logs a layout build failure without breaking later updates', async () =>
	{
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		const broken = {
			get tag()
			{
				throw new Error('build failed');
			}
		};

		const { container, data } = mount(Div([
			On('mode', (mode) => (mode === 'bad') ? broken : Div({ class: 'mode-' + mode }))
		]), { mode: 'a' });

		data.mode = 'bad';
		await flush();
		expect(error).toHaveBeenCalled();

		data.mode = 'b';
		await flush();
		expect(container.querySelector('.mode-b')).not.toBeNull();
	});

	it('keeps the persisted entry of a child that replaces a persisted child', async () =>
	{
		class Child extends Component
		{
			/**
			 * @returns {object}
			 */
			render()
			{
				return Div({ class: 'child' });
			}
		}

		const { data, parent } = mount(Div([
			On('mode', (mode) => new Child({ cache: 'child', mode }))
		]), { mode: 'a' }, { persist: true });

		data.mode = 'b';
		await flush();

		// @ts-ignore
		expect(parent.child.mode).toBe('b');
		// @ts-ignore
		expect(parent.persistedChildren['pk:child']).toBe(parent.child);
	});

	it('retries the same value after a failed render', async () =>
	{
		vi.spyOn(console, 'error').mockImplementation(() => {});
		let fail = true;
		const { container, data } = mount(Div([
			On('mode', (mode) =>
			{
				if (mode === 'b' && fail)
				{
					throw new Error('boom');
				}
				return Div({ class: 'mode-' + mode });
			})
		]), { mode: 'a' });

		data.mode = 'b';
		await flush();
		expect(container.querySelector('.mode-a')).not.toBeNull();

		fail = false;
		data.mode = 'c';
		data.mode = 'b';
		await flush();
		expect(container.querySelector('.mode-b')).not.toBeNull();
	});

	it('replaces multi-root layouts and removes them on null', async () =>
	{
		const { container, data } = mount(Div([
			On('count', (count) => (count > 0) ? [Div({ class: 'r1' }), Div({ class: 'r2' })] : null)
		]), { count: 1 });

		expect(container.querySelectorAll('.r1, .r2').length).toBe(2);

		data.count = 2;
		await flush();
		expect(container.querySelectorAll('.r1, .r2').length).toBe(2);

		data.count = 0;
		await flush();
		expect(container.querySelectorAll('.r1, .r2').length).toBe(0);
	});
});

describe('getParentData', () =>
{
	it('returns null for a missing parent', () =>
	{
		expect(getParentData(undefined)).toBeNull();
		expect(getParentData(null)).toBeNull();
	});

	it('does not throw for a top-level build without a parent', () =>
	{
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		const container = createContainer();

		expect(() => Builder.build(Div([On('x', () => Div())]), container, null)).not.toThrow();
		expect(error).toHaveBeenCalled();
	});
});
