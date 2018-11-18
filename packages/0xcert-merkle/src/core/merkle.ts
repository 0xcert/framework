/**
 * Merkle tree node definition.
 */
export type MerkleHasher = ((v: any) => string) | ((v: any) => Promise<string>);

/**
 * 
 */
export interface MerkleValue {
  index: number;
  value: any;
}

/**
 * 
 */
export interface MerkleHash {
  index: number;
  hash: string;
}

/**
 * 
 */
export interface MerkleRecipe {
  values: MerkleValue[];
  nodes: MerkleHash[];
}

/**
 * Merkle tree configuration.
 */
export interface MerkleConfig {
  hasher?: MerkleHasher;
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
      hasher: (v) => v,
      ...config,
    };
  }

  /**
   * Returns a complete evidence data object.
   * @param data List of arbitrary values.
   */
  public async notarize(data: (string|number|boolean)[]) {
    const values = [...data];
    const nodes = [await this.config.hasher('')];

    for (let i = values.length - 1; i >= 0; i--) {
      const right = nodes[0];
      const value = values[i];
      nodes.unshift(
        await this.config.hasher(value)
      );
      const left = nodes[0];
      nodes.unshift(
        await this.config.hasher(`${left}${right}`)
      );
    }

    return {
      values: values.map((value, index) => ({ index, value })),
      nodes: nodes.map((hash, index) => ({ index, hash })),
    };
  }

  /**
   * Returns evidence data object that includes only data for exposed values
   * from which we can recreate the imprint.
   * @param recipe Object returned by notarize()
   * @param expose Value indexes to expose.
   */
  public async disclose(recipe: MerkleRecipe, expose: number[]) {
    const size = Math.max(...expose.map((i) => i + 1), 0);
    const values = [];
    const nodes = [
      recipe.nodes.find((n) => n.index === size * 2)
    ];

    for (let i = size - 1; i >= 0; i--) {
      if (expose.indexOf(i) !== -1) {
        values.unshift(
          recipe.values.find((n) => n.index === i)
        );
      }
      else {
        nodes.unshift(
          recipe.nodes.find((n) => n.index === i * 2 + 1)
        );
      }
    }

    return { values, nodes };
  }

  /**
   * Returns the root merkle tree hash built from the evidence object.
   * @param evidence Object returned by disclose()
   */
  public async imprint(evidence: MerkleRecipe) {
    const nodes = [
      ...await Promise.all(
        evidence.values.map(async (v) => ({
          index: v.index * 2 + 1,
          hash: await this.config.hasher(v.value),
          value: v.value
        }))
      ),
      ...evidence.nodes,
    ];
    const size = Math.max(...nodes.map((n) => n.index + 1), 0);

    for (let i = size - 1; i >= 0; i-=2) {
      const right = nodes.find((n) => n.index === i);
      const left = nodes.find((n) => n.index === i - 1);

      if (right && left) {
        nodes.unshift({
          index: i - 2,
          hash: await this.config.hasher(`${left.hash}${right.hash}`),
        });
      }
    }

    const root = nodes.find((n) => n.index === 0);
    return root ? root.hash : null;
  }

}
