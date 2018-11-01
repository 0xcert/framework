import { FolderGetCapabilitiesResult } from "@0xcert/connector";
import { FolderConfig } from "../core/folder";
import { performQuery } from "../core/intents";
import { getFolder } from "../utils/contracts";

/**
 * 
 */
export default async function(config: FolderConfig) {
  const folder = getFolder(config.web3, config.folderId);

  return performQuery<FolderGetCapabilitiesResult>(async () => {
    const isBurnable = await folder.methods.supportsInterface('0x42966c68').call();
    const isMutable = await folder.methods.supportsInterface('0x33b641ae').call();
    const isPausable = await folder.methods.supportsInterface('0xbedb86fb').call();
    const isRevokable = await folder.methods.supportsInterface('0x20c5429b').call();

    return { isBurnable, isMutable, isPausable, isRevokable };
  });
}
