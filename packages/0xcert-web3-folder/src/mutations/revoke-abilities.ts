import { FolderAbility } from "@0xcert/scaffold";
import { Folder } from "../core/folder";

/**
 * 
 */
export default async function(folder: Folder, accountId: string, abilities: FolderAbility[]) {
  const from = folder.connector.makerId;

  return folder.connector.mutate(() => {
    return folder.contract.methods.revokeAbilities(accountId, abilities).send({ from });
  });
}
