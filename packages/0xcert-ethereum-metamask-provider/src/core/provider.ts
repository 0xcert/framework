import { GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';

/**
 * Metamask RPC client.
 */
export class MetamaskProvider extends GenericProvider {

  /**
   * Class constructor.
   */
  public constructor() {
    super({
      client: typeof window !== 'undefined' ? window['ethereum'] : null,
      signMethod: SignMethod.EIP712,
    });
  }

  /**
   * 
   */
  public isSupported() {
    return (
      typeof window !== 'undefined'
      && typeof window['ethereum'] !== 'undefined'
    );
  }

  /**
   * 
   */
  public async isEnabled() {
    return (
      this.isSupported()
      && await this.client._metamask.isApproved()
      && !!this.accountId
    );
  }

  /**
   * 
   */
  public async enable() {
    if (this.isSupported()) {
      this.accountId = await this.client.enable().then((a) => a[0]);
    }
    return this;
  }
  
}
