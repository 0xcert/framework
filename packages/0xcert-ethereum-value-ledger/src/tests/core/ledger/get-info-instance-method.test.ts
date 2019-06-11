import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { ValueLedger } from '../../../core/ledger';

const spec = new Spec<{
  provider: GenericProvider
  protocol: Protocol;
}>();

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

spec.test('returns ledger info', async (ctx) => {
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').erc20.instance.options.address;
  const ledger =  new ValueLedger(provider, ledgerId);
  const info = await ledger.getInfo();
  ctx.deepEqual(info, {
    name: 'ERC20',
    symbol: 'ERC20',
    decimals: '18',
    supply: '500000000000000000000000000',
  });
});

spec.test('returns ledger info for contract that does not fully support it', async (ctx) => {
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').erc721Metadata.instance.options.address;
  const ledger =  new ValueLedger(provider, ledgerId);
  const info = await ledger.getInfo();
  ctx.deepEqual(info, {
    name: 'ERC721 Metadata',
    symbol: 'ERC721Metadata',
    decimals: null,
    supply: null,
  });
});

export default spec;
