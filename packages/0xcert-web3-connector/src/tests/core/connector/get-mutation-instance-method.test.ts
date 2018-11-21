import { Spec } from '@specron/spec';
import { Connector } from '../../..';

interface Data {
  txId: string;
  connector: Connector;
}

const spec = new Spec<Data>();

spec.before((stage) => {
  stage.set('connector', new Connector(stage));
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  const tx = await stage.web3.eth.sendTransaction({
    from: accounts[0],
    to: accounts[1],
    value: 10000,
  });
  stage.set('txId', tx.transactionHash);
});

spec.test('returns mutation data', async (ctx) => {
  const connector = ctx.get('connector');
  const txId = ctx.get('txId');
  const mutation = await connector.getMutation(txId);
  ctx.is(mutation.id, txId);
  ctx.true(mutation.confirmations >= 0); 
});

export default spec;
