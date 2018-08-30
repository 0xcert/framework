import { Spec } from '@specron/spec';

const spec = new Spec();

export default spec;

spec.test('correctly checks all the supported interfaces', async (ctx) => {

});

spec.test('correctly mints a NFT', async (ctx) => {

});

spec.test('returns correct balanceOf', async (ctx) => {

});

spec.test('throws when trying to get count of NFTs owned by 0x0 address', async (ctx) => {

});

spec.test('throws when trying to mint 2 NFTs with the same ids', async (ctx) => {

});

spec.test('throws when trying to mint NFT to 0x0 address', async (ctx) => {

});

spec.test('finds the correct owner of NFToken id', async (ctx) => {

});

spec.test('throws when trying to find owner od non-existing NFT id', async (ctx) => {

});

spec.test('correctly approves account', async (ctx) => {

});

spec.test('correctly cancels approval', async (ctx) => {

});

spec.test('throws when trying to get approval of non-existing NFT id', async (ctx) => {

});

spec.test('throws when trying to approve NFT ID from a third party', async (ctx) => {

});

spec.test('correctly sets an operator', async (ctx) => {

});

spec.test('correctly sets then cancels an operator', async (ctx) => {

});

spec.test('corectly transfers NFT from owner', async (ctx) => {

});

spec.test('corectly transfers NFT from approved address', async (ctx) => {

});

spec.test('corectly transfers NFT as operator', async (ctx) => {

});

spec.test('throws when trying to transfer NFT as an address that is not owner, approved or operator', async (ctx) => {

});

spec.test('throws when trying to transfer NFT to a zero address', async (ctx) => {

});

spec.test('throws when trying to transfer a invalid NFT', async (ctx) => {

});

spec.test('corectly safe transfers NFT from owner', async (ctx) => {

});

spec.test('throws when trying to safe transfers NFT from owner to a smart contract', async (ctx) => {

});

spec.test('corectly safe transfers NFT from owner to smart contract that can recieve NFTs', async (ctx) => {

});

spec.test('corectly safe transfers NFT from owner to smart contract that can recieve NFTs with data', async (ctx) => {

});

spec.test('returns the correct issuer name', async (ctx) => {

});

spec.test('returns the correct issuer symbol', async (ctx) => {

});

spec.test('return the correct URI', async (ctx) => {

});

spec.test('throws when trying to get URI of invalid NFT ID', async (ctx) => {

});

spec.test('corectly burns a NFT', async (ctx) => {

});

spec.test('throws when trying to burn non existant NFT', async (ctx) => {
  
});

spec.test('returns the correct token by index', async (ctx) => {
  
});

spec.test('throws when trying to get token by non-existing index', async (ctx) => {
  
});

spec.test('returns the correct token of owner by index', async (ctx) => {
  
});

spec.test('throws when trying to get token of owner by non-existing index', async (ctx) => {
  
});

spec.test('mint should correctly set ownerToIds and idToOwnerIndex and idToIndex', async (ctx) => {
  
});

spec.test('burn should correctly set ownerToIds and idToOwnerIndex and idToIndex', async (ctx) => {
  
});

spec.test('transfer should correctly set ownerToIds and idToOwnerIndex and idToIndex', async (ctx) => {
  
});