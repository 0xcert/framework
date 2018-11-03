import { FolderGetInfoResult } from "@0xcert/scaffold";
import { Folder } from "../core/folder";

/**
 * 
 */
export default async function(folder: Folder) {
  return folder.connector.query<FolderGetInfoResult>(async () => {
    const name = await folder.contract.methods.name().call();
    const symbol = await folder.contract.methods.symbol().call();
    const uriBase = await folder.contract.methods.uriBase().call();
    const conventionId = await folder.contract.methods.symbol().call();

    return { name, symbol, uriBase, conventionId };
  });
}
