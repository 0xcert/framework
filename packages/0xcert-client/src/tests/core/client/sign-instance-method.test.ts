import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Connector, SignMethod } from '@0xcert/ethereum-connector';
import { Client } from '../../..';

interface Data {
  protocol: Protocol;
  client: Client;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  stage.set('client', new Client({
    connector: new Connector({
      web3: stage.web3,
      myId: await stage.web3.eth.getAccounts().then((a) => a[0]),
    }),
  }));
});

spec.test('signs arbitrary string', async (ctx) => {
  const client = ctx.get('client');
  const signature = await client.sign('foo');
  ctx.true(signature.indexOf(`${SignMethod.ETH_SIGN}:`) === 0);
  ctx.true(signature.length > 10);
});

export default spec;
