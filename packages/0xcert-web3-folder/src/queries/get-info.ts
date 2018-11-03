import { FolderGetInfoResult } from "@0xcert/connector";
import { FolderConfig } from "../core/folder";
import { performQuery } from "@0xcert/web3-utils";
import { getFolder } from "../utils/contracts";

/**
 * 
 */
export default async function(config: FolderConfig) {
  const folder = getFolder(config.web3, config.folderId);

  return performQuery<FolderGetInfoResult>(async () => {
    const name = await folder.methods.name().call();
    const symbol = await folder.methods.symbol().call();
    const uriBase = await folder.methods.uriBase().call();
    const conventionId = await folder.methods.symbol().call();

    return { name, symbol, uriBase, conventionId };
  });
}
