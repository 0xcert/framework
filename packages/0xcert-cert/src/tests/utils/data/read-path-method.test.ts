import { Spec } from '@hayspec/spec';
import { readPath } from '../../../utils/data';

const spec = new Spec();

spec.test('reads JSON property at path', async (ctx) => {
  ctx.is(readPath(['a'], { a: 'a' }), 'a');
  ctx.is(readPath(['a', 'b'], { a: { b: 'b' } }), 'b');
  ctx.is(readPath(['a', 1, 'b'], { a: [[], { b: 'b' }] }), 'b');
});

export default spec;
