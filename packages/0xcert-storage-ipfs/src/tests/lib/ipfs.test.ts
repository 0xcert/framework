import { Spec } from '@hayspec/spec';
import * as https from 'https';
import { StorageIPFS } from '../../';

const spec = new Spec<{
  ipfs: StorageIPFS;
}>();

spec.before(async (stage) => {
  console.log('IPFS');
  const ipfs = new StorageIPFS({
    // apiUri: '192.168.10.80',
    // apiProtocol: 'http',
  });
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
