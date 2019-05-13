import { Spec } from '@hayspec/spec';
import { HttpProvider } from '../..';

const spec = new Spec<{
  provider: HttpProvider;
}>();

spec.before(async (stage) => {
  // Blockchain connection provided by: http://infra.wanchainx.exchange/.
  const provider = new HttpProvider({
    url: 'http://139.59.44.13:9000/node/5c9a341860626f3d2aad1dc0',
  });
  stage.set('provider', provider);
});

spec.test('returns block data', async (ctx) => {
  const provider = ctx.get('provider');
  const version = await provider.getNetworkVersion();
  ctx.is(version, '3');
});

export default spec;
