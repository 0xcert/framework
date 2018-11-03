import { Spec } from '@hayspec/spec';
import * as merkle from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!merkle.Merkle);
});

export default spec;
