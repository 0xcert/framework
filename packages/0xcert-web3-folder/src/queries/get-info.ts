import { FolderGetInfoResult } from "@0xcert/connector";
import { FolderConfig } from "../core/folder";
import { performQuery } from "../core/intents";
import { getFolder } from "../utils/contracts";

/**
 * 
 */
export default async function(config: FolderConfig) {
  const folder = getFolder(config.web3, config.folderId);

  return performQuery<FolderGetInfoResult>(async () => {
    const name = await folder.methods.name().call();
    const symbol = await folder.methods.symbol().call();

    return { name, symbol };
  });
}
