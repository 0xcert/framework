import { Folder } from "../core/folder";

/**
 * 
 */
export default async function(folder: Folder) {
  return folder.connector.query<number>(async () => {
    const total = parseInt(await folder.contract.methods.totalSupply().call());

    return total;
  });
}
