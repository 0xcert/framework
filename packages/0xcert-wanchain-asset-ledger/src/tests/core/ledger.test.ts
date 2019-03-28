import { Spec } from '@hayspec/spec';
import { AssetLedger } from '../..';

const spec = new Spec();

spec.test('Check normalize address override', (ctx) => {
  const ledger1 = new AssetLedger(null, '0xE96D860C8BBB30F6831E6E65D327295B7A0C524F');
  ctx.is(ledger1.id, '0xe96d860c8bbb30f6831e6e65d327295b7a0c524f');
  // ctx.is(ledger1.id, '0xE96d860c8bbb30f6831e6e65D327295b7a0c524F');

  const ledger2 = AssetLedger.getInstance(null, '0xE96D860C8BBB30F6831E6E65D327295B7A0C524F');
  ctx.is(ledger2.id, '0xe96d860c8bbb30f6831e6e65d327295b7a0c524f');
  // ctx.is(ledger2.id, '0xE96d860c8bbb30f6831e6e65D327295b7a0c524F');
});

export default spec;
