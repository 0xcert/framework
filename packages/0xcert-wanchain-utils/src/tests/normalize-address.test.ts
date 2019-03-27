import { Spec } from '@hayspec/spec';
import { normalizeAddress } from '../lib/normalize-address';

const spec = new Spec();

spec.test('normalize address', (ctx) => {
  console.log(normalizeAddress('0xE96D860C8BBB30F6831E6E65D327295B7A0C524F'));
  ctx.is(normalizeAddress('0xE96D860C8BBB30F6831E6E65D327295B7A0C524F'), '0xE96d860c8bbb30f6831e6e65D327295b7a0c524F');
  ctx.is(normalizeAddress('0xe96d860c8bbb30f6831e6e65d327295b7a0c524f'), '0xE96d860c8bbb30f6831e6e65D327295b7a0c524F');
  ctx.is(normalizeAddress('0xE96d860c8bbb30f6831e6e65D327295b7a0c524F'), '0xE96d860c8bbb30f6831e6e65D327295b7a0c524F');
  ctx.is(normalizeAddress('E96d860c8bbb30f6831e6e65D327295b7a0c524F'), '0xE96d860c8bbb30f6831e6e65D327295b7a0c524F');
  ctx.is(normalizeAddress(null), null);
  ctx.throws(() => normalizeAddress('dfg'));
});

export default spec;
