import { Spec } from '@specron/spec';
import * as ledger from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!ledger.ValueLedger);
});

export default spec;
