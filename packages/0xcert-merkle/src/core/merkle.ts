/**
 * Merkle tree hash function interface.
 */
export type MerkleHasher = ((v: any) => string) | ((v: any) => Promise<string>);

/**
 * Merkle value interface.
 */
export interface MerkleValue {
  index: number;
  value: any;
}

/**
 * Merkle node interface.
 */
export interface MerkleNode {
  index: number;
  hash: string;
}

/**
 * Merkle recipe interface with information for rebuilding merkle root.
 */
export interface MerkleRecipe {
  values: MerkleValue[];
  nodes: MerkleNode[];
}

/**
 * Merkle tree options interface.
 */
export interface MerkleOptions {
  hasher?: MerkleHasher;
}

/**
 * Merkle tree class.
 */
export class Merkle {
  protected $options: MerkleOptions;

  /**
   * Class constructor.
   * @param options Configuration options.
   */
  public constructor(options?: MerkleOptions) {
    this.$options = {
      hasher: (v) => v,
      ...options,
    };
  }

  /**
   * Returns a complete merkle recipe object with all merkle values and nodes.
   * @param data List of arbitrary values.
   */
  public async notarize(data: (string | number | boolean)[]): Promise<MerkleRecipe> {
    const values = [...data];
    const nodes = [await this.$options.hasher('')];

    for (let i = values.length - 1; i >= 0; i--) {
      const right = nodes[0];
      const value = values[i];
      nodes.unshift(
        await this.$options.hasher(value),
      );
      const left = nodes[0];
      nodes.unshift(
        await this.$options.hasher(`${left}${right}`),
      );
    }

    return {
      values: values.map((value, index) => ({ index, value })),
      nodes: nodes.map((hash, index) => ({ index, hash })),
    };
  }

  /**
   * Returns partial recipe object that includes only data for exposed values
   * from which we can still recreate the imprint. This method expects a
   * complete recipe (returned by the notarize function) then deletes nodes and
   * values that are not needed to recalculate the merkle root (imprint).
   * @param recipe A complete data recipe.
   * @param expose Value indexes to expose.
   */
  public async disclose(recipe: MerkleRecipe, expose: number[]) {
    const size = Math.max(...expose.map((i) => i + 1), 0);
    const values = [];
    const nodes = [
      recipe.nodes.find((n) => n.index === size * 2),
    ];

    for (let i = size - 1; i >= 0; i--) {
      if (expose.indexOf(i) !== -1) {
        values.unshift(
          recipe.values.find((n) => n.index === i),
        );
      } else {
        nodes.unshift(
          recipe.nodes.find((n) => n.index === i * 2 + 1),
        );
      }
    }

    return { values, nodes };
  }

  /**
   * Returns the root merkle tree hash built from the provided recipe object.
   * @param recipe Recipe object with nodes and values.
   */
  public async imprint(recipe: MerkleRecipe) {
    const nodes = [
      ...await Promise.all(
        recipe.values.map(async (v) => ({
          index: v.index * 2 + 1,
          hash: await this.$options.hasher(v.value),
          value: v.value,
        })),
      ),
      ...recipe.nodes,
    ];
    const size = Math.max(...nodes.map((n) => n.index + 1), 0);

    for (let i = size - 1; i >= 0; i -= 2) {
      const right = nodes.find((n) => n.index === i);
      const left = nodes.find((n) => n.index === i - 1);

      if (right && left) {
        nodes.unshift({
          index: i - 2,
          hash: await this.$options.hasher(`${left.hash}${right.hash}`),
        });
      }
    }

    const root = nodes.find((n) => n.index === 0);
    return root ? root.hash : null;
  }

}
