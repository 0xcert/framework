import { AssetLedgerAbility } from "@0xcert/scaffold";
import { encodeFunctionCall, decodeParameters } from 'web3-eth-abi';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcertAbi';

/**
 * Gets an array of all abilities an account has.
 */
export default async function(ledger: AssetLedger, accountId: string) {

  const abi = xcertAbi.find((a) => (
    a.name === 'isAble' && a.type === 'function'
  ));

  return await Promise.all(
    [ AssetLedgerAbility.MANAGE_ABILITIES,
      AssetLedgerAbility.MINT_ASSET,
      AssetLedgerAbility.PAUSE_TRANSFER,
      AssetLedgerAbility.REVOKE_ASSET,
      AssetLedgerAbility.SIGN_MINT_CLAIM,
      AssetLedgerAbility.UPDATE_PROOF,
    ].map(async (ability) => {
      return ledger.provider.send({
        method: 'eth_call',
        params: [
          {
            to: ledger.id,
            data: encodeFunctionCall(abi, [accountId, ability]),
          },
          'latest'
        ],
      }).then(({ result }) => {
        return decodeParameters(abi.outputs, result);
      }).then((r) => {
        return r[0] ? ability : -1;
      });
    })
  ).then((abilities) => {
    return abilities.filter((a) => a !== -1).sort();
  });
}
