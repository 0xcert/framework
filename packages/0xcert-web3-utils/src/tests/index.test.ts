import { Spec } from '@specron/spec';
import * as utils from '..';

const spec = new Spec();

spec.test('exposed content', (ctx) => {
  ctx.true(!!utils.performMutate);
  ctx.true(!!utils.performQuery);
  ctx.true(!!utils.createSignature);
  ctx.true(!!utils.SignatureMethod);
  ctx.true(!!utils.tuple);
});

export default spec;
