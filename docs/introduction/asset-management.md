## About



## Interoperability

### Asset design



## What you can do with assets

Because we are talking about complete ownership of assets, asset management slightly differs from normal asset management. To show what can be done with an asset we must first establish what the permission system looks like and who are the participants. This a list of currently available permissions:

<u>I think permissions should be a seperate section since this will probably be a thing developers will want to often check</u>

| Permission                         | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| Assign/revoke abilities of others. | Smart contract creator automatically gets assigned the ability to assign/revoke abilities of others. |
| Creating new assets.               | Ability to create a new asset.                               |
| Revoke an asset.                   | Ability to revoke any asset.                                 |
| Pause transfers.                   | Ability to pause/unpause asset transfers.                    |
| Update asset data.                 | Ability to update private asset data which is represented by the proof. |
| Sign claim.                        | Anyone with this ability is a valid claim signer for any asset. |
| Update uri base.                   | Ability to update the uri base used for public metadata.     |

Smart contract creator can assign this abilities to others or himself. For the sake of simpler explanation of functionalities we will say that we have two participants. We will call the first one an Issuer and he has all the permissions described above. The second one is the owner and he is the current owner of a particular asset. 

### Create

An issuer can create a new asset. When creating an asset issuer has to specify uniqe identification number representing the asset and data that was specified when [designing the asset](link to asset design documentation). That data gets automatically transformed into public data accessable via url and private data that is transformed into the asset proof. When creating a new asset issuer has to specify who is the recipient of the asset. It cannot be created and assigned later.

### Transfer

As an owner of an asset you can transfer your ownership to someone else. This action cannot be reverted and you lose all rights to that asset. The only way to get that asset back is for the new owner to send it back.

### Approve

Owners can approve someone else to have the ability to operate with their assets while they still maintain full ownership. We call such a person operator. An operator has full control of the assets the same as the owner. That means he can transfer the asset is that case ownership in transfered as well. Because of this an owner should be really carefull about who he trusts to approve. Owner can revoke an approval at any time.

### Destroy

This is an optional function that is only available if the issuer adds it when [designing an asset](). 

Owner has the option of permanently destroying an asset in his possession.  

### Revoke

This is an optional function that is only available if the issuer adds it when [designing an asset](). 

An issuer can revoke an asset he has created. This means the asset it permenently destoryed even if it is not in the possesion of the issuer. 

### Pause

This is an optional function that is only available if the issuer adds it when [designing an asset](). 

Issuer can at any time pause all transfers so an owner cannot transfer his ownership. He can at any time then unpause transfers. In some cases issuer will never want to allow asset ownership to be transfered. This can be achived by pausing transfer from the start and never unpausing them. 

### Update

This is an optional function that is only available if the issuer adds it when [designing an asset](). 

Issuer can at any time update private data of an asset (proof) he created. Previous data can always be retrived but new data will be the one defining the asset. 

## Certification and validation

### What is proof

### Generating proofs

### Validate proof

### Exposing certified data