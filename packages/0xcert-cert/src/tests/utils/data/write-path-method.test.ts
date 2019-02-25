import { Spec } from '@hayspec/spec';
import { writePath } from '../../../utils/data';

const spec = new Spec();

spec.test('writes JSON property at path', async (ctx) => {
  ctx.deepEqual(writePath(['a'], 1, {}), { a: 1 });
  ctx.deepEqual(writePath(['b', 1], 'foo', {}), { b: [null, 'foo'] });
  ctx.deepEqual(writePath(['c', 1, 'd'], 'foo', {}), { c: [null, { d: 'foo'}] });
  ctx.deepEqual(writePath(['c', 2, 'd'], 'foo', { c: [{ d: 'bar'}] }), { c: [{ d: 'bar'}, null, { d: 'foo'}] });
  ctx.deepEqual(writePath(['b', 0], 'foo', { 'a': 'bar' }), { a: 'bar', b: ['foo'] });
});

export default spec;
