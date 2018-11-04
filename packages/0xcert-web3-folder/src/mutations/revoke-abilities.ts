import { FolderAbility } from "@0xcert/scaffold";
import { Folder } from "../core/folder";

/**
 * 
 */
export default async function(folder: Folder, accountId: string, abilities: FolderAbility[]) {
  const from = folder.context.makerId;

  return folder.context.mutate(() => {
    return folder.contract.methods.revokeAbilities(accountId, abilities).send({ from });
  });
}
