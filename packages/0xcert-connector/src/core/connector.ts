import { FolderBase } from "./folder";

/**
 * 
 */
export interface ConnectorBase {
  getFolder(id: string): Promise<FolderBase>;
}
