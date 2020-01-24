import { Spec } from '@specron/spec';

interface Data {
  xcert?: any;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const xcert = await ctx.deploy({
    src: './build/xcert-mock.json',
    contract: 'XcertMock',
    args: ['Foo', 'F', 'https://0xcert.org/', '.json', '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658', ['0x9d118770', '0x0d04c3b8', '0xbedb86fb', '0x20c5429b']],
  });
  ctx.set('xcert', xcert);
});

spec.test('supports interfaces', async (ctx) => {
  const xcert = ctx.get('xcert');
  ctx.true(await xcert.instance.methods.supportsInterface('0x9d118770')); // destroyable
  ctx.true(await xcert.instance.methods.supportsInterface('0x0d04c3b8')); // mutable
  ctx.true(await xcert.instance.methods.supportsInterface('0xbedb86fb')); // pausable
  ctx.true(await xcert.instance.methods.supportsInterface('0x20c5429b')); // revokable
  ctx.true(await xcert.instance.methods.supportsInterface('0xe08725ee')); // xcert
});

export default spec;
