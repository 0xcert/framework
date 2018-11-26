import { Spec } from '@specron/spec';
import { EthereumConnector } from '@0xcert/ethereum-connector';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { ValueLedger } from '../../../core/ledger';

interface Data {
  connector: EthereumConnector
  ledger: ValueLedger;
  protocol: Protocol;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const connector = new EthereumConnector(stage.web3);

  stage.set('connector', connector);
});

spec.before(async (stage) => {
  const connector = stage.get('connector');
  const ledgerId = stage.get('protocol').erc20.instance.options.address;

  stage.set('ledger', new ValueLedger(connector, ledgerId));
});

spec.test('returns ledger total supply', async (ctx) => {
  const ledger = ctx.get('ledger');
  
  const supply = await ledger.getSupply();

  ctx.is(supply, 300000000000000000000000000);
});

export default spec;
