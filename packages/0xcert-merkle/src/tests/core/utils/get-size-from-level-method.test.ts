import { Spec } from '@hayspec/spec';
import { getSizeFromLevel } from '../../../utils/calcs';

const spec = new Spec();

spec.test('returns the number of values based on level index', async (ctx) => {
  ctx.is(getSizeFromLevel(0), 1);
  ctx.is(getSizeFromLevel(1), 3);
  ctx.is(getSizeFromLevel(2), 7);
  ctx.is(getSizeFromLevel(3), 15);
  ctx.is(getSizeFromLevel(4), 31);
  ctx.is(getSizeFromLevel(5), 63);
});

export default spec;
