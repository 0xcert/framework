import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { Protocol } from '@0xcert/ethereum-sandbox';
import { Spec } from '@specron/spec';
import { AssetLedger } from '../../../core/ledger';

const spec = new Spec<{
  protocol: Protocol;
  provider: GenericProvider;
  coinbase: string;
}>();

spec.before(async (stage) => {
  const protocol = new Protocol(stage.web3);
  stage.set('protocol', await protocol.deploy());
});

spec.before(async (stage) => {
  const provider = new GenericProvider({
    client: stage.web3,
  });
  stage.set('provider', provider);
});

spec.before(async (stage) => {
  const accounts = await stage.web3.eth.getAccounts();
  stage.set('coinbase', accounts[0]);
});

spec.before(async (stage) => {
  const provider = stage.get('provider');
  const ledgerId = stage.get('protocol').xcert.instance.options.address;
  stage.set('ledger', new AssetLedger(provider, ledgerId));
});

spec.test('returns token approved account', async (ctx) => {
  const coinbase = ctx.get('coinbase');
  const xcert = ctx.get('protocol').xcert;
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').xcert.instance.options.address;
  const ledger = new AssetLedger(provider, ledgerId);
  await xcert.instance.methods.create(coinbase, '1', '0x973124ffc4a03e66d6a4458e587d5d6146f71fc57f359c8d516e0b12a50ab0d9').send({ from: coinbase });
  const approvedAccount = await ledger.getApprovedAccount('1');
  ctx.is(approvedAccount, '0x0000000000000000000000000000000000000000');
});

spec.test('returns null calling a contract that does not have getApprovedAccount function', async (ctx) => {
  const provider = ctx.get('provider');
  const ledgerId = ctx.get('protocol').erc20.instance.options.address;
  const ledger = new AssetLedger(provider, ledgerId);
  ctx.is(await ledger.getApprovedAccount('1'), null);
});

spec.test('check crypto kitty fallback hack', async (ctx) => {
  const provider = ctx.get('provider');
  const coinbase = ctx.get('coinbase');

  /**
   * To test kitty fallback we use a contract specially created for this:
   * pragma solidity ^0.4.24;
   *
   *  contract KittyHackTest {
   *    mapping (uint256 => address) public kittyIndexToApproved;
   *
   *    function addToKittyIndex(
   *      uint256 _index,
   *      address _owner
   *    )
   *    external
   *    {
   *      kittyIndexToApproved[_index] = _owner;
   *    }
   *  }
   */
  const kittyHackAbi = [{'constant': true, 'inputs': [{'name': '', 'type': 'uint256'}], 'name': 'kittyIndexToApproved', 'outputs': [{'name': '', 'type': 'address'}], 'payable': false, 'stateMutability': 'view', 'type': 'function'}, {'constant': false, 'inputs': [{'name': '_index', 'type': 'uint256'}, {'name': '_owner', 'type': 'address'}], 'name': 'addToKittyIndex', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function'}];

  const kittyHackBytecode = '0x608060405234801561001057600080fd5b50610160806100206000396000f30060806040526004361061004b5763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663481af3d38114610050578063d3adfa8e14610091575b600080fd5b34801561005c57600080fd5b506100686004356100c4565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b34801561009d57600080fd5b506100c260043573ffffffffffffffffffffffffffffffffffffffff602435166100ec565b005b60006020819052908152604090205473ffffffffffffffffffffffffffffffffffffffff1681565b600091825260208290526040909120805473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff9092169190911790555600a165627a7a723058201ae7be4968e8a069a633e1dd4845d3951d3a0cb52f5d6d1eaabf44d32332b44f0029';
  const kittyHashContract = new ctx.web3.eth.Contract(kittyHackAbi);
  let ledgerId;
  await kittyHashContract.deploy({ data: kittyHackBytecode })
  .send({ from: coinbase, gas: 1000000 })
  .then((newContractInstance) => {
    ledgerId = newContractInstance.options.address; // instance with the new contract address
    kittyHashContract.options.address = ledgerId;
  });

  await kittyHashContract.methods.addToKittyIndex('1', coinbase).send({ from: coinbase });

  const ledger = new AssetLedger(provider, ledgerId);
  ctx.is(await ledger.getApprovedAccount('1'), coinbase);
});

export default spec;
