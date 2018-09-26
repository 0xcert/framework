import { Spec } from '@hayspec/spec';
import { Ganache } from '../../lib/ganache';
import * as Web3 from 'web3';
import { Protocol } from '../..';

interface Data {
  ganache: Ganache;
  protocol: Protocol;
}

const spec = new Spec<Data>();

spec.before(async (ctx) => {
  ctx.set('ganache', await Ganache.listen(8911));
  ctx.set('protocol', await Protocol.deploy(new Web3(`http://localhost:8911`)));
});

spec.after(async (ctx) => {
  await ctx.get('ganache').close();
});

spec.test('deploys protocol contracts', async (ctx) => {
  const protocol = ctx.get('protocol');
  ctx.true(!!protocol.xcertMintProxy);
  ctx.true(!!protocol.tokenTransferProxy);
  ctx.true(!!protocol.nftokenTransferProxy);
  ctx.true(!!protocol.exchange);
  ctx.true(!!protocol.minter);
});

export default spec;
