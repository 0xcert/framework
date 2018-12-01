import { Spec } from '@specron/spec';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { ValueLedger } from '../../../core/ledger';

interface Data {
  provider: GenericProvider
  ledger: ValueLedger;
  protocol: Protocol;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
  });

  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const provider = stage.get('provider');
  const ledgerId = stage.get('protocol').erc20.instance.options.address;

  stage.set('ledger', new ValueLedger(provider, ledgerId));
});

spec.test('returns ledger info', async (ctx) => {
  const ledger = ctx.get('ledger');
  
  const info = await ledger.getInfo();

  ctx.deepEqual(info, {
    name: "ERC20",
    symbol: "ERC20",
    decimals: '18',
    supply: '500000000',
  });
});

export default spec;
