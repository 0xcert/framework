import { Spec } from '@hayspec/spec';
import * as https from 'https';
import { StorageMiddleware } from '../../';

const spec = new Spec<{
  middleware: StorageMiddleware;
}>();

spec.before(async (stage) => {
  console.log('IPFS');
  const ipfs = new StorageMiddleware({});
  stage.set('ipfs', ipfs);
});

spec.test('add get file', async (ctx) => {
  const middleware = ctx.get('middleware');

});

export default spec;
