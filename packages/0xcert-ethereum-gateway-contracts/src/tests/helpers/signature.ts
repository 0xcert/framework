export async function getSignature(web3: any, claim: string, address: string) {
  const signature = await web3.eth.sign(claim, address);
  return {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
    kind: 0,
  };
}
