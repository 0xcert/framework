import { MerkleValue } from '@0xcert/merkle';

/**
 * 
 */
export interface PropProof {
  path: PropPath;
  values: PropValue[];
  nodes: PropNode[];
}

/**
 * 
 */
export interface PropValue extends MerkleValue {}

/**
 * 
 */
export interface PropNode {
  index: number;
  hash: string;
}

/**
 * 
 */
export type PropPath = PropKey[];

/**
 * 
 */
export type PropKey = string | number;
