import { Spec } from '@hayspec/spec';
import * as merkle from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!merkle.Zcip1);
});

export default spec;
