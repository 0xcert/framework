import { FolderBase } from "./folders";

/**
 * 
 */
export interface ConnectorBase {
  getFolder(id: string): Promise<FolderBase>;
}
