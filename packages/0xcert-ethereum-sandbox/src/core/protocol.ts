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
  public xcertDestroyable;
  public xcertMutable;
  public xcertPausable;
  public xcertRevokable;
  public xcert;
  public xcertCreateProxy;
  public tokenTransferProxy;
  public nftokenTransferProxy;
  public nftokenSafeTransferProxy;
  public nftokenReceiver;
  public orderGateway;

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
    this.xcertDestroyable = await this.deployXcertDestroyable(from);
    this.xcertMutable = await this.deployXcertMutable(from);
    this.xcertPausable = await this.deployXcertPausable(from);
    this.xcertRevokable = await this.deployXcertRevokable(from);
    this.xcert = await this.deployXcert(from);
    this.xcertCreateProxy = await this.deployXcertCreateProxy(from);
    this.tokenTransferProxy = await this.deployTokenTransferProxy(from);
    this.nftokenTransferProxy = await this.deployNFTokenTransferProxy(from);
    this.nftokenSafeTransferProxy = await this.deployNFTokenSafeTransferProxy(from);
    this.nftokenReceiver = await this.deployNFTokenReceiver(from);
    this.orderGateway = await this.deployOrderGateway(from);

    return this;
  }

  /**
   * Deploys the ERC20 contract.
   * @param from Contract owner's address.
   */
  protected async deployErc20(from: string) {
    return deploy({
      web3: this.web3,
      abi: contracts.erc20.abi,
      bytecode: contracts.erc20.bytecode,
      args: ['ERC20', 'ERC20', 18, '500000000'],
      from,
    });
  }

  /**
   * Deploys enumberable ERC721 contract.
   * @param from Contract owner's address.
   */
  protected async deployErc721Enumerable(from: string) {
    return deploy({
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
    return deploy({
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
    return deploy({
      web3: this.web3,
      abi: contracts.erc721.abi,
      bytecode: contracts.erc721.bytecode,
      from,
    });
  }

  /**
   * Deploys xcert contract with destroy capability.
   * @param from Contract owner's address.
   */
  protected async deployXcertDestroyable(from: string) {
    const xcert = await deploy({
      web3: this.web3,
      abi: contracts.xcert.abi,
      bytecode: contracts.xcert.bytecode,
      args: ['Destroyable Xcert', 'DestroyableXcert', 'http://0xcert.org/', '0x1', ['0x9d118770']],
      from,
    });

    return xcert;
  }

  /**
   * Deploys xcert contract with mutate capability.
   * @param from Contract owner's address.
   */
  protected async deployXcertMutable(from: string) {
    const xcert = await deploy({
      web3: this.web3,
      abi: contracts.xcert.abi,
      bytecode: contracts.xcert.bytecode,
      args: ['Mutable Xcert', 'MutableXcert', 'http://0xcert.org/', '0x2', ['0xbda0e852']],
      from,
    });

    return xcert;
  }

  /**
   * Deploys xcert contract with pause capability.
   * @param from Contract owner's address.
   */
  protected async deployXcertPausable(from: string) {
    const xcert = await deploy({
      web3: this.web3,
      abi: contracts.xcert.abi,
      bytecode: contracts.xcert.bytecode,
      args: ['Pausable Xcert', 'PausableXcert', 'http://0xcert.org/', '0x3', ['0xbedb86fb']],
      from,
    });

    return xcert;
  }

  /**
   * Deploys xcert contract with revoke capability.
   * @param from Contract owner's address.
   */
  protected async deployXcertRevokable(from: string) {
    const xcert = await deploy({
      web3: this.web3,
      abi: contracts.xcert.abi,
      bytecode: contracts.xcert.bytecode,
      args: ['Revokable Xcert', 'RevokableXcert', 'http://0xcert.org/', '0x4', ['0x20c5429b']],
      from,
    });

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
      args: ['Xcert', 'Xcert', 'http://0xcert.org/', '0x5', []],
      from,
    });

    return xcert;
  }

  /**
   * Deploys the xcert create proxy contract.
   * @param from Contract owner's address.
   */
  protected async deployXcertCreateProxy(from: string) {
    return deploy({
      web3: this.web3,
      abi: contracts.xcertCreateProxy.abi,
      bytecode: contracts.xcertCreateProxy.bytecode,
      from,
    });
  }

  /**
   * Deploys the token transfer proxy contract.
   * @param from Contract owner's address.
   */
  protected async deployTokenTransferProxy(from: string) {
    return deploy({
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
    return deploy({
      web3: this.web3,
      abi: contracts.nftokenTransferProxy.abi,
      bytecode: contracts.nftokenTransferProxy.bytecode,
      from,
    });
  }

  /**
   * Deploys the non-fungible token safe transfer proxy contract.
   * @param from Contract owner's address.
   */
  protected async deployNFTokenSafeTransferProxy(from: string) {
    return deploy({
      web3: this.web3,
      abi: contracts.nftokenSafeTransferProxy.abi,
      bytecode: contracts.nftokenSafeTransferProxy.bytecode,
      from,
    });
  }

  /**
   * Deploys the non-fungible token receiver contract.
   * @param from Contract owner's address.
   */
  protected async deployNFTokenReceiver(from: string) {
    return deploy({
      web3: this.web3,
      abi: contracts.erc721receiver.abi,
      bytecode: contracts.erc721receiver.bytecode,
      from,
    });
  }

  /**
   * Deploys the decentralized orderGateway contract.
   * @param from Contract owner's address.
   */
  protected async deployOrderGateway(from: string) {
    const orderGateway = await deploy({
      web3: this.web3,
      abi: contracts.orderGateway.abi,
      bytecode: contracts.orderGateway.bytecode,
      from,
    });

    await orderGateway.instance.methods.grantAbilities(from, 2).send({ from });
    await orderGateway.instance.methods.setProxy(0, this.xcertCreateProxy.receipt._address).send({ from });
    await orderGateway.instance.methods.setProxy(1, this.tokenTransferProxy.receipt._address).send({ from });
    await orderGateway.instance.methods.setProxy(2, this.nftokenTransferProxy.receipt._address).send({ from });
    await orderGateway.instance.methods.setProxy(3, this.nftokenSafeTransferProxy.receipt._address).send({ from });
    await this.tokenTransferProxy.instance.methods.grantAbilities(orderGateway.receipt._address, 2).send({ from });
    await this.nftokenTransferProxy.instance.methods.grantAbilities(orderGateway.receipt._address, 2).send({ from });
    await this.xcertCreateProxy.instance.methods.grantAbilities(orderGateway.receipt._address, 2).send({ from });
    await this.nftokenSafeTransferProxy.instance.methods.grantAbilities(orderGateway.receipt._address, 2).send({ from });

    return orderGateway;
  }
}
