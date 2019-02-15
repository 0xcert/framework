import { Spec } from '@specron/spec';
import { HttpProvider } from '../..';

const spec = new Spec<{
  provider: HttpProvider;
}>();

spec.before(async (stage) => {
  const provider = new HttpProvider({
    url: 'https://ropsten.infura.io/v3/06312ac7a50b4bd49762abc5cf79dab8',
  });
  stage.set('provider', provider);
});

spec.test('returns block data', async (ctx) => {
  const provider = ctx.get('provider');
  const version = await provider.getNetworkVersion();
  ctx.is(version, '3');
});

export default spec;
