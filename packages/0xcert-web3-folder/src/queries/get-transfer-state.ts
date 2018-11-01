import { FolderTransferState } from "@0xcert/connector";
import { FolderConfig } from "../core/folder";
import { performQuery } from "../core/intents";
import { getFolder } from "../utils/contracts";

/**
 * 
 */
export default async function(config: FolderConfig) {
  const folder = getFolder(config.web3, config.folderId);

  return performQuery<FolderTransferState>(async () => {
    const paused = await folder.methods.isPaused().call();
    const state = paused ? FolderTransferState.DISABLED : FolderTransferState.ENABLED;

    return state;
  });
}
