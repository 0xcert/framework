import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Connector } from '../../..';

interface Data {
  protocol: Protocol;
  connector: Connector;
  transactionHash: string;
  coinbase: string;
  bob: string;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
  stage.set('bob', accounts[1]);
});

spec.before(async (stage) => {
  const connector = new Connector({
    provider: stage.web3,
  });

  stage.set('connector', connector);
});

spec.before(async (stage) => {
  const { transactionHash } = await stage.web3.eth.sendTransaction({
    from: stage.get('coinbase'),
    to: stage.get('bob'),
    value: 100000,
  });

  stage.set('transactionHash', transactionHash);
});

spec.test('returns block data', async (ctx) => {
  const connector = ctx.get('connector');
  const transactionHash = ctx.get('transactionHash');

  const res = await connector.getTransactionByHash(transactionHash);

  ctx.is(res.hash, transactionHash);
});

export default spec;
