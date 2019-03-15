import { Spec } from '@specron/spec';
import { GenericProvider } from '../../..';

const spec = new Spec<{
  provider: GenericProvider;
}>();

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
  });
  stage.set('provider', provider);
});

spec.test('returns checksum account ids', async (ctx) => {
  const provider = ctx.get('provider');
  const accounts = await provider.getAvailableAccounts();
  ctx.true(accounts.length > 2);
  ctx.not(accounts[0].toLowerCase(), accounts[0]);
});

export default spec;
