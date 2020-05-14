import { Spec } from '@hayspec/spec';
import * as ledger from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!ledger.Ens);
});

export default spec;
