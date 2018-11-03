/**
 * Merkle tree node definition.
 */
export interface MerkleNode {
  level: number;
  index: number;
  hash: string;
}

/**
 * Merkle tree value definition.
 */
export interface MerkleValue {
  index: number;
  value: string;
}

/**
 * Merkle tree configuration.
 */
export interface MerkleConfig {
  algo?: ((v: string) => string) | ((v: string) => Promise<string>);
}

/**
 * Merkle tree class.
 */
export class Merkle {
  protected config: MerkleConfig;

  /**
   * Class constructor.
   * @param config Merkle tree configuration.
   */
  public constructor(
    config?: MerkleConfig
  ) {
    this.config = {
      algo: (v) => v,
      ...config,
    };
  }

  /**
   * Converts the provided values into merkle tree nodes.
   * @param values A complete list of merkle tree values.
   */
  public async build(values: MerkleValue[]) {
    const levelsCount = Math.ceil(Math.log2(values.length)) + 1;
    const valuesCount = values.concat([]).sort((a, b) => b.index - a.index)[0].index + 1;
    const nodes = [];

    for (let index = 0; index < valuesCount; index++) {
      const value = values[index];
      nodes.push({
        level: levelsCount - 1,
        index: value.index,
        hash: await this.config.algo(value.value),
      });
    }

    for (let level = levelsCount - 1; level > 0; level--) {
      const levelNodes = nodes.filter((a) => a.level === level);

      for (let index = 0; index < levelNodes.length; index += 2) {
        const left = levelNodes.find((a) => a.index === index);
        const right = levelNodes.find((a) => a.index === index + 1);

        if (left && right) {
          nodes.push({
            level: level - 1,
            index: index / 2,
            hash: await this.config.algo(`${left.hash}${right.hash}`),
          });
        }
        else if (left && !right) {
          nodes.push({
            level: level - 1,
            index: index / 2,
            hash: left.hash,
          });
        }
      }
    }

    return this.sortNodes(nodes);
  }

  /**
   * Converts the provided values into a minimal list of merkle tree nodes from
   * which the root node can still be ccalculated.
   * @param values A complete list of merkle tree values.
   * @param exposed A list of exposed values.
   */
  public pack(nodes: MerkleNode[], exposed: number[]) {
    const levelsCount = nodes.concat([]).sort((a, b) => b.level - a.level)[0].level + 1;
    const calculatedNodes = [];
    const requiredNodes = [];

    for (const index of exposed) {
      calculatedNodes.push(
        nodes.find((a) => a.level === levelsCount - 1 && a.index === index)
      );
    }
    
    for (let level = levelsCount - 1; level > 0; level--) {
      const levelNodes = calculatedNodes.filter((a) => a.level === level);
      const lastLevelNode = levelNodes.concat([]).sort((a, b) => b.index - a.index)[0];
      const levelNodesCount = lastLevelNode ? lastLevelNode.index + 1 : 0;
      
      for (let index = 0; index < levelNodesCount; index += 2) {
        const left = levelNodes.find((a) => a.index === index);
        const right = levelNodes.find((a) => a.index === index + 1);

        if (!left && right) {
          const requiredNode = nodes.find((a) => a.level === level && a.index === index);
          requiredNodes.push(requiredNode);
        }
        if (!right && left) {
          const requiredNode = nodes.find((a) => a.level === level && a.index === index + 1);
          if (requiredNode) {
            requiredNodes.push(requiredNode);
          }
        }
        if (left || right) {
          const calculatedNode = nodes.find((a) => a.level === level - 1 && a.index === index / 2);
          if (calculatedNode) {
            calculatedNodes.push(calculatedNode);
          }
        }
      }
    }

    return this.sortNodes(requiredNodes);
  }

  /**
   * Returns the root node of the tree.
   * @param values A list of disclosed tree values.
   * @param nodes A packed list of nodes required to rebuild the root node.
   */
  public async calculate(values: MerkleValue[], nodes: MerkleNode[], size: number) {
    const levelsCount = Math.max(Math.ceil(Math.log2(size)) + 1);
    const requiredNodes = nodes.concat([]);

    for (const value of values) {
      requiredNodes.push({
        level: levelsCount - 1,
        index: value.index,
        hash: await this.config.algo(value.value),
      });
    }
    
    for (let level = levelsCount - 1; level > 0; level--) {
      const levelNodes = requiredNodes.filter((a) => a.level === level);
      const lastLevelNode = levelNodes.concat([]).sort((a, b) => b.index - a.index)[0];
      const levelNodesCount = lastLevelNode ? lastLevelNode.index + 1 : 0;

      for (let index = 0; index < levelNodesCount; index += 2) {
        const left = levelNodes.find((a) => a.index === index);
        const right = levelNodes.find((a) => a.index === index + 1);

        if (left && right) {
          requiredNodes.push({
            level: level - 1,
            index: index / 2,
            hash: await this.config.algo(`${left.hash}${right.hash}`),
          });
        }
        else if (left && !right) {
          requiredNodes.push({
            level: level - 1,
            index: index / 2,
            hash: left.hash,
          });
        }
      }
    }

    return requiredNodes.find((a) => a.level === 0 && a.index === 0);
  }

  /**
   * Returns an ordered list of node.
   * @param nodes A list of nodes.
   */
  protected sortNodes(nodes: MerkleNode[]) {
    return nodes.concat([]).sort((a, b) => {
      if (a.level == b.level) {
        return (a.index < b.index) ? -1 : (a.index > b.index) ? 1 : 0;
      }
      else {
        return (a.level < b.level) ? -1 : 1;
      }
    });
  }

}
