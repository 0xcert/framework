import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { EthereumConnector } from '../../..';

interface Data {
  protocol: Protocol;
  connector: EthereumConnector;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const connector = new EthereumConnector(stage.web3.currentProvider);

  stage.set('connector', connector);
});

spec.test('returns block data', async (ctx) => {
  const connector = ctx.get('connector');

  const res = await connector.getBlockByNumber(20);

  ctx.is(res.number, 20);
});

export default spec;
