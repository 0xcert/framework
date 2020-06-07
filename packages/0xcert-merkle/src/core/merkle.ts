/**
 * Merkle tree hash function interface.
 */
export enum MerkleHasherPosition {
  VALUE = 0,
  LEAF = 1,
  NODE = 2,
}

/**
 * Merkle tree hash function interface.
 */
export type MerkleHasher = (
  (value: any, path: (string | number)[], position: MerkleHasherPosition) => string)
| ((value: any, path: (string | number)[], position: MerkleHasherPosition) => Promise<string>
);

/**
 * Merkle tree nonce function interface.
 */
export type MerkleNoncer = (
  (path: (string | number)[]) => string)
| ((path: (string | number)[]) => Promise<string>
);

/**
 * Merkle value interface.
 */
export interface MerkleValue {
  index: number;
  value: any;
  nonce: string;
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
  noncer?: MerkleNoncer;
}

/**
 * Merkle tree class.
 */
export class Merkle {
  protected _options: MerkleOptions;

  /**
   * Class constructor.
   * @param options Configuration options.
   */
  public constructor(options?: MerkleOptions) {
    this._options = {
      hasher: (v) => v,
      noncer: () => '',
      ...options,
    };
  }

  /**
   * Create a custom hash.
   */
  public hash(value: any, path: (string | number)[], position: MerkleHasherPosition): string | Promise<string> {
    return this._options.hasher(value, path, position);
  }

  /**
   * Create a custom hash.
   */
  public nonce(path: (string | number)[]): string | Promise<string> {
    return this._options.noncer(path);
  }

  /**
   * Returns a complete merkle recipe object with all merkle values and nodes.
   * @param data List of arbitrary values.
   */
  public async notarize(data: (string | number | boolean)[], prepend: (string | number)[] = []): Promise<MerkleRecipe> {
    const values = [...data];
    const nonces = [];

    const empty = await this._options.noncer([...prepend, values.length]);
    const nodes = [await this._options.hasher(empty, [...prepend, values.length], MerkleHasherPosition.NODE)];

    for (let i = values.length - 1; i >= 0; i--) {
      const right = nodes[0];
      nonces.unshift(
        await this._options.noncer([...prepend, i]),
      );
      const value = await this._options.hasher(values[i], [...prepend, i], MerkleHasherPosition.VALUE);
      nodes.unshift(
        await this._options.hasher(`${value}${nonces[0]}`, [...prepend, i], MerkleHasherPosition.LEAF),
      );
      const left = nodes[0];
      nodes.unshift(
        await this._options.hasher(`${left}${right}`, [...prepend, i], MerkleHasherPosition.NODE),
      );
    }

    return {
      values: values.map((value, index) => ({ index, value, nonce: nonces[index] })),
      nodes: nodes.map((hash, index) => ({ index, hash })),
    };
  }

  /**
   * Returns partial recipe object that includes only data for exposed values
   * from which we can still recreate the imprint. This method expects a
   * complete recipe (returned by the notarize function) then deletes nodes and
   * values that are not needed to recalculate the Merkle root (imprint).
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
   * Returns the root Merkle tree hash built from the provided recipe object.
   * @param recipe Recipe object with nodes and values.
   */
  public async imprint(recipe: MerkleRecipe) {
    const nodes = [
      ...await Promise.all(
        recipe.values.map(async (v, i) => {
          const value = await this._options.hasher(v.value, [i], MerkleHasherPosition.VALUE);
          return {
            index: v.index * 2 + 1,
            hash: await this._options.hasher(`${value}${v.nonce}`, [i], MerkleHasherPosition.LEAF),
            value: v.value,
          };
        }),
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
          hash: await this._options.hasher(`${left.hash}${right.hash}`, [i], MerkleHasherPosition.NODE),
        });
      }
    }

    const root = nodes.find((n) => n.index === 0);
    return root ? root.hash : null;
  }

}
