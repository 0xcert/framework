# 0xcertAPI client

The 0xcert API Client is a JavaScript library written in TypeScript, that provides a complete set of tools for easier communication with the 0xcert API. 0xcert API is language independent software as a service with a RESTful API endpoint built for developers.

## Installation

We recommend you employ the client module as an NPM package in your application.

```sh
$ npm i --save @0xcert/client
```

On our official open-source [GitHub repository](https://github.com/0xcert/framework), we also host a compiled and minimized JavaScript files that can be directly implemented into your application or website. Please also refer to the [API Reference](/api/core.html) section to learn more about certification.

## Function responses

Every successful function response equals to the [0xcert REST API](/api/rest) response. Successful response has a unique ID which helps identifying potential problems. It also includes a status code that can help identifying the cause of a potential problem.

Successful requests include a `data` key, which hold a valid response object, and a `meta` key, which holds additional information about the result.

```js
{
  "id": ...,
  "status": ...,
  "data": { ... },
  "meta": { ... },
}
```

In case of a failure we have two different kind of error responses:

### Client fetch error

Client fetch error represents the error thrown by client when the 0xcert API(link) server responds with error. In case of failure, client responds with `errors` key, which holds a list of error objects.

```js
{
  "id": ...,
  "status": ...,
  "errors": [ ... ]
}
```

**Possible status codes**:

* **200**: Success.
* **201**: Successfully created.
* **400**: Invalid resource or resource not found.
* **401**: Unauthenticated access.
* **403**: Unauthorized access.
* **404**: Path not found.
* **422**: Data validation failed.
* **500**: System error.

**Client fetch error handling**:

Client fetch errors include a unique code number and an error message. The code number helps identifying potential problems and points to the exact position in the system.

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

### Client error

Client error represents an error thrown by the client unrelated to the [0xcert REST API](/api/rest).

**Client error handling**

Client errors include a unique code number, error message and original thrown error if it is caught by client. The code number helps identifying potential problems and points to the exact position in the system.

```js
{
  "code": 7000001,
  "message": "There was an error while initializing client."
  "original": null
}
```

## Client(options)

A class providing communication with the 0xcert API.

**Arguments**

| Argument | Description
|-|-
| options.provider | [required] Connected 0xcert framework provider instance (link).
| options.apiUrl | A `string` representing the API URL to which client will connect. Defaults to `https://api.0xcert.org`.

**Usage**

```ts
import { Client } from '@0xcert/client';

const client = new Client({
  provider,
  apiUrl: 'https://api.0xcert.org',
});
```

**See also:**

[Using providers](#using-providers)

## init()

An `asynchronous` class instance `function` which initializes client and performs authentication with the API. Client must be initialized before any other functions can be called.

**Usage**

```ts
await client.init();
```

##### Possible errors

| Code | Description
|-|-
| 7000001 | There was an error while initializing client.
| 400001 | Provided signature is not valid.

## getAccount()

An `asynchronous` class instance `function` which returns currently authenticated account's information.

**Result:**

An object representing currently authenticated account.

**Example:**

```ts
const account = await client.getAccount();
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.

## getAccountAbilities()

An `asynchronous` class instance `function` which returns currently authenticated account's ledger abilities.

**Result:**

A list of object representing currently authenticated account's ledger abilities.

**Example:**

```ts
const accountAbilities = await client.getAccountAbilities();
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## getAccountWebhook()

An `asynchronous` class instance `function` which returns currently authenticated account's webhook data.

**Result:**

An object representing currently authenticated account's webhook data.

**Example:**

```ts
const accountWebhook = await client.getAccountWebhook();
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## updateAccountWebhook(url, events)

An `asynchronous` class instance `function` which updates currently authenticated account's webhook data.

**Arguments**

| Argument | Description
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

**Result:**

An object representing currently authenticated account's webhook data.

**Example:**

```ts
import { WebhookEventKind } from '@0xcert/client';

const accountWebhook = await client.updateAccountWebhook('https://api.0xcert.org', [WebhookEventKind.ORDER_REQUEST_CHANGED]);
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.
| 422066 | Webhook validation failed because `events` is not valid.
| 422067 | Webhook validation failed because `url` is not present.
| 422114 | Webhook validation failed because `url` is not valid.

## updateAccountInformation(accountInformation)

An `asynchronous` class instance `function` which updates currently authenticated account's information.

**Arguments**

| Argument | Description
|-|-
| accountInformation.firstName | [required] A `string` representing first name of the account's owner.
| accountInformation.lastName | [required] A `string` representing last name of the account's owner.
| accountInformation.email | [required] A `string` representing email address of the account's owner.
| accountInformation.streetAddress | [required] A `string` representing street address of the account's owner.
| accountInformation.postalCode | [required] A `string` representing postal code of the account's owner.
| accountInformation.city | [required] A `string` representing city of the account's owner.
| accountInformation.country | [required] A `string` representing country of the account's owner.
| accountInformation.isCompany | A `boolean` representing account will be used by a company. If this field is set to `true`, company information must be provided. Defaults to `false`.
| accountInformation.companyInformation.name | [required - if `isCompany` field is set to `true`] A `string` representing name of the account's company.
| accountInformation.companyInformation.streetAddress | [required - if `isCompany` field is set to `true`] A `string` representing street address of the account's company.
| accountInformation.companyInformation.postalCode | [required - if `isCompany` field is set to `true`] A `string` representing postal code of the account's company.
| accountInformation.companyInformation.city | [required - if `isCompany` field is set to `true`] A `string` representing city of the account's company.
| accountInformation.companyInformation.country | [required - if `isCompany` field is set to `true`] A `string` representing country of the account's company.
| accountInformation.companyInformation.taxNumber | [required - if `isCompany` field is set to `true`] A `string` representing tax number of the account's company.
| accountInformation.companyInformation.phoneNumber | [required - if `isCompany` field is set to `true`] A `number` representing phone number of the account's company.

**Result:**

An object representing currently authenticated account.

**Example:**

```ts
const account = await client.updateAccountInformation({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example-domain.com',
  streetAddress: 'Main Street 1',
  postalCode: '12345',
  city: 'Anytown',
  country: 'Ruritania',
});
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
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

## createDeployment(deployData, priority)

An `asynchronous` class instance `function` which creates new deployment

| Argument | Description
|-|-
| deployData.name | [required] A `string` representing the name of the asset ledger.
| deployData.symbol | [required] A `string` representing the symbol of the asset ledger.
| deployData.uriPrefix | [required] A `string` representing the URI prefix of the asset ledger.
| deployData.uriPostfix | [required] A `string` representing the URI postfix of the asset ledger.
| deployData.schemaId | [required] A `string` representing the schemaId of the asset ledger.
| deployData.capabilities[] | [required] An `integer[]` representing the capabilities of the asset ledger.
| deployData.ownerId | [required] A `string` representing the ethereum address that will get all abilities of the asset ledger.
| priority | [required] An `integer` representing the priority of the deploy order.

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

**Result:**

An object representing newly created deployment.

**Example:**

```ts
import { AssetLedgerCapability, Priority } from '@0xcert/client';

const deployment = await client.createDeployment({
  name: 'Math Course Certificate',
  symbol: 'MCC',
  uriPrefix: 'http://example-domain.com',
  uriPostfix: '.json',
  schemaId: '0x3f4a0870cd6039e6c987b067b0d28de54efea17449175d7a8cd6ec10ab23cc5d',
  capabilities: [AssetLedgerCapability.TOGGLE_TRANSFERS],
  ownerId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
}, Priority.HIGH);
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
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

## getDeployment(deploymentRef)

An `asynchronous` class instance `function` which returns currently authenticated account's deployment.

| Argument | Description
|-|-
| deploymentRef | [required] A `string` representing deployment reference.

**Result:**

An object representing currently authenticated account's deployment.

**Example:**

```ts
const deployment = await client.getDeployment('5dfa35251991e62dff302e01');
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400003 | Deployment does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## getDeployment(options)

An `asynchronous` class instance `function` which returns currently authenticated account's deployments based on filters.

| Argument | Description
|-|-
| options.skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| options.limit | An `integer` representing the maximum number of items. Defaults to `25`.
| options.filterIds | A `string[]` that when present only items with specified references are returned.
| options.statuses | A `integer` that when present only items with specified request statuses are returned.
| options.sort | An `integer` that defines sort strategy.

##### Sort strategies

| Number | Description
|-|-
| 1 | Sort by date of creation in ascending order.
| 2 | Sort by date of creation in descending order.

##### Deploy request statuses

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

**Result:**

A list of objects representing currently authenticated account's deployments.

**Example:**

```ts
import { RequestStatus, DeploymentSort } from '@0xcert/client';

const deployments = await client.getDeployments({
  skip: 0,
  limit: 10,
  filterIds: [
    '5dfa35251991e62dff302e01',
    '5dfa35251991e62dff302e02',
  ],
  statuses: [
    RequestStatus.INITIALIZED,
    RequestStatus.PENDING,
  ],
  sort: DeploymentSort.CREATED_AT_ASC,
});
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## createOrder(order, priority)

An `asynchronous` class instance `function` which creates new actions order.

| Argument | Description
|-|-
| order.actions[] | [required] An `array` that can be of different types depending on what actions we want to perform. Option are: create asset, destroy asset, transfer asset, update asset imprint, transfer value, update ledger account permissions. You can find the definitions of the types bellow.
| order.signersIds | [required] A `string[]` representing an ethereum addresses of the order signers.
| order.payerId | A `string` representing an ethereum addresses of the order payer. If payer is not specified `wildcardSigner` field must be set to `true`. If payer is specified it must be listed as order signers in `signersIds` array.
| order.wildcardSigner | [required] A `boolean` representing if the order allows wild card claiming.
| order.automatedPerform | [required] A `boolean` representing if the order should be performed as soon as all conditions are met. If automated performed is disabled you need to call `performOrder(orderRef)` function to perform it.
| priority | [required] An `integer` representing the priority of the actions order.

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
| assetLedgerId | [required] A `string` representing Ethereum `Xcert` smart contract address on which the asset will be created.
| senderId | A `string` representing an Ethereum address that has the ability to sign an asset creation order.
| receiverId | A `string` representing an Ethereum address that will receive the created asset.
| imprint | [required] A `string` representing the asset's imprint generated from certification.
| id | [required] A `string` representing the asset's id.

**Destroy asset action**

| Name | Description
|-|-
| kind | [required] An `integer` representing action kind. Must be `6` for delete asset action.
| assetLedgerId | [required] A `string` representing Ethereum `Xcert` smart contract address on which the asset will be destroyed.
| senderId | A `string` representing an Ethereum address that is the owner of the asset.
| id | [required] A `string` representing the asset's id.

**Transfer asset action**

| Name | Description
|-|-
| kind | [required] An `integer` representing action kind. Must be `2` for transfer asset action.
| assetLedgerId | [required] A `string` representing Ethereum `ERC721` smart contract address on which the asset will be transferred.
| senderId | A `string` representing an Ethereum address that will send the asset.
| receiverId | A `string` representing an Ethereum address that will receive the asset.
| id | [required] A `string` representing the asset's id.

**Update asset imprint action**

| Name | Description
|-|-
| kind | [required] An `integer` representing action kind. Must be `4` for update asset imprint action. 
| assetLedgerId | [required] A `string` representing Ethereum `Xcert` smart contract address on which the asset imprint will be updated.
| senderId | A `string` representing an Ethereum address that has the ability to sign an asset imprint update order.
| imprint | [required] A `string` representing the asset's imprint generated from certification.
| id | [required] A `string` representing the asset's id.

**Transfer value action**

| Name | Description
|-|-
| kind | [required] An `integer` representing action kind. Must be `3` for transfer value action.
| valueLedgerId | [required] A `string` representing Ethereum `ERC20` smart contract address on which the value will be transferred.
| senderId | A `string` representing an Ethereum address that will send the value.
| receiverId | A `string` representing an Ethereum address that will receive the value.
| value | [required] A `number` representing the number amount of value we are sending.

**Update ledger account permission action**

| Name | Description
|-|-
| kind | [required] An `integer` representing action kind. Must be `5` for update ledger account permission action.
| assetLedgerId | [required] A `string` representing Ethereum `Xcert` smart contract address on which account abilities will be set.
| senderId | A `string` representing an Ethereum address that has the ability to sign an update abilities order.
| receiverId | A `string` representing an Ethereum address on which the ledger abilities will be set.
| abilities | [required] An `integer[]` representing the abilities we want to set.

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

**Result:**

An object representing newly created actions order.

**Example:**

```ts
import { ActionCreateAsset, ActionKind, ActionTransferValue, Priority } from '@0xcert/client';

const actionCreateAsset: ActionCreateAsset = {
  kind: ActionKind.CREATE_ASSET,
  assetLedgerId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
  senderId: '0xF9196F9f176fd2eF9243E8960817d5FbE63D79aa',
  receiverId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
  id: '100',
  imprint: 'd747e6ffd1aa3f83efef2931e3cc22c653ea97a32c1ee7289e4966b6964ecdfb',
};

const actionTransferValue: ActionTransferValue = {
  kind: ActionKind.TRANSFER_VALUE,
  valueLedgerId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
  senderId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
  receiverId: '0xF9196F9f176fd2eF9243E8960817d5FbE63D79aa',
  value: 100,
};

const order = {
  signersIds: [
    '0xF9196F9f176fd2eF9243E8960817d5FbE63D79aa',
    '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
  ],
  actions: [
    actionCreateAsset,
    actionTransferValue,
  ],
  wildcardSigner: false,
  automatedPerform: true,
  payerId: '0xF9196F9f176fd2eF9243E8960817d5FbE63D79aa',
};

const actionsOrder = await client.createOrder(order, Priority.HIGH);
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
̌| 7000003 | Payer must be specified if `wildcardSigner` tag is set to false.
| 7000004 | Payer must be listed as order\'s signer.
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

## getOrder(orderRef)

An `asynchronous` class instance `function` which returns currently authenticated account's actions order.

| Argument | Description
|-|-
| orderRef | [required] A `string` representing actions order reference.

**Result:**

An object representing currently authenticated account's actions order.

**Example:**

```ts
const actionsOrder = await client.getOrder('5dfa35251991e62dff302e08');
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400011 | Order does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## getOrders(options)

An `asynchronous` class instance `function` which returns currently authenticated account's actions orders based on filters.

| Argument | Description
|-|-
| options.skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| options.limit | An `integer` representing the maximum number of items. Defaults to `25`.
| options.filterIds | A `string[]` that when present only items with specified references are returned.
| options.statuses | A `integer[]` that when present only items with specified action order request statuses are returned.
| options.sort | An `integer` that defines sort strategy.

##### Sort strategies

| Number | Description
|-|-
| 1 | Sort by date of creation in ascending order.
| 2 | Sort by date of creation in descending order.

##### Actions order request statuses

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

**Result:**

A list of objects representing currently authenticated account's actions orders.

**Example:**

```ts
import { RequestStatus, OrderSort } from '@0xcert/client';

const actionsOrders = await client.getOrders({
  skip: 0,
  limit: 10,
  filterIds: [
    '5dfa35251991e62dff302e05',
    '5dfa35251991e62dff302e06',
  ],
  statuses: [
    RequestStatus.INITIALIZED,
    RequestStatus.PENDING,
  ],
  sort: OrderSort.CREATED_AT_ASC,
});
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## signOrder(orderRef)

An `asynchronous` class instance `function` which adds a signature to specified order. This can only be done if order is in initialized state.

| Argument | Description
|-|-
| orderRef | [required] A `string` representing actions order reference.

**Result:**

An object representing newly signed actions order.

**Example:**

```ts
const actionsOrder = await client.signOrder('5dfa35251991e62dff302e08');
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
̌| 7000005 | There was a problem while fetching order data.
| 400001 | Provided signature is not valid.
| 400009 | This account is not specified as order signer.
| 400010 | Order claim must be present to sign an order.
| 400011 | Order does not exists.
| 400012 | Order has already been claimed.
| 400013 | Order is not in correct state to perform this action.

## performOrder(orderRef)

An `asynchronous` class instance `function` which performs an order that has all necessary signatures. This can only be done if order is in initialized state and fully signed.

| Argument | Description
|-|-
| orderRef | [required] A `string` representing actions order reference.

**Result:**

An object representing newly performed actions order.

**Example:**

```ts
const actionsOrder = await client.performOrder('5dfa35251991e62dff302e08');
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400008 | This order is not ready to perform.
| 400011 | Order does not exists.
| 400013 | Order is not in correct state to perform this action.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## cancelOrder(orderRef)

An `asynchronous` class instance `function` which cancels specified order. This can only be done if order is in initialized state and if authenticated account is specified as order's signer.

| Argument | Description
|-|-
| orderRef | [required] A `string` representing actions order reference.

**Result:**

An object representing newly canceled actions order.

**Example:**

```ts
const actionsOrder = await client.cancelOrder('5dfa35251991e62dff302e08');
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400009 | This account is not specified as order signer.
| 400011 | Order does not exists.
| 400013 | Order is not in correct state to perform this action.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## getLedger(ledgerRef)

An `asynchronous` class instance `function` which returns currently authenticated account's ledger.

| Argument | Description
|-|-
| ledgerRef | [required] A `string` representing ledger reference.

**Result:**

An object representing currently authenticated account's ledger.

**Example:**

```ts
const ledger = await client.getLedger('5dfa35251991e62dff302c01');
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400004 | Ledger does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## getLedgers(options)

An `asynchronous` class instance `function` which returns currently authenticated account's ledgers based on filters.

| Argument | Description
|-|-
| options.skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| options.limit | An `integer` representing the maximum number of items. Defaults to `25`.

**Result:**

A list of objects representing currently authenticated account's ledgers.

**Example:**

```ts
const ledgers = await client.getLedgers({
  skip: 0,
  limit: 10,
});
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## getLedgerAbilities(ledgerRef, options)

An `asynchronous` class instance `function` which returns abilities that accounts have for specified ledger based on filters.

| Argument | Description
|-|-
| ledgerRef | [required] A `string` representing ledger reference.
| options.skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| options.limit | An `integer` representing the maximum number of items. Defaults to `25`.
| options.filterAccountIds[] | A `string[]` that when present only items for specified accountIds are returned.

**Result:**

A list of objects representing currently abilities that accounts have for specified ledger.

**Example:**

```ts
const ledgerAbilities = await client.getLedgerAbilities('5dfa35251991e62dff302c01', {
  skip: 0,
  limit: 10,
  filterAccountIds: [
    '0xF9196F9f176fd2eF9243E8960817d5FbE63D79aa',
    '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
  ]
});
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400004 | Ledger does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## getLedgerAccounts(ledgerRef, options)

An `asynchronous` class instance `function` which returns list of account IDs that have any kind of abilities on specified ledger based on filters.

| Argument | Description
|-|-
| ledgerRef | [required] A `string` representing ledger reference.
| options.skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| options.limit | An `integer` representing the maximum number of items. Defaults to `25`.
| options.filterAccountIds[] | A `string[]` that when present only items for specified accountIds are returned.

**Result:**

A list of account IDs that have any kind of abilities on specified ledger.

**Example:**

```ts
const ledgerAccounts = await client.getLedgerAccounts('5dfa35251991e62dff302c01', {
  skip: 0,
  limit: 10,
  filterAccountIds: [
    '0xF9196F9f176fd2eF9243E8960817d5FbE63D79aa',
    '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
  ]
});
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400004 | Ledger does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## getLedgerAsset(ledgerRef, assetId)

An `asynchronous` class instance `function` which returns currently authenticated account's specified asset on specified ledger.

| Argument | Description
|-|-
| ledgerRef | [required] A `string` representing ledger reference.
| assetId | [required] A `string` representing asset's id.

**Result:**

An object representing currently authenticated account's specified asset on specified ledger.

**Example:**

```ts
const asset = await client.getLedgerAsset('5dfa35251991e62dff302c01', '100');
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400004 | Ledger does not exists.
| 400005 | Asset does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route

## getLedgerAssets(ledgerRef, options)

An `asynchronous` class instance `function` which returns assets for specified ledger based on filters.

| Argument | Description
|-|-
| ledgerRef | [required] A `string` representing ledger reference.
| options.skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| options.limit | An `integer` representing the maximum number of items. Defaults to `25`.
| options.filterIds[] | A `string[]` that when present only assets with specified IDs are returned.
| options.sort | An `integer` that defines sort strategy.

##### Sort strategies

| Number | Description
|-|-
| 1 | Sort by date of creation in ascending order.
| 2 | Sort by date of creation in descending order.

**Result:**

A list of objects representing assets for specified ledger.

**Example:**

```ts
import { AssetSort } from '@0xcert/client';

const assets = await client.getLedgerAssets('5dfa35251991e62dff302c01', {
  skip: 0,
  limit: 10,
  filterIds: [
    '100',
    '101',
  ],
  sort: AssetSort.CREATED_AT_ASC,
});
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400004 | Ledger does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## getTrafficStats(options)

An `asynchronous` class instance `function` which returns currently authenticated account's traffic stats.

| Argument | Description
|-|-
| options.skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| options.limit | An `integer` representing the maximum number of items. Defaults to `25`.
| options.fromDate | A `date` that when present only items that have creation date greater then specified date are returned.
| options.toDate | A `date` that when present only items that have creation date bellow the specified date are returned.

**Result:**

A list of objects representing currently authenticated account's traffic stats.

**Example:**

```ts
const toDate = new Date(Date.now());
const fromDate = new Date(toDate - 86400000 * 14); // 14 days

const trafficStats = await client.getTrafficStats({
  skip: 0,
  limit: 10,
  fromDate,
  toDate,
});
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## getCostsStats(options)

An `asynchronous` class instance `function` which returns currently authenticated account's costs stats based on filters.

| Argument | Description
|-|-
| options.skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| options.limit | An `integer` representing the maximum number of items. Defaults to `25`.
| options.fromDate | A `date` that when present only items that have creation date greater then specified date are returned.
| options.toDate | A `date` that when present only items that have creation date bellow the specified date are returned.

**Result:**

A list of objects representing currently authenticated account's costs stats based on filters.

**Example:**

```ts
const toDate = new Date(Date.now());
const fromDate = new Date(toDate - 86400000 * 14); // 14 days

const costStats = await client.getCostsStats({
  skip: 0,
  limit: 10,
  fromDate,
  toDate,
});
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## getTickerStats(options)

An `asynchronous` class instance `function` which returns information about ZXC price based on filters.

| Argument | Description
|-|-
| options.skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| options.limit | An `integer` representing the maximum number of items. Defaults to `25`.
| options.fromDate | A `date` that when present only items that have creation date greater then specified date are returned.
| options.toDate | A `date` that when present only items that have creation date bellow the specified date are returned.
| filterIds | A `string[]` that when present only tickers with specified IDs are returned.
| sort | An `integer` that defines sort strategy.

##### Sort strategies

| Number | Description
|-|-
| 1 | Sort by date of creation in ascending order.
| 2 | Sort by date of creation in descending order.

**Result:**

A list of objects representing information about ZXC price.

**Example:**

```ts
const toDate = new Date(Date.now());
const fromDate = new Date(toDate - 86400000 * 14); // 14 days

const tickers = await client.getTickerStats({
  skip: 0,
  limit: 10,
  fromDate,
  toDate,
});
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.

## getRequest(requestRef)

An `asynchronous` class instance `function` which returns currently authenticated account's specified request information.

| Argument | Description
|-|-
| requestRef | [required] A `string` representing request reference.

**Result:**

An object representing currently authenticated account's specified request.

**Example:**

```ts
const request = await client.getRequest('5dfa35251991e62dff302d01');
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400002 | Request does not exists.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.

## getRequests(options)

An `asynchronous` class instance `function` which returns currently authenticated account's requests information based on filters.

| Argument | Description
|-|-
| options.skip | An `integer` that defines the number of items to be skip. Defaults to `0`.
| options.limit | An `integer` representing the maximum number of items. Defaults to `25`.
| options.methods | A `string[]` that when present only items with specified HTTP request method are returned (GET, POST, PUT, DELETE).
| options.status | A `number` that when present only items with specified HTTP request status are returned.
| options.fromDate | A `date` that when present only items that have creation date greater then specified date are returned.
| options.toDate | A `date` that when present only items that have creation date bellow the specified date are returned.
| options.sort | An `integer` that defines sort strategy.

##### Sort strategies

| Number | Description
|-|-
| 1 | Sort by date of creation in ascending order.
| 2 | Sort by date of creation in descending order.

**Result:**

A list of objects representing currently authenticated account's requests.

**Example:**

```ts
import { RequestSort } from '@0xcert/client';

const toDate = new Date(Date.now());
const fromDate = new Date(toDate - 86400000 * 14); // 14 days

const requests = await client.getRequests({
  skip: 0,
  limit: 10,
  fromDate,
  toDate,
  methods: [
    'PUT',
    'GET',
  ],
  status: 200,
  sort: RequestSort.CREATED_AT_ASC,
});
```

##### Possible errors

| Code | Description
|-|-
| 7000002 | Client not connected. Please initialize your client first.
| 400001 | Provided signature is not valid.
| 400014 | Account is not identified. Before you start using API on Ethereum mainnet you must provide information about yourself using update account route.
