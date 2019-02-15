import { Spec } from '@specron/spec';
import { GenericProvider } from '../../..';

const spec = new Spec<{
  provider: GenericProvider;
}>();

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
  });
  stage.set('provider', provider);
});

spec.test('returns block data', async (ctx) => {
  const provider = ctx.get('provider');
  const version = await provider.getNetworkVersion();
  ctx.true(parseInt(version) > 2);
});

export default spec;
