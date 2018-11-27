import { Spec } from '@specron/spec';
import * as utils from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!utils.toFloat);
  ctx.true(!!utils.toInteger);
  ctx.true(!!utils.toSeconds);
  ctx.true(!!utils.tuple);
});

export default spec;
