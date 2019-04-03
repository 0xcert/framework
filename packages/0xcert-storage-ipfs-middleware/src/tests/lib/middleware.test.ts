import { Spec } from '@hayspec/spec';
import * as express from 'express';
import { StorageMiddleware } from '../../';

const spec = new Spec<{
  server: any;
}>();

spec.before(async (stage) => {
  const app = express();
  const storage = new StorageMiddleware({});

  app.get('/storage/:id', storage.getter());
  app.post('/storage/:id', storage.setter());

  const server = app.listen(4445);

  stage.set('server', server);
});

spec.after(async (stage) => {
  const server = stage.get('server');
  await server.close();
});

spec.test('add get file', async (ctx) => {
  const data = {
    ralph: 'I am a data.',
    bart: 'Cowabunga!',
  };

  await ctx.request({
    url: '/storage/0',
    method: 'post',
    data,
  });

  const res = await ctx.request({
      url: '/storage/0',
      method: 'get',
  });

  ctx.deepEqual(res.data, data);
});

export default spec;
