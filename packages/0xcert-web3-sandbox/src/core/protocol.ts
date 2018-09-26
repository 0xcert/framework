import * as Web3 from 'web3';
import * as contracts from '../config/contracts';
import { deploy } from '../lib/deploy';

/**
 * Protocol contracts deployer.
 */
export class Protocol {
  readonly web3: Web3;
  public xcertMintProxy;
  public tokenTransferProxy;
  public nftokenTransferProxy;
  public exchange;
  public minter;

  /**
   * Instantiates the protocol class and deploys the contracts.
   * @param web3 Web3 object instance.
   * @param from Optional owner's address.
   */
  public static deploy(web3: Web3, from?: string) {
    return new Protocol(web3).deploy(from);
  }

  /**
   * Class constructor.
   * @param web3 Web3 object instance.
   */
  public constructor(web3: Web3) {
    this.web3 = web3;
  }

  /**
   * Deploys protocol contracts.
   * @param from Optional owner's address.
   */
  public async deploy(from?: string) {

    if (!from) {
      from = await this.web3.eth.getAccounts().then((a) => a[0]);
    }

    this.xcertMintProxy = await this.deployXcertMintProxy(from);
    this.tokenTransferProxy = await this.deployTokenTransferProxy(from);
    this.nftokenTransferProxy = await this.deployNFTokenTransferProxy(from);
    this.exchange = await this.deployExchange(from);
    this.minter = await this.deployMinter(from);

    return this;
  }

  /**
   * Deploys the xcert mint proxy contract.
   * @param from Contract owner's address.
   */
  protected async deployXcertMintProxy(from: string) {
    return await deploy({
      web3: this.web3,
      abi: contracts.xcertMintProxy.abi,
      bytecode: contracts.xcertMintProxy.bytecode,
      from,
    });
  }

  /**
   * Deploys the token transfer proxy contract.
   * @param from Contract owner's address.
   */
  protected async deployTokenTransferProxy(from: string) {
    return await deploy({
      web3: this.web3,
      abi: contracts.tokenTransferProxy.abi,
      bytecode: contracts.tokenTransferProxy.bytecode,
      from,
    });
  }

  /**
   * Deploys the non-fungible token transfer proxy contract.
   * @param from Contract owner's address.
   */
  protected async deployNFTokenTransferProxy(from: string) {
    return await deploy({
      web3: this.web3,
      abi: contracts.nftokenTransferProxy.abi,
      bytecode: contracts.nftokenTransferProxy.bytecode,
      from,
    });
  }

  /**
   * Deploys the decentralized exchange contract.
   * @param from Contract owner's address.
   */
  protected async deployExchange(from: string) {
    const exchange = await deploy({
      web3: this.web3,
      abi: contracts.exchange.abi,
      bytecode: contracts.exchange.bytecode,
      from,
    });

    await exchange.methods.setProxy(0, this.tokenTransferProxy._address).send({ from });
    await exchange.methods.setProxy(1, this.nftokenTransferProxy._address).send({ from });
    await this.tokenTransferProxy.methods.addAuthorizedAddress(exchange._address).send({ from });
    await this.nftokenTransferProxy.methods.addAuthorizedAddress(exchange._address).send({ from });

    return exchange;
  }

  /**
   * Deploys the decentralized minter contract.
   * @param from Contract owner's address.
   */
  protected async deployMinter(from: string) {
    const minter = await deploy({
      web3: this.web3,
      abi: contracts.minter.abi,
      bytecode: contracts.minter.bytecode,
      args: [this.tokenTransferProxy._address, this.xcertMintProxy._address],
      from,
    });

    await this.tokenTransferProxy.methods.addAuthorizedAddress(minter._address).send({ from });
    await this.xcertMintProxy.methods.addAuthorizedAddress(minter._address).send({ from });

    return minter;
  }

}
