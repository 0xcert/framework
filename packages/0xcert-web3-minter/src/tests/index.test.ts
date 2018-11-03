import { Spec } from '@specron/spec';
import * as folder from '..';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!folder.Minter);
  ctx.true(!!folder.MinterOrder);
});

export default spec;
