import { FolderBase } from "./folder";

/**
 * 
 */
export interface ConnectorBase {
  attach(): Promise<this>;
  detach(): Promise<this>;
  sign(data: string): Promise<string>;
}
