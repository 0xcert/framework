import { IChainRequest, IChainResponse } from '@0xcert/chain';
import { IStoreRequest, IStoreResponse } from '@0xcert/store';

/**
 * 
 */
export * from '@0xcert/chain';

/**
 * 
 */
export * from '@0xcert/store';

/**
 * 
 */
export type IRequest = IChainRequest | IStoreRequest;

/**
 * 
 */
export type IResponse = IChainResponse | IStoreResponse;
