import * as Web3 from 'web3';
import * as contracts from '../config/contracts';
import { deploy } from '../lib/deploy';

/**
 * Protocol contracts deployer.
 */
export class Protocol {
  public web3: Web3;
  public erc20;
  public erc721Enumerable;
  public erc721Metadata;
  public erc721;
  public xcertBurnable;
  public xcertMutable;
  public xcertPausable;
  public xcertRevokable;
  public xcert;
  public tokenTransferProxy;
  public nftokenTransferProxy;
  public exchange;

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

    this.erc20 = await this.deployErc20(from);
    this.erc721Enumerable = await this.deployErc721Enumerable(from);
    this.erc721Metadata = await this.deployErc721Metadata(from);
    this.erc721 = await this.deployErc721(from);
    this.xcertBurnable = await this.deployXcertBurnable(from);
    this.xcertMutable = await this.deployXcertMutable(from);
    this.xcertPausable = await this.deployXcertPausable(from);
    this.xcertRevokable = await this.deployXcertRevokable(from);
    this.xcert = await this.deployXcert(from);
    this.tokenTransferProxy = await this.deployTokenTransferProxy(from);
    this.nftokenTransferProxy = await this.deployNFTokenTransferProxy(from);
    this.exchange = await this.deployExchange(from);

    return this;
  }

  /**
   * Deploys the ERC20 contract.
   * @param from Contract owner's address.
   */
  protected async deployErc20(from: string) {
    return await deploy({
      web3: this.web3,
      abi: contracts.erc20.abi,
      bytecode: contracts.erc20.bytecode,
      from,
    });
  }

  /**
   * Deploys enumberable ERC721 contract.
   * @param from Contract owner's address.
   */
  protected async deployErc721Enumerable(from: string) {
    return await deploy({
      web3: this.web3,
      abi: contracts.erc721Enumerable.abi,
      bytecode: contracts.erc721Enumerable.bytecode,
      from,
    });
  }

  /**
   * Deploys ERC721 metadata contract.
   * @param from Contract owner's address.
   */
  protected async deployErc721Metadata(from: string) {
    return await deploy({
      web3: this.web3,
      abi: contracts.erc721Metadata.abi,
      bytecode: contracts.erc721Metadata.bytecode,
      args: ['ERC721 Metadata', 'ERC721Metadata', 'http://0xcert.org/'],
      from,
    });
  }

  /**
   * Deploys the erc721 contract.
   * @param from Contract owner's address.
   */
  protected async deployErc721(from: string) {
    return await deploy({
      web3: this.web3,
      abi: contracts.erc721.abi,
      bytecode: contracts.erc721.bytecode,
      from,
    });
  }

  /**
   * Deploys burnable xcert contract.
   * @param from Contract owner's address.
   */
  protected async deployXcertBurnable(from: string) {
    const xcert = await deploy({
      web3: this.web3,
      abi: contracts.xcertBurnable.abi,
      bytecode: contracts.xcertBurnable.bytecode,
      args: ['Burnable Xcert', 'BurnableXcert', 'http://0xcert.org/', '0x1'],
      from,
    });

    await xcert.instance.methods.assignAbilities(from, [1, 2, 3, 4, 5, 6]).send({ from });

    return xcert;
  }

  /**
   * Deploys mutable xcert contract.
   * @param from Contract owner's address.
   */
  protected async deployXcertMutable(from: string) {
    const xcert = await deploy({
      web3: this.web3,
      abi: contracts.xcertMutable.abi,
      bytecode: contracts.xcertMutable.bytecode,
      args: ['Mutable Xcert', 'MutableXcert', 'http://0xcert.org/', '0x2'],
      from,
    });

    await xcert.instance.methods.assignAbilities(from, [1, 2, 3, 4, 5, 6]).send({ from });

    return xcert;
  }

  /**
   * Deploys pausable xcert contract.
   * @param from Contract owner's address.
   */
  protected async deployXcertPausable(from: string) {
    const xcert = await deploy({
      web3: this.web3,
      abi: contracts.xcertPausable.abi,
      bytecode: contracts.xcertPausable.bytecode,
      args: ['Pausable Xcert', 'PausableXcert', 'http://0xcert.org/', '0x3'],
      from,
    });

    await xcert.instance.methods.assignAbilities(from, [1, 2, 3, 4, 5, 6]).send({ from });

    return xcert;
  }

  /**
   * Deploys revokable xcert contract.
   * @param from Contract owner's address.
   */
  protected async deployXcertRevokable(from: string) {
    const xcert = await deploy({
      web3: this.web3,
      abi: contracts.xcertRevokable.abi,
      bytecode: contracts.xcertRevokable.bytecode,
      args: ['Revokable Xcert', 'RevokableXcert', 'http://0xcert.org/', '0x4'],
      from,
    });

    await xcert.instance.methods.assignAbilities(from, [1, 2, 3, 4, 5, 6]).send({ from });

    return xcert;
  }

  /**
   * Deploys an Xcert contract.
   * @param from Contract owner's address.
   */
  protected async deployXcert(from: string) {
    const xcert = await deploy({
      web3: this.web3,
      abi: contracts.xcert.abi,
      bytecode: contracts.xcert.bytecode,
      args: ['Xcert', 'Xcert', 'http://0xcert.org/', '0x5'],
      from,
    });

    await xcert.instance.methods.assignAbilities(from, [1, 2, 3, 4, 5, 6]).send({ from });

    return xcert;
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

    await exchange.instance.methods.assignAbilities(from, [1]).send({ from });
    await exchange.instance.methods.setProxy(0, this.tokenTransferProxy.receipt._address).send({ from });
    await exchange.instance.methods.setProxy(1, this.nftokenTransferProxy.receipt._address).send({ from });
    await this.tokenTransferProxy.instance.methods.assignAbilities(exchange.receipt._address, [1]).send({ from });
    await this.nftokenTransferProxy.instance.methods.assignAbilities(exchange.receipt._address, [1]).send({ from });

    return exchange;
  }

}
