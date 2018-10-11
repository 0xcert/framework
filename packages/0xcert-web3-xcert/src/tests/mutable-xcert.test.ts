import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  xcert?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  zeroAddress?: string;
  id1?: string;
  id2?: string;
  id3?: string;
  uriBase?: string;
  proof1?: string;
  proof2?: string;
  proof3?: string;
}

const spec = new Spec<Data>();

export default spec;

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
});

spec.beforeEach(async (ctx) => {
  ctx.set('id1', '123');
  ctx.set('id2', '124');
  ctx.set('id3', '125');
  ctx.set('uriBase', 'http://0xcert.org/');
  ctx.set('proof1', '973124FFC4A03E66D6A4458E587D5D6146F71FC57F359C8D516E0B12A50AB0D9');
  ctx.set('proof2', '6F25B3F4BC7EADAFB8F57D69F8A59DB3B23F198151DBF3C66AC3082381518329');
  ctx.set('proof3', 'C77A290BE17F8A4EF301C4CA46497C5BEB4A0556EC2D5A04DCE4CE6EBD439AD1');
});

spec.beforeEach(async (ctx) => {
  const owner = ctx.get('owner');
  const uriBase = ctx.get('uriBase');
  const xcert = await ctx.deploy({ 
    src: './build/mutable-xcert-mock.json',
    contract: 'MutableXcertMock',
    args: ['Foo','F',uriBase,'0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658']
  });

  await xcert.instance.methods.assignAbilities(owner, [1,4]).send({ from: owner });
  ctx.set('xcert', xcert);
});

spec.test('sucesfully updates proof', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');
  const newProof = ctx.get('proof2');

  await xcert.instance.methods.mint(bob, id, proof).send({ from: owner });
  const logs = await xcert.instance.methods.updateTokenProof(id, newProof).send({ from: owner });
  ctx.not(logs.events.TokenProofUpdate, undefined);
  const xcertId1Proof = await xcert.instance.methods.tokenProof(id).call();
  ctx.is(xcertId1Proof, newProof);
});

spec.test('throws when a third party tries to update proof', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const sara = ctx.get('sara');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');
  const newProof = ctx.get('proof2');

  await xcert.instance.methods.mint(bob, id, proof).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.updateTokenProof(id, newProof).send({ from: sara }));
});

spec.test('throws when trying to update proof to empty', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');

  await xcert.instance.methods.mint(bob, id, proof).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.updateTokenProof(id, '').send({ from: owner }), '010001');
});

spec.test('throws when trying to update xcert that does not exist', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const id = ctx.get('id1');
  const proof = ctx.get('proof1');

  await ctx.reverts(() => xcert.instance.methods.updateTokenProof(id, proof).send({ from: owner }), '010002');
});
