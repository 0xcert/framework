import { Spec } from '@specron/spec';
import { GenericProvider } from '../../..';

const spec = new Spec<{
  provider: GenericProvider;
}>();

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
    accountId: '0x44e44897FC076Bc46AaE6b06b917D0dfD8B2dae9',
  });
  stage.set('provider', provider);
});

spec.test('returns true when account ID matches', async (ctx) => {
  const provider = ctx.get('provider');
  ctx.true(provider.isCurrentAccount('0x44e44897fc076bc46aae6b06b917d0dfd8b2dae9'));
});

spec.test('returns true when account ID does not match', async (ctx) => {
  const provider = ctx.get('provider');
  ctx.false(provider.isCurrentAccount('0xF9196F9f176fd2eF9243E8960817d5FbE63D79aa'));
});

export default spec;
