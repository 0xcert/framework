import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  selector?: any;
  owner?: string;
}

const spec = new Spec<Data>();

export default spec;

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
});

spec.beforeEach(async (ctx) => {
  const selector = await ctx.deploy({ 
    src: './build/selector.json',
    contract: 'Selector',
  });
  ctx.set('selector', selector);
});

spec.test('checks Xcert selector', async (ctx) => {
  const selector = ctx.get('selector');
  const xcert = await ctx.deploy({ 
    src: './build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['Foo','F','0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658']
  });

  const bytes = await selector.methods.calculateXcertSelector().call();
  const supports = await xcert.methods.supportsInterface(bytes).call();
  ctx.is(supports, true);
});
