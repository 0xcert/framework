import { Spec } from '@specron/spec';
import { GenericProvider } from '../../..';

interface Data {
  provider: GenericProvider;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
    accountId: await stage.web3.eth.getCoinbase(),
  });

  stage.set('provider', provider);
});

spec.test('signs a message', async (ctx) => {
  const provider = ctx.get('provider');

  const res = await provider.sign({
    message: '0x9dc665c52884d20e7a903d689d29934cda7c2bcaaf3a0c619d3f4819eccf61e8', 
  });

  ctx.is(res.substr(0, 2), '0:');
  ctx.is(res.length, 134);
});

export default spec;
