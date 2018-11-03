import { FolderCapability } from "@0xcert/scaffold";
import { Folder } from "../core/folder";

/**
 * 
 */
export default async function(folder: Folder) {
  return folder.connector.query<FolderCapability[]>(async () => {
    return await Promise.all(
      [ [FolderCapability.BURNABLE, '0x42966c68'],
        [FolderCapability.MUTABLE, '0x33b641ae'],
        [FolderCapability.PAUSABLE, '0xbedb86fb'],
        [FolderCapability.REVOKABLE, '0x20c5429b'],
      ].map(async (capability) => {
        if (await folder.contract.methods.supportsInterface(capability[1]).call()) {
          return capability[0];
        } else {
          return null;
        }
      })
    ).then((abilities) => {
      return abilities.filter((a) => a !== null).sort() as FolderCapability[];
    });
  })
}
