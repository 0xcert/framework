import { Spec } from '@specron/spec';
import * as ledger from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!ledger.Exchange);
  ctx.true(!!ledger.ExchangeOrder);
});

export default spec;
