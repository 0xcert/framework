import { Spec } from '@hayspec/spec';
import { Gateway, Storage } from '../../';

const spec = new Spec<{
  ipfs: Storage;
  gateway: Gateway;
}>();

spec.before(async (stage) => {
  const ipfs = new Storage({});
  const gateway = new Gateway({});
  stage.set('ipfs', ipfs);
  stage.set('gateway', gateway);
});

spec.test('reads a file from the gateway', async (ctx) => {
  const ipfs = ctx.get('ipfs');
  const gateway = ctx.get('gateway');
  const text = 'Hello world!';

  const v = await ipfs.add(Buffer.alloc(text.length, text));
  const res = await gateway.get(v[0].hash);
  const body = await res.text();

  ctx.is(body, text);
});

export default spec;
