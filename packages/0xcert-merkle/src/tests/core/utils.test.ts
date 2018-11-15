import { Spec } from '@hayspec/spec';
import { getLevelFromSize, getSizeFromLevel } from '../../utils/calcs';

const spec = new Spec();

spec.test('method `getLevelFromSize` returns level index based on number of values', async (ctx) => {
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

spec.test('method `getSizeFromLevel` returns the number of values based on level index', async (ctx) => {
  ctx.is(getSizeFromLevel(0), 1);
  ctx.is(getSizeFromLevel(1), 3);
  ctx.is(getSizeFromLevel(2), 7);
  ctx.is(getSizeFromLevel(3), 15);
  ctx.is(getSizeFromLevel(4), 31);
  ctx.is(getSizeFromLevel(5), 63);
});

export default spec;
