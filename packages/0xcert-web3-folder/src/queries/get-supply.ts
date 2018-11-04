import { Folder } from "../core/folder";

/**
 * 
 */
export default async function(folder: Folder) {
  return folder.context.query<number>(async () => {
    const total = parseInt(await folder.contract.methods.totalSupply().call());

    return total;
  });
}
