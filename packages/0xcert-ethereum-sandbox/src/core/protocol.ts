import * as contracts from '../config/contracts';
import { deploy } from '../lib/deploy';

/**
 * Protocol contracts deployer.
 */
export class Protocol {
  public web3: any;
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
  public xcertUpdateProxy;
  public xcertBurnProxy;
  public tokenTransferProxy;
  public nftokenTransferProxy;
  public nftokenSafeTransferProxy;
  public xcertDeployProxy;
  public tokenDeployProxy;
  public nftokenReceiver;
  public actionsGateway;
  public xcertDeployGateway;
  public tokenDeployGateway;
  public abilitableManageProxy;
  public dappToken;

  /**
   * Class constructor.
   * @param web3 Web3 object instance.
   */
  public constructor(web3: any) {
    this.web3 = web3;
  }

  /**
   * Instantiates the protocol class and deploys the contracts.
   * @param web3 Web3 object instance.
   * @param from Optional owner's address.
   */
  public static deploy(web3: any, from?: string) {
    return new Protocol(web3).deploy(from);
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
    this.xcertUpdateProxy = await this.deployXcertUpdateProxy(from);
    this.xcertBurnProxy = await this.deployXcertBurnProxy(from);
    this.tokenTransferProxy = await this.deployTokenTransferProxy(from);
    this.nftokenTransferProxy = await this.deployNFTokenTransferProxy(from);
    this.nftokenSafeTransferProxy = await this.deployNFTokenSafeTransferProxy(from);
    this.abilitableManageProxy = await this.deployAbilitableManageProxy(from);
    this.nftokenReceiver = await this.deployNFTokenReceiver(from);
    this.xcertDeployProxy = await this.deployXcertDeployProxy(from);
    this.tokenDeployProxy = await this.deployTokenDeployProxy(from);
    this.actionsGateway = await this.deployActionsGateway(from);
    this.xcertDeployGateway = await this.deployXcertDeployGateway(from);
    this.tokenDeployGateway = await this.deployTokenDeployGateway(from);
    this.dappToken = await this.deployDappToken(from);

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
      args: ['ERC20', 'ERC20', 18, '500000000000000000000000000'],
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
      args: ['ERC721 Metadata', 'ERC721Metadata', 'https://0xcert.org/', '.json'],
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
   * Deploys Xcert contract with destroy capability.
   * @param from Contract owner's address.
   */
  protected async deployXcertDestroyable(from: string) {
    const xcert = await deploy({
      web3: this.web3,
      abi: contracts.xcert.abi,
      bytecode: contracts.xcert.bytecode,
      args: ['Destroyable Xcert', 'DestroyableXcert', 'https://0xcert.org/', '.json', '0x1', ['0x9d118770']],
      from,
    });

    return xcert;
  }

  /**
   * Deploys Xcert contract with mutate capability.
   * @param from Contract owner's address.
   */
  protected async deployXcertMutable(from: string) {
    const xcert = await deploy({
      web3: this.web3,
      abi: contracts.xcert.abi,
      bytecode: contracts.xcert.bytecode,
      args: ['Mutable Xcert', 'MutableXcert', 'https://0xcert.org/', '.json', '0x2', ['0x0d04c3b8']],
      from,
    });

    return xcert;
  }

  /**
   * Deploys Xcert contract with pause capability.
   * @param from Contract owner's address.
   */
  protected async deployXcertPausable(from: string) {
    const xcert = await deploy({
      web3: this.web3,
      abi: contracts.xcert.abi,
      bytecode: contracts.xcert.bytecode,
      args: ['Pausable Xcert', 'PausableXcert', 'https://0xcert.org/', '.json', '0x3', ['0xbedb86fb']],
      from,
    });

    return xcert;
  }

  /**
   * Deploys Xcert contract with revoke capability.
   * @param from Contract owner's address.
   */
  protected async deployXcertRevokable(from: string) {
    const xcert = await deploy({
      web3: this.web3,
      abi: contracts.xcert.abi,
      bytecode: contracts.xcert.bytecode,
      args: ['Revokable Xcert', 'RevokableXcert', 'https://0xcert.org/', '.json', '0x4', ['0x20c5429b']],
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
      args: ['Xcert', 'Xcert', 'https://0xcert.org/', '.json', '0x5', []],
      from,
    });

    return xcert;
  }

  /**
   * Deploys the Xcert create proxy contract.
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
   * Deploys the Xcert update proxy contract.
   * @param from Contract owner's address.
   */
  protected async deployXcertUpdateProxy(from: string) {
    return deploy({
      web3: this.web3,
      abi: contracts.xcertUpdateProxy.abi,
      bytecode: contracts.xcertUpdateProxy.bytecode,
      from,
    });
  }

  /**
   * Deploys the Xcert burn proxy contract.
   * @param from Contract owner's address.
   */
  protected async deployXcertBurnProxy(from: string) {
    return deploy({
      web3: this.web3,
      abi: contracts.xcertBurnProxy.abi,
      bytecode: contracts.xcertBurnProxy.bytecode,
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
   * Deploys the abilitable manage proxy contract.
   * @param from Contract owner's address.
   */
  protected async deployAbilitableManageProxy(from: string) {
    return deploy({
      web3: this.web3,
      abi: contracts.abilitableManageProxy.abi,
      bytecode: contracts.abilitableManageProxy.bytecode,
      from,
    });
  }

  /**
   * Deploys the abilitable manage proxy contract.
   * @param from Contract owner's address.
   */
  protected async deployXcertDeployProxy(from: string) {
    return deploy({
      web3: this.web3,
      abi: contracts.xcertDeployProxy.abi,
      bytecode: contracts.xcertDeployProxy.bytecode,
      from,
    });
  }

  /**
   * Deploys the abilitable manage proxy contract.
   * @param from Contract owner's address.
   */
  protected async deployTokenDeployProxy(from: string) {
    return deploy({
      web3: this.web3,
      abi: contracts.tokenDeployProxy.abi,
      bytecode: contracts.tokenDeployProxy.bytecode,
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
   * Deploys the decentralized actionsGateway contract.
   * @param from Contract owner's address.
   */
  protected async deployActionsGateway(from: string) {
    const actionsGateway = await deploy({
      web3: this.web3,
      abi: contracts.actionsGateway.abi,
      bytecode: contracts.actionsGateway.bytecode,
      from,
    });

    await actionsGateway.instance.methods.grantAbilities(from, 16).send({ from });
    await actionsGateway.instance.methods.addProxy(this.xcertCreateProxy.receipt._address, 0).send({ from });
    await actionsGateway.instance.methods.addProxy(this.tokenTransferProxy.receipt._address, 1).send({ from });
    await actionsGateway.instance.methods.addProxy(this.nftokenTransferProxy.receipt._address, 1).send({ from });
    await actionsGateway.instance.methods.addProxy(this.nftokenSafeTransferProxy.receipt._address, 1).send({ from });
    await actionsGateway.instance.methods.addProxy(this.xcertUpdateProxy.receipt._address, 2).send({ from });
    await actionsGateway.instance.methods.addProxy(this.abilitableManageProxy.receipt._address, 3).send({ from });
    await actionsGateway.instance.methods.addProxy(this.xcertBurnProxy.receipt._address, 4).send({ from });
    await this.tokenTransferProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, 16).send({ from });
    await this.nftokenTransferProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, 16).send({ from });
    await this.xcertCreateProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, 16).send({ from });
    await this.nftokenSafeTransferProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, 16).send({ from });
    await this.xcertUpdateProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, 16).send({ from });
    await this.xcertBurnProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, 16).send({ from });
    await this.abilitableManageProxy.instance.methods.grantAbilities(actionsGateway.receipt._address, 16).send({ from });

    return actionsGateway;
  }

  /**
   * Deploys the decentralized xcertDeployGateway contract.
   * @param from Contract owner's address.
   */
  protected async deployXcertDeployGateway(from: string) {
    const xcertDeployGateway = await deploy({
      web3: this.web3,
      abi: contracts.xcertDeployGateway.abi,
      bytecode: contracts.xcertDeployGateway.bytecode,
      args: [
        this.xcertDeployProxy.receipt._address,
        this.tokenTransferProxy.receipt._address,
        this.xcertCreateProxy.receipt._address,
        this.xcertUpdateProxy.receipt._address,
        this.abilitableManageProxy.receipt._address,
        this.nftokenSafeTransferProxy.receipt._address,
        this.xcertBurnProxy.receipt._address,
      ],
      from,
    });

    await this.tokenTransferProxy.instance.methods.grantAbilities(xcertDeployGateway.receipt._address, 16).send({ from });
    return xcertDeployGateway;
  }

  /**
   * Deploys the decentralized tokenDeployGateway contract.
   * @param from Contract owner's address.
   */
  protected async deployTokenDeployGateway(from: string) {
    const tokenDeployGateway = await deploy({
      web3: this.web3,
      abi: contracts.tokenDeployGateway.abi,
      bytecode: contracts.tokenDeployGateway.bytecode,
      args: [
        this.tokenDeployProxy.receipt._address,
        this.tokenTransferProxy.receipt._address,
      ],
      from,
    });

    await this.tokenTransferProxy.instance.methods.grantAbilities(tokenDeployGateway.receipt._address, 16).send({ from });
    return tokenDeployGateway;
  }

  /**
   * Deploys the dappToken contract.
   * @param from Contract owner's address.
   */
  protected async deployDappToken(from: string) {
    const dappToken = await deploy({
      web3: this.web3,
      abi: contracts.dappToken.abi,
      bytecode: contracts.dappToken.bytecode,
      args: [
        'Dapp token',
        'DXC',
        18,
        this.erc20.receipt._address,
        this.tokenTransferProxy.receipt._address,
      ],
      from,
    });

    await this.erc20.instance.methods.approve(dappToken.receipt._address, '5000000000000000000000000000').send({ from });
    return dappToken;
  }
}
