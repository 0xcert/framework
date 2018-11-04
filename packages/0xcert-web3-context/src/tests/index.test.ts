import { Spec } from '@specron/spec';
import * as conn from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!conn.Context);
  ctx.true(!!conn.SignMethod);
});

export default spec;
