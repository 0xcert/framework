import { Spec } from '@specron/spec';

interface Data {
  addressUtils?: any;
  owner?: string;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const addressUtils = await ctx.deploy({
    src: './build/address-utils-mock.json',
    contract: 'AddressUtilsMock',
  });
  ctx.set('addressUtils', addressUtils);
});

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
});

spec.test('correctly checks account', async (ctx) => {
  const addressUtils = ctx.get('addressUtils');
  const owner = ctx.get('owner');
  const isDeployedContract = await addressUtils.instance.methods.isDeployedContract(owner).call();
  ctx.false(isDeployedContract);
});

spec.test('correctly checks smart contract', async (ctx) => {
  const addressUtils = ctx.get('addressUtils');
  const abilitable = await ctx.deploy({
    src: './build/abilitable-test-mock.json',
    contract: 'AbilitableTestMock',
  });
  const isDeployedContract = await addressUtils.instance.methods.isDeployedContract(abilitable.receipt._address).call();
  ctx.true(isDeployedContract);
});

export default spec;
