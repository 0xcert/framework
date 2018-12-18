import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  xcert?: any;
}

const spec = new Spec<Data>();

export default spec;

spec.beforeEach(async (ctx) => {
  const xcert = await ctx.deploy({ 
    src: './build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['Foo', 'F', 'http://0xcert.org', '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658', ['0x9d118770', '0x33b641ae', '0xbedb86fb', '0x20c5429b']]
  });
  ctx.set('xcert', xcert);
});

spec.test('supports interfaces', async (ctx) => {
  const xcert = ctx.get('xcert');
  ctx.true(await xcert.instance.methods.supportsInterface('0x9d118770')); // destroyable
  ctx.true(await xcert.instance.methods.supportsInterface('0x33b641ae')); // mutable
  ctx.true(await xcert.instance.methods.supportsInterface('0xbedb86fb')); // pausable
  ctx.true(await xcert.instance.methods.supportsInterface('0x20c5429b')); // revokable
  ctx.true(await xcert.instance.methods.supportsInterface('0x55bee7a4')); // xcert
});
