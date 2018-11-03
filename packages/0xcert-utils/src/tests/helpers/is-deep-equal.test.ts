import { Spec } from '@hayspec/spec';
import { isDeepEqual } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.true(isDeepEqual('foo', 'foo'));
  ctx.true(isDeepEqual('', ''));
  ctx.false(isDeepEqual('', 'foo'));
  ctx.true(isDeepEqual(null, null));
  ctx.true(isDeepEqual(undefined, undefined));
  ctx.false(isDeepEqual(null, undefined));
  ctx.true(isDeepEqual(false, false));
  ctx.true(isDeepEqual(true, true));
  ctx.false(isDeepEqual(false, true));
  ctx.true(isDeepEqual({ a: 1, b: 2 }, { a: 1, b: 2 }));
  ctx.true(isDeepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }));
  ctx.true(isDeepEqual({ a: 1, b: { c: [1, 2] }}, { a: 1, b: { c: [1, 2] }}));
  ctx.false(isDeepEqual({ a: 1, b: { c: [1, 2] }}, { a: 1, b: { c: [2, 1] }}));
});

export default spec;
