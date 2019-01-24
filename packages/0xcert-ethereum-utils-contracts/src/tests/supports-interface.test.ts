import { Spec } from '@specron/spec';

interface Data {
  supportsInterface?: any;
}

const spec = new Spec<Data>();

spec.beforeEach(async (ctx) => {
  const supportsInterface = await ctx.deploy({
    src: './build/supports-interface.json',
    contract: 'SupportsInterface',
  });
  ctx.set('supportsInterface', supportsInterface);
});

spec.test('correctly checks all the supported interfaces', async (ctx) => {
  const supportsInterface = ctx.get('supportsInterface');
  const erc165 = await supportsInterface.instance.methods.supportsInterface('0x01ffc9a7').call();
  ctx.is(erc165, true);
});

spec.test('checks if 0xffffffff is false', async (ctx) => {
  const supportsInterface = ctx.get('supportsInterface');
  const erc165 = await supportsInterface.instance.methods.supportsInterface('0xffffffff').call();
  ctx.is(erc165, false);
});

export default spec;
