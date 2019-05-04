import { Spec } from '@hayspec/spec';
import { Storage } from '../../';

const spec = new Spec<{
  ipfs: Storage;
}>();

spec.before(async (stage) => {
  const ipfs = new Storage({});
  stage.set('ipfs', ipfs);
});

spec.test('adds and reads a file', async (ctx) => {
  const ipfs = ctx.get('ipfs');
  const text = 'Hello world!';

  const v = await ipfs.add(Buffer.alloc(text.length, text));
  const res = await ipfs.cat(v[0].hash);

  ctx.is(res, text);
});

export default spec;