import { FolderTransferState } from "@0xcert/scaffold";
import { Folder } from "../core/folder";

/**
 * 
 */
export default async function(folder: Folder) {
  return folder.context.query<FolderTransferState>(async () => {
    const paused = await folder.contract.methods.isPaused().call();
    const state = paused ? FolderTransferState.DISABLED : FolderTransferState.ENABLED;

    return state;
  });
}
