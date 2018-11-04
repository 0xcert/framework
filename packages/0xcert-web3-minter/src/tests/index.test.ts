import { Spec } from '@specron/spec';
import * as ledger from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!ledger.Minter);
  ctx.true(!!ledger.MinterOrder);
});

export default spec;
