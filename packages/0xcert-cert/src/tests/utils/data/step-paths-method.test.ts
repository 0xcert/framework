import { Spec } from '@hayspec/spec';
import { stepPaths } from '../../../utils/data';

const spec = new Spec();

spec.test('converts a value to string', async (ctx) => {
  ctx.deepEqual(
    stepPaths([['a', 'b', 'c']]),
    [[], ['a'], ['a', 'b'], ['a', 'b', 'c']],
  );
  ctx.deepEqual(
    stepPaths([['a', 'b', 'c'], ['a', 'b']]),
    [[], ['a'], ['a', 'b'], ['a', 'b', 'c']],
  );
});

export default spec;
