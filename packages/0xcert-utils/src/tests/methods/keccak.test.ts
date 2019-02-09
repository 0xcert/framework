import { Spec } from '@hayspec/spec';
import { keccak256 } from '../../methods/keccak';

const spec = new Spec();

spec.test('converts string into keccak256 hash', async (ctx) => {
  ctx.is(keccak256('foo#'), '0xe7bb87eda991af44cdb673a7d5f2bfeb854dd089e421b3934d022fc5c29259a0');
  ctx.is(keccak256('bar!'), '0x179eb773d34690d312adc3f96661402e2de2009e39dbf4b8dee22b3adc842752');
});

export default spec;
