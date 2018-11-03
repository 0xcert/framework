import { Spec } from '@specron/spec';
import * as folder from '..';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!folder.Order);
});

export default spec;
