import { Spec } from '@specron/spec';
import { ValueLedger } from '@0xcert/web3-value-ledger';
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

spec.test('creates an instance of a value ledger', async (ctx) => {
  const client = ctx.get('client');
  const ledgerId = ctx.get('protocol').erc20.instance.options.address;
  const ledger = await client.getValueLedger(ledgerId);
  ctx.is(ledger.id, ledgerId);
  ctx.true(ledger instanceof ValueLedger); 
});

export default spec;
