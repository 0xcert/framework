import { Spec } from '@hayspec/spec';
import { toArray } from '../..';

const spec = new Spec();

spec.test('perform tests', (ctx) => {
  ctx.deepEqual(toArray(), null);
  ctx.deepEqual(toArray(undefined), null);
  ctx.deepEqual(toArray(null), null);
  ctx.deepEqual(toArray(NaN), []);
  ctx.deepEqual(toArray(Infinity), []);
  ctx.deepEqual(toArray([]), []);
  ctx.deepEqual(toArray({}), [{}]);
  ctx.deepEqual(toArray(''), ['']);
  ctx.deepEqual(toArray(0), [0]);
  ctx.deepEqual(toArray('john'), ['john']);
});

export default spec;
