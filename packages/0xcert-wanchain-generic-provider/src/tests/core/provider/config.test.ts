import { Spec } from '@hayspec/spec';
import { GenericProvider } from '../../..';

const spec = new Spec();

spec.test('normalizes ID when set', async (ctx) => {
  const provider = new GenericProvider({});
  ctx.is(provider.valueLedgerSource, 'https://0xcert.org/conventions/wanchain/token-mock.json');
  ctx.is(provider.assetLedgerSource, 'https://0xcert.org/conventions/wanchain/xcert-mock.json');
});

export default spec;
