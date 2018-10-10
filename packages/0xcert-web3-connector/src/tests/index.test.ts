import { Spec } from '@specron/spec';
import * as connector from '..';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!connector.Connector);
  ctx.true(!!connector.ActionId);
});

export default spec;
