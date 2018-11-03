import { FolderConfig } from "../core/folder";
import { FolderCapability } from "@0xcert/scaffold";
import { performQuery } from "@0xcert/web3-utils";
import { getFolder } from "../utils/contracts";

/**
 * 
 */
export default async function(config: FolderConfig) {
  const folder = getFolder(config.web3, config.folderId);

  return performQuery<FolderCapability[]>(async () => {
    return await Promise.all(
      [ [FolderCapability.BURNABLE, '0x42966c68'],
        [FolderCapability.MUTABLE, '0x33b641ae'],
        [FolderCapability.PAUSABLE, '0xbedb86fb'],
        [FolderCapability.REVOKABLE, '0x20c5429b'],
      ].map(async (capability) => {
        if (await folder.methods.supportsInterface(capability[1]).call()) {
          return capability[0];
        } else {
          return null;
        }
      })
    ).then((abilities) => {
      return abilities.filter((a) => a !== null).sort() as FolderCapability[];
    });
  });

}
