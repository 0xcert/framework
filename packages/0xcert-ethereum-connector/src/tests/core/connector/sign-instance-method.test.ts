import { Spec } from '@specron/spec';
import { Connector } from '../../..';

interface Data {
  connector: Connector;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const connector = new Connector({
    provider: stage.web3,
    accountId: await stage.web3.eth.getCoinbase(),
  });

  stage.set('connector', connector);
});

spec.test('signs a message', async (ctx) => {
  const connector = ctx.get('connector');

  const res = await connector.sign({
    message: '0x9dc665c52884d20e7a903d689d29934cda7c2bcaaf3a0c619d3f4819eccf61e8', 
  });

  ctx.is(res.substr(0, 2), '0:');
  ctx.is(res.length, 134);
});

export default spec;
