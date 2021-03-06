import { Spec } from '@hayspec/spec';
import { HttpProvider } from '../..';

const spec = new Spec<{
  provider: HttpProvider;
}>();

spec.before(async (stage) => {
  const provider = new HttpProvider({
    url: 'https://gwan-ssl.wandevs.org:46891',
  });
  stage.set('provider', provider);
});

spec.test('returns network version', async (ctx) => {
  const provider = ctx.get('provider');
  const version = await provider.getNetworkVersion();
  ctx.is(version, '999');
});

export default spec;
