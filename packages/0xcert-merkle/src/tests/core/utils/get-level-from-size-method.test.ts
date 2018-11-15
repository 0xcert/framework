import { Spec } from '@hayspec/spec';
import { getLevelFromSize } from '../../../utils/calcs';

const spec = new Spec();

spec.test('returns level index based on number of values', async (ctx) => {
  ctx.is(getLevelFromSize(0), 0);
  ctx.is(getLevelFromSize(1), 0);
  ctx.is(getLevelFromSize(2), 1);
  ctx.is(getLevelFromSize(3), 1);
  ctx.is(getLevelFromSize(4), 2);
  ctx.is(getLevelFromSize(5), 2);
  ctx.is(getLevelFromSize(6), 2);
  ctx.is(getLevelFromSize(7), 2);
  ctx.is(getLevelFromSize(8), 3);
  ctx.is(getLevelFromSize(9), 3);
  ctx.is(getLevelFromSize(10), 3);
  ctx.is(getLevelFromSize(11), 3);
  ctx.is(getLevelFromSize(12), 3);
  ctx.is(getLevelFromSize(13), 3);
  ctx.is(getLevelFromSize(14), 3);
  ctx.is(getLevelFromSize(15), 3);
  ctx.is(getLevelFromSize(16), 4);
});

export default spec;
