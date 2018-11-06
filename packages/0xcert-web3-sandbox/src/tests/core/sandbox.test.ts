import { Spec } from '@hayspec/spec';
import { Sandbox } from '../../core/sandbox';
import * as request from 'supertest';

const spec = new Spec();
const sandbox = new Sandbox();

spec.before(async () => {
  await sandbox.listen({ port: 8010, blockTime: 1 });
});

spec.after(async () => {
  await sandbox.close();
});

spec.test('listens for requests', async (ctx) => {
  const res = await request('http://localhost:8010').get('/').catch((e) => e.response);
  ctx.is(res.status, 400);
});

spec.test('deploys protocol contracts', async (ctx) => {
  ctx.true(!!sandbox.protocol.erc20);
  ctx.true(!!sandbox.protocol.erc721Enumerable);
  ctx.true(!!sandbox.protocol.erc721Metadata);
  ctx.true(!!sandbox.protocol.erc721);
  ctx.true(!!sandbox.protocol.xcertBurnable);
  ctx.true(!!sandbox.protocol.xcertMutable);
  ctx.true(!!sandbox.protocol.xcertPausable);
  ctx.true(!!sandbox.protocol.xcertRevokable);
  ctx.true(!!sandbox.protocol.xcert);  
  ctx.true(!!sandbox.protocol.xcertMintProxy);
  ctx.true(!!sandbox.protocol.tokenTransferProxy);
  ctx.true(!!sandbox.protocol.nftokenTransferProxy);
  ctx.true(!!sandbox.protocol.nftokenSafeTransferProxy);
  ctx.true(!!sandbox.protocol.exchange);
});

spec.test('subscribes to `newBlockHeaders` event', async (ctx) => {
  let count = 0;
  await new Promise((resolve) => {
    const subscription = sandbox.web3.eth.subscribe('newBlockHeaders');
    subscription.on('data', () => count++);
    setTimeout(() => resolve(), 4800);
  });
  ctx.is(count, 4);
});

export default spec;
