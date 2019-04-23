import { Spec } from '@hayspec/spec';
import { HttpProvider } from '../..';

const spec = new Spec();

spec.test('Check normalize address override', (ctx) => {
  const provider1 = new HttpProvider({
    url: '',
    accountId: '0xE96D860C8BBB30F6831E6E65D327295B7A0C524F',
  });
  ctx.is(provider1.accountId, '0xe96d860c8bbb30f6831e6e65d327295b7a0c524f');
  // ctx.is(provider1.accountId, '0xE96d860c8bbb30f6831e6e65D327295b7a0c524F');

  const provider2 = new HttpProvider({
    url: '',
    accountId: '0xE96D860C8BBB30F6831E6E65D327295B7A0C524F',
  });
  ctx.is(provider2.accountId, '0xe96d860c8bbb30f6831e6e65d327295b7a0c524f');
  // ctx.is(provider2.accountId, '0xE96d860c8bbb30f6831e6e65D327295b7a0c524F');
});

export default spec;
