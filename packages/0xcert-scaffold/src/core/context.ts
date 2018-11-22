/**
 * 
 */
export interface ContextBase {
  myId: string;
  sign(data: string): Promise<string>;
}

/**
 * 
 */
export interface Query<T> {
  result: T;
}

/**
 * 
 */
export interface Mutation {
  id: string;
  confirmations: number;
}
