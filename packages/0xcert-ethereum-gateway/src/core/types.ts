/**
 * Order gateway proxy kinds.
 */
export enum ProxyKind {
  CREATE_ASSET = 0,
  TRANSFER_TOKEN = 1,
  TRANSFER_ASSET = 2,
  UPDATE_ASSET = 3,
  MANAGE_ABILITIES = 4,
  DESTROY_ASSET = 5,
}

/**
 * Order gateway proxy ids.
 */
export enum ProxyId {
  XCERT_CREATE = 0,
  TOKEN_TRANSFER = 1,
  NFTOKEN_TRANSFER = 2,
  NFTOKEN_SAFE_TRANSFER = 3,
  XCERT_UPDATE = 4,
  MANAGE_ABILITIES = 5,
  XCERT_BURN = 6,
}
