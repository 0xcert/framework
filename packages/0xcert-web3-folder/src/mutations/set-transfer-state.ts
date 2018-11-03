import { FolderTransferState } from "@0xcert/scaffold";
import { Folder } from "../core/folder";

/**
 * 
 */
export default async function(folder: Folder, state: FolderTransferState) {
  const from = folder.connector.makerId;
  const paused = state !== FolderTransferState.ENABLED;

  return folder.connector.mutate(() => {
    return folder.contract.methods.setPause(paused).send({ from });
  });
}
