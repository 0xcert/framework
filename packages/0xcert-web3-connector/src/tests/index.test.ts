import { Spec } from '@specron/spec';
import * as conn from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!conn.Connector);
});

export default spec;
