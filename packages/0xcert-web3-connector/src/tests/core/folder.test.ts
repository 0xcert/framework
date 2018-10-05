import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { Folder } from '../../core/folder';

interface Data {
  xcert: any;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = await Protocol.deploy(stage.web3);
  stage.set('xcert', protocol.xcert);
});

spec.test('returns deployed folder name', async (ctx) => {
  const folder = new Folder({
    web3: ctx.web3,
    address: ctx.get('xcert').receipt._address,
  });
  ctx.is(await folder.getName(), 'Xcert');
});

spec.test('returns deployed folder symbol', async (ctx) => {
  const folder = new Folder({
    web3: ctx.web3,
    address: ctx.get('xcert').receipt._address,
  });
  console.log(await folder.getSymbol())
  ctx.is(await folder.getSymbol(), 'Xcert');
});

spec.test('returns deployed folder convention', async (ctx) => {
  const folder = new Folder({
    web3: ctx.web3,
    address: ctx.get('xcert').receipt._address,
  });
  console.log(await folder.getConvention())
  ctx.is(await folder.getConvention(), '0x0500000000000000000000000000000000000000000000000000000000000000');
});

export default spec;
