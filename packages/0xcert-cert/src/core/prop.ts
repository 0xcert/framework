import { MerkleNode, MerkleValue } from '@0xcert/merkle';

/**
 * Property (level) recipe interface.
 */
export interface PropRecipe {
  path: PropPath;
  values: PropValue[];
  nodes: PropNode[];
}

/**
 * Property value interface.
 */
export interface PropValue extends MerkleValue {}

/**
 * Property node interface.
 */
export interface PropNode extends MerkleNode {}

/**
 * Property path type.
 */
export type PropPath = PropKey[];

/**
 * Property path key type.
 */
export type PropKey = string | number;
