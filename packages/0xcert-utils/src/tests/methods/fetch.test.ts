import { Spec } from '@hayspec/spec';
import { fetch } from '../../methods/fetch';

const spec = new Spec();

spec.test('downloads a remote file', async (ctx) => {
  const res = await fetch('https://cdn.jsdelivr.net/gh/xpepermint/0xcert-contracts/asset-ledger.json').then((r) => r.json());
  ctx.true(!!res.AssetLedger);
});

export default spec;
