/**
 * Deploys smart contract to the network.
 * @param config Deploy contract configuration.
 */
export function deploy(config: {
  web3: any;
  abi: any;
  bytecode: string;
  from: string;
  args?: any[];
  gas?: number;
  gasPrice?: number;
}) {
  return new config.web3.eth.Contract(config.abi).deploy({
    data: config.bytecode,
    arguments: config.args,
  }).send({
    from: config.from,
    gas: config.gas || 6000000,
    gasPrice: config.gas || 1,
  }).then((receipt) => {
    const instance = new config.web3.eth.Contract(
      config.abi,
      receipt.options.address,
      {
        gas: config.gas || 6000000,
        from: config.from,
      },
    );
    return { instance, receipt };
  });
}
