import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { OrderRecipe } from '@0xcert/scaffold';
import { Order } from '../../core/minter';

interface Data {
  accounts: string[];
  protocol: Protocol;
  recipe: (folderId?: string) => OrderRecipe;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  stage.set('accounts', await stage.web3.eth.getAccounts());
});

spec.before(async (stage) => {
  stage.set('recipe', (folderId) => ({
    takerId: '0x1231858C3aeFe5B5E8A5C81d2b5341fbc41E2B13',
    asset: {
      folderId: folderId ? folderId : '0x146E35b007B76A4455890cF6d1b82F6A8ef12e0E',
      assetId: '1',
      proof: '1e205550c271490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8',
    },
    transfers: [
      {
        vaultId: '0x2bD270a0F3232E9f11dd439D8E5e74694e46dC53',
        senderId: '0x342da4DaE236037E9586499DA06494DDE2a0b52b',
        receiverId: '0x287206D90777dcB5fb96070D0DDF06737FCE3d1E',
        amount: 5000,
      },
      {
        vaultId: '0x2bD270a0F3232E9f11dd439D8E5e74694e46dC53',
        senderId: '0x342da4DaE236037E9586499DA06494DDE2a0b52b',
        receiverId: '0x28bC05dd0Eb0A3912AB7ea9d9C0A0502AE0773C7',
        amount: 300,
      },
    ],
    seed: 1535113220,
    expiration: 1535113820,
  }));
});

spec.test('method `compile` sets the claim property', async (ctx) => {
  const recipe = ctx.get('recipe')();
  const order = new Order({ 
    web3: ctx.web3,
    minterId: '0x825C96c2c73f9eC9C983BAAa3f5EbBc77aC2e981',
    makerId: '0x342da4DaE236037E9586499DA06494DDE2a0b52b',
    signatureMethod: 0,
  });
  order.signature = 'foo';
  await order.compile(recipe);
  ctx.is(order.claim, '0x43695986f951d66d34a52513e4992b1f410371d724ee31c6629eac756fc29993');  
  ctx.is(order.signature, null);
  ctx.deepEqual(order.recipe, recipe);
});

spec.test('method `sign` sets the signature property', async (ctx) => {
  const recipe = ctx.get('recipe')();
  const order = new Order({ 
    web3: ctx.web3,
    minterId: ctx.get('protocol').minter.instance.options.address,
    makerId: ctx.get('accounts')[0],
    signatureMethod: 0,
  });
  await order.compile(recipe);
  await order.sign();
  ctx.not(order.signature, null);
});

spec.test('method `perform` executes order on ethereum network', async (ctx) => {
  const owner = ctx.get('accounts')[0];
  const bob = ctx.get('accounts')[1];
  const sara = ctx.get('accounts')[2];
  const xcert = ctx.get('protocol').xcert;
  const minter = ctx.get('protocol').minter;
  const xcertMintProxy = ctx.get('protocol').xcertMintProxy;
  const nftokenTransferProxy = ctx.get('protocol').nftokenTransferProxy;
  await xcert.instance.methods.mint(bob, '100', 'foo').send({ form: owner });
  await xcert.instance.methods.assignAbilities(xcertMintProxy.instance.options.address, [1]).send({ from: owner });
  await xcert.instance.methods.approve(nftokenTransferProxy.instance.options.address, '100').send({ from: bob });
  const recipe = {
    takerId: bob,
    asset: {
      folderId: xcert.instance.options.address,
      assetId: '5',
      proof: '1e205550c271490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8',
    },
    transfers: [
      {
        folderId: xcert.instance.options.address,
        senderId: bob,
        receiverId: sara,
        assetId: '100',
      },
    ],
    seed: 1535113220,
    expiration: 1607731200,
  };
  const order = new Order({
    web3: ctx.web3,
    minterId: minter.instance.options.address,
    makerId: owner,
    signatureMethod: 0,
  });
  await order.compile(recipe);
  await order.sign();
  await order.perform(order.signature).then(() => ctx.sleep(300));
  ctx.is(await xcert.instance.methods.ownerOf('5').call(), bob);
  ctx.is(await xcert.instance.methods.ownerOf('100').call(), sara);
});

export default spec;
