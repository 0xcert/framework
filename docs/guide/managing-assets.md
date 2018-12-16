# Managing Assets

Asset is a representation of a unique digital item. It is also known as a non-fungible token or ERC-721 standard token (complying with ERC-721 standard on the Ethereum blockchain).

Let’s take an example. When you graduate from a collage you earn a diploma or a degree credential. Every diploma is unique but all diplomas have the same elements. Every credential would, therefore, contain a list of courses and your scores, your name, some kind of a unique identifier, etc. To digitize such document, you need a computer software that intakes that information, stores it, and references it by its unique identifier or ID. Applying the same process across all the credentials, a complete list of diplomas is stored and ordered in the same place.

If we apply this example to the 0xcert protocol, we would say that 0xcert provides a framework for storage of digitized diplomas to which we add personal and identifiable ownership. By applying the 0xcert protocol, a diploma or a credential would not be stored in college-owned software, but rather on a public blockchain with only its owner allowed to access it.

To use blockchain storage of assets trough the 0xcert framework you first need to understand some basic terminology. We will still be using the above example to explain it.

How the diploma is defined (the elements we talked about) is what we call asset design or a recipe. Diploma itself is an asset and the place where all the diplomas are stored is called an asset ledger. So in order to create a diploma with the 0xcert framework, you would first create a diploma recipe from which you could create an asset ledger specific to that recipe and create diploma assets to be stored in it.

Since we are talking about complete ownership of assets, digital asset management slightly differs from normal asset management. To show what can be done with an asset, we must first establish what the permission system looks like and who are the participants. 

Smart contract creator can assign this abilities to others or themselves. For the sake of a simpler explanation of functionalities, we will imagine that we have two participants. Let’s call the first one an Issuer and grant him all the permissions described above. The second one participant is called the Owner and is the current owner of a particular asset.

Create
An issuer can create a new asset. When creating an asset, the issuer has to specify the unique identification number representing an asset and the data that was specified when designing the asset. That data is automatically transformed into public data accessible via a URL and the private data that is transformed into the asset proof. When creating a new asset, the issuer has to specify who is the recipient of the asset. This permission cannot be created nor assigned later in the process.

Transfer
As an Owner of an asset, you can transfer your ownership to someone else. This action cannot be reverted and once it is done, you lose all rights to that asset. The only way to get that asset back is for the new owner to send it back.

Approve
The Owner can approve for someone else to have the ability to operate with their assets while the Owner still maintains full ownership. A person operating with other owner’s assets is called Operator. An Operator has full control of the assets in the same way as the Owner does. That means they can transfer the asset is (in?) that case ownership in transfered as well. This requires the Owner to be really carefull with trusting them to approve on Owner’s behalf. The Owner can revoke an approval at any time.

Destroy
This is an optional function that is only available if the Issuer adds it when designing an asset.

The Owner has the option of permanently destroying an asset in his possession.

Revoke
This is an optional function that is only available if the Issuer adds it when designing an asset.

The Issuer can revoke an asset he has created. This means the asset is permanently destroyed even if it is not in the possesion of the Issuer.

Pause
This is an optional function that is only available if the Issuer adds it when designing an asset.

The Issuer can at any time pause all transfers so that the Owner cannot transfer his ownership. Similarly, the Issuer can also unpause the transfers at any time. In some cases, the Issuer will never want to allow the asset ownership to be transfered. This can be achived by pausing the ownership transfer from the start and never unpausing it.

Update
This is an optional function that is only available if the Issuer adds it when designing an asset.

The Issuer can at any time update the private data of an asset (proof) he created. Previous data can always be retrived but new data will be the one defining the asset.

## Asset Ledger

- Asset ledger manages assets of a certain type.
- gre za smart contract na ethereum blockchainu, ki je zgrajen na osnovi ERC-721 standarda ampak ponuja vec funkcij. 
- Predstavljamo si ga lahko kot fascikel, ki hrani razlicne dokumente glede ownershipa nad neko zadevo (e.g. Marko je owner certifikata 101, Lenka je owner pogodbe 52 itd).
- Tako kot v realnem zivljenju asset torej predstavlja neko mapo kjer hranimo dokazila.

### Installation

We recommend that in your application you use the package as an NPM package.

```shell
$ npm i --save @0xcert/ethereum-asset-ledger
```

We also host compiled and minimized JavaScript file which you can directly include in your website on our official GitHub repository. The package adds the content on the `window.$0xcert` variable. You can use [jsdelivr](https://www.jsdelivr.com) to access these files on your website.

```html
<script src="https://cdn.jsdelivr.net/gh/0xcert/framework/dist/ethereum-asset-ledger.min.js" />
```

### Usage

Kot obicajno zacnemo z importanjem paketa.

```ts
import { AssetLedger } from '@0xcert/ethereum-asset-ledger';
```

Dejmo najprej deployat nov asset ledger to Ethereum blockchain. Ce se vam ne da tega delat, mate na voljo already deployed asset ledger `XXX`.

```ts
const mutation = await AssetLedger.deploy(provider, {
    name: 'Certificate',
    symbol: 'CERT',
    uriBase: 'http://domain.com',
    schemaId: '239423',
    burnable: true,
    pausable: true,
}).then(() => {
    return mutation.resolve();
});

const assetLedgerId = mutation.receiverId;
```

Zdej ko smo ustvarili nov asset ledger na networku, lahko nalozimo njegovo instanco.

```ts
const assetLedger = AssetLedger.getInstance(provider, assetLedgerId);
```

Najprej se preizkusimo v querying asset ledgerja.

```ts
const assetLedgerInfo = await assetLedger.getInfo();
//=> { name: 'Certificate', symbol: 'CERT', uriBase: 'http://domain.com', schemaId: '239423' }
```

Response bi moral vsebovati podobno vsebino, kot pri koraku, kjer smo deployali nov asset ledger. V zacetku poglavja smo razlozili, da je asset ledger kot knjiga zapisov o ownershipih. Items v tej njigi so `Asset`. Cas je, da ustvarimo nov asset, kjer si za njegov unique ID izberemo `100`. Spodnji primer bo nov asset ustvaril in poslal kar na nas osnovni account.

```ts
const mutation = await assetLedger.createAsset({
    receiverId: provider.accountId,
    id: '100',
}).then((mutation) => {
    return mutation.resolve();
});
```

Zdaj ko smo srecni lastniki novega asseta, ga bomo poskusili prenesti v drugo denarnico. V Metamasku zato ustvarite nov account in naslov denarnice vnesite v `receiverId` v spodnjem code snippetu.

```ts
const mutation = await assetLedger.transferAsset({
    receiverId: provider.accountId,
    id: '100',
}).then((mutation) => {
    return mutation.resolve();
});
```

Token `100` bi se moral zdaj nahajati v novi denarnici. Preverimo ce to drzi.

```ts
const ownerId = await assetLedger.getAssetAccount('100');
//=> 0x...
```
