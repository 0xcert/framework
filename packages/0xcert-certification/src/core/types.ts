import { MerkleValue } from '@0xcert/merkle';

/**
 * 
 */
export interface CertProp {
  path: (string | number)[];
  // value: any;
  evidence: Evidence;
}

/**
 * 
 */
export interface Evidence {
  values: MerkleValue[];
  proofs: EvidenceProof[];
  nodes: EvidenceNode[];
}

/**
 * 
 */
export interface EvidenceProof {
  index: number;
  hash: string;
  key: string | number;
}

/**
 * 
 */
export interface EvidenceNode {
  index: number;
  hash: string;
}
