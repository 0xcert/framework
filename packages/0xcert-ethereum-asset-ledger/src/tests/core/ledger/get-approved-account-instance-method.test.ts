import { Spec } from '@specron/spec';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedger } from '../../../core/ledger';
import { AssetLedgerAbility } from '@0xcert/scaffold';

interface Data {
  protocol: Protocol;
  provider: GenericProvider;
  ledger: AssetLedger;
  coinbase: string;
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
  const ledgerId = stage.get('protocol').xcert.instance.options.address;

  stage.set('ledger', new AssetLedger(provider, ledgerId));
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('coinbase', accounts[0]);
});

spec.test('returns token approved account', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const xcert = ctx.get('protocol').xcert;
  const ledger = ctx.get('ledger');
  
  await xcert.instance.methods.mint(coinbase, '1', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });

  const approvedAccount = await ledger.getApprovedAccount('1');
  ctx.is(approvedAccount, '0x0000000000000000000000000000000000000000');
});

export default spec;
