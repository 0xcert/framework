/**
 * Merkle tree node definition.
 */
export type MerkleAlgo = ((v: string) => string) | ((v: string) => Promise<string>);

/**
 * Merkle tree configuration.
 */
export interface MerkleConfig {
  algo?: MerkleAlgo;
}

/**
 * Merkle tree class.
 */
export class Merkle {
  protected config: MerkleConfig;

  /**
   * 
   */
  public constructor(config?: MerkleConfig) {
    this.config = {
      algo: (v) => v,
      ...config,
    };
  }

  /**
   * 
   */
  public buildRoot(values: string[]) {
    // 
  }

}
