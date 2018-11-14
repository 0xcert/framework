import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/web3-sandbox';
import { parseError } from '../../core/errors';
import { ConnectorIssue } from '@0xcert/scaffold/dist/core/errors';

interface Data {
  protocol: Protocol;
  owner: string;
  bob: string;
  jane: string;
  zeroAddress: string;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  stage.set('owner', accounts[0]);
  stage.set('bob', accounts[1]);
  stage.set('jane', accounts[2]);
  stage.set('zeroAddress', '0x0000000000000000000000000000000000000000');
});

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const erc721 = stage.get('protocol').erc721;
  const erc721Metadata = stage.get('protocol').erc721Metadata;
  const erc721Enumerable = stage.get('protocol').erc721Enumerable;
  const burnableXcert = stage.get('protocol').xcertBurnable;
  const owner = stage.get('owner');
  const jane = stage.get('jane');
  await erc721.instance.methods.mint(jane, '123').send({ from: owner });
  await erc721Metadata.instance.methods.mint(jane, '123').send({ from: owner });
  await erc721Enumerable.instance.methods.mint(jane, '123').send({ from: owner });
  await burnableXcert.instance.methods.mint(jane, '123', '0x0').send({ from: owner });
});


spec.test('correctly throws ZERO_ADDRESS error', async (ctx) => {
  const erc721 = ctx.get('protocol').erc721;
  const erc721Metadata = ctx.get('protocol').erc721Metadata;
  const erc721Enumerable = ctx.get('protocol').erc721Enumerable;
  const zeroAddress = ctx.get('zeroAddress');
  await erc721.instance.methods.balanceOf(zeroAddress).call()
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ConnectorIssue.ZERO_ADDRESS);
  });
  await erc721Metadata.instance.methods.balanceOf(zeroAddress).call()
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ConnectorIssue.ZERO_ADDRESS);
  });
  await erc721Enumerable.instance.methods.balanceOf(zeroAddress).call()
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ConnectorIssue.ZERO_ADDRESS);
  });
});

spec.test('correctly throws INVALID_NFT error', async (ctx) => {
  const erc721 = ctx.get('protocol').erc721;
  const erc721Metadata = ctx.get('protocol').erc721Metadata;
  const erc721Enumerable = ctx.get('protocol').erc721Enumerable;
  const mutableXcert = ctx.get('protocol').xcertMutable;
  const owner = ctx.get('owner');
  await erc721.instance.methods.ownerOf('2').call()
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ConnectorIssue.INVALID_NFT);
  });
  await erc721Metadata.instance.methods.ownerOf('2').call()
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ConnectorIssue.INVALID_NFT);
  });
  await erc721Enumerable.instance.methods.ownerOf('2').call()
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ConnectorIssue.INVALID_NFT);
  });
  await mutableXcert.instance.methods.updateTokenProof('1','0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').call({ from: owner })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ConnectorIssue.INVALID_NFT);
  });
});

spec.test('correctly throws NOT_AUTHORIZED error', async (ctx) => {
  const erc721 = ctx.get('protocol').erc721;
  const erc721Metadata = ctx.get('protocol').erc721Metadata;
  const erc721Enumerable = ctx.get('protocol').erc721Enumerable;
  const burnableXcert = ctx.get('protocol').xcertBurnable;
  const xcert = ctx.get('protocol').xcert;
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const jane = ctx.get('jane');

  await erc721.instance.methods.approve(bob, '2').call({ from: owner })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ConnectorIssue.NOT_AUTHORIZED);
  });
  await erc721Metadata.instance.methods.approve(bob, '2').call({ from: owner })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ConnectorIssue.NOT_AUTHORIZED);
  });
  await erc721Enumerable.instance.methods.approve(bob, '2').call({ from: owner })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ConnectorIssue.NOT_AUTHORIZED);
  });
  await erc721.instance.methods.transferFrom(jane, bob, '123').call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ConnectorIssue.NOT_AUTHORIZED);
  });
  await erc721Metadata.instance.methods.transferFrom(jane, bob, '123').call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ConnectorIssue.NOT_AUTHORIZED);
  });
  await erc721Enumerable.instance.methods.transferFrom(jane, bob, '123').call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ConnectorIssue.NOT_AUTHORIZED);
  });
  await burnableXcert.instance.methods.burn('123').call({ from: bob })
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ConnectorIssue.NOT_AUTHORIZED);
  });
  await xcert.instance.methods.assignAbilities(bob, [0]).call({from: bob})
  .then(() => { ctx.fail(); })
  .catch((e) => {
    ctx.is(parseError(e).issue, ConnectorIssue.NOT_AUTHORIZED);
  });
});

export default spec;
