import { Spec } from '@hayspec/spec';
import { Storage } from '../../';

const spec = new Spec<{
  ipfs: Storage;
}>();

spec.before(async (stage) => {
  const ipfs = new Storage({});
  stage.set('ipfs', ipfs);
});

spec.test('add get file', async (ctx) => {
  const ipfs = ctx.get('ipfs');
  const text = 'Hello world!';

  const v = await ipfs.add(Buffer.alloc(text.length, text));
  const res = await ipfs.get(v[0].hash);
  const body = await res.text();

  ctx.is(body, text);
});

export default spec;
