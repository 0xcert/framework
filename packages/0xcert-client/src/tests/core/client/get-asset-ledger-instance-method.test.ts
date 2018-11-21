import { Spec } from '@specron/spec';
import { AssetLedger } from '@0xcert/web3-asset-ledger';
import { Protocol } from '@0xcert/web3-sandbox';
import { Connector } from '@0xcert/web3-connector';
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
    connector: new Connector(stage),
  }));
});

spec.test('creates an instance of asset ledger', async (ctx) => {
  const client = ctx.get('client');
  const exchangeId = ctx.get('protocol').xcert.instance.options.address;
  const exchange = await client.getAssetLedger(exchangeId);
  ctx.is(exchange.id, exchangeId);
  ctx.true(exchange instanceof AssetLedger); 
});

export default spec;
