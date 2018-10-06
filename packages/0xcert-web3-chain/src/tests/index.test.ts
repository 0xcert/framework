import { Spec } from '@specron/spec';
import * as connector from '..';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!connector.Chain);
  ctx.true(!!connector.ChainAction);
});

export default spec;
