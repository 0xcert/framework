import { Spec } from '@hayspec/spec';
import { StorageIPFS } from '../../';

const spec = new Spec<{
  ipfs: StorageIPFS;
}>();

spec.before(async (stage) => {
  console.log('IPFS');
  const ipfs = new StorageIPFS({});
  stage.set('ipfs', ipfs);
});

spec.test('add get file', async (ctx) => {
  const ipfs = ctx.get('ipfs');

  const v = await ipfs.add('hi');
  console.log(v);

  console.log(await ipfs.get(v));
});

export default spec;
