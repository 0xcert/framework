import { Spec } from '@specron/spec';
import { keccak } from '../../methods/keccak';

const spec = new Spec();

spec.test('converts string into SHA3 hash', async (ctx) => {
  ctx.is(await keccak(256, 'foo#'), 'e7bb87eda991af44cdb673a7d5f2bfeb854dd089e421b3934d022fc5c29259a0');
  ctx.is(await keccak(256, 'bar!'), '179eb773d34690d312adc3f96661402e2de2009e39dbf4b8dee22b3adc842752');
});

export default spec;
