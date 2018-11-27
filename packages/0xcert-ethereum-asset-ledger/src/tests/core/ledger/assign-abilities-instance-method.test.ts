import { Spec } from '@specron/spec';
import { Connector } from '@0xcert/ethereum-connector';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { AssetLedger } from '../../../core/ledger';
import { AssetLedgerAbility } from '@0xcert/scaffold';

interface Data {
  connector: Connector;
  ledger: AssetLedger;
  protocol: Protocol;
  bob: string;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const connector = new Connector({
    provider: stage.web3,
    accountId: await stage.web3.eth.getCoinbase(),
  });

  stage.set('connector', connector);
});

spec.before(async (stage) => {
  const connector = stage.get('connector');
  const ledgerId = stage.get('protocol').xcert.instance.options.address;

  stage.set('ledger', new AssetLedger(connector, ledgerId));
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();

  stage.set('bob', accounts[1]);
});

spec.test('assignes ledger abilities for an account', async (ctx) => {
  const ledger = ctx.get('ledger');
  const bob = ctx.get('bob');
  
  await ledger.assignAbilities(bob, [AssetLedgerAbility.MINT_ASSET]).then(() => ctx.sleep(200));

  const abilities = await ledger.getAbilities(bob);
  ctx.deepEqual(abilities, [AssetLedgerAbility.MINT_ASSET]);
});

export default spec;
