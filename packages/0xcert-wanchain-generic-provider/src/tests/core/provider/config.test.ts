import { Spec } from '@hayspec/spec';
import { GenericProvider } from '../../..';

const spec = new Spec();

spec.test('normalizes ID when set', async (ctx) => {
  const provider = new GenericProvider({});
  ctx.is(provider.valueLedgerSource, 'https://conventions.0xcert.org/wanchain/token-mock.json');
  ctx.is(provider.assetLedgerSource, 'https://conventions.0xcert.org/wanchain/xcert-mock.json');
});

export default spec;
