import { FolderGetSupplyResult } from "@0xcert/connector";
import { FolderConfig } from "../core/folder";
import { performQuery } from "../core/intents";
import { getFolder } from "../utils/contracts";

/**
 * 
 */
export default async function(config: FolderConfig) {
  const folder = getFolder(config.web3, config.folderId);

  return performQuery<FolderGetSupplyResult>(async () => {
    const total = parseInt(await folder.methods.totalSupply().call());

    return { total };
  });
}