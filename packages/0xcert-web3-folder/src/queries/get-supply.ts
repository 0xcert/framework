import { FolderConfig } from "../core/folder";
import { performQuery } from "@0xcert/web3-utils";
import { getFolder } from "../utils/contracts";

/**
 * 
 */
export default async function(config: FolderConfig) {
  const folder = getFolder(config.web3, config.folderId);

  return performQuery<number>(async () => {
    const total = parseInt(await folder.methods.totalSupply().call());

    return total;
  });
}