import { Spec } from '@hayspec/spec';
import { sha } from '../../methods/sha';

const spec = new Spec();

spec.test('converts string into SHA256 hash', async (ctx) => {
  ctx.is(await sha(256, 'foo#'), '18845243706c9f9a00b514348b58edd82fe708a68393ccbb3f70e1599577a148');
  ctx.is(await sha(256, 'bar!'), 'e687b749f2cd93615923a2f705faace4033f35d57ccfca652cdc39616a94a3c2');
});

export default spec;
