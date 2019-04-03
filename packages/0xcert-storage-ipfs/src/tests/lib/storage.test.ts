import { Spec } from '@hayspec/spec';
import * as https from 'https';
import { Storage } from '../../';

const spec = new Spec<{
  ipfs: Storage;
}>();

spec.before(async (stage) => {
  console.log('IPFS');
  const ipfs = new Storage({});
  stage.set('ipfs', ipfs);
});

spec.test('add get file', async (ctx) => {
  const ipfs = ctx.get('ipfs');

  const v = await ipfs.add(Buffer.alloc(12, 'Hello world!'));
  console.log(v[0].hash);
  console.log();

  const res = await ipfs.get(v[0].hash);
  console.log(await res.text());
});

export default spec;
