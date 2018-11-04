import { FolderAbility } from "@0xcert/scaffold";
import { Folder } from "../core/folder";

/**
 * 
 */
export default async function(folder: Folder, accountId: string) {
  return folder.context.query<FolderAbility[]>(async () => {
    return await Promise.all(
      [ FolderAbility.MANAGE_ABILITIES,
        FolderAbility.MINT_ASSET,
        FolderAbility.PAUSE_TRANSFER,
        FolderAbility.REVOKE_ASSET,
        FolderAbility.SIGN_MINT_CLAIM,
        FolderAbility.UPDATE_PROOF,
      ].map(async (ability) => {
        const able = await folder.contract.methods.isAble(accountId, ability).call();
        return able ? ability : -1;
      })
    ).then((abilities) => {
      return abilities.filter((a) => a !== -1).sort();
    });
  });
}
