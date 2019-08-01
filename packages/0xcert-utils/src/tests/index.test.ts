import { Spec } from '@hayspec/spec';
import * as utils from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!utils.sha);
  ctx.true(!!utils.keccak256);
  ctx.true(!!utils.toFloat);
  ctx.true(!!utils.toInteger);
  ctx.true(!!utils.toSeconds);
  ctx.true(!!utils.toString);
  ctx.true(!!utils.toTuple);
  ctx.true(!!utils.fetchJson);
});

export default spec;
