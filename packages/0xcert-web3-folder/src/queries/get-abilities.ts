import { FolderAbility } from "@0xcert/scaffold";
import { performQuery } from "@0xcert/web3-utils";
import { FolderConfig } from "../core/folder";
import { getFolder } from "../utils/contracts";

/**
 * 
 */
export default async function(config: FolderConfig, accountId: string) {
  const folder = getFolder(config.web3, config.folderId);

  return performQuery<FolderAbility[]>(async () => {
    return await Promise.all(
      [ FolderAbility.MANAGE_ABILITIES,
        FolderAbility.MINT_ASSET,
        FolderAbility.PAUSE_TRANSFER,
        FolderAbility.REVOKE_ASSET,
        FolderAbility.SIGN_MINT_CLAIM,
        FolderAbility.UPDATE_PROOF,
      ].map(async (ability) => {
        if (await folder.methods.isAble(accountId, ability).call()) {
          return ability;
        } else {
          return null;
        }
      })
    ).then((abilities) => {
      return abilities.filter((a) => a !== null).sort();
    });
  });
}
