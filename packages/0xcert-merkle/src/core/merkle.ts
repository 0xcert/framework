import { getLevelFromSize, getSizeFromLevel } from '../utils/calcs';

/**
 * Merkle tree node definition.
 */
export type MerkleHasher = ((v: string) => string) | ((v: string) => Promise<string>);

/**
 * Merkle tree node definition.
 */
// export type MerkleSeeder = ((i: number) => string) | ((i: number) => Promise<string>);

/**
 * 
 */
export interface MerkleValue {
  index: number;
  value: string;
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
  proofs: MerkleHash[];
  nodes: MerkleHash[];
}

/**
 * Merkle tree configuration.
 */
export interface MerkleConfig {
  hasher?: MerkleHasher;
  // seeder?: MerkleSeeder;
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
      // seeder: (i) => `${i}`,
      ...config,
    };
  }

  /**
   * Returns evidence data.
   * @param values List of arbitrary values.
   */
  public async buildRecipe(data: string[]) {
    const values = this.buildValues(data);
    const proofs = await this.buildProofs(values);
    const nodes = await this.buildNodes(proofs);

    return {
      values: values.map((value, index) => ({ index, value })),
      proofs: proofs.map((hash, index) => ({ index, hash })),
      nodes: nodes.map((hash, index) => ({ index, hash })),
    };
  }

  /**
   * Returns evidence data.
   * @param recipe Object returned by buildRecipe()
   * @param expose Value indexes to expose.
   */
  public async buildEvidence(recipe: MerkleRecipe, expose: number[]) {
    const evidence = {
      values: recipe.values.filter((v) => expose.indexOf(v.index) !== -1),
      proofs: [],
      nodes: [],
    };

    const maxIndex = Math.max(...expose);
    const levelsCount = getLevelFromSize(maxIndex + 1);

    for (let level = 0; level < levelsCount; level++) {
      const size = getSizeFromLevel(level + 1) - 1;
      const range = [size - Math.pow(2, level + 1), size - 1];

      const indexes = expose.filter((i) => i >= range[0] && i <= range[1]);
      if (indexes.length) {
        evidence.proofs.push(
          ...recipe.proofs.filter((p) => p.index >= range[0] && p.index <= range[1] && expose.indexOf(p.index) === -1)
        );
      }
      else {
        evidence.nodes.push(
          recipe.nodes[level * 2 + 1]
        );
      }
    }

    evidence.nodes.push(
      recipe.nodes[levelsCount * 2]
    );

    return evidence;
  }

  /**
   * Returns the root merkle tree hash built from the evidence object.
   * @param evidence Object returned by buildEvidence()
   */
  public async buildImprint(evidence: MerkleRecipe) {

    const levels = Math.max(
      getLevelFromSize(Math.max(...evidence.values.map((v) => v.index))),
      getLevelFromSize(Math.max(...evidence.proofs.map((p) => p.index))),
      (Math.max(...evidence.nodes.map((n) => n.index)) - 1) / 2,
    );
    const nodes = [];

    for (let level = levels - 1; level >= 0; level--) {

      const rightNode = evidence.nodes.find((n) => n.index === level * 2 + 2);
      if (rightNode) {
        nodes.unshift(rightNode.hash);
      }
      else {
        nodes.unshift(
          await this.config.hasher(nodes.slice(0, 2).join(''))
        );
      }

      const leftNode = evidence.nodes.find((n) => n.index === level * 2 + 1);
      if (leftNode) {
        nodes.unshift(leftNode.hash);
      }
      else {
        const size = getSizeFromLevel(level + 1) - 1;
        const range = [size - Math.pow(2, level + 1), size - 1];
        const valueProofs = await Promise.all(
          evidence.values.filter((p) => p.index >= range[0] && p.index <= range[1])
            .map(async (v) => ({ index: v.index, hash: await this.config.hasher(v.value) }))
        );
        const levelProofs = evidence.proofs
          .filter((p) => p.index >= range[0] && p.index <= range[1])
        const proofs = [].concat(valueProofs).concat(levelProofs)
          .sort((a, b) => (a.index < b.index) ? -1 : (a.index > b.index) ? 1 : 0);
        nodes.unshift(
          await this.config.hasher(proofs.map((p) => p.hash).join(''))
        );
      }
    }

    return await this.config.hasher(nodes.slice(0, 2).join(''));
  }

  /**
   * Converts an array of values into a fixed array of marke tree values. 
   * @param values List of arbitrary values.
   */
  protected buildValues(values: string[]) {
    const valuesCount = values.length + 1; // include null
    const maxLevel = getLevelFromSize(valuesCount);

    return [...values].concat(
      [...Array(getSizeFromLevel(maxLevel) - valuesCount)].map(() => '-')
    );
  }

  /**
   * Converts data into hash values.
   * @param values List of arbitrary values.
   */
  protected async buildProofs(values: string[]) {
    return Promise.all(
      values.map(async (value) => this.config.hasher(value))
    );
  }

  /**
   * Returns a list of left and right hash nodes which connect the merkle tree.
   * @param proofs List of proofs.
   */
  protected async buildNodes(proofs: string[]) {
    const chunks = this.buildChunks(proofs);
    const levels = chunks.length;
    const nodes = [];

    for (let level = levels - 1; level >= 0; level--) {

      if (level === levels - 1) {
        nodes.unshift(
          await this.config.hasher('-')
        );
      }
      else {
        nodes.unshift(
          await this.config.hasher(
            nodes.slice(0, 2).join('')
          )
        );
      }

      nodes.unshift(
        await this.config.hasher(
          chunks[level].join('')
        )
      );
    }

    nodes.unshift(
      await this.config.hasher(
        nodes.slice(0, 2).join('')
      )
    );

    return [...nodes];
  }

  /**
   * Convert an array into an array of merkle chunks where the first chunk is
   * ignored (see the description for the buildItems method).
   * @param values Fixed array of merkle items.
   */
  protected buildChunks(values: any[]) {
    const valuesCount = values.length + 1;
    const maxLevel = getLevelFromSize(valuesCount);

    return [...Array(maxLevel + 1)].map((v, level) => {
      const start = getSizeFromLevel(level) - Math.pow(2, level);
      return [null, ...values].slice(start, start + Math.pow(2, level));
    }).slice(1);
  }

  // `L` number of levels based `N` number of total values in array
  // L = Math.ceil(Math.log2(N))

  // `L` number of items in `level`
  // L = Math.pow(2, level)

  // `chunk` of a `level` from values in an array
  // chunk = [0,1,2,3,4,5,6,7,8,9].splice(Math.pow(2, level)-1, Math.pow(2, level));

  // level based on number of items (first item is always null)
  // Math.log2(size + 1)
}
