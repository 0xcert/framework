import { Spec } from '@hayspec/spec';
import { normalizeAddress } from '../lib/normalize-address';

const spec = new Spec();

spec.test('normalize address', (ctx) => {
  ctx.is(normalizeAddress('0x85A9916425960aA35B2a527D77C71855DC0215B3'), '0x85A9916425960aA35B2a527D77C71855DC0215B3');
  ctx.is(normalizeAddress('0x85a9916425960aa35b2a527d77c71855dc0215b3'), '0x85A9916425960aA35B2a527D77C71855DC0215B3');
  ctx.is(normalizeAddress('0x85A9916425960AA35B2A527D77C71855DC0215B3'), '0x85A9916425960aA35B2a527D77C71855DC0215B3');
  ctx.is(normalizeAddress('85A9916425960aA35B2a527D77C71855DC0215B3'), '0x85A9916425960aA35B2a527D77C71855DC0215B3');
  ctx.is(normalizeAddress('0x85A9916425960aA35B2a527D77C71855DC0215b3'), '0x85A9916425960aA35B2a527D77C71855DC0215B3');
  ctx.is(normalizeAddress(null), null);
  ctx.throws(() => normalizeAddress('dfg'));
});

export default spec;
