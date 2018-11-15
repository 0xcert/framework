| Error                                                | Description                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| ZERO_ADDRESS                                         | One of the addresses provided was a zero (0x0) address.      |
| INVALID_NFT                                          | Provided NFT is invalid (id does not exist).                 |
| NOT_AUTHORIZED                                       | Indicates that a user is not authorized for the action(not approved for transfer/does not have a certain ability etc.). |
| RECEIVER_DOES_NOT_SUPPORT_NFT                        | Smart contract to which you are transfering NFT does not implement a way to safely receive a NFT. |
| NFT_ALREADY_EXISTS                                   | A NFT with the same ID already exists. You cannot create multiple NFTs with the same ID. |
| INVALID_INDEX                                        | NFT at provided index does not exist.                        |
| TRANSFERS_PAUSED                                     | NFT transfers are paused.                                    |
| COIN_TRANSFER_FAILED                                 | Coin transfer within the exchange order failed.              |
| INVALID_SIGNATURE_KIND                               | Provided signature kind is not supported.                    |
| INVALID_PROXY                                        | Provided proxy is not supported.                             |
| YOU_ARE_NOT_THE_TAKER                                | You are trying to perform an order from an account that cannot perform it. Check order takerId field to see which address has the ability to perform this order. |
| YOU_ARE_THE_MAKER                                    | Maker and taker of the order cannot be the same.             |
| ORDER_EXPIRED                                        | Order has expired (check expiration field).                  |
| INVALID_SIGNATURE                                    | The signature provided is invalid.                           |
| ORDER_CANCELED                                       | Order has been canceled.                                     |
| ORDER_CANNOT_BE_PERFORMED_TWICE                      | Order was already performed and cannot be performed twice.   |
| YOU_ARE_NOT_THE_MAKER                                | User making the transaction is not he order maker. Check the makerId field. |
| SIGNER_NOT_AUTHORIZED                                | Signature provided was signed by an unauthorized user.       |
| ONE_ZERO_ABILITY_HAS_TO_EXIST                        | There always has to be at least on user with the ability to assign new abilities. |
| GENERAL_REVERT                                       | Transaction reverted from an unknown reason.                 |
| TRANSATION_RESPONSE_ERROR_CHECK_PENDING_TRANSACTIONS | While executing the transaction there was an error with the response. The transaction may or may not have executed sucessfully. Please recheck transaction status and pending transactions. |
| INVALID_ADDRESS                                      | User/smart contract address provided is invalid.             |
| UNHANDLED                                            | An unhandled error has occured.                              |