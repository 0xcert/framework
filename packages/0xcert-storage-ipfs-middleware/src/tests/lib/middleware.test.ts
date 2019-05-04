import { Spec } from '@hayspec/spec';
import * as express from 'express';
import { StorageMiddleware } from '../../';

const spec = new Spec<{
  server: any;
  data: any;
}>();

spec.before(async (stage) => {
  const storage = new StorageMiddleware({});

  const app = express();

  app.get('/storage/:id', storage.getter());
  app.post('/storage/:id', storage.setter());

  const server = app.listen(4445);

  stage.set('server', server);
});

spec.before((stage) => {
  const data = {
    ralph: 'I am a data.',
    bart: 'Cowabunga!',
  };

  stage.set('data', data);
});

spec.after(async (stage) => {
  const server = stage.get('server');
  await server.close();
});

spec.test('post new file to IPFS', async (ctx) => {
  const data = ctx.get('data');

  const res = await ctx.request({
    url: '/storage/0',
    method: 'post',
    data,
  });

  ctx.is(res.data.success, true);
});

spec.test('get file from IPFS', async (ctx) => {
  const data = ctx.get('data');

  const res = await ctx.request({
      url: '/storage/0',
      method: 'get',
  });

  ctx.deepEqual(res.data, JSON.stringify(data));
});

export default spec;
