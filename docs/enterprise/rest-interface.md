# REST API

## Endpoints

0xcert API is language independent software as a service with a RESTful API endpoint built for developers. 

## Requests

The server speaks [JSON](https://en.wikipedia.org/wiki/JSON). It's recommended that every call to the server includes a `ContentType` header set to `application/json; charset=utf-8;`. 

Requests with `POST` or `PUT` method must send data as `application/json` or `multipart/form-data` when files are included in the request body.

```bash
$ curl -X 'POST' 'https://api.0xcert.org/' \
       -H 'Authorization: {signature_type}:{signature}' \
       -H 'Content-Type: application/json; charset=utf-8' \
       -d $'{}'
```

## Responses

Every response has a unique ID which helps identifying potential problems. It also includes a status code that can help identifying the cause of a potential problem.

Successful requests include a `data` key, which hold a valid response object, and a `meta` key, which holds additional information about the result.

```js
{
  "id": ...,
  "status": ...,
  "data": { ... },
  "meta": { ... },
}
```

In case of failure, the server responds with `errors` key, which holds a list of error objects.

```js
{
  "id": ...,
  "status": ...,
  "errors": [ ... ]
}
```

Query requests through `GET` method can return status codes `200`, `400`, `401`, `403` or `500`. Mutations through `POST`, `PUT` and `DELETE` can return also codes `201` and `422`. Invalid routes return status code `404`.

* **200**: Success.
* **201**: Successfully created.
* **400**: Invalid resource or resource not found.
* **401**: Unauthenticated access.
* **403**: Unauthorized access.
* **404**: Path not found.
* **422**: Data validation failed.
* **500**: System error.

## Error Handling

Errors include a unique code number and an error message. The code number helps identifying potential problems and points to the exact position in the system.

```js
{
  ...
  "errors": [
    {
      "code": 400000,
      "message": "Invalid path."
    }
  ]
}
```

Below is a complete list of global handled errors.

### Global errors

| Code | Message
|-|-
| 500000 | Unhandled system error.
| 400000 | Invalid path.

## Authentication

Most of the API routes restrict public access and require authentication. Authenticated requests must include a HTTP header `Authorization` holding ethereum signature made by the users private key of text: `0xcert api`. Signature is structured as following: `{signature_type}:{signature}`.

| Signature type | Description
|-|-
| 0 | ETH_SIGN
| 3 | PERSONAL_SIGN

## Routes

### Orders

#### [private] POST /orders

> Creates an actions order.

##### Body fields

| Name | Description
|-|-
| automatedPerform | A `boolean` representing if the order should be performed as soon as all conditions are met. If automated performed is disabled you need to call /orders/:orderRef/perform to perform it. Defaults to `true`.
| order.signers[].accountId | [required] A `string` representing an ethereum address of the order signer.
| order.signers[].claim | [required] A `string` representing an ethereum signature of the order performed by the designated signer.
| order.wildcardClaim.accountId | A `string` representing an ethereum address of the wildcard signer.
| order.wildcardClaim.claim | A `string` representing an ethereum signature of the order performed by the wildcard accountId.
| order.actions[] | [required] An `array` that can be of different types depending on what actions we want to perform. Option are: create asset, destroy asset, transfer asset, update asset imprint, transfer value, update ledger account permission. You can find the definitions of the types bellow.
| order.seed | [required] A `number` representing salt for hash uniqueness. Usually UNIX timestamp.
| order.expiration | [required] A `number` representing how long this order is valid. Must be a UNIX timestamp.
| priority | [required] An `integer` representing the priority of the order. 
| wildcardSigner | A `boolean` representing if the order contains a `wildcardClaim`. If wildcard is enabled then any empty `receiverId` or `senderId` will be replaced by the account of the `wildcardClaim`. Defaults to `true`.

##### Priorities

| Number | Description
|-|-
| 1 | Low priority. 
| 2 | Medium priority.
| 3 | High priority.
| 4 | Critical priority.

**Create asset action**

| Name | Description
|-|-
| kind | [required] An `integer` representing action kind. Must be `1` for create asset action.
| ledgerId | [required] A `string` representing Ethereum `Xcert` smart contract address on which the asset will be created.
| receiverId | A `string` representing an Ethereum address that will receive the created asset.
| senderId | A `string` representing an Ethereum address that has the ability to sign an asset creation order.
| assetId | [required] A `string` representing the assets id.
| assetImprint | [required] A `string` representing the assets imprint generated from certification.

**Destroy asset action**

| Name | Description
|-|-
| kind | [required] An `integer` representing action kind. Must be `6` for delete asset action.
| ledgerId | [required] A `string` representing Ethereum `Xcert` smart contract address on which the asset will be destroyed.
| senderId | A `string` representing an Ethereum address that is the owner of the asset.
| assetId | [required] A `string` representing the assets id.

**Transfer asset action**

| Name | Description
|-|-
| kind | [required] An `integer` representing action kind. Must be `2` for transfer asset action.
| ledgerId | [required] A `string` representing Ethereum `ERC721` smart contract address on which the asset will be transferred.
| receiverId | A `string` representing an Ethereum address that will receive the asset.
| senderId | A `string` representing an Ethereum address that will send the asset.
| assetId | [required] A `string` representing the assets id.

**Update asset imprint action**

| Name | Description
|-|-
| kind | [required] An `integer` representing action kind. Must be `4` for update asset imprint action.
| ledgerId | [required] A `string` representing Ethereum `Xcert` smart contract address on which the asset imprint will be updated.
| senderId | A `string` representing an Ethereum address that has the ability to sign an asset imprint update order.
| assetId | [required] A `string` representing the assets id.
| assetImprint | [required] A `string` representing the assets imprint generated from certification.

**Transfer value action**

| Name | Description
|-|-
| kind | [required] An `integer` representing action kind. Must be `3` for transfer value action.
| ledgerId | [required] A `string` representing Ethereum `ERC20` smart contract address on which the value will be transferred.
| receiverId | A `string` representing an Ethereum address that will receive the value.
| senderId | A `string` representing an Ethereum address that will send the value.
| value | [required] A `string` representing the number amount of value we are sending. Value must include all the decimals number representation specified in the `ERC20` smart contract (usually 18).

**Update ledger account permission action**

| Name | Description
|-|-
| kind | [required] An `integer` representing action kind. Must be `5` for update ledger account permission action.
| ledgerId | [required] A `string` representing Ethereum `Xcert` smart contract address on which account abilities will be set.
| receiverId | A `string` representing an Ethereum address on which the ledger abilities will be set.
| senderId | A `string` representing an Ethereum address that has the ability to sign an update abilities order.
| abilities[] | [required] An `integer` representing the abilities we want to set. 

##### Abilities

| Number | Description
|-|-
| 1 | Allows an account to further grant abilities.
| 2 | A specific ability that is bounded to atomic orders. When granting abilities trough 0xcert API the action `senderId` has to have this ability.
| 16 | Allows an account to create a new asset.
| 32 | Allows management accounts to revoke assets.
| 64 | Allows an account to stop and start asset transfers.
| 128 | Allows an account to update asset data.
| 256 | Allows an account to update asset ledger's base URI.
| 512 | A specific ability that is bounded to atomic orders. When creating a new asset trough 0xcert API the action `senderId` has to have this ability.
| 1024 | A specific ability that is bounded to atomic orders. When updating asset imprint trough 0xcert API the action `senderId` has to have this ability.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400004 | Ledger does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.
| 422010 | Order request validation failed because `priority` is not present.
| 422011 | Order request validation failed because `status` is not present.
| 422009 | Order request validation failed because `order` is not present.
| 422001 | Order validation failed because `makerId` is not present.
| 422002 | Order validation failed because `seed` is not present.
| 422003 | Order validation failed because `expiration` is not present.
| 422012 | Order validation failed because payment is not valid.
| 422004 | Order action validation failed because `ledgerId` is not present.
| 422005 | Order action validation failed because `assetId` is not present.
| 422006 | Order action validation failed because `assetImprint` is not present.
| 422007 | Order action validation failed because `value` is not present.
| 422057 | Order action validation failed because `senderId` or `receiverId` is not present.
| 422058 | Order action validation failed because `ledgerId` is not valid eth address.
| 422059 | Order action validation failed because `receiverId` is not valid eth address.
| 422060 | Order action validation failed because `senderId` is not valid eth address.
| 422061 | Order action set abilities validation failed because manage proxy is missing ability - manage abilities.
| 422062 | Order action set abilities validation failed because account is missing ability - allow manage abilities.
| 422070 | Order action validation failed because `value` is not valid.
| 422071 | Order action create asset validation failed because account is missing ability - allow create ability.
| 422072 | Order action create asset validation failed because create proxy is missing ability - create ability.
| 422073 | Order action transfer asset validation failed because account is missing gateway approval.
| 422074 | Order action transfer asset validation failed because account is not an asset owner.
| 422075 | Order action transfer value validation failed because account's balance is insufficient.
| 422076 | Order action transfer value validation failed because account is missing gateway approval.
| 422077 | Order action update asset validation failed because account is missing ability - allow update ability.
| 422078 | Order action update asset validation failed because update proxy is missing ability - update ability.
| 422081 | Order action destroy asset validation failed because account is missing gateway approval.
| 422082 | Order action destroy asset validation failed because account is not an asset owner.
| 422083 | Order action update asset validation failed because ledger is missing capability - update imprint capability.
| 422084 | Order action destroy asset validation failed because ledger is missing capability - update imprint capability.
| 422023 | Asset validation failed because `id` is not present.
| 422024 | Asset validation failed because `imprint` is not present.
| 422036 | Asset validation failed because `ledgerId` is not present.
| 422013 | Asset validation failed because `id` is not unique on selected ledger.

#### [private] PUT /orders/:orderRef/perform

> Performs an order that has all necessary signatures. Can only be done if order is in initialized state and fully signed.

##### Path parameters

| Name | Description
|-|-
| orderRef | An `string` representing order reference.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400008 | This order is not ready to perform.
| 400011 | Order does not exists.
| 400013 | Order is not in correct state to perform this action.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

#### [private] PUT /orders/:orderRef/sign

> Adds a signature to specified order. Can only be done if order is in initialized state.

##### Path parameters

| Name | Description
|-|-
| orderRef | [required] An `string` representing order reference.

##### Body fields

| Name | Description
|-|-
| claim | [required] A `string` representing an ethereum signature of the order made by the function caller.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400009 | This account is not specified as order signer.
| 400010 | Order claim must be present to sign an order.
| 400011 | Order does not exists.
| 400012 | Order has already been claimed.
| 400013 | Order is not in correct state to perform this action.

#### [private] GET /orders/:orderRef

> Gets specific order information.

##### Path parameters

| Name | Description
|-|-
| orderRef | [required] An `string` representing order reference.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400011 | Order does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

#### [private] GET /orders

> Gets order based on filters.

##### Query parameters

| Name | Description
|-|-
| skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| limit | An `integer` representing the maximum number of items. Defaults to `25`.
| filterIds | A `string[]` that when present only items with specified references are returned.
| statuses | A `integer` that when present only orders with specified request statuses are returned.
| sort | An `integer` that defines sort strategy.

##### Sort strategies

| Number | Description
|-|-
| 1 | Sort by order reference in ascending order.
| -1 | Sort by order reference in descending order.

##### Request statuses

| Number | Description
|-|-
| 0 | Initialized.
| 1 | Pending.
| 2 | Processing.
| 3 | Success.
| 4 | Failure.
| 5 | Suspended.
| 6 | Canceled.
| 7 | Finalized.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

#### [private] DELETE /orders/:orderRef

> Cancels specified order. Can only be done if order is in initialized state.

##### Path parameters

| Name | Description
|-|-
| orderRef | [required] An `string` representing order reference.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400009 | This account is not specified as order signer.
| 400011 | Order does not exists.
| 400013 | Order is not in correct state to perform this action.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

### Deployments

#### [private] POST /deployments

> Creates a deploy order.

##### Body fields

| Name | Description
|-|-
| claim | [required] A `string` representing an ethereum signature of deploy order.
| deploy.makerId | [required] A `string` representing the ethereum address of the one who is creating this deploy order.
| deploy.takerId | A `string` representing the ethereum address of the executor of the deploy order.
| deploy.assetLedgerData.name | [required] A `string` representing the name of the asset ledger.
| deploy.assetLedgerData.symbol | [required] A `string` representing the symbol of the asset ledger.
| deploy.assetLedgerData.uriPrefix | [required] A `string` representing the URI prefix of the asset ledger.
| deploy.assetLedgerData.uriPostfix | [required] A `string` representing the URI postfix of the asset ledger.
| deploy.assetLedgerData.schemaId | [required] A `string` representing the schemaId of the asset ledger.
| deploy.assetLedgerData.capabilities[] | [required] An `integer[]` representing the capabilities of the asset ledger.
| deploy.assetLedgerData.ownerId | [required] A `string` representing the ethereum address that will get all abilities of the asset ledger.
| deploy.tokenTransferData.ledgerId | [required] A `string` representing the ethereum address of an ERC-20 compatible smart contract on which token will be transferred.
| deploy.tokenTransferData.receiverId | [required] A `string` representing the ethereum of the ERC-20 tokens receiver.
| deploy.tokenTransferData.value | [required] A `string` representing the amount of ERC-20 tokens that will get transferred.
| deploy.seed | [required] A `number` representing salt for hash uniqueness. Usually UNIX timestamp.
| deploy.expiration | [required] A `number` representing how long this order is valid. Must be a UNIX timestamp.
| priority | [required] An `integer` representing the priority of the order.

##### Priorities

| Number | Description
|-|-
| 1 | Low priority. 
| 2 | Medium priority.
| 3 | High priority.
| 4 | Critical priority.

##### Capabilities

| Number | Description
|-|-
| 1 | Users are able to destroy their own assets.
| 2 | Ledger owner can update assets imprint.
| 3 | Ledger owner can stop/start asset transfers.
| 4 | Ledger owner can destroy any asset.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400007 | Deploy creation failed.
| 422008 | Deploy request validation failed because `claim` is not present.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.
| 422037 | Deploy request validation failed because `takerId` is not valid.
| 422038 | Deploy request validation failed because `deploy` is not present.
| 422039 | Deploy validation failed because `assetLedgerData` is not present.
| 422040 | Deploy validation failed because `assetLedgerData.name` is not present.
| 422041 | Deploy validation failed because `assetLedgerData.symbol` is not present.
| 422042 | Deploy validation failed because `assetLedgerData.uriPostfix` is not present.
| 422043 | Deploy validation failed because `assetLedgerData.uriPrefix` is not present.
| 422044 | Deploy validation failed because `assetLedgerData.schemaId` is not present.
| 422045 | Deploy validation failed because `assetLedgerData.capabilities` is not present.
| 422046 | Deploy validation failed because `assetLedgerData.capabilities` is not valid.
| 422047 | Deploy validation failed because `assetLedgerData.ownerId` is not present.
| 422048 | Deploy validation failed because `assetLedgerData.ownerId` is not valid.
| 422049 | Deploy validation failed because `tokenTransferData` is not present.
| 422050 | Deploy validation failed because `tokenTransferData.ledgerId` is not present.
| 422051 | Deploy validation failed because `tokenTransferData.ledgerId` is not valid.
| 422052 | Deploy validation failed because `makerId` is not valid.
| 422053 | Deploy validation failed because `tokenTransferData.receiverId` is not valid.
| 422054 | Deploy validation failed because `tokenTransferData.value` is not present.
| 422055 | Deploy validation failed because payment is not valid.
| 422063 | Deploy validation failed because `receiverId` is not present when `takerId` is present.
| 422064 | Deploy validation failed because `expiration` is not present.
| 422079 | Deploy validation failed because account's balance is insufficient.
| 422080 | Deploy validation failed because account is missing gateway approval.

#### [private] GET /deployments/:deploymentRef

> Gets specific deployment information.

##### Path parameters

| Name | Description
|-|-
| deploymentRef | [required] An `string` representing deployment reference.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400003 | Deployment does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

#### [private] GET /deployments

> Gets deployments based on filters.

##### Query parameters

| Name | Description
|-|-
| skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| limit | An `integer` representing the maximum number of items. Defaults to `25`.
| filterIds | A `string[]` that when present only items with specified references are returned.
| statuses | A `integer` that when present only items with specified request statuses are returned.
| sort | An `integer` that defines sort strategy.

##### Sort strategies

| Number | Description
|-|-
| 1 | Sort by deployment reference in ascending order.
| -1 | Sort by deployment reference in descending order.

##### Request statuses

| Number | Description
|-|-
| 0 | Initialized.
| 1 | Pending.
| 2 | Processing.
| 3 | Success.
| 4 | Failure.
| 5 | Suspended.
| 6 | Canceled.
| 7 | Finalized.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

### Deposits

#### [private] POST /deposits

> Creates a stripe deposit intent trough which a credit card deposit resulting in receiving DXC tokens can be made.

##### Body fields

| Name | Description
|-|-
| amount | [required] An `integer` representing amount of EUR to deposit in cents (e.g. 100 cents = 1€). Minimum amount is 1000 cents (10€). 

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.
| 422095 | Deposit intent validation failed because amount is not present.
| 422096 | Deposit intent validation failed because amount is too low.

### Account

#### [private] GET /account

> Gets account information.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.

#### [private] PUT /account

> Updates account information. The information will be used to generate billing details.

##### Body fields

| Name | Description
|-|-
| firstName | [required] A `string` representing first name of the account's owner.
| lastName | [required] A `string` representing last name of the account's owner.
| email | [required] A `string` representing email address of the account's owner.
| streetAddress | [required] A `string` representing street address of the account's owner.
| postalCode | [required] A `string` representing postal code of the account's owner.
| city | [required] A `string` representing city of the account's owner.
| country | [required] A `string` representing country of the account's owner.
| isCompany | A `boolean` representing account will be used by a company. If this field is set to `true`, company information must be provided. Defaults to `false`.
| companyInformation.name | [required - if `isCompany` field is set to `true`] A `string` representing name of the account's company.
| companyInformation.streetAddress | [required - if `isCompany` field is set to `true`] A `string` representing street address of the account's company.
| companyInformation.postalCode | [required - if `isCompany` field is set to `true`] A `string` representing postal code of the account's company.
| companyInformation.city | [required - if `isCompany` field is set to `true`] A `string` representing city of the account's company.
| companyInformation.country | [required - if `isCompany` field is set to `true`] A `string` representing country of the account's company.
| companyInformation.taxNumber | [required - if `isCompany` field is set to `true`] A `string` representing tax number of the account's company.
| companyInformation.phoneNumber | [required - if `isCompany` field is set to `true`] A `number` representing phone number of the account's company.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 422097 | Account validation failed because account information is not present.
| 422098 | Account validation failed because account information first name is not present.
| 422099 | Account validation failed because account information last name is not present.
| 422100 | Account validation failed because account information email is not present.
| 422101 | Account validation failed because account information email is not valid.
| 422102 | Account validation failed because account information street address is not present.
| 422103 | Account validation failed because account information postal code is not present.
| 422104 | Account validation failed because account information city is not present.
| 422105 | Account validation failed because account information country is not present.
| 422106 | Account validation failed because account information company information is not present.
| 422107 | Account validation failed because company information name is not present.
| 422108 | Account validation failed because company information street address is not present.
| 422109 | Account validation failed because company information postal code is not present.
| 422110 | Account validation failed because company information city is not present.
| 422111 | Account validation failed because company information country is not present.
| 422112 | Account validation failed because company information tax number is not present.
| 422113 | Account validation failed because company information phone number is not present.

#### [private] PUT /account/webhook

> Updates account webhook configuration.

##### Body fields

| Name | Description
|-|-
| url | [required] A `string` representing an URL that is the target of webhooks.
| events[] | [required] A `integer[]` representing webhook events.

##### Webhook events

| Number | Description
|-|-
| 0 | Order request changed.
| 1 | Order request error.
| 2 | Deployment request changed.
| 3 | Deployment request error.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.
| 422066 | Webhook validation failed because `events` is not valid.
| 422067 | Webhook validation failed because `url` is not present.

#### [private] GET /account/webhook

> Gets webhook configuration.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

#### [private] GET /account/abilities

> Gets account abilities per ledger.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

### Ledgers

#### [private] GET /ledgers

> Gets ledgers based on filters.

##### Query parameters

| Name | Description
|-|-
| skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| limit | An `integer` representing the maximum number of items. Defaults to `25`.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

#### [private] GET /ledgers/:ledgerRef

> Gets specific ledger information.

##### Path parameters

| Name | Description
|-|-
| ledgerRef | [required] A `string` representing ledger reference.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400004 | Ledger does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

#### [private] GET /ledgers/:ledgerRef/abilities

> Gets abilities that accounts have for specified ledger based on filters.

##### Path parameters

| Name | Description
|-|-
| ledgerRef | [required] A `string` representing ledger reference.

##### Query parameters

| Name | Description
|-|-
| skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| limit | An `integer` representing the maximum number of items. Defaults to `25`.
| filterAccountIds[] | A `string[]` that when present only abilities for specified accountIds are returned.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400004 | Ledger does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

#### [private] GET /ledgers/:ledgerRef/accounts

> Gets list of account IDs that have any kind of abilities on specified ledger based on filters.

##### Path parameters

| Name | Description
|-|-
| ledgerRef | [required] A `string` representing ledger reference.

##### Query parameters

| Name | Description
|-|-
| skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| limit | An `integer` representing the maximum number of items. Defaults to `25`.
| filterAccountIds[] | A `string[]` that when present only items for specified accountIds are returned.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400004 | Ledger does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

#### [private] GET /ledgers/:ledgerRef/assets

> Gets assets for specified ledger based on filters.

##### Path parameters

| Name | Description
|-|-
| ledgerRef | [required] A `string` representing ledger reference.

##### Query parameters

| Name | Description
|-|-
| skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| limit | An `integer` representing the maximum number of items. Defaults to `25`.
| filterIds[] | A `string[]` that when present only assets with specified IDs are returned.
| sort | An `integer` that defines sort strategy.

##### Sort strategies

| Number | Description
|-|-
| 1 | Sort by date of creation in ascending order.
| -1 | Sort by date of creation in descending order.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400004 | Ledger does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

#### [private] GET /ledgers/:ledgerRef/assets/:assetId

> Gets specified asset information.

##### Path parameters

| Name | Description
|-|-
| ledgerRef | [required] A `string` representing ledger reference.
| assetId | [required] A `string` representing ledger asset ID.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400004 | Ledger does not exists.
| 400005 | Asset does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

### Requests

#### [private] GET /requests

> Gets every request and that was made to the API based of filters.

##### Query parameters

| Name | Description
|-|-
| skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| limit | An `integer` representing the maximum number of items. Defaults to `25`.
| methods[] | A `string[]` that when present only items with specified HTTP request method are returned (GET, POST, PUT, DELETE).
| status | A `string` that when present only items with specified HTTP request status are returned.
| fromDate | A `string` that when present only items that have creation date greater then specified date (in ISO 8601 format) are returned.
| toDate | A `string` that when present only items that have creation date bellow the specified date (in ISO 8601 format) are returned.
| sort | An `integer` that defines sort strategy.

##### Sort strategies

| Number | Description
|-|-
| 1 | Sort by date of creation in ascending order.
| -1 | Sort by date of creation in descending order.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

#### [private] GET /requests/:requestRef

> Gets specific request information.

##### Path parameters

| Name | Description
|-|-
| requestRef | [required] A `string` representing request reference.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400002 | Request does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

### Stats

#### [private] GET /stats/costs

> Gets cost statistics based on filters.

##### Query parameters

| Name | Description
|-|-
| skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| limit | An `integer` representing the maximum number of items. Defaults to `25`.
| fromDate | A `string` that when present only items that have creation date greater then specified date (in ISO 8601 format) are returned.
| toDate | A `string` that when present only items that have creation date bellow the specified date (in ISO 8601 format) are returned.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

#### [private] GET /stats/traffic

> Gets traffic statistics based on filters.

##### Query parameters

| Name | Description
|-|-
| skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| limit | An `integer` representing the maximum number of items. Defaults to `25`.
| fromDate | A `string` that when present only items that have creation date greater then specified date (in ISO 8601 format) are returned.
| toDate | A `string` that when present only items that have creation date bellow the specified date (in ISO 8601 format) are returned.

##### Possible errors

| Code | Description
|-|-
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

### Tickers

#### GET /stats/tickers

> Gets information about ZXC price based on filters.

##### Query parameters

| Name | Description
|-|-
| skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| limit | An `integer` representing the maximum number of items. Defaults to `25`.
| fromDate | A `string` that when present only items that have creation date greater then specified date (in ISO 8601 format) are returned.
| toDate | A `string` that when present only items that have creation date bellow the specified date (in ISO 8601 format) are returned.
| filterIds[] | A `string[]` that when present only tickers with specified IDs are returned.
| sort | An `integer` that defines sort strategy.

##### Sort strategies

| Number | Description
|-|-
| 1 | Sort by date of creation in ascending order.
| -1 | Sort by date of creation in descending order.
