import { Spec } from '@specron/spec';
import * as ledger from '..';

const spec = new Spec();

spec.test('exposes objects', (ctx) => {
  ctx.true(!!ledger.AssetLedger);
  ctx.true(!!ledger.GeneralAssetLedgerAbility);
  ctx.true(!!ledger.SuperAssetLedgerAbility);
  ctx.true(!!ledger.AssetLedgerCapability);
});

export default spec;
