import { Spec } from '@hayspec/spec';
import { Sandbox } from '../../core/server';
import * as request from 'supertest';

const spec = new Spec();
const sandbox = new Sandbox();

spec.before(async () => {
  await sandbox.listen(8911);
});

spec.after(async () => {
  await sandbox.close();
});

spec.test('listens for requests', async (ctx) => {
  const res = await request('http://localhost:8911').get('/').catch((e) => e.response);
  ctx.is(res.status, 400);
});

spec.test('deploys protocol contracts', async (ctx) => {
  ctx.true(!!sandbox.protocol.xcertMintProxy);
  ctx.true(!!sandbox.protocol.tokenTransferProxy);
  ctx.true(!!sandbox.protocol.nftokenTransferProxy);
  ctx.true(!!sandbox.protocol.exchange);
  ctx.true(!!sandbox.protocol.minter);
});

export default spec;
