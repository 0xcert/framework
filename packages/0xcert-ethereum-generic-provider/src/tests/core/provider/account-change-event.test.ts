import { Spec } from '@specron/spec';
import { GenericProvider, ProviderEvent } from '../../..';

const spec = new Spec<{
  provider: GenericProvider;
  bob: string;
}>();

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
  });
  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  stage.set('bob', accounts[1]);
});

spec.test('returns block data', async (ctx) => {
  const provider = ctx.get('provider');
  const bob = ctx.get('bob');

  let triggered = null;
  provider.on(ProviderEvent.ACCOUNT_CHANGE, (accountId) => {
    triggered = accountId;
  });
  provider.accountId = bob;

  ctx.is(triggered, bob);
  ctx.is(provider.accountId, bob);
});

export default spec;
