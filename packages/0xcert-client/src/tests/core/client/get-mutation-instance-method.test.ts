import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Connector } from '@0xcert/ethereum-connector';
import { Client } from '../../..';

interface Data {
  protocol: Protocol;
  client: Client;
  txId: string;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  stage.set('client', new Client({
    connector: new Connector(stage),
  }));
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
  const client = ctx.get('client');
  const txId = ctx.get('txId');
  const mutation = await client.getMutation(txId);
  ctx.is(mutation.id, txId);
  ctx.true(mutation.confirmations >= 0); 
});

export default spec;
